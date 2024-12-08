// Risk-related types
export interface RiskFactors {
    tvlRisk: 'low' | 'medium' | 'high';
    chainDiversification: 'low' | 'medium' | 'high';
    stabilityScore: {
        short_term: 'stable' | 'volatile';
        medium_term: 'stable' | 'volatile';
        long_term: 'stable' | 'volatile';
    };
}

export interface RiskPoints {
    low: number;
    medium: number;
    high: number;
}

// Protocol-related types
export interface Protocol {
    id: string;
    name: string;
    description?: string;
    symbol?: string;
    url?: string;
    tvl: number;
    mcap?: number;
    category?: string;
    chainTvls: Record<string, number>;
    change_1h?: number;
    change_1d?: number;
    change_7d?: number;
    chains: string[];
    volume24h?: number;
}

export interface HealthMetrics {
    risk_level: string;
    risk_factors: RiskFactors;
    tvl_changes: {
        hour: number;
        day: number;
        week: number;
    };
    last_calculated: string;
}

// Chain-related types
export interface ChainMetrics {
    chain_name: string;
    tvl: number;
    protocol_count: number;
    metrics: {
        dominance?: number;
        protocol_distribution?: number;
    };
    last_updated: string;
}