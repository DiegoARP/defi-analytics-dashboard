export interface Protocol {
    id: string;
    name: string;
    description?: string;
    symbol?: string;
    url?: string;
    tvl: number;
    mcap?: number;
    category?: string;
    chain_data: {
        chains: string[];
        chainTvls: Record<string, number>;
        totalChains: number;
    };
    health_metrics: {
        risk_level: string;
        risk_factors: {
            tvlRisk: string;
            chainDiversification: string;
            stabilityScore: {
                short_term: string;
                medium_term: string;
                long_term: string;
            };
        };
        tvl_changes: {
            hour: number;
            day: number;
            week: number;
        };
        last_calculated: string;
    };
    last_updated: string;
}

export interface ChainMetrics {
    chain_name: string;
    tvl: number;
    protocol_count: number;
    metrics: {
        dominance?: number;     // % of total TVL
        growth_rate?: number;   // Growth rate
        stability?: string;     // Stability indicator
    };
    change_1d?: number;
    change_7d?: number;
    last_updated: string;
}

export interface ProtocolTVLHistory {
    id: number;
    protocol_id: string;
    tvl: number;
    timestamp: string;
}