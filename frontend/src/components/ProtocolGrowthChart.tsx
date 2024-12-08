import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProtocolGrowthData {
  date: string;
  growthRate: number;
}

export function ProtocolGrowthChart({ data }: { data: ProtocolGrowthData[] }) {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Protocol Growth Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="growthRate" 
                stroke="#8884d8" 
                name="7-day Growth %" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 