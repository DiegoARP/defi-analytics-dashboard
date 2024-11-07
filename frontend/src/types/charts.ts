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