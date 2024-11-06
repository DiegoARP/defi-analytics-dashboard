import DataProcessor from '../src/utils/data-processor';
import dotenv from 'dotenv';

dotenv.config();

async function updateData() {
    const processor = new DataProcessor();
    
    try {
        console.log('Starting data update...');
        await processor.fetchAndProcessData();  // Changed this line
        console.log('Data update completed successfully');
    } catch (error) {
        console.error('Error updating data:', error);
        process.exit(1);
    }
}

updateData();