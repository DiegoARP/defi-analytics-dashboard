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
    Cell,
    Label
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
                    <span className="inline-block w-24">{entry.name}:</span>
                    {entry.name.toLowerCase().includes('tvl') 
                        ? formatTVL(entry.value)
                        : entry.value}
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
    const totalTVL = data.reduce((sum, item) => sum + item.total_tvl, 0);
    
    const formattedData = data.map(item => ({
        ...item,
        name: `${item.tvl_range} (${((item.total_tvl / totalTVL) * 100).toFixed(1)}%)`,
        displayValue: formatTVL(item.total_tvl)
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={formattedData}
                    dataKey="total_tvl"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                >
                    {formattedData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS.chart[index % COLORS.chart.length]}
                            strokeWidth={1}
                        />
                    ))}
                    <Label
                        value={`Total\n${formatTVL(totalTVL)}`}
                        position="center"
                        className="text-sm font-medium"
                    />
                </Pie>
                <Tooltip 
                    content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const data = payload[0].payload;
                        return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <p className="text-sm font-medium">{data.tvl_range}</p>
                                <p className="text-xs text-muted-foreground">
                                    TVL: {data.displayValue}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Protocols: {data.protocol_count}
                                </p>
                            </div>
                        );
                    }}
                />
                <Legend 
                    layout="vertical" 
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ 
                        paddingLeft: '10px',
                        fontSize: '12px',
                        lineHeight: '20px'
                    }}
                    iconSize={10}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const RiskDistributionChart: React.FC<{ data: RiskDistribution[] }> = ({ data }) => {
    if (!data?.length) return null;

    const totalProtocols = data.reduce((sum, item) => sum + item.protocol_count, 0);
    const totalTVL = data.reduce((sum, item) => sum + item.total_tvl, 0);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={data}
                margin={{ top: 10, right: 40, left: 40, bottom: 20 }}
                barGap={0}
            >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                    dataKey="risk_level"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                    yAxisId="left" 
                    tickFormatter={formatTVL}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    label={{ 
                        value: 'Total Value Locked', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' },
                        offset: -25
                    }}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    label={{ 
                        value: 'Protocol Count', 
                        angle: 90, 
                        position: 'insideRight',
                        style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' },
                        offset: -20
                    }}
                />
                <Tooltip 
                    content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const data = payload[0].payload;
                        return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <p className="text-sm font-medium">{data.risk_level} Risk</p>
                                <p className="text-xs text-muted-foreground">
                                    TVL: {formatTVL(data.total_tvl)} ({((data.total_tvl / totalTVL) * 100).toFixed(1)}%)
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Protocols: {data.protocol_count} ({((data.protocol_count / totalProtocols) * 100).toFixed(1)}%)
                                </p>
                            </div>
                        );
                    }}
                />
                <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }}
                    align="center"
                />
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