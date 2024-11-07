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
import { Card } from '@/components/ui/card';
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

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
    <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="h-[400px] w-full">
            {children}
        </div>
    </Card>
);

export const CategoryTVLChart: React.FC<{ data: CategoryDistribution[] }> = ({ data }) => (
    <ChartCard title="Category Distribution by TVL">
        <ResponsiveContainer>
            <BarChart
                data={data.slice(0, 10)} // Top 10 categories
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" />
                <YAxis tickFormatter={formatTVL} />
                <Tooltip formatter={(value: number) => formatTVL(value)} />
                <Legend />
                <Bar dataKey="total_tvl" fill="#8884d8" name="Total TVL" />
                <Bar dataKey="protocol_count" fill="#82ca9d" name="Protocol Count" />
            </BarChart>
        </ResponsiveContainer>
    </ChartCard>
);

export const TVLDistributionChart: React.FC<{ data: TVLDistribution[] }> = ({ data }) => (
    <ChartCard title="TVL Concentration">
        <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="total_tvl"
                    nameKey="tvl_range"
                    cx="50%"
                    cy="50%"
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index
                    }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                                x={x}
                                y={y}
                                fill="#8884d8"
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                            >
                                {`${data[index].tvl_range} (${formatTVL(value)})`}
                            </text>
                        );
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTVL(value)} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </ChartCard>
);

// Rest of the components remain the same...
export const RiskDistributionChart: React.FC<{ data: RiskDistribution[] }> = ({ data }) => (
    <ChartCard title="Risk Distribution">
        <ResponsiveContainer>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk_level" />
                <YAxis yAxisId="left" tickFormatter={formatTVL} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: number, name: string) => [
                    name.includes('tvl') ? formatTVL(value) : value,
                    name
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="total_tvl" fill="#8884d8" name="Total TVL" />
                <Bar yAxisId="right" dataKey="protocol_count" fill="#82ca9d" name="Protocol Count" />
            </BarChart>
        </ResponsiveContainer>
    </ChartCard>
);

export const ChainDiversityChart: React.FC<{ data: ChainDiversity[] }> = ({ data }) => (
    <ChartCard title="Chain Diversity vs TVL">
        <ResponsiveContainer>
            <BarChart
                data={data.slice(0, 15)}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" />
                <YAxis yAxisId="left" tickFormatter={formatTVL} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: number, name: string) => [
                    name === 'tvl' ? formatTVL(value) : value,
                    name
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="tvl" fill="#8884d8" name="TVL" />
                <Bar yAxisId="right" dataKey="chain_count" fill="#82ca9d" name="Chain Count" />
            </BarChart>
        </ResponsiveContainer>
    </ChartCard>
);