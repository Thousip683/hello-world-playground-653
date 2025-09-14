import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useReports } from "@/hooks/useReports";
import { Link } from "react-router-dom";
import { Calendar, MapPin, FileText, Eye, TrendingUp, BarChart3 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

const CitizenDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const { reports, loading } = useReports();

  // Filter reports based on selected tab
  const filteredReports = reports.filter(report => {
    switch (selectedTab) {
      case "submitted":
        return report.status === "submitted";
      case "progress":
        return report.status === "acknowledged" || report.status === "in-progress";
      case "resolved":
        return report.status === "resolved";
      default:
        return true;
    }
  });

  const getStatusCounts = () => {
    return {
      total: reports.length,
      submitted: reports.filter(r => r.status === "submitted").length,
      progress: reports.filter(r => r.status === "acknowledged" || r.status === "in-progress").length,
      resolved: reports.filter(r => r.status === "resolved").length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your reports...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl mr-4">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    My Reports Dashboard
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Track the progress of your submitted civic issues
                  </p>
                </div>
              </div>
              <Button asChild className="mt-4 md:mt-0 h-12 px-6 text-lg">
                <Link to="/report">
                  <FileText className="w-5 h-5 mr-2" />
                  Report New Issue
                </Link>
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                      <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{counts.total}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-amber-500/20 rounded-xl mr-4">
                      <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-amber-800 dark:text-amber-200">{counts.progress}</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-500/20 rounded-xl mr-4">
                      <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-800 dark:text-green-200">{counts.resolved}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-500/20 rounded-xl mr-4">
                      <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">2.5</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reports Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Your Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Reports ({counts.total})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                <TabsTrigger value="progress">In Progress ({counts.progress})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
              <TabsContent value="submitted" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
              <TabsContent value="progress" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
              <TabsContent value="resolved" className="space-y-4">
                <ReportsList reports={filteredReports} />
              </TabsContent>
                </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ReportsList = ({ reports }: { reports: any[] }) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-muted/50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <FileText className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No reports found</h3>
        <p className="text-muted-foreground">Get started by reporting your first civic issue!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <StatusBadge status={report.status} />
                    <PriorityBadge priority={report.priority} />
                  </div>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center bg-muted/50 px-2 py-1 rounded-md">
                      <FileText className="w-4 h-4 mr-1" />
                      {report.id}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {report.location_address || 'Location not specified'}
                    </span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {report.category}
                    </Badge>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="h-10 px-6">
                  <Link to={`/report/${report.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CitizenDashboard;