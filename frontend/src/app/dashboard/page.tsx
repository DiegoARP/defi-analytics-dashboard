// src/app/dashboard/page.tsx
'use client';

import React, { Suspense } from 'react';
import DeFiDashboard from '@/components/DeFiDashboard';
import { useDefiData } from '@/hooks/useDefiData';

function DashboardContent() {
  console.log('Dashboard Content Rendering');
  const timestamp = Date.now(); // Force re-render
  const { data, loading, error } = useDefiData();

  console.log('Dashboard State:', { loading, error, hasData: !!data });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading dashboard data...</p>
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-gray-600">
          No data available
        </div>
      </div>
    );
  }

  return <div key={timestamp}><DeFiDashboard {...data} /></div>;
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