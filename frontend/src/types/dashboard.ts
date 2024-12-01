import { ProtocolComparison } from './charts';

export interface CategoryData {
    category: string;
    protocol_count: number;
    total_tvl: number;
    avg_tvl: number;
  }
  
  export interface TvlDistributionData {
    tvl_range: string;
    protocol_count: number;
    total_tvl: number;
  }
  
  export interface RiskDistributionData {
    risk_level: string;
    protocol_count: number;
    total_tvl: number;
    avg_tvl: number;
  }
  
  export interface ChainDiversityData {
    name: string;
    tvl: number;
    chain_count: number;
    risk_level: string;
  }
  
  export interface DeFiDashboardProps {
    categoryData: CategoryData[];
    tvlDistributionData: TvlDistributionData[];
    riskDistributionData: RiskDistributionData[];
    chainDiversityData: ChainDiversityData[];
    timeSeriesData: {
        date: string;
        total_tvl: number;
        protocol_count: number;
        active_chains: number;
    }[];
    enhancedMetrics: {
        avgTVL: number;
        growthRate: number;
        mostActiveChain: string;
        riskAdjustedTVL: number;
    } | null;
    protocols: ProtocolComparison[];
    chartTimeframe: '24h' | '7d' | '30d';
    setChartTimeframe: (timeframe: '24h' | '7d' | '30d') => void;
  }