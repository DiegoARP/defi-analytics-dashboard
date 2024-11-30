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
    ChainDiversityChart
} from './charts/DeFiCharts';
import { 
    TrendingUp, 
    TrendingDown, 
    BarChart2, 
    Shield, 
    Activity, 
    DollarSign 
} from 'lucide-react';
import type { 
    CategoryDistribution, 
    TVLDistribution, 
    RiskDistribution, 
    ChainDiversity 
} from '@/types/charts';

export interface DeFiDashboardProps {
    categoryData: CategoryDistribution[];
    tvlDistributionData: TVLDistribution[];
    riskDistributionData: RiskDistribution[];
    chainDiversityData: ChainDiversity[];
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

// Main Dashboard Component
const DeFiDashboard: React.FC<DeFiDashboardProps> = ({
    categoryData = [],
    tvlDistributionData = [],
    riskDistributionData = [],
    chainDiversityData = []
}) => {
    const [timeframe, setTimeframe] = useState('24h');

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

    // Add loading state check
    if (!categoryData?.length || !tvlDistributionData?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <p className="mt-4">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">DeFi Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Real-time insights across protocols and chains
                        </p>
                    </div>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                    </Select>
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

                {/* Charts Grid */}
                {categoryData.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* TVL Distribution Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>TVL Distribution</CardTitle>
                                <CardDescription>Value concentration across protocols</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                <TVLDistributionChart data={tvlDistributionData} />
                            </CardContent>
                        </Card>

                        {/* Risk Analysis Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Risk Analysis</CardTitle>
                                <CardDescription>Protocol risk distribution</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <RiskDistributionChart data={riskDistributionData} />
                            </CardContent>
                        </Card>

                        {/* Protocol Categories Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Protocol Categories</CardTitle>
                                <CardDescription>TVL distribution across categories</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <CategoryTVLChart data={categoryData} />
                            </CardContent>
                        </Card>

                        {/* Chain Diversity Chart */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Chain Diversity</CardTitle>
                                <CardDescription>Distribution across blockchain networks</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ChainDiversityChart data={chainDiversityData} />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeFiDashboard;