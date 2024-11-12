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

// Modern color palette matching New York style
const COLORS = {
    primary: 'hsl(var(--primary))',
    muted: 'hsl(var(--muted))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    chart: [
        'hsl(221, 83%, 53%)', // blue-600
        'hsl(142, 71%, 45%)', // emerald-500
        'hsl(250, 89%, 65%)', // purple-500
        'hsl(345, 83%, 62%)', // rose-500
        'hsl(26, 90%, 57%)'   // orange-500
    ]
};

const formatTVL = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    
    return (
        <div className="rounded-lg border bg-background p-3 shadow-sm">
            <p className="font-medium">{label}</p>
            {payload.map((entry: any, index: number) => (
                <p key={index} className="text-sm text-muted-foreground">
                    {entry.name}: {entry.name.includes('TVL') ? formatTVL(entry.value) : entry.value}
                </p>
            ))}
        </div>
    );
};

export const CategoryTVLChart: React.FC<{ data: CategoryDistribution[] }> = ({ data }) => {
    if (!data?.length) return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
        </div>
    );

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart 
                data={data.slice(0, 10)} 
                margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
            >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                    tickFormatter={formatTVL}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                    dataKey="total_tvl" 
                    fill={COLORS.chart[0]} 
                    name="Total TVL"
                    radius={[4, 4, 0, 0]}
                />
                <Bar 
                    dataKey="protocol_count" 
                    fill={COLORS.chart[1]} 
                    name="Protocol Count"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const TVLDistributionChart: React.FC<{ data: TVLDistribution[] }> = ({ data }) => {
    if (!data?.length) return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
        </div>
    );

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="total_tvl"
                    nameKey="tvl_range"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({name, value}) => `${name}: ${formatTVL(value)}`}
                    labelLine={false}
                >
                    {data.map((_, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS.chart[index % COLORS.chart.length]}
                            className="stroke-background"
                            strokeWidth={2}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const RiskDistributionChart: React.FC<{ data: RiskDistribution[] }> = ({ data }) => {
    if (!data?.length) return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
        </div>
    );

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                    dataKey="risk_level"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                    yAxisId="left" 
                    tickFormatter={formatTVL}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                    yAxisId="left" 
                    dataKey="total_tvl" 
                    fill={COLORS.chart[0]}
                    name="Total TVL" 
                    radius={[4, 4, 0, 0]}
                />
                <Bar 
                    yAxisId="right" 
                    dataKey="protocol_count" 
                    fill={COLORS.chart[1]}
                    name="Protocol Count" 
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const ChainDiversityChart: React.FC<{ data: ChainDiversity[] }> = ({ data }) => {
    if (!data?.length) return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
        </div>
    );

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={data.slice(0, 15)}
                margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
            >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                    yAxisId="left" 
                    tickFormatter={formatTVL}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                    yAxisId="left" 
                    dataKey="tvl" 
                    fill={COLORS.chart[0]}
                    name="TVL" 
                    radius={[4, 4, 0, 0]}
                />
                <Bar 
                    yAxisId="right" 
                    dataKey="chain_count" 
                    fill={COLORS.chart[1]}
                    name="Chain Count" 
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};