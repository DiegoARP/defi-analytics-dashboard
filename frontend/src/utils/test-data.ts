// src/utils/test-data.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('Testing Supabase connection...');
        
        // Test protocols table
        const { data: protocols, error: protocolError } = await supabase
            .from('protocols')
            .select('id, name, tvl')
            .limit(1);

        if (protocolError) {
            throw new Error(`Protocol query failed: ${protocolError.message}`);
        }

        console.log('Protocols test:', {
            success: true,
            hasData: protocols && protocols.length > 0,
            sample: protocols?.[0]
        });

        // Test chain_metrics table
        const { data: chains, error: chainError } = await supabase
            .from('chain_metrics')
            .select('chain_name, tvl')
            .limit(1);

        if (chainError) {
            throw new Error(`Chain metrics query failed: ${chainError.message}`);
        }

        console.log('Chain metrics test:', {
            success: true,
            hasData: chains && chains.length > 0,
            sample: chains?.[0]
        });

        console.log('All tests completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Run tests
testConnection().catch(console.error);