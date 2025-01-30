// src/hooks/useDefiData.ts
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Protocol, ChainMetrics } from '@/types/database';
import type { 
    CategoryDistribution, 
    TVLDistribution, 
    RiskDistribution, 
    ChainDiversity, 
    TimeSeriesData, 
    EnhancedMetrics 
} from '@/types/charts';
import type { DeFiDashboardProps } from '@/types/dashboard';

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
    const getTimeframeDate = (tf: '24h' | '7d' | '30d') => {
        const date = new Date();
        switch (tf) {
            case '7d':
                date.setDate(date.getDate() - 7);
                break;
            case '24h':
                date.setDate(date.getDate() - 1);
                break;
            default: // 30d
                date.setDate(date.getDate() - 30);
        }
        return date;
    };

    const [chartTimeframe, setChartTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
    const [data, setData] = useState<DeFiDashboardProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [historicalLoading, setHistoricalLoading] = useState(false);

    useEffect(() => {
        console.log('useDefiData hook initialized');
        async function fetchData() {
            try {
                console.log('Fetching data...');
                await fetchBaseData();
                console.log('Data fetched successfully');
            } catch (err) {
                console.error('Error in fetchData:', err);
                setError(err as Error);
            }
        }
        fetchData();
    }, [chartTimeframe]);

    // Fetch historical data when timeframe changes
    useEffect(() => {
        if (!data) return;
        setHistoricalLoading(true);
        
        fetchHistoricalData(chartTimeframe)
            .then(timeSeriesData => {
                setData(prev => prev ? { ...prev, timeSeriesData } : null);
            })
            .catch(error => {
                console.error('Error fetching historical data:', error);
            })
            .finally(() => {
                setHistoricalLoading(false);  // Ensure this always runs
            });
    }, [chartTimeframe, data]);

    async function fetchHistoricalData(timeframe: '24h' | '7d' | '30d') {
        const startDate = getTimeframeDate(timeframe);
        const { data: historicalData } = await supabase
            .from('historical_metrics')
            .select('*')
            .gte('date', startDate.toISOString())
            .order('date', { ascending: true });

        return historicalData?.map(record => ({
            date: new Date(record.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            total_tvl: record.total_tvl,
            protocol_count: record.protocol_count,
            active_chains: record.active_chains
        })) || [];
    }

    async function fetchBaseData() {
        try {
            setLoading(true);
            // Clear cached data when timeframe changes
            cachedData = null;

            // Fetch protocols with specific columns
            const { data: protocols, error: protocolError } = await supabase
                .from('protocols')
                .select(`
                    id,
                    name,
                    category,
                    tvl,
                    tvl_7d,
                    apy,
                    chain_data,
                    health_metrics
                `);

            if (protocolError) throw protocolError;
            console.log('Fetched protocols:', protocols?.length);

            // Fetch volumes separately
            const { data: volumeData, error: volumeError } = await supabase
                .from('protocol_volumes')
                .select('*')
                .order('volume_24h', { ascending: false });

            if (volumeError) {
                console.error('Failed to fetch volumes:', volumeError);
            }

            // Create volume map with non-zero values only
            const volumeMap = (volumeData || []).reduce((acc: {[key: string]: number}, v) => {
                if (v.volume_24h > 0) {
                    acc[v.protocol_name.toLowerCase()] = Number(v.volume_24h);
                }
                return acc;
            }, {});

            console.log('Volume data loaded:', volumeData?.length, 'records');

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
                const tvl = Number(protocol.tvl) || 0;
                catData.total_tvl += tvl;
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

            // Update historical data fetch based on timeframe
            const startDate = getTimeframeDate(chartTimeframe);
            const { data: historicalData, error: historicalError } = await supabase
                .from('historical_metrics')
                .select('*')
                .gte('date', startDate.toISOString())
                .order('date', { ascending: true });

            if (historicalError) throw historicalError;

            // Process historical data with proper date formatting
            const timeSeriesData = historicalData.map(record => ({
                date: new Date(record.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }),
                total_tvl: record.total_tvl,
                protocol_count: record.protocol_count,
                active_chains: record.active_chains
            }));

            console.log('Setting processed data...');
            const totalTVL = categoryData.reduce((sum, cat) => sum + cat.total_tvl, 0);
            const formattedTVL = (totalTVL / 1e9).toFixed(2); // Convert to billions
            const safetyScore = ((riskDistributionData.find(r => r.risk_level === 'Low')?.total_tvl || 0) + 
                                 (riskDistributionData.find(r => r.risk_level === 'Medium')?.total_tvl || 0)) / totalTVL * 100;

            cachedData = {
                categoryData,
                tvlDistributionData,
                riskDistributionData,
                chainDiversityData,
                timeSeriesData,
                enhancedMetrics: {
                    avgTVL: totalTVL / protocols.length,
                    growthRate: ((timeSeriesData[timeSeriesData.length - 1]?.total_tvl || 0) / 
                                (timeSeriesData[0]?.total_tvl || 1) - 1) * 100,
                    mostActiveChain: chainDiversityData[0]?.name || 'Unknown',
                    riskAdjustedTVL: totalTVL * (safetyScore / 100)
                },
                protocols: protocols.map(p => {
                    const riskLevel = p.health_metrics?.risk_level || 'Medium';
                    const riskScore = riskLevel === 'Low' ? 80 : riskLevel === 'Medium' ? 50 : 30;
                    const currentTvl = Number(p.tvl) || 0;
                    const tvl7dAgo = Number(p.tvl_7d) || currentTvl;
                    
                    // Get volume directly from volumeData instead of volumeMap
                    const volumeRecord = volumeData?.find(v => v.protocol_name === p.name);
                    const volume24h = volumeRecord ? Number(volumeRecord.volume_24h) : 0;
                    
                    return {
                        name: p.name,
                        tvl: currentTvl,
                        volume24h: volume24h,  // Use the found volume
                        riskScore,
                        apy: Number(p.apy) || 0,
                        change7d: Number(((currentTvl - tvl7dAgo) / tvl7dAgo * 100).toFixed(2))
                    };
                }),
                chartTimeframe,
                setChartTimeframe
            };
            setData(cachedData);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { 
        data: data || {
            categoryData: [],
            tvlDistributionData: [],
            riskDistributionData: [],
            chainDiversityData: [],
            timeSeriesData: [],
            enhancedMetrics: null,
            protocols: []
        }, 
        loading, 
        error, 
        historicalLoading, 
        chartTimeframe, 
        setChartTimeframe 
    };
}