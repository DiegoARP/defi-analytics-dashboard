// src/hooks/useDefiData.ts

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Protocol, ChainMetrics } from '@/types/database';
import type { 
    CategoryDistribution, 
    TVLDistribution, 
    RiskDistribution, 
    ChainDiversity 
} from '@/types/charts';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useDefiData() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<{
        categoryData: CategoryDistribution[];
        tvlDistributionData: TVLDistribution[];
        riskDistributionData: RiskDistribution[];
        chainDiversityData: ChainDiversity[];
    } | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                
                // Fetch protocols
                const { data: protocols, error: protocolsError } = await supabase
                    .from('protocols')
                    .select('*')
                    .order('tvl', { ascending: false });

                if (protocolsError) throw protocolsError;

                // Fetch chain metrics
                const { data: chainMetrics, error: chainError } = await supabase
                    .from('chain_metrics')
                    .select('*')
                    .order('tvl', { ascending: false });

                if (chainError) throw chainError;

                // Process data for category distribution
                const categoryMap = new Map<string, CategoryDistribution>();
                protocols.forEach((protocol: Protocol) => {
                    const category = protocol.category || 'Other';
                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, {
                            category,
                            protocol_count: 0,
                            total_tvl: 0,
                            avg_tvl: 0
                        });
                    }
                    const catData = categoryMap.get(category)!;
                    catData.protocol_count++;
                    catData.total_tvl += protocol.tvl;
                });
                
                // Calculate averages and convert to array
                const categoryData = Array.from(categoryMap.values()).map(cat => ({
                    ...cat,
                    avg_tvl: cat.total_tvl / cat.protocol_count
                }));

                // Process TVL distribution
                const tvlRanges = {
                    'Above $1B': { min: 1e9, max: Infinity },
                    '$100M-$1B': { min: 1e8, max: 1e9 },
                    '$10M-$100M': { min: 1e7, max: 1e8 },
                    'Below $10M': { min: 0, max: 1e7 }
                };

                const tvlDistribution = Object.entries(tvlRanges).map(([range, { min, max }]) => {
                    const protocolsInRange = protocols.filter(
                        (p: Protocol) => p.tvl >= min && p.tvl < max
                    );
                    return {
                        tvl_range: range,
                        protocol_count: protocolsInRange.length,
                        total_tvl: protocolsInRange.reduce((sum, p) => sum + p.tvl, 0)
                    };
                });

                // Process risk distribution
                const riskMap = new Map<string, RiskDistribution>();
                protocols.forEach((protocol: Protocol) => {
                    const risk = protocol.health_metrics.risk_level;
                    if (!riskMap.has(risk)) {
                        riskMap.set(risk, {
                            risk_level: risk,
                            protocol_count: 0,
                            total_tvl: 0,
                            avg_tvl: 0
                        });
                    }
                    const riskData = riskMap.get(risk)!;
                    riskData.protocol_count++;
                    riskData.total_tvl += protocol.tvl;
                });

                const riskDistribution = Array.from(riskMap.values()).map(risk => ({
                    ...risk,
                    avg_tvl: risk.total_tvl / risk.protocol_count
                }));

                // Process chain diversity
                const chainDiversity = chainMetrics.map((chain: ChainMetrics) => ({
                    name: chain.chain_name,
                    tvl: chain.tvl,
                    chain_count: chain.protocol_count,
                    risk_level: 'Medium' // You might want to calculate this based on your metrics
                }));

                setData({
                    categoryData,
                    tvlDistributionData: tvlDistribution,
                    riskDistributionData: riskDistribution,
                    chainDiversityData: chainDiversity
                });
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        // Optional: Set up real-time subscription
        const subscription = supabase
            .channel('protocol-updates')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'protocols' },
                () => {
                    fetchData(); // Refetch data when changes occur
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { data, loading, error };
}