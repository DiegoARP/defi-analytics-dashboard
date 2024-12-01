'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProtocolComparisonChart } from './charts/ProtocolComparisonChart';
import { ProtocolComparison } from '@/types/charts';

interface ProtocolComparisonProps {
    protocols: ProtocolComparison[];
}

export const ProtocolComparisonCard: React.FC<ProtocolComparisonProps> = ({ protocols }) => {
    const [protocol1, setProtocol1] = useState<string>('');
    const [protocol2, setProtocol2] = useState<string>('');

    // Set initial protocols if not set
    React.useEffect(() => {
        if (!protocol1 && !protocol2 && protocols?.length >= 2) {
            setProtocol1(protocols[0].name);
            setProtocol2(protocols[1].name);
        }
    }, [protocols, protocol1, protocol2]);

    // Loading/empty state
    if (!protocols?.length || protocols.length < 2) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Protocol Comparison</CardTitle>
                    <CardDescription>Loading protocol data...</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-muted-foreground">No protocols available for comparison</div>
                </CardContent>
            </Card>
        );
    }

    const comparisonData = {
        protocol1: protocols.find(p => p.name === protocol1) || protocols[0],
        protocol2: protocols.find(p => p.name === protocol2) || protocols[1]
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Protocol Comparison</CardTitle>
                <CardDescription>Compare key metrics between protocols</CardDescription>
                <div className="flex space-x-4 mt-4">
                    <Select value={protocol1} onValueChange={setProtocol1}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg min-w-[200px]">
                            {protocols.map(p => (
                                <SelectItem 
                                    key={p.name} 
                                    value={p.name}
                                    className="hover:bg-muted focus:bg-muted"
                                >
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={protocol2} onValueChange={setProtocol2}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg min-w-[200px]">
                            {protocols.map(p => (
                                <SelectItem 
                                    key={p.name} 
                                    value={p.name}
                                    className="hover:bg-muted focus:bg-muted"
                                >
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ProtocolComparisonChart data={comparisonData} />
            </CardContent>
        </Card>
    );
}; 