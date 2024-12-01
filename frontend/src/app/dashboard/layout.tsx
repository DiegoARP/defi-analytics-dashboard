import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: 'DeFi Analytics Dashboard',
    description: 'Real-time insights and analytics across DeFi protocols and chains',
    openGraph: {
        title: 'DeFi Analytics Dashboard',
        description: 'Real-time insights and analytics across DeFi protocols and chains',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DeFi Analytics Dashboard',
        description: 'Real-time insights and analytics across DeFi protocols and chains',
    }
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}