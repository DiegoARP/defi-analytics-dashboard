# DeFi Analytics Dashboard 🚀

A real-time analytics platform for monitoring and analyzing the DeFi ecosystem, providing comprehensive insights into protocols, chains, and market trends.

## Overview

This platform aggregates and analyzes data from multiple DeFi protocols across various blockchain networks, offering:

- Real-time TVL (Total Value Locked) tracking
- Protocol health monitoring
- Cross-chain analytics
- Risk assessment metrics
- Historical trend analysis

## Technical Architecture

### Data Collection Layer
- **Source**: DeFiLlama API
- **Frequency**: Real-time data collection
- **Processing**: Batch processing of 100 protocols simultaneously
- **Storage**: Supabase (PostgreSQL)

### Database Schema
```sql
protocols           - Core protocol information and metrics
protocol_tvl_history - Historical TVL tracking
chain_metrics       - Chain-specific analytics
protocol_summary    - Aggregated protocol insights (View)
```

### Tech Stack
```
Frontend:
- Next.js 14
- TypeScript
- TailwindCSS
- Chart libraries (coming soon)

Backend:
- Supabase
- Node.js
- TypeScript

Data Processing:
- Custom ETL pipeline
- Batch processing
- Real-time updates
```

## Current Features

### Protocol Analytics
- TVL tracking and history
- Risk assessment metrics
- Chain diversity analysis
- Health scoring system

### Chain Analytics
- TVL by chain
- Protocol distribution
- Chain dominance metrics
- Cross-chain relationships

### Risk Metrics
- TVL-based risk scoring
- Chain diversification analysis
- Stability assessment
- Historical volatility tracking

## Development Progress

### ✅ Completed
- Database schema design and implementation
- Data collection pipeline
- Protocol processing system
- Chain metrics calculation
- Basic risk analytics

### 🚧 In Progress
- Dashboard UI development
- Advanced analytics implementation
- Visualization components
- Real-time updates

### 📅 Planned
- Interactive analytics dashboard
- Custom metric calculations
- Historical trend analysis
- Advanced risk modeling

## Getting Started

### Prerequisites
```bash
- Node.js 16+
- npm/yarn
- Supabase account
```

### Installation
```bash
# Clone repository
git clone https://github.com/DiegoARP/defi-analytics-dashboard.git

# Install dependencies
cd defi-analytics-dashboard/frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials
```

### Running Data Collection
```bash
npm run update-data
```

### Development
```bash
npm run dev
```

## Data Update Process
1. Fetches protocol data from DeFiLlama
2. Processes in batches of 100 protocols
3. Calculates risk metrics and health scores
4. Updates chain analytics
5. Maintains historical records

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Next Steps in Development

1. **Data Validation**
   - Verify data integrity
   - Check calculation accuracy
   - Validate relationships

2. **Dashboard Planning**
   - Define key metrics
   - Design user interface
   - Plan interactive features

3. **Frontend Development**
   - Implement UI components
   - Create visualizations
   - Add interactivity

## Contact

[Your Name] - [Your Email]

Project Link: [https://github.com/DiegoARP/defi-analytics-dashboard](https://github.com/yourusername/defi-analytics-dashboard)