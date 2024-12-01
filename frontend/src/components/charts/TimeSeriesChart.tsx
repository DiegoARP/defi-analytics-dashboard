'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { TimeSeriesData } from '@/types/charts';
import { formatTVL } from '@/lib/utils/format';
import { COLORS } from './DeFiCharts';

export const TimeSeriesChart: React.FC<{ 
    data: TimeSeriesData[];
    timeframe: '24h' | '7d' | '30d';
    onTimeframeChange: (timeframe: '24h' | '7d' | '30d') => void;
    isLoading?: boolean;
}> = ({ data, timeframe, onTimeframeChange, isLoading }) => {
    const showLoading = isLoading && (!data || data.length === 0);

    if (!data?.length) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                No historical data available
            </div>
        );
    }

    return (
        <div className="h-full relative">
            {showLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
            
            <div className="absolute top-0 right-0 z-10">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    {['24h', '7d', '30d'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => onTimeframeChange(tf as any)}
                            className={`
                                px-3 py-1 text-xs font-medium
                                ${tf === timeframe 
                                    ? 'bg-primary text-primary-foreground z-10' 
                                    : 'bg-background hover:bg-muted'
                                }
                                ${tf === '24h' ? 'rounded-l-md' : '-ml-px'}
                                ${tf === '30d' ? 'rounded-r-md' : ''}
                                border border-input
                                focus:z-10 focus:ring-2 focus:ring-primary
                                transition-colors
                            `}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-10 h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 100, left: 60, bottom: 30 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            className="stroke-muted/20"
                            horizontal={true}
                            vertical={true}
                        />
                        <XAxis 
                            dataKey="date"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            tickLine={true}
                            axisLine={true}
                            height={50}
                        />
                        <YAxis 
                            yAxisId="left"
                            tickFormatter={formatTVL}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            axisLine={true}
                            tickLine={true}
                            label={{ 
                                value: 'Total Value Locked', 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' },
                                offset: -45
                            }}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            axisLine={true}
                            tickLine={true}
                            label={{ 
                                value: 'Protocol Count', 
                                angle: 90, 
                                position: 'insideRight',
                                style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' },
                                offset: -35
                            }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload) return null;
                                return (
                                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                                        <p className="font-medium mb-2">{label}</p>
                                        {payload.map((entry: any, index: number) => (
                                            <p key={index} className="text-sm text-muted-foreground">
                                                <span className="inline-block w-32">{entry.name}:</span>
                                                <span className="font-medium">
                                                    {entry.name === 'Total TVL' 
                                                        ? formatTVL(entry.value)
                                                        : entry.value.toLocaleString()}
                                                </span>
                                            </p>
                                        ))}
                                    </div>
                                );
                            }}
                        />
                        <Legend 
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{
                                paddingBottom: '20px'
                            }}
                        />
                        <Line 
                            yAxisId="left" 
                            type="monotone" 
                            dataKey="total_tvl" 
                            name="Total TVL" 
                            stroke={COLORS.chart[0]} 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 2 }}
                        />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="protocol_count" 
                            name="Protocol Count" 
                            stroke={COLORS.chart[1]} 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 