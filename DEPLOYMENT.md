# Deployment Guide

1. Frontend Deployment (Vercel):
- Connect your GitHub repository to Vercel
- Add environment variables in Vercel dashboard
- Deploy automatically with git push

2. Database (Supabase):
- Use existing Supabase setup
- Create tables for caching DeFi data
- Set up row level security

3. Data Updates:
Create a new file: /pages/api/cron/update-data.ts for periodic updates:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch new data from DeFiLlama
    const data = await fetchDefiData();
    
    // Update Supabase
    await supabase.from('defi_data').upsert(data);
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
}
```

4. Set up Vercel Cron Job:
```bash
# vercel.json
{
  "crons": [{
    "path": "/api/cron/update-data",
    "schedule": "*/10 * * * *"
  }]
} 