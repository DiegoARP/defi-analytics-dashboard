'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CategoryTVLChart,
    TVLDistributionChart,
    RiskDistributionChart,
    ChainDiversityChart,
    TimeSeriesChart
} from './charts/DeFiCharts';
import { 
    TrendingUp, 
    TrendingDown, 
    BarChart2, 
    Shield, 
    Activity, 
    DollarSign, 
    Share2
} from 'lucide-react';
import type { 
    CategoryDistribution, 
    TVLDistribution, 
    RiskDistribution, 
    ChainDiversity, 
    TimeSeriesData, 
    EnhancedMetrics
} from '@/types/charts';
import { useDefiData } from '@/hooks/useDefiData';
import { ProtocolComparisonCard } from './ProtocolComparison';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export interface DeFiDashboardProps {
    categoryData: CategoryDistribution[];
    tvlDistributionData: TVLDistribution[];
    riskDistributionData: RiskDistribution[];
    chainDiversityData: ChainDiversity[];
    timeSeriesData: TimeSeriesData[];
    enhancedMetrics: EnhancedMetrics | null;
}

// StatCard Component
const StatCard = ({ 
    title, 
    value, 
    change, 
    trend,
    icon 
}: { 
    title: string; 
    value: string; 
    change?: number; 
    trend?: 'up' | 'down';
    icon: React.ReactNode;
}) => (
    <Card className="hover:shadow-lg transition-all">
        <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">{title}</span>
                    <span className="text-2xl font-bold tracking-tight">{value}</span>
                    {change && (
                        <div className="flex items-center space-x-1">
                            {trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm ${
                                trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                            }`}>
                                {change}%
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                    {icon}
                </div>
            </div>
        </CardContent>
    </Card>
);

// Share button component
const ShareButton = () => (
    <button 
        onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            // Could add a toast notification here
        }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-sm text-primary"
    >
        <Share2 className="w-4 h-4" />
        Share
    </button>
);

// Main Dashboard Component
const DeFiDashboard: React.FC<DeFiDashboardProps> = ({
    categoryData = [],
    tvlDistributionData = [],
    riskDistributionData = [],
    chainDiversityData = [],
    timeSeriesData = [],
    enhancedMetrics = null
}) => {
    const { data, loading, error, chartTimeframe, setChartTimeframe } = useDefiData();

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} retry={() => window.location.reload()} />;

    // Calculate insights using your existing logic with null checks
    const insights = useMemo(() => {
        if (!categoryData?.length || !riskDistributionData?.length) {
            return {
                totalTVL: '0',
                topCategory: null,
                categoryConcentration: '0',
                safetyScore: '0'
            };
        }

        const totalTVL = categoryData.reduce((sum, cat) => sum + cat.total_tvl, 0);
        const topCategories = [...categoryData]
            .sort((a, b) => b.total_tvl - a.total_tvl)
            .slice(0, 3);
        
        const riskTVL = riskDistributionData.reduce((acc, risk) => ({
            ...acc,
            [risk.risk_level]: risk.total_tvl
        }), {} as Record<string, number>);
        
        const safetyScore = ((riskTVL['Low'] || 0 + riskTVL['Medium'] || 0) / totalTVL * 100).toFixed(1);
        
        return {
            totalTVL: (totalTVL / 1e9).toFixed(2),
            topCategory: topCategories[0] || null,
            categoryConcentration: ((topCategories[0]?.total_tvl || 0) / totalTVL * 100).toFixed(1),
            safetyScore
        };
    }, [categoryData, riskDistributionData]);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
                {/* Header with share button */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            DeFi Analytics Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Real-time insights across protocols and chains
                        </p>
                    </div>
                    <ShareButton />
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Value Locked"
                        value={`$${insights.totalTVL}B`}
                        change={2.3}
                        trend="up"
                        icon={<DollarSign className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Top Category"
                        value={insights.topCategory?.category || '-'}
                        change={Number(insights.categoryConcentration)}
                        trend="up"
                        icon={<BarChart2 className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Safety Score"
                        value={`${insights.safetyScore}%`}
                        icon={<Shield className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Active Chains"
                        value={chainDiversityData.length.toString()}
                        icon={<Activity className="w-6 h-6" />}
                    />
                </div>

                {/* Historical Trends with its own timeframe control */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Historical Trends</CardTitle>
                        <CardDescription>TVL and protocol growth over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <TimeSeriesChart 
                            data={data.timeSeriesData}
                            timeframe={chartTimeframe}
                            onTimeframeChange={setChartTimeframe}
                            loading={loading}
                            error={error}
                        />
                    </CardContent>
                </Card>

                {/* Charts Grid */}
                {categoryData.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* TVL Distribution Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>TVL Distribution</CardTitle>
                                <CardDescription>Value concentration across protocols</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[220px]">
                                <TVLDistributionChart data={tvlDistributionData} />
                            </CardContent>
                        </Card>

                        {/* Risk Analysis Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Risk Analysis</CardTitle>
                                <CardDescription>Protocol risk distribution by TVL and count</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[280px]">
                                <RiskDistributionChart data={riskDistributionData} />
                            </CardContent>
                        </Card>

                        {/* Protocol Categories Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Protocol Categories</CardTitle>
                                <CardDescription className="flex items-center justify-between">
                                    <span>TVL distribution across categories</span>
                                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded">Top 15 by TVL</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <CategoryTVLChart data={categoryData} />
                            </CardContent>
                        </Card>

                        {/* Chain Diversity Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Chain Diversity</CardTitle>
                                <CardDescription className="flex items-center justify-between">
                                    <span>Distribution across blockchain networks</span>
                                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded">Top 15 by TVL</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ChainDiversityChart data={chainDiversityData} />
                            </CardContent>
                        </Card>

                        <ProtocolComparisonCard protocols={data.protocols} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeFiDashboard;