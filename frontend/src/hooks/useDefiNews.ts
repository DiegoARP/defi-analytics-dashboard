import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  url: string;
  timestamp: string;
  source: string;
}

export function useDefiNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        // Using CoinGecko's status updates API instead
        const response = await fetch(
          'https://api.coingecko.com/api/v3/status_updates?category=general&per_page=10'
        );
        const data = await response.json();
        
        const formattedNews = data.status_updates.map((item: any) => ({
          title: item.description,
          url: item.project.link,
          timestamp: new Date(item.created_at).toLocaleString(),
          source: item.project.name
        })).filter((item: NewsItem) => 
          item.title.toLowerCase().includes('defi') ||
          item.title.toLowerCase().includes('protocol') ||
          item.title.toLowerCase().includes('dao') ||
          item.title.toLowerCase().includes('yield')
        );
        
        setNews(formattedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback data in case API fails
        setNews([
          {
            title: "Aave Launches GHO Stablecoin",
            url: "https://aave.com",
            timestamp: new Date().toLocaleString(),
            source: "Aave"
          },
          {
            title: "Uniswap Deploys on Base Network",
            url: "https://uniswap.org",
            timestamp: new Date().toLocaleString(),
            source: "Uniswap"
          },
          {
            title: "Compound Updates Interest Rate Model",
            url: "https://compound.finance",
            timestamp: new Date().toLocaleString(),
            source: "Compound"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
    // Refresh every 15 minutes (CoinGecko has rate limits)
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { news, loading };
} 