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
import type { DeFiDashboardProps } from '@/components/DeFiDashboard';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    },
    global: {
        fetch: fetch.bind(globalThis)
    }
});

// Immediate connection test
(async () => {
    try {
        console.log('Testing Supabase connection...');
        const { count, error } = await supabase
            .from('protocols')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.error('Supabase connection error:', error);
        } else {
            console.log('Supabase connection successful, protocols count:', count);
        }
    } catch (err) {
        console.error('Supabase test failed:', err);
    }
})();

let cachedData: DeFiDashboardProps | null = null;

export function useDefiData() {
    const [data, setData] = useState<DeFiDashboardProps>(cachedData || {
        categoryData: [],
        tvlDistributionData: [],
        riskDistributionData: [],
        chainDiversityData: []
    });
    const [loading, setLoading] = useState(!cachedData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                console.log('Fetching data...');
                
                // Fetch protocols with specific columns
                const { data: protocols, error: protocolError } = await supabase
                    .from('protocols')
                    .select(`
                        id,
                        name,
                        category,
                        tvl,
                        chain_data,
                        health_metrics
                    `);

                if (protocolError) throw protocolError;
                console.log('Fetched protocols:', protocols?.length);

                // Process category distribution
                const categoryMap = new Map<string, CategoryDistribution>();
                protocols?.forEach((protocol: any) => {
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
                    catData.total_tvl += Number(protocol.tvl) || 0;
                });

                const categoryData = Array.from(categoryMap.values())
                    .map(cat => ({
                        ...cat,
                        avg_tvl: cat.total_tvl / cat.protocol_count
                    }))
                    .sort((a, b) => b.total_tvl - a.total_tvl);

                console.log('Category data processed:', categoryData.length);

                // Process TVL distribution
                const tvlRanges = [
                    { min: 0, max: 1e6, label: '0-1M' },
                    { min: 1e6, max: 10e6, label: '1M-10M' },
                    { min: 10e6, max: 100e6, label: '10M-100M' },
                    { min: 100e6, max: Infinity, label: '100M+' }
                ];

                const tvlDistributionData = tvlRanges.map(range => {
                    const protocolsInRange = protocols?.filter(
                        (p: any) => Number(p.tvl) >= range.min && Number(p.tvl) < range.max
                    );
                    return {
                        tvl_range: range.label,
                        protocol_count: protocolsInRange?.length || 0,
                        total_tvl: protocolsInRange?.reduce((sum: number, p: any) => sum + (Number(p.tvl) || 0), 0) || 0
                    };
                });

                // Process risk distribution
                const riskDistributionData = protocols?.reduce((acc: any[], protocol: any) => {
                    const riskLevel = protocol.health_metrics?.risk_level || 'Medium';
                    const existing = acc.find(item => item.risk_level === riskLevel);
                    if (existing) {
                        existing.protocol_count++;
                        existing.total_tvl += Number(protocol.tvl) || 0;
                    } else {
                        acc.push({
                            risk_level: riskLevel,
                            protocol_count: 1,
                            total_tvl: Number(protocol.tvl) || 0,
                            avg_tvl: 0
                        });
                    }
                    return acc;
                }, []).map(risk => ({
                    ...risk,
                    avg_tvl: risk.total_tvl / risk.protocol_count
                }));

                // Process chain diversity
                const chainMap = new Map();
                protocols?.forEach((protocol: any) => {
                    const chains = protocol.chain_data?.chains || [];
                    chains.forEach((chain: string) => {
                        if (!chainMap.has(chain)) {
                            chainMap.set(chain, {
                                name: chain,
                                tvl: 0,
                                chain_count: 0,
                                risk_level: 'Medium'
                            });
                        }
                        const chainData = chainMap.get(chain);
                        chainData.tvl += Number(protocol.tvl) || 0;
                        chainData.chain_count++;
                    });
                });

                const chainDiversityData = Array.from(chainMap.values())
                    .sort((a, b) => b.tvl - a.tvl)
                    .slice(0, 20); // Top 20 chains

                console.log('Setting processed data...');
                cachedData = {
                    categoryData,
                    tvlDistributionData,
                    riskDistributionData,
                    chainDiversityData
                };
                setData(cachedData);
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { data, loading, error };
}