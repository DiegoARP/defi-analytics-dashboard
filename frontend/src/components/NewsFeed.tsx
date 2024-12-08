'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDefiNews } from '@/hooks/useDefiNews';

export function NewsFeed() {
  const { news, loading } = useDefiNews();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>DeFi News</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Live</span>
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {loading ? (
            <p>Loading news...</p>
          ) : (
            news.map((item, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  <h3 className="font-medium">{item.title}</h3>
                </a>
                <div className="text-sm text-gray-500 mt-1">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 