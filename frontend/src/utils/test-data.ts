// src/utils/test-data.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fetch from 'cross-fetch';
global.fetch = fetch;

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
    global: {
        fetch: fetch
    }
});

async function testConnection() {
    try {
        console.log('Testing Supabase connection...');
        console.log('Using URL:', supabaseUrl);
        
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

        console.log('All tests completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Connection test failed:', error);
        process.exit(1);
    }
}

testConnection().catch(console.error);