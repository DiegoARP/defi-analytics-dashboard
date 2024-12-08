# DeFi Analytics Dashboard 🚀

A real-time analytics platform for monitoring and analyzing the decentralized finance ecosystem, powered by DeFiLlama data.

![DeFi Analytics Dashboard](./public/dashboard-preview.png)

## Features

### Real-time Analytics
- 📊 Live TVL tracking across protocols
- 📈 Historical trends visualization
- 🔄 Protocol comparison tool
- 🌐 Cross-chain analytics

### Risk Analysis
- 🛡️ Protocol safety scoring
- 📊 Risk distribution metrics
- 🔍 TVL concentration analysis
- 🔗 Chain diversity tracking

### Market Intelligence
- 📰 DeFi news feed
- 📉 Historical performance
- 🎯 Category insights
- 💹 Growth indicators

## Dashboard Features

### Data Display
- Protocol Volume Leaders (24h trading volume)
- Yield Overview (Top protocols by APY)
- Protocol Comparison Tool
- Chain Diversity Metrics
- TVL Distribution
- Risk Analysis

### Data Sources
- Protocol data from DeFiLlama API
- Volume data updated from DeFiLlama DEX endpoint
- Data refresh via `npm run update-data`

### Database Tables
- `protocols`: Main protocol information
- `protocol_volumes`: 24h trading volumes
- `chain_metrics`: Chain-specific metrics
- `protocol_tvl_history`: Historical TVL data

### Updating Data
To refresh dashboard data:

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Charts**: Recharts
- **State**: React Hooks

### Backend
- **Database**: Supabase
- **API**: DeFiLlama Integration
- **Caching**: Built-in Supabase

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env.local
# Add your Supabase credentials
```

3. Run development server:
```bash
npm run dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

---
Built with ❤️ for the DeFi community