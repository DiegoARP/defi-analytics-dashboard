'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ error, retry }: { error: Error; retry?: () => void }) => (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground max-w-md">{error.message}</p>
            {retry && (
                <button
                    onClick={retry}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    </div>
); 