'use client';

import React, { useMemo } from 'react';
import {
    CategoryTVLChart,
    TVLDistributionChart,
    RiskDistributionChart,
    ChainDiversityChart
} from './charts/DeFiCharts';
import { CategoryDistribution, TVLDistribution, RiskDistribution, ChainDiversity } from '@/types/charts';
import { TrendingUp, TrendingDown, BarChart2, Shield } from 'lucide-react';

interface DeFiDashboardProps {
    categoryData: CategoryDistribution[];
    tvlDistributionData: TVLDistribution[];
    riskDistributionData: RiskDistribution[];
    chainDiversityData: ChainDiversity[];
}

const StatCard = ({ 
    title, 
    value, 
    change, 
    trend 
}: { 
    title: string; 
    value: string; 
    change?: number; 
    trend?: 'up' | 'down' 
}) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {change && (
                <span className={`flex items-center text-sm ${
                    trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(change)}%
                </span>
            )}
        </div>
    </div>
);

const DeFiDashboard: React.FC<DeFiDashboardProps> = ({
    categoryData,
    tvlDistributionData,
    riskDistributionData,
    chainDiversityData
}) => {
    // Calculate dynamic insights
    const insights = useMemo(() => {
        const totalTVL = categoryData.reduce((sum, cat) => sum + cat.total_tvl, 0);
        const topCategories = [...categoryData]
            .sort((a, b) => b.total_tvl - a.total_tvl)
            .slice(0, 3);
        
        const riskTVL = riskDistributionData.reduce((acc, risk) => ({
            ...acc,
            [risk.risk_level]: risk.total_tvl
        }), {} as Record<string, number>);
        
        const safetyScore = ((riskTVL['Low'] + riskTVL['Medium']) / totalTVL * 100).toFixed(1);
        
        return {
            totalTVL: (totalTVL / 1e9).toFixed(2),
            topCategory: topCategories[0],
            categoryConcentration: ((topCategories[0].total_tvl / totalTVL) * 100).toFixed(1),
            safetyScore
        };
    }, [categoryData, riskDistributionData]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">DeFi Analytics Dashboard</h1>
                    <p className="text-gray-500">Real-time insights across protocols and chains</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Total Value Locked" 
                        value={`$${insights.totalTVL}B`}
                        change={2.3}
                        trend="up"
                    />
                    <StatCard 
                        title="Top Category" 
                        value={insights.topCategory?.category || '-'}
                        change={Number(insights.categoryConcentration)}
                        trend="up"
                    />
                    <StatCard 
                        title="Safety Score" 
                        value={`${insights.safetyScore}%`}
                    />
                    <StatCard 
                        title="Active Chains" 
                        value={chainDiversityData.length.toString()}
                    />
                </div>

                {/* Main Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* TVL Distribution */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">TVL Distribution</h2>
                                <p className="text-sm text-gray-500">Value concentration across protocols</p>
                            </div>
                            <BarChart2 className="text-blue-500" />
                        </div>
                        <TVLDistributionChart data={tvlDistributionData} />
                    </div>

                    {/* Risk Analysis */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Risk Analysis</h2>
                                <p className="text-sm text-gray-500">Protocol risk distribution</p>
                            </div>
                            <Shield className="text-emerald-500" />
                        </div>
                        <RiskDistributionChart data={riskDistributionData} />
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Protocol Categories</h2>
                                <p className="text-sm text-gray-500">TVL distribution across categories</p>
                            </div>
                        </div>
                        <CategoryTVLChart data={categoryData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeFiDashboard;