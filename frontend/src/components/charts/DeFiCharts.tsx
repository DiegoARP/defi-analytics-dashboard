'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { 
    CategoryDistribution, 
    TVLDistribution, 
    RiskDistribution,
    ChainDiversity 
} from '@/types/charts';

// Utility function for formatting large numbers
const formatTVL = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

// Wrapper component for consistent styling
const ChartWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="w-full h-full min-h-[400px] bg-white p-4 rounded-lg shadow">
            {children}
        </div>
    );
};

// Custom tooltip for better formatting
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    
    return (
        <div className="bg-white p-3 border rounded shadow-lg">
            <p className="font-bold">{label}</p>
            {payload.map((entry: any, index: number) => (
                <p key={index} style={{ color: entry.color }}>
                    {entry.name}: {entry.name.includes('TVL') ? formatTVL(entry.value) : entry.value}
                </p>
            ))}
        </div>
    );
};

export const CategoryTVLChart: React.FC<{ data: CategoryDistribution[] }> = ({ data }) => {
    if (!data?.length) return <div>No data available</div>;

    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                    data={data.slice(0, 10)} 
                    margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="category" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis tickFormatter={formatTVL} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="total_tvl" fill="#8884d8" name="Total TVL" />
                    <Bar dataKey="protocol_count" fill="#82ca9d" name="Protocol Count" />
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const TVLDistributionChart: React.FC<{ data: TVLDistribution[] }> = ({ data }) => {
    if (!data?.length) return <div>No data available</div>;

    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total_tvl"
                        nameKey="tvl_range"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({name, value}) => `${name}: ${formatTVL(value)}`}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const RiskDistributionChart: React.FC<{ data: RiskDistribution[] }> = ({ data }) => {
    if (!data?.length) return <div>No data available</div>;

    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk_level" />
                    <YAxis yAxisId="left" tickFormatter={formatTVL} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                        yAxisId="left" 
                        dataKey="total_tvl" 
                        fill="#8884d8" 
                        name="Total TVL" 
                    />
                    <Bar 
                        yAxisId="right" 
                        dataKey="protocol_count" 
                        fill="#82ca9d" 
                        name="Protocol Count" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export const ChainDiversityChart: React.FC<{ data: ChainDiversity[] }> = ({ data }) => {
    if (!data?.length) return <div>No data available</div>;

    return (
        <ChartWrapper>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data.slice(0, 15)}
                    margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis yAxisId="left" tickFormatter={formatTVL} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                        yAxisId="left" 
                        dataKey="tvl" 
                        fill="#8884d8" 
                        name="TVL" 
                    />
                    <Bar 
                        yAxisId="right" 
                        dataKey="chain_count" 
                        fill="#82ca9d" 
                        name="Chain Count" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};