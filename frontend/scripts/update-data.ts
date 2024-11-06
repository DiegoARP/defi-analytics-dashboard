import * as dotenv from 'dotenv';
import path from 'path';
import { DataProcessor } from '../src/utils/data-processor';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function updateData() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing required environment variables');
        process.exit(1);
    }

    const processor = new DataProcessor();
    
    try {
        console.log('Starting data update...');
        
        // Increased timeout to 30 minutes
        const timeout = setTimeout(() => {
            console.error('Process timed out after 30 minutes');
            process.exit(1);
        }, 1800000);

        await processor.fetchAndProcessData();
        
        clearTimeout(timeout);
        console.log('Data update completed successfully');
    } catch (error) {
        console.error('Error updating data:', error);
        process.exit(1);
    }
}

updateData().catch(console.error);