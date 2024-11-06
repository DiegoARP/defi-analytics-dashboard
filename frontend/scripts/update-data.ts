import * as dotenv from 'dotenv';
import path from 'path';
import { DataProcessor } from '../src/utils/data-processor';  // Changed import syntax

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function updateData() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing required environment variables');
        process.exit(1);
    }

    const processor = new DataProcessor();
    
    try {
        console.log('Starting data update...');
        
        // Add timeout to entire process
        const timeout = setTimeout(() => {
            console.error('Process timed out after 5 minutes');
            process.exit(1);
        }, 300000); // 5 minutes timeout

        await processor.fetchAndProcessData();
        
        clearTimeout(timeout);
        console.log('Data update completed successfully');
    } catch (error) {
        console.error('Error updating data:', error);
        process.exit(1);
    }
}

updateData().catch(console.error);