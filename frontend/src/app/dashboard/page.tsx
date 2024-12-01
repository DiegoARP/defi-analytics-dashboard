// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import DeFiDashboard from '@/components/DeFiDashboard';
import { useDefiData } from '@/hooks/useDefiData';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

function DashboardContent() {
    const { data, loading, error, chartTimeframe, setChartTimeframe, historicalLoading } = useDefiData();

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <DeFiDashboard 
            {...data}
            chartTimeframe={chartTimeframe}
            setChartTimeframe={setChartTimeframe}
            historicalLoading={historicalLoading}
        />
    );
}

export default function DashboardPage() {
    return <DashboardContent />;
}