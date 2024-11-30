// src/app/dashboard/page.tsx
'use client';

import React, { Suspense } from 'react';
import DeFiDashboard from '@/components/DeFiDashboard';
import { useDefiData } from '@/hooks/useDefiData';

function DashboardContent() {
  const { data, loading, error } = useDefiData();

  console.log('Dashboard State:', { 
    loading, 
    error, 
    hasData: !!data,
    categoryDataLength: data?.categoryData?.length,
    tvlDistDataLength: data?.tvlDistributionData?.length
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading dashboard data...</p>
          <p className="text-sm text-gray-500">Fetching protocol data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-4 rounded-lg max-w-lg">
          <h2 className="text-red-700 text-lg font-bold">Error Loading Data</h2>
          <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  return <DeFiDashboard {...data} />;
}

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}