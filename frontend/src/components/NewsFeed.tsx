'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Newspaper, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';

interface NewsItem {
    title: string;
    source: string;
    timestamp: string;
    url: string;
    impact: 'positive' | 'negative' | 'neutral';
}

export const NewsFeed = () => {
    const [news, setNews] = useState<NewsItem[]>([
        {
            title: "Uniswap V4 Announcement: Major Protocol Upgrade Coming",
            source: "DeFi News",
            timestamp: "2h ago",
            url: "#",
            impact: 'positive'
        },
        {
            title: "New Security Measures Implemented Across Major DeFi Protocols",
            source: "CryptoWatch",
            timestamp: "4h ago",
            url: "#",
            impact: 'positive'
        },
        {
            title: "Market Alert: Significant TVL Movement in Lending Protocols",
            source: "DeFi Pulse",
            timestamp: "6h ago",
            url: "#",
            impact: 'neutral'
        }
    ]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">DeFi News Feed</CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground">Live updates</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {news.map((item, index) => (
                    <a 
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                    {item.impact === 'positive' && <ArrowUp className="w-4 h-4 text-emerald-500" />}
                                    {item.impact === 'negative' && <ArrowDown className="w-4 h-4 text-red-500" />}
                                    <p className="font-medium line-clamp-2">{item.title}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{item.source}</span>
                                    <span>•</span>
                                    <span>{item.timestamp}</span>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                        </div>
                    </a>
                ))}
            </CardContent>
        </Card>
    );
}; 