'use client';

export const LoadingState = () => (
    <div className="min-h-screen bg-background p-6">
        <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-64 bg-muted rounded"></div>
                <div className="h-4 w-96 bg-muted rounded"></div>
            </div>
            
            {/* Stats grid skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 rounded-lg border bg-card">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-muted rounded"></div>
                            <div className="h-6 w-32 bg-muted rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-6 rounded-lg border bg-card">
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted rounded"></div>
                            <div className="h-[200px] bg-muted rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
); 