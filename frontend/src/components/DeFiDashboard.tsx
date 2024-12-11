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
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ProtocolComparisonCard } from './ProtocolComparison';
import { DashboardHeader } from './DashboardHeader';
import { InfoPanel } from './InfoPanel';
import { NewsFeed } from '@/components/NewsFeed';
import { ProtocolGrowthChart } from './ProtocolGrowthChart';

export interface DeFiDashboardProps {
    categoryData: CategoryDistribution[];
    tvlDistributionData: TVLDistribution[];
    riskDistributionData: RiskDistribution[];
    chainDiversityData: ChainDiversity[];
    timeSeriesData: TimeSeriesData[];
    enhancedMetrics: EnhancedMetrics | null;
    protocols: any[];
}

// Add this helper function for number formatting
const formatNumber = (num: number): string => {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

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
const DeFiDashboard: React.FC<DeFiDashboardProps & {
    chartTimeframe: '24h' | '7d' | '30d';
    setChartTimeframe: (timeframe: '24h' | '7d' | '30d') => void;
    historicalLoading?: boolean;
}> = ({
    categoryData = [],
    tvlDistributionData = [],
    riskDistributionData = [],
    chainDiversityData = [],
    timeSeriesData = [],
    enhancedMetrics = null,
    protocols = [],
    chartTimeframe,
    setChartTimeframe,
    historicalLoading = false,
}) => {
    console.log('Total protocols:', protocols.length);
    console.log('Protocols with volume:', protocols.filter(p => p.volume24h > 0).length);
    console.log('Top 5 by volume:', protocols
        .filter(p => p.volume24h > 0)
        .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
        .slice(0, 5)
        .map(p => ({name: p.name, volume: p.volume24h}))
    );

    // Add back useMemo for insights
    const insights = useMemo(() => {
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
                <DashboardHeader />
                
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                    <div className="space-y-6">
                        <div className="hidden lg:block">
                            <InfoPanel />
                        </div>
                        <div className="hidden lg:block">
                            <NewsFeed />
                        </div>
                        <div className="hidden lg:block">
                            <Card>
                                <CardHeader className="flex">
                                    <div className="inline-block">
                                        <div className="inline-flex flex-col gap-0.5 px-3 py-2 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-md">
                                            <CardTitle className="text-sm font-semibold">
                                                Top Daily Gainers
                                            </CardTitle>
                                            <CardDescription className="text-xs opacity-75">
                                                Best performing assets (24h)
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {protocols
                                            .filter(p => p.priceChange24h != null && p.priceChange24h > 0)
                                            .sort((a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0))
                                            .slice(0, 5)
                                            .map((protocol, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="font-medium px-3 py-1 bg-secondary/50 rounded-md">
                                                        {protocol.name}
                                                    </span>
                                                    <span className="text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-md">
                                                        +{(protocol.priceChange24h || 0).toFixed(2)}%
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard 
                                title="Total Value Locked"
                                value={`$${(timeSeriesData[timeSeriesData.length - 1]?.total_tvl / 1e9).toFixed(2)}B`}
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

                        {/* Historical Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Historical Trends</CardTitle>
                                <CardDescription>TVL and protocol growth over time</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <TimeSeriesChart 
                                    data={timeSeriesData}
                                    timeframe={chartTimeframe}
                                    onTimeframeChange={setChartTimeframe}
                                    isLoading={historicalLoading}
                                />
                            </CardContent>
                        </Card>

                        {/* Charts Grid */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>TVL Distribution</CardTitle>
                                    <CardDescription>Value concentration across protocols</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[220px]">
                                    <TVLDistributionChart data={tvlDistributionData} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Risk Analysis</CardTitle>
                                    <CardDescription>Protocol risk distribution by TVL and count</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[280px]">
                                    <RiskDistributionChart data={riskDistributionData} />
                                </CardContent>
                            </Card>

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

                            <div className="lg:col-span-2 grid gap-6 lg:grid-cols-2">
                                <ProtocolComparisonCard protocols={protocols} />
                                <div className="grid gap-6">
                                    <Card>
                                        <CardHeader className="flex">
                                            <div className="inline-block">
                                                <div className="inline-flex flex-col gap-0.5 px-3 py-2 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-md">
                                                    <CardTitle className="text-sm font-semibold">
                                                        Yield Overview
                                                    </CardTitle>
                                                    <CardDescription className="text-xs opacity-75">
                                                        Top protocols by APY
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {protocols
                                                    .sort((a, b) => (b.apy || 0) - (a.apy || 0))
                                                    .slice(0, 5)
                                                    .map((protocol, index) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <span className="font-medium px-3 py-1 bg-secondary/50 rounded-md">
                                                                {protocol.name}
                                                            </span>
                                                            <span className="text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-md">
                                                                {(protocol.apy || 0).toFixed(2)}% APY
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex">
                                            <div className="inline-block">
                                                <div className="inline-flex flex-col gap-0.5 px-3 py-2 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-md">
                                                    <CardTitle className="text-sm font-semibold">
                                                        Volume Leaders
                                                    </CardTitle>
                                                    <CardDescription className="text-xs opacity-75">
                                                        24h trading volume
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {protocols
                                                    .filter(p => p.volume24h != null && p.volume24h > 0)
                                                    .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
                                                    .slice(0, 5)
                                                    .map((protocol, index) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <span className="font-medium px-3 py-1 bg-secondary/50 rounded-md">
                                                                {protocol.name}
                                                            </span>
                                                            <span className="text-blue-500 px-3 py-1 bg-blue-500/10 rounded-md">
                                                                ${formatNumber(protocol.volume24h)}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeFiDashboard;