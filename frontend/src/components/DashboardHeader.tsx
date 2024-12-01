'use client';

import { Share2 } from 'lucide-react';

export const DashboardHeader = () => (
    <div className="relative rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8">
        <div className="relative flex justify-between items-start">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    DeFi Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Real-time insights across protocols and chains
                </p>
            </div>
            <button 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
                <Share2 className="w-4 h-4" />
                Share
            </button>
        </div>
    </div>
); 