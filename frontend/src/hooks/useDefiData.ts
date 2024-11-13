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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
        console.log('useEffect triggered in useDefiData');
        let isMounted = true;

        async function fetchData() {
            try {
                console.log('fetchData function started');
                if (!isMounted) return;

                setLoading(true);
                console.log('Loading state set to true');

                // Test database connection
                const { data: testData, error: testError } = await supabase
                    .from('protocols')
                    .select('id')
                    .limit(1);

                if (testError) {
                    throw new Error(`Database connection test failed: ${testError.message}`);
                }

                console.log('Database connection test successful:', !!testData);

                // Fetch protocols
                console.log('Fetching protocols...');
                const { data: protocols, error: protocolsError } = await supabase
                    .from('protocols')
                    .select('*')
                    .order('tvl', { ascending: false })
                    .throwOnError();

                if (protocolsError) {
                    console.error('Protocol fetch error:', protocolsError);
                    throw protocolsError;
                }

                console.log(`Successfully fetched ${protocols?.length || 0} protocols`);
                if (protocols?.[0]) {
                    console.log('Sample protocol data:', {
                        id: protocols[0].id,
                        name: protocols[0].name,
                        tvl: protocols[0].tvl
                    });
                }

                // Fetch chain metrics
                console.log('Fetching chain metrics...');
                const { data: chainMetrics, error: chainError } = await supabase
                    .from('chain_metrics')
                    .select('*')
                    .order('tvl', { ascending: false })
                    .throwOnError();

                if (chainError) {
                    console.error('Chain metrics fetch error:', chainError);
                    throw chainError;
                }

                console.log(`Successfully fetched ${chainMetrics?.length || 0} chain metrics`);
                if (chainMetrics?.[0]) {
                    console.log('Sample chain metric:', {
                        chain: chainMetrics[0].chain_name,
                        tvl: chainMetrics[0].tvl
                    });
                }

                // Process category distribution
                console.log('Processing category distribution...');
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

                const categoryData = Array.from(categoryMap.values()).map(cat => ({
                    ...cat,
                    avg_tvl: cat.total_tvl / cat.protocol_count
                }));

                console.log(`Processed ${categoryData.length} categories`);

                // Process TVL distribution
                console.log('Processing TVL distribution...');
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

                console.log('TVL distribution processed:', tvlDistribution);

                // Process risk distribution
                console.log('Processing risk distribution...');
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

                console.log('Risk distribution processed:', riskDistribution);

                // Process chain diversity
                console.log('Processing chain diversity...');
                const chainDiversity = chainMetrics.map((chain: ChainMetrics) => ({
                    name: chain.chain_name,
                    tvl: chain.tvl,
                    chain_count: chain.protocol_count,
                    risk_level: chain.metrics.stability || 'Medium'
                }));

                console.log(`Processed ${chainDiversity.length} chains`);

                if (isMounted) {
                    // Set final processed data
                    const processedData = {
                        categoryData,
                        tvlDistributionData: tvlDistribution,
                        riskDistributionData: riskDistribution,
                        chainDiversityData: chainDiversity
                    };

                    console.log('Setting final data with summary:', {
                        categories: processedData.categoryData.length,
                        tvlDistribution: processedData.tvlDistributionData.length,
                        riskDistribution: processedData.riskDistributionData.length,
                        chainDiversity: processedData.chainDiversityData.length
                    });

                    setData(processedData);
                }
            } catch (err) {
                console.error('Error in fetchData:', err);
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('An error occurred'));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    console.log('Loading state set to false');
                }
            }
        }

        console.log('Calling fetchData function');
        fetchData();

        // Set up real-time subscription
        const subscription = supabase
            .channel('protocol-updates')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'protocols' },
                (payload) => {
                    console.log('Real-time update received:', payload);
                    if (isMounted) {
                        fetchData();
                    }
                }
            )
            .subscribe();

        return () => {
            console.log('useEffect cleanup - component unmounting');
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return { data, loading, error };
}