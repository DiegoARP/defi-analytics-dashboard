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
    const valueMetrics = [
        { key: 'tvl', label: 'TVL', format: (v: number) => formatTVL(Math.round(v)) },
        { key: 'volume24h', label: '24h Volume', format: (v: number) => formatTVL(Math.round(v)) },
    ];

    const percentageMetrics = [
        { key: 'riskScore', label: 'Risk Score', format: (v: number) => `${Math.round(v)}%` },
        { key: 'apy', label: 'APY', format: (v: number) => `${Math.round(v)}%` },
        { key: 'change7d', label: '7d Change', format: (v: number) => `${Math.round(v)}%` }
    ];

    const barChartData = valueMetrics.map(({ key, label }) => {
        const value1 = Number(data.protocol1[key as keyof typeof data.protocol1]);
        const value2 = Number(data.protocol2[key as keyof typeof data.protocol2]);
        
        // Ensure we have non-zero values for visibility
        return {
            metric: label,
            [data.protocol1.name]: value1 || 0.001,  // Use small value instead of 0 for visibility
            [data.protocol2.name]: value2 || 0.001,
            // Add raw values for tooltip
            [`${data.protocol1.name}_raw`]: value1,
            [`${data.protocol2.name}_raw`]: value2
        };
    });

    const percentageData = percentageMetrics.map(({ key, label, format }) => ({
        metric: label,
        protocol1: {
            name: data.protocol1.name,
            value: Number(data.protocol1[key as keyof typeof data.protocol1]),
            formattedValue: format(Number(data.protocol1[key as keyof typeof data.protocol1]))
        },
        protocol2: {
            name: data.protocol2.name,
            value: Number(data.protocol2[key as keyof typeof data.protocol2]),
            formattedValue: format(Number(data.protocol2[key as keyof typeof data.protocol2]))
        }
    }));

    return (
        <div className="h-full flex flex-col">
            {/* Value Metrics (Bar Chart) */}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={barChartData}
                        layout="vertical"
                        margin={{ top: 20, right: 60, left: 100, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis 
                            type="number" 
                            tickFormatter={formatTVL}
                            scale="log"  // Use logarithmic scale for better visualization
                            domain={['auto', 'auto']}
                        />
                        <YAxis 
                            dataKey="metric" 
                            type="category" 
                            width={100}
                        />
                        <Tooltip content={({ active, payload, label }) => {
                            if (!active || !payload) return null;
                            return (
                                <div className="rounded-lg border bg-background p-3 shadow-sm">
                                    <p className="font-medium mb-2">{label}</p>
                                    {payload.map((entry: any) => {
                                        const rawValue = Number(barChartData[0][`${entry.name}_raw`]);
                                        return (
                                            <p key={entry.name} className="text-sm text-muted-foreground">
                                                <span className="inline-block w-32">{entry.name}:</span>
                                                <span className="font-medium">{formatTVL(Math.round(rawValue))}</span>
                                            </p>
                                        );
                                    })}
                                </div>
                            );
                        }} />
                        <Legend />
                        <Bar 
                            dataKey={data.protocol1.name} 
                            fill={COLORS.chart[0]}
                            minPointSize={5}  // Ensure minimum visibility
                        />
                        <Bar 
                            dataKey={data.protocol2.name} 
                            fill={COLORS.chart[1]}
                            minPointSize={5}  // Ensure minimum visibility
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Percentage Metrics (Custom Visualization) */}
            <div className="flex-1 mt-4">
                {percentageData.map(({ metric, protocol1, protocol2 }) => (
                    <div key={metric} className="mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{metric}</span>
                            <div className="flex gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {protocol1.name}: <span className="font-medium">{protocol1.formattedValue}</span>
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {protocol2.name}: <span className="font-medium">{protocol2.formattedValue}</span>
                                </span>
                            </div>
                        </div>
                        <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden">
                            <div 
                                className="absolute top-0 left-0 h-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.max(protocol1.value, 0)}%`,
                                    backgroundColor: COLORS.chart[0],
                                    opacity: protocol1.value < 0 ? 0.5 : 1
                                }}
                            />
                            <div 
                                className="absolute top-0 left-0 h-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.max(protocol2.value, 0)}%`,
                                    backgroundColor: COLORS.chart[1],
                                    opacity: protocol2.value < 0 ? 0.5 : 1
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 