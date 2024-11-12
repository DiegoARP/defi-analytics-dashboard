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
  
  export interface DashboardProps {
    categoryData: CategoryData[];
    tvlDistributionData: TvlDistributionData[];
    riskDistributionData: RiskDistributionData[];
    chainDiversityData: ChainDiversityData[];
  }