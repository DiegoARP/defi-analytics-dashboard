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
} from 'recharts';
import { ComparisonData } from '@/types/charts';
import { formatTVL } from '@/lib/utils/format';
import { COLORS } from './DeFiCharts';

export const ProtocolComparisonChart: React.FC<{ data: ComparisonData }> = ({ data }) => {
    const formatTVLNoDecimals = (value: number) => {
        if (value >= 1e9) return `$${Math.floor(value / 1e9)}B`;
        if (value >= 1e6) return `$${Math.floor(value / 1e6)}M`;
        if (value >= 1e3) return `$${Math.floor(value / 1e3)}K`;
        return `$${Math.floor(value)}`;
    };

    const barChartData = [
        {
            metric: 'TVL',
            [data.protocol1.name]: Number(data.protocol1.tvl) || 0.001,
            [data.protocol2.name]: Number(data.protocol2.tvl) || 0.001,
            [`${data.protocol1.name}_raw`]: Number(data.protocol1.tvl),
            [`${data.protocol2.name}_raw`]: Number(data.protocol2.tvl)
        },
        {
            metric: '24h Volume',
            [data.protocol1.name]: Number(data.protocol1.volume24h) || 0.001,
            [data.protocol2.name]: Number(data.protocol2.volume24h) || 0.001,
            [`${data.protocol1.name}_raw`]: Number(data.protocol1.volume24h),
            [`${data.protocol2.name}_raw`]: Number(data.protocol2.volume24h)
        }
    ];

    return (
        <div className="space-y-6">
            {/* Value Metrics (Bar Chart) */}
            <div className="h-[180px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={barChartData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 80, bottom: 5 }}
                        barSize={24}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis 
                            type="number" 
                            tickFormatter={formatTVLNoDecimals}
                            scale="log"
                            domain={['auto', 'auto']}
                        />
                        <YAxis 
                            dataKey="metric" 
                            type="category" 
                            width={60}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload) return null;
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <p className="font-medium mb-1">{label}</p>
                                        {payload.map((entry: any) => (
                                            <p key={entry.name} className="text-sm text-muted-foreground">
                                                <span className="inline-block w-32">{entry.name}:</span>
                                                <span className="font-medium">
                                                    {formatTVLNoDecimals(entry.payload[`${entry.name}_raw`] || 0)}
                                                </span>
                                            </p>
                                        ))}
                                    </div>
                                );
                            }} 
                        />
                        <Legend />
                        <Bar 
                            dataKey={data.protocol1.name} 
                            fill={COLORS.chart[0]}
                            minPointSize={5}
                            radius={[0, 4, 4, 0]}
                        />
                        <Bar 
                            dataKey={data.protocol2.name} 
                            fill={COLORS.chart[1]}
                            minPointSize={5}
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Percentage Metrics */}
            <div className="space-y-4">
                {[
                    { label: 'Risk Score', key: 'riskScore' },
                    { label: 'APY', key: 'apy' },
                    { label: '7d Change', key: 'change7d' }
                ].map(({ label, key }) => (
                    <div key={key} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{label}</span>
                            <div className="space-x-4">
                                <span>
                                    <span className="text-muted-foreground">{data.protocol1.name}:</span>
                                    <span className="font-medium ml-1">
                                        {Math.round(Number(data.protocol1[key as keyof typeof data.protocol1]))}%
                                    </span>
                                </span>
                                <span>
                                    <span className="text-muted-foreground">{data.protocol2.name}:</span>
                                    <span className="font-medium ml-1">
                                        {Math.round(Number(data.protocol2[key as keyof typeof data.protocol2]))}%
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="absolute h-full bg-primary/40 rounded-full transition-all"
                                style={{ 
                                    width: `${Math.max(Number(data.protocol1[key as keyof typeof data.protocol1]), 0)}%`,
                                    left: 0
                                }}
                            />
                            <div 
                                className="absolute h-full bg-primary rounded-full transition-all"
                                style={{ 
                                    width: `${Math.max(Number(data.protocol2[key as keyof typeof data.protocol2]), 0)}%`,
                                    left: 0
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 