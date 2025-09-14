import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useReports } from "@/hooks/useReports";
import { Link } from "react-router-dom";
import { 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  MapPin,
  Eye
} from "lucide-react";

const AdminDashboard = () => {
  const { reports, loading } = useReports();

  const getStatistics = () => {
    const total = reports.length;
    const submitted = reports.filter(r => r.status === "submitted").length;
    const inProgress = reports.filter(r => r.status === "acknowledged" || r.status === "in-progress").length;
    const resolved = reports.filter(r => r.status === "resolved").length;
    const highPriority = reports.filter(r => r.priority === "high").length;
    
    return { total, submitted, inProgress, resolved, highPriority };
  };

  const stats = getStatistics();
  const recentReports = reports.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of civic issues and system activity
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild variant="civic">
            <Link to="/admin/issues">View All Issues</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/analytics">Analytics</Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-civic-blue mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-status-submitted mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.submitted}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-status-progress mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-status-resolved mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-civic-red mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Issues */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Issues
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/issues">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{report.title}</h4>
                      <StatusBadge status={report.status} />
                      <PriorityBadge priority={report.priority} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {report.id}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {report.citizen_name || 'Anonymous'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/admin/issues/${report.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Categories */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="civic" className="w-full">
                <Link to="/admin/assign">Assign Issues</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/analytics">View Analytics</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/issues?status=submitted">Review Pending</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Issue Categories */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Road Maintenance", count: 8, color: "civic-blue" },
                  { name: "Street Lighting", count: 5, color: "civic-amber" },
                  { name: "Vandalism", count: 3, color: "civic-red" },
                  { name: "Water Issues", count: 2, color: "civic-green" },
                ].map((category) => (
                  <div key={category.name} className="flex justify-between items-center">
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Department Status */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Department Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Public Works", active: 5, resolved: 12, avg: "2.3 days" },
              { name: "Electrical Services", active: 3, resolved: 8, avg: "1.8 days" },
              { name: "Parks & Recreation", active: 2, resolved: 6, avg: "3.1 days" },
            ].map((dept) => (
              <div key={dept.name} className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">{dept.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active Issues:</span>
                    <Badge variant="progress">{dept.active}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved:</span>
                    <Badge variant="resolved">{dept.resolved}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Resolution:</span>
                    <span className="font-medium">{dept.avg}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;