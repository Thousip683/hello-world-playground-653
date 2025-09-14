import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AdminAnalyticsChart = () => {
  // Sample data for different chart types
  const categoryData = [
    { name: 'Road Maintenance', submitted: 45, resolved: 38 },
    { name: 'Street Lighting', submitted: 32, resolved: 29 },
    { name: 'Vandalism', submitted: 18, resolved: 12 },
    { name: 'Trash Collection', submitted: 28, resolved: 25 },
    { name: 'Water Issues', submitted: 22, resolved: 18 },
    { name: 'Parks & Recreation', submitted: 15, resolved: 12 }
  ];

  const monthlyTrends = [
    { month: 'Jan', reports: 65, resolved: 58 },
    { month: 'Feb', reports: 78, resolved: 62 },
    { month: 'Mar', reports: 82, resolved: 75 },
    { month: 'Apr', reports: 91, resolved: 88 },
    { month: 'May', reports: 88, resolved: 85 },
    { month: 'Jun', reports: 95, resolved: 90 }
  ];

  const statusDistribution = [
    { name: 'Resolved', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#f59e0b' },
    { name: 'Submitted', value: 10, color: '#6366f1' }
  ];

  const priorityData = [
    { priority: 'High', count: 25, color: '#ef4444' },
    { priority: 'Medium', count: 78, color: '#f59e0b' },
    { priority: 'Low', count: 45, color: '#10b981' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trends Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Report Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="reports" 
                stroke="#6366f1" 
                strokeWidth={3}
                name="Reports Submitted"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Reports Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Reports by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="submitted" fill="#6366f1" name="Submitted" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="priority" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsChart;