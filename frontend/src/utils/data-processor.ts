import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { 
    Protocol, 
    HealthMetrics, 
    RiskFactors, 
    RiskPoints,
    ChainMetrics 
} from '../types/protocol';


dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class DataProcessor {
    private readonly DEFILLAMA_API = 'https://api.llama.fi';
    private readonly BATCH_SIZE = 100;
    
    async fetchAndProcessData() {
        try {
            console.log('Fetching protocols from DeFiLlama...');
            const response = await axios.get(`${this.DEFILLAMA_API}/protocols`, {
                timeout: 30000 // 30 second timeout for initial fetch
            });
            
            const protocols: Protocol[] = response.data;
            console.log(`Found ${protocols.length} protocols. Processing in batches...`);

            // Process in batches
            for (let i = 0; i < protocols.length; i += this.BATCH_SIZE) {
                const batch = protocols.slice(i, i + this.BATCH_SIZE);
                console.log(`Processing batch ${i/this.BATCH_SIZE + 1}/${Math.ceil(protocols.length/this.BATCH_SIZE)}`);
                
                // Process protocols in current batch
                await Promise.all(batch.map(protocol => this.processProtocol(protocol)));
                
                // Update chain metrics for this batch
                await this.updateChainMetrics(batch);
                
                console.log(`Completed batch. Processed ${Math.min(i + this.BATCH_SIZE, protocols.length)}/${protocols.length} protocols`);
            }

            console.log('All processing completed successfully');
            return true;
        } catch (error) {
            console.error('Error in data processing:', error);
            throw error;
        }
    }

    private async processProtocol(protocol: Protocol) {
        try {
            const healthMetrics = this.calculateHealthMetrics(protocol);
            const chainData = {
                chains: protocol.chains || [],
                chainTvls: protocol.chainTvls || {},
                totalChains: (protocol.chains || []).length
            };

            // Upsert protocol data
            await supabase
                .from('protocols')
                .upsert({
                    id: protocol.id,
                    name: protocol.name,
                    description: protocol.description,
                    symbol: protocol.symbol,
                    url: protocol.url,
                    tvl: protocol.tvl,
                    mcap: protocol.mcap,
                    category: protocol.category,
                    chain_data: chainData,
                    health_metrics: healthMetrics,
                    last_updated: new Date().toISOString()
                });

            // Insert TVL history
            await supabase
                .from('protocol_tvl_history')
                .insert({
                    protocol_id: protocol.id,
                    tvl: protocol.tvl,
                    timestamp: new Date().toISOString()
                });

        } catch (error) {
            console.error(`Error processing ${protocol.name}:`, error);
            // Continue with other protocols
        }
    }

    private async updateChainMetrics(protocols: Protocol[]) {
        try {
            const chainData = new Map<string, {tvl: number, protocols: Set<string>}>();

            // Aggregate chain data
            protocols.forEach(protocol => {
                Object.entries(protocol.chainTvls || {}).forEach(([chain, tvl]) => {
                    if (!chainData.has(chain)) {
                        chainData.set(chain, { tvl: 0, protocols: new Set() });
                    }
                    const data = chainData.get(chain)!;
                    data.tvl += tvl;
                    data.protocols.add(protocol.id);
                });
            });

            // Batch update chain metrics
            const updates = Array.from(chainData.entries()).map(([chain, data]) => ({
                chain_name: chain,
                tvl: data.tvl,
                protocol_count: data.protocols.size,
                metrics: {
                    dominance: data.tvl,
                    protocol_distribution: data.protocols.size
                },
                last_updated: new Date().toISOString()
            }));

            if (updates.length > 0) {
                await supabase
                    .from('chain_metrics')
                    .upsert(updates, {
                        onConflict: 'chain_name'
                    });
            }
        } catch (error) {
            console.error('Error updating chain metrics:', error);
        }
    }

    private async processChainMetrics(protocols: Protocol[]) {
        try {
            const chainMetrics = new Map<string, any>();

            protocols.forEach(protocol => {
                Object.entries(protocol.chainTvls || {}).forEach(([chain, tvl]) => {
                    if (!chainMetrics.has(chain)) {
                        chainMetrics.set(chain, {
                            tvl: 0,
                            protocol_count: 0,
                            protocols: new Set()
                        });
                    }
                    
                    const metrics = chainMetrics.get(chain);
                    metrics.tvl += tvl;
                    metrics.protocols.add(protocol.id);
                });
            });

            for (const [chain, data] of chainMetrics.entries()) {
                const metrics = {
                    dominance: (data.tvl / protocols.reduce((sum, p) => sum + (p.tvl || 0), 0)) * 100,
                    protocol_distribution: data.protocols.size
                };

                const { error } = await supabase
                    .from('chain_metrics')
                    .upsert({
                        chain_name: chain,
                        tvl: data.tvl,
                        protocol_count: data.protocols.size,
                        metrics: metrics,
                        last_updated: new Date().toISOString()
                    });

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error processing chain metrics:', error);
            throw error;
        }
    }

    private calculateHealthMetrics(protocol: Protocol): HealthMetrics {
        const riskFactors: RiskFactors = {
            tvlRisk: this.calculateTVLRisk(protocol.tvl),
            chainDiversification: this.calculateChainDiversification(protocol.chains.length),
            stabilityScore: this.calculateStabilityScore(protocol)
        };

        const riskLevel = this.determineRiskLevel(riskFactors);

        return {
            risk_level: riskLevel,
            risk_factors: riskFactors,
            tvl_changes: {
                hour: protocol.change_1h || 0,
                day: protocol.change_1d || 0,
                week: protocol.change_7d || 0
            },
            last_calculated: new Date().toISOString()
        };
    }

    private calculateTVLRisk(tvl: number): 'low' | 'medium' | 'high' {
        if (tvl > 1_000_000_000) return 'low';
        if (tvl > 100_000_000) return 'medium';
        return 'high';
    }

    private calculateChainDiversification(chainCount: number): 'low' | 'medium' | 'high' {
        if (chainCount > 5) return 'high';
        if (chainCount > 2) return 'medium';
        return 'low';
    }

    private calculateStabilityScore(protocol: Protocol) {
        const hourlyChange = Math.abs(protocol.change_1h || 0);
        const dailyChange = Math.abs(protocol.change_1d || 0);
        const weeklyChange = Math.abs(protocol.change_7d || 0);

        return {
            short_term: hourlyChange < 5 ? 'stable' : 'volatile',
            medium_term: dailyChange < 20 ? 'stable' : 'volatile',
            long_term: weeklyChange < 40 ? 'stable' : 'volatile'
        } as const;
    }

    private determineRiskLevel(riskFactors: RiskFactors): string {
        const riskPoints: RiskPoints = {
            'low': 1,
            'medium': 2,
            'high': 3
        };

        const tvlRiskScore = riskPoints[riskFactors.tvlRisk];
        const chainScore = riskPoints[riskFactors.chainDiversification];
        
        const totalRisk = tvlRiskScore + chainScore;
        
        if (totalRisk <= 3) return 'Low';
        if (totalRisk <= 4) return 'Medium';
        return 'High';
    }
}

export default DataProcessor;