import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReports, categories, departments } from "@/data/mockData";
import { BarChart3, TrendingUp, Clock, Target, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminAnalytics = () => {
  const getAnalytics = () => {
    const total = mockReports.length;
    const resolved = mockReports.filter(r => r.status === "resolved").length;
    const inProgress = mockReports.filter(r => r.status === "acknowledged" || r.status === "in-progress").length;
    const submitted = mockReports.filter(r => r.status === "submitted").length;
    
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    
    // Category breakdown
    const categoryStats = categories.map(category => ({
      name: category,
      count: mockReports.filter(r => r.category === category).length,
      resolved: mockReports.filter(r => r.category === category && r.status === "resolved").length,
    }));

    // Department stats
    const departmentStats = departments.map(dept => ({
      name: dept,
      assigned: mockReports.filter(r => r.assignedDepartment === dept).length,
      resolved: mockReports.filter(r => r.assignedDepartment === dept && r.status === "resolved").length,
    }));

    // Priority distribution
    const priorityStats = [
      { level: "High", count: mockReports.filter(r => r.priority === "high").length },
      { level: "Medium", count: mockReports.filter(r => r.priority === "medium").length },
      { level: "Low", count: mockReports.filter(r => r.priority === "low").length },
    ];

    return {
      overview: { total, resolved, inProgress, submitted, resolutionRate },
      categories: categoryStats,
      departments: departmentStats,
      priorities: priorityStats,
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Insights into civic issue reporting and resolution performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-civic-blue mr-3" />
              <div>
                <p className="text-2xl font-bold">{analytics.overview.total}</p>
                <p className="text-sm text-muted-foreground">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-civic-green mr-3" />
              <div>
                <p className="text-2xl font-bold">{analytics.overview.resolutionRate}%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-civic-amber mr-3" />
              <div>
                <p className="text-2xl font-bold">{analytics.overview.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-civic-red mr-3" />
              <div>
                <p className="text-2xl font-bold">2.3</p>
                <p className="text-sm text-muted-foreground">Avg Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categories
                .filter(cat => cat.count > 0)
                .sort((a, b) => b.count - a.count)
                .map((category) => {
                  const resolutionRate = category.count > 0 ? Math.round((category.resolved / category.count) * 100) : 0;
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{category.count} total</Badge>
                          <Badge 
                            variant={resolutionRate >= 80 ? "resolved" : resolutionRate >= 50 ? "progress" : "submitted"}
                          >
                            {resolutionRate}% resolved
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-civic-green h-2 rounded-full transition-all"
                          style={{ width: `${resolutionRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Department Workload */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Department Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.departments
                .filter(dept => dept.assigned > 0)
                .sort((a, b) => b.assigned - a.assigned)
                .map((department) => {
                  const resolutionRate = department.assigned > 0 ? Math.round((department.resolved / department.assigned) * 100) : 0;
                  return (
                    <div key={department.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{department.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{department.assigned} assigned</Badge>
                          <Badge 
                            variant={resolutionRate >= 80 ? "resolved" : resolutionRate >= 50 ? "progress" : "submitted"}
                          >
                            {resolutionRate}% resolved
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-civic-blue h-2 rounded-full transition-all"
                          style={{ width: `${resolutionRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution and Resolution Timeline */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.priorities.map((priority) => {
                const percentage = analytics.overview.total > 0 ? Math.round((priority.count / analytics.overview.total) * 100) : 0;
                return (
                  <div key={priority.level} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded mr-3 ${
                        priority.level === "High" ? "bg-civic-red" :
                        priority.level === "Medium" ? "bg-civic-amber" :
                        "bg-civic-blue"
                      }`} />
                      <span className="font-medium">{priority.level} Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                      <Badge variant="outline">{priority.count}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Resolution Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Same Day</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-civic-green h-2 rounded-full w-1/4" />
                  </div>
                  <Badge variant="resolved">25%</Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">1-3 Days</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-civic-green h-2 rounded-full w-2/5" />
                  </div>
                  <Badge variant="resolved">40%</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">4-7 Days</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-civic-amber h-2 rounded-full w-1/4" />
                  </div>
                  <Badge variant="progress">25%</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">7+ Days</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-civic-red h-2 rounded-full w-1/10" />
                  </div>
                  <Badge variant="submitted">10%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;