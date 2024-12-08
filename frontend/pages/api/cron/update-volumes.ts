import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Fetch volumes from DeFiLlama
        const response = await fetch('https://api.llama.fi/overview/dexs');
        const data = await response.json();
        
        // Prepare volume data for upsert
        const volumes = data.protocols.map((p: any) => ({
            protocol_name: p.name,
            volume_24h: p.volume24h || 0,
            updated_at: new Date().toISOString()
        }));

        // Update Supabase
        const { error } = await supabase
            .from('protocol_volumes')
            .upsert(volumes, {
                onConflict: 'protocol_name',
                ignoreDuplicates: false
            });

        if (error) throw error;
        
        res.status(200).json({ success: true, count: volumes.length });
    } catch (error) {
        console.error('Failed to update volumes:', error);
        res.status(500).json({ error: 'Failed to update volumes' });
    }
} 