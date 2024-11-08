'use client';

import React from 'react';
import DeFiDashboard from '@/components/DeFiDashboard';

// Sample data based on your SQL results
const sampleData = {
    categoryData: [
        {
            category: "CEX",
            protocol_count: 53,
            total_tvl: 227189584922.73,
            avg_tvl: 4286595941.94
        },
        {
            category: "Liquid Staking",
            protocol_count: 193,
            total_tvl: 48627506351.35,
            avg_tvl: 251955991.46
        }
        // Add more categories as needed
    ],
    tvlDistributionData: [
        {
            tvl_range: "Above $1B",
            protocol_count: 57,
            total_tvl: 380578866695.51
        },
        {
            tvl_range: "$100M-$1B",
            protocol_count: 197,
            total_tvl: 62363284990.32
        }
        // Add more ranges
    ],
    riskDistributionData: [
        {
            risk_level: "Medium",
            protocol_count: 4060,
            total_tvl: 247993794516.87,
            avg_tvl: 61082215.40
        },
        {
            risk_level: "Low",
            protocol_count: 177,
            total_tvl: 195013214139.87,
            avg_tvl: 1101769571.41
        }
        // Add more risk levels
    ],
    chainDiversityData: [
        {
            name: "Multichain",
            tvl: 118836302.48,
            chain_count: 53,
            risk_level: "High"
        }
        // Add more protocols
    ]
};

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">DeFi Analytics Dashboard</h1>
            <DeFiDashboard {...sampleData} />
        </div>
    );
}