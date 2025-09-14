import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusData = [
  { name: 'Submitted', value: 145, color: '#ef4444' },
  { name: 'In Progress', value: 89, color: '#f59e0b' },
  { name: 'Resolved', value: 234, color: '#10b981' },
];

const categoryData = [
  { name: 'Roads', submitted: 45, resolved: 38 },
  { name: 'Lighting', submitted: 32, resolved: 28 },
  { name: 'Waste', submitted: 28, resolved: 25 },
  { name: 'Parks', submitted: 22, resolved: 19 },
  { name: 'Water', submitted: 18, resolved: 15 },
];

export const IssueStatsChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Issue Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Issues by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="submitted" fill="#ef4444" name="Submitted" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};