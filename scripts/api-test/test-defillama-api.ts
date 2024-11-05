import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://api.llama.fi';

interface Protocol {
    id: string;
    name: string;
    address: string | null;
    symbol: string;
    url: string;
    description: string;
    chain: string;
    logo: string | null;
    tvl: number;
    chainTvls: Record<string, number>;
    change_1h: number | null;
    change_1d: number | null;
    change_7d: number | null;
    staking: number | null;
    fdv: number | null;
    mcap: number | null;
}

class DeFiLlamaAPI {
    private async fetchEndpoint(endpoint: string) {
        try {
            const response = await axios.get(`${BASE_URL}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null;
        }
    }

    async testAllEndpoints() {
        console.log('Starting DeFiLlama API tests...\n');

        // Test endpoints and save responses
        const endpoints = {
            protocols: '/protocols',
            chains: '/chains',
            protocol_example: '/protocol/aave-v3',
            tvl_example: '/tvl/aave-v3'
        };

        const results: Record<string, any> = {};

        for (const [key, endpoint] of Object.entries(endpoints)) {
            console.log(`Testing endpoint: ${endpoint}`);
            const data = await this.fetchEndpoint(endpoint);
            results[key] = data;
            
            if (data) {
                console.log(`✅ Success: ${endpoint}`);
                console.log(`Sample data structure:`);
                this.analyzeSampleData(data);
            } else {
                console.log(`❌ Failed: ${endpoint}`);
            }
            console.log('\n---\n');
        }

        // Save results to file
        await this.saveResults(results);
    }

    private analyzeSampleData(data: any) {
        if (Array.isArray(data)) {
            console.log('Array of items. First item structure:');
            console.log(this.getObjectStructure(data[0]));
        } else {
            console.log('Object structure:');
            console.log(this.getObjectStructure(data));
        }
    }

    private getObjectStructure(obj: any, depth: number = 1): string {
        if (depth > 2) return '...'; // Limit depth to prevent too much detail
        
        if (typeof obj !== 'object' || obj === null) {
            return `(${typeof obj})`;
        }

        const indent = '  '.repeat(depth);
        const entries = Object.entries(obj);
        
        return '{\n' + entries.slice(0, 5).map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${indent}${key}: Array(${value.length})`;
            }
            if (typeof value === 'object' && value !== null) {
                return `${indent}${key}: ${this.getObjectStructure(value, depth + 1)}`;
            }
            return `${indent}${key}: (${typeof value})`;
        }).join(',\n') + 
        (entries.length > 5 ? `\n${indent}... (${entries.length - 5} more fields)` : '') +
        `\n${'  '.repeat(depth - 1)}}`;
    }

    private async saveResults(results: Record<string, any>) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputDir = path.join(__dirname, 'output');
            await fs.mkdir(outputDir, { recursive: true });
            
            const filePath = path.join(outputDir, `api-test-results-${timestamp}.json`);
            await fs.writeFile(
                filePath,
                JSON.stringify(results, null, 2)
            );
            
            console.log(`Results saved to: ${filePath}`);
        } catch (error) {
            console.error('Error saving results:', error);
        }
    }

    // Specific endpoint tests
    async testProtocolDetails(protocolName: string) {
        console.log(`\nTesting specific protocol: ${protocolName}`);
        const data = await this.fetchEndpoint(`/protocol/${protocolName}`);
        console.log('Protocol details structure:');
        this.analyzeSampleData(data);
        return data;
    }

    async testTVLHistory(protocolName: string) {
        console.log(`\nTesting TVL history: ${protocolName}`);
        const data = await this.fetchEndpoint(`/tvl/${protocolName}`);
        console.log('TVL history structure:');
        this.analyzeSampleData(data);
        return data;
    }
}

async function main() {
    const api = new DeFiLlamaAPI();
    
    // Test all main endpoints
    await api.testAllEndpoints();
    
    // Test specific protocol
    await api.testProtocolDetails('aave-v3');
    
    // Test TVL history
    await api.testTVLHistory('aave-v3');
}

main().catch(console.error);