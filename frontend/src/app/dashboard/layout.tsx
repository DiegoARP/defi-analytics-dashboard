'use client';

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
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
    return children;
}