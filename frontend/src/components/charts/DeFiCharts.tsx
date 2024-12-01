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
import { formatTVL } from '@/lib/utils/format';

// Modern color palette matching New York style
export const COLORS = {
    primary: 'hsl(var(--primary))',
    muted: 'hsl(var(--muted))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    chart: [
        '#6366F1', // indigo
        '#22C55E', // green
        '#F59E0B', // amber
        '#EC4899', // pink
        '#8B5CF6'  // purple
    ]
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
    if (!data?.length) return null;

    const topCategories = data
        .sort((a, b) => b.total_tvl - a.total_tvl)
        .slice(0, 15);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={topCategories}
                margin={{ top: 20, right: 100, left: 60, bottom: 60 }}  // Reduced right margin
                barGap={8}  // Slightly reduced gap
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="stroke-muted/20"
                    horizontal={true}
                    vertical={false}
                />
                <XAxis 
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={65}  // Slightly reduced height
                    tick={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11
                    }}
                    tickMargin={12}  // Adjusted margin
                />
                <YAxis 
                    yAxisId="left"
                    tickFormatter={formatTVL}
                    tick={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11
                    }}
                    width={65}  // Slightly reduced width
                />
                <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11
                    }}
                    width={45}  // Slightly reduced width
                />
                <Tooltip 
                    cursor={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        opacity: 0.1 
                    }}
                    content={({ active, payload, label }) => {
                        if (!active || !payload?.[0]) return null;
                        return (
                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                <p className="font-medium mb-1">{label}</p>
                                {payload.map((entry: any, index: number) => (
                                    <p key={index} className="text-sm text-muted-foreground">
                                        <span className="inline-block w-32">{entry.name}:</span>
                                        <span className="font-medium">
                                            {entry.name === 'Total TVL' 
                                                ? formatTVL(entry.value)
                                                : entry.value}
                                        </span>
                                    </p>
                                ))}
                            </div>
                        );
                    }}
                />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                        paddingLeft: '15px',  // Reduced padding
                        fontSize: '12px',
                        lineHeight: '20px',
                        right: 0
                    }}
                    iconType="circle"
                    iconSize={8}
                />
                <Bar 
                    yAxisId="left"
                    dataKey="total_tvl"
                    name="Total TVL"
                    fill={COLORS.chart[0]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}  // Slightly reduced bar size
                />
                <Bar 
                    yAxisId="right"
                    dataKey="protocol_count"
                    name="Protocol Count"
                    fill={COLORS.chart[1]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}  // Slightly reduced bar size
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

    const tvlChartOptions = {
        chart: {
            type: 'donut',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            }
        },
        colors: ['#6366F1', '#22C55E', '#F59E0B', '#EC4899'], // Modern indigo, green, amber, pink
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                opacityFrom: 1,
                opacityTo: 0.8,
            }
        },
        tooltip: {
            y: {
                formatter: (value: number) => `$${(value / 1e9).toFixed(2)}B`
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            markers: {
                radius: 12,
            }
        }
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={formattedData}
                    dataKey="total_tvl"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    animationDuration={750}
                    animationBegin={0}
                >
                    {formattedData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS.chart[index % COLORS.chart.length]}
                            strokeWidth={2}
                            stroke={COLORS.background}
                        />
                    ))}
                    <Label
                        value={`Total\n${formatTVL(totalTVL)}`}
                        position="center"
                        className="text-sm font-medium"
                        style={{ fill: 'hsl(var(--foreground))' }}
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

    const riskChartOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '60%',
                grouped: true,
            }
        },
        colors: ['#6366F1', '#22C55E'], // Indigo for TVL, Green for count
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.2,
                opacityFrom: 0.9,
                opacityTo: 0.7,
            }
        },
        stroke: {
            width: 0
        },
        tooltip: {
            shared: true,
            intersect: false
        }
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 60, left: 60, bottom: 30 }}
                barGap={8}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="stroke-muted/20" 
                    horizontal={true}
                    vertical={false}
                />
                <XAxis 
                    dataKey="risk_level"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={12}
                />
                <YAxis 
                    yAxisId="left" 
                    tickFormatter={formatTVL}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={8}
                    label={{ 
                        value: 'Total Value Locked', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { 
                            fontSize: '12px', 
                            fill: 'hsl(var(--muted-foreground))',
                            textAnchor: 'middle'
                        },
                        offset: -45
                    }}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickMargin={8}
                    label={{ 
                        value: 'Protocol Count', 
                        angle: 90, 
                        position: 'insideRight',
                        style: { 
                            fontSize: '12px', 
                            fill: 'hsl(var(--muted-foreground))',
                            textAnchor: 'middle'
                        },
                        offset: -35
                    }}
                />
                <Tooltip 
                    cursor={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        opacity: 0.1 
                    }}
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
                    wrapperStyle={{ 
                        fontSize: '12px',
                        paddingTop: '5px',
                    }}
                    align="center"
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                />
                <Bar 
                    yAxisId="left" 
                    dataKey="total_tvl" 
                    fill={COLORS.chart[0]}
                    name="Total TVL" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={750}
                    animationBegin={0}
                    maxBarSize={45}
                />
                <Bar 
                    yAxisId="right" 
                    dataKey="protocol_count" 
                    fill={COLORS.chart[1]}
                    name="Protocol Count" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={750}
                    animationBegin={250}
                    maxBarSize={45}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const ChainDiversityChart: React.FC<{ data: ChainDiversity[] }> = ({ data }) => {
    if (!data?.length) return null;

    // Take top 15 chains by TVL
    const topChains = data
        .sort((a, b) => b.tvl - a.tvl)
        .slice(0, 15);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={topChains}
                margin={{ top: 20, right: 100, left: 60, bottom: 60 }}
                barGap={8}
            >
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    className="stroke-muted/20"
                    horizontal={true}
                    vertical={false}
                />
                <XAxis 
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={65}
                    tick={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11
                    }}
                    tickMargin={12}
                />
                <YAxis 
                    yAxisId="left"
                    tickFormatter={formatTVL}
                    tick={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11
                    }}
                    width={65}
                    label={{ 
                        value: 'Total Value Locked', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { 
                            fontSize: '12px', 
                            fill: 'hsl(var(--muted-foreground))',
                            textAnchor: 'middle'
                        },
                        offset: -45
                    }}
                />
                <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 11
                    }}
                    width={45}
                    label={{ 
                        value: 'Chain Count', 
                        angle: 90, 
                        position: 'insideRight',
                        style: { 
                            fontSize: '12px', 
                            fill: 'hsl(var(--muted-foreground))',
                            textAnchor: 'middle'
                        },
                        offset: -35
                    }}
                />
                <Tooltip 
                    cursor={{ 
                        fill: 'hsl(var(--muted-foreground))',
                        opacity: 0.1 
                    }}
                    content={({ active, payload, label }) => {
                        if (!active || !payload?.[0]) return null;
                        return (
                            <div className="rounded-lg border bg-background p-3 shadow-sm">
                                <p className="font-medium mb-1">{label}</p>
                                {payload.map((entry: any, index: number) => (
                                    <p key={index} className="text-sm text-muted-foreground">
                                        <span className="inline-block w-24">{entry.name}:</span>
                                        <span className="font-medium">
                                            {entry.name === 'TVL' 
                                                ? formatTVL(entry.value)
                                                : entry.value}
                                        </span>
                                    </p>
                                ))}
                            </div>
                        );
                    }}
                />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                        paddingLeft: '15px',
                        fontSize: '12px',
                        lineHeight: '20px',
                        right: 0
                    }}
                    iconType="circle"
                    iconSize={8}
                />
                <Bar 
                    yAxisId="left"
                    dataKey="tvl"
                    name="TVL"
                    fill={COLORS.chart[0]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                />
                <Bar 
                    yAxisId="right"
                    dataKey="chain_count"
                    name="Chain Count"
                    fill={COLORS.chart[1]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export { TimeSeriesChart } from './TimeSeriesChart';