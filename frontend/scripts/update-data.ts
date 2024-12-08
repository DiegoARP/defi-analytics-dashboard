import { DataProcessor } from '../src/utils/data-processor';

async function main() {
    console.log('Starting data update...');
    const processor = new DataProcessor();
    
    try {
        await processor.fetchAndProcessData();
        console.log('Data update completed successfully');
    } catch (error) {
        console.error('Error updating data:', error);
        process.exit(1);
    }
}

main().catch(console.error);