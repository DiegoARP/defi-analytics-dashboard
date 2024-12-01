'use client';

import { useEffect, useState } from 'react';
import { Info, TrendingUp, Shield, Boxes } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const InfoPanel = () => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        // Only set time on client side
        setTime(new Date().toLocaleTimeString());
        
        // Optional: Update time every minute
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-none">
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        About DeFi Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Track and analyze the decentralized finance ecosystem in real-time. 
                        Our dashboard provides comprehensive insights across protocols and chains.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <h4 className="text-sm font-medium">Real-time Metrics</h4>
                            <p className="text-xs text-muted-foreground">Track TVL, protocol growth, and market trends as they happen</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <h4 className="text-sm font-medium">Risk Analysis</h4>
                            <p className="text-xs text-muted-foreground">Understand protocol safety scores and risk distribution</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Boxes className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <h4 className="text-sm font-medium">Cross-chain Insights</h4>
                            <p className="text-xs text-muted-foreground">Compare metrics across different blockchain networks</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                        Data updated every 5 minutes. Last update: {time}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}; 