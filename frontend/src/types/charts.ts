export interface CategoryDistribution {
    category: string;
    protocol_count: number;
    total_tvl: number;
    avg_tvl: number;
}

export interface TVLDistribution {
    tvl_range: string;
    protocol_count: number;
    total_tvl: number;
}

export interface RiskDistribution {
    risk_level: string;
    protocol_count: number;
    total_tvl: number;
    avg_tvl: number;
}

export interface ChainDiversity {
    name: string;
    tvl: number;
    chain_count: number;
    risk_level: string;
}

export interface TimeSeriesData {
    date: string;
    total_tvl: number;
    protocol_count: number;
    active_chains: number;
}

export interface EnhancedMetrics {
    avgTVL: number;
    growthRate: number;
    mostActiveChain: string;
    riskAdjustedTVL: number;
}

export interface ProtocolComparison {
    name: string;
    tvl: number;
    volume24h: number;
    riskScore: number;
    apy: number;
    change7d: number;
}

export interface ComparisonData {
    protocol1: ProtocolComparison;
    protocol2: ProtocolComparison;
}