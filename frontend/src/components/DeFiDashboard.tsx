import React from 'react';
import {
    CategoryTVLChart,
    TVLDistributionChart,
    RiskDistributionChart,
    ChainDiversityChart
} from './charts/DeFiCharts';
import { CategoryDistribution, TVLDistribution, RiskDistribution, ChainDiversity } from '@/types/charts';

interface DeFiDashboardProps {
    categoryData: CategoryDistribution[];
    tvlDistributionData: TVLDistribution[];
    riskDistributionData: RiskDistribution[];
    chainDiversityData: ChainDiversity[];
}

const DeFiDashboard: React.FC<DeFiDashboardProps> = ({
    categoryData,
    tvlDistributionData,
    riskDistributionData,
    chainDiversityData
}) => {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryTVLChart data={categoryData} />
                <TVLDistributionChart data={tvlDistributionData} />
                <RiskDistributionChart data={riskDistributionData} />
                <ChainDiversityChart data={chainDiversityData} />
            </div>
        </div>
    );
};

export default DeFiDashboard;