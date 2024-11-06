import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        'Missing environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env'
    );
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Protocol {
    id: string;
    name: string;
    description?: string;
    symbol?: string;
    url?: string;
    tvl: number;
    mcap?: number;
    category?: string;
    chainTvls: Record<string, number>;
    change_1h?: number;
    change_1d?: number;
    change_7d?: number;
    chains: string[];
}

class DataProcessor {
    private readonly DEFILLAMA_API = 'https://api.llama.fi';

    async fetchAndProcessData() {
        try {
            console.log('Fetching data from DeFiLlama...');
            const protocols = await this.fetchProtocols();
            await this.processProtocols(protocols);
            await this.processChainMetrics(protocols);
            console.log('Completed processing all data');
        } catch (error) {
            console.error('Error processing data:', error);
            throw error;
        }
    }

    private async fetchProtocols(): Promise<Protocol[]> {
        const response = await axios.get(`${this.DEFILLAMA_API}/protocols`);
        return response.data;
    }

    private async processProtocols(protocols: Protocol[]) {
        for (const protocol of protocols) {
            await this.processProtocol(protocol);
        }
    }

    private async processProtocol(protocol: Protocol) {
        try {
            const healthMetrics = this.calculateHealthMetrics(protocol);
            const chainData = {
                chains: protocol.chains,
                chainTvls: protocol.chainTvls,
                totalChains: protocol.chains.length
            };

            // Update or insert protocol
            const { error: upsertError } = await supabase
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

            if (upsertError) throw upsertError;

            // Insert TVL history
            const { error: historyError } = await supabase
                .from('protocol_tvl_history')
                .insert({
                    protocol_id: protocol.id,
                    tvl: protocol.tvl,
                    timestamp: new Date().toISOString()
                });

            if (historyError) throw historyError;

        } catch (error) {
            console.error(`Error processing protocol ${protocol.name}:`, error);
            throw error;
        }
    }

    private async processChainMetrics(protocols: Protocol[]) {
        try {
            // Aggregate chain data
            const chainMetrics = new Map<string, any>();

            protocols.forEach(protocol => {
                Object.entries(protocol.chainTvls).forEach(([chain, tvl]) => {
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

            // Calculate and store chain metrics
            for (const [chain, data] of chainMetrics.entries()) {
                const metrics = {
                    dominance: (data.tvl / protocols.reduce((sum, p) => sum + p.tvl, 0)) * 100,
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

    private calculateHealthMetrics(protocol: Protocol) {
        const riskFactors = {
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

    private calculateTVLRisk(tvl: number): string {
        if (tvl > 1_000_000_000) return 'low';
        if (tvl > 100_000_000) return 'medium';
        return 'high';
    }

    private calculateChainDiversification(chainCount: number): string {
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
        };
    }

    private determineRiskLevel(riskFactors: any): string {
        const riskPoints = {
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