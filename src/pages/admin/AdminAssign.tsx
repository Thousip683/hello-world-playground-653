import { useState, useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Clock, MapPin, User, FileText, Search, Users, Building2 } from "lucide-react";
import { format } from "date-fns";

const departments = [
  "Fire Department",
  "Public Works", 
  "Electrical Department",
  "Sanitation",
  "Parks & Recreation",
  "Building & Safety",
  "Transportation",
  "Water Department"
];

const AdminAssign = () => {
  const { reports, loading, updateReport } = useReports();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  const assignToDepartment = async (reportId: string, department: string) => {
    try {
      await updateReport(reportId, {
        assigned_department: department,
        status: 'acknowledged'
      });
      toast({
        title: "Report Assigned",
        description: `Report has been assigned to ${department}`,
      });
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const updatePriority = async (reportId: string, priority: 'low' | 'medium' | 'high') => {
    try {
      await updateReport(reportId, { priority });
      toast({
        title: "Priority Updated",
        description: `Report priority set to ${priority}`,
      });
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.citizen_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || report.assigned_department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getAssignmentStats = () => {
    const unassigned = reports.filter(r => !r.assigned_department).length;
    const assigned = reports.filter(r => r.assigned_department).length;
    const byDepartment = departments.map(dept => ({
      name: dept,
      count: reports.filter(r => r.assigned_department === dept).length
    }));
    
    return { unassigned, assigned, byDepartment };
  };

  const stats = getAssignmentStats();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assignment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Department Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Assign reports to appropriate departments and manage priorities
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {stats.unassigned} Unassigned Reports
        </Badge>
      </div>

      {/* Assignment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unassigned}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground">With departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">All civic reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Reports by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.byDepartment.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.count} reports</p>
                </div>
                <Badge variant="secondary">{dept.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, location, or citizen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-filter">Filter by Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterDepartment("all");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Reports ({filteredReports.length})
        </h2>
        
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Reports Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReports
            .sort((a, b) => {
              // Prioritize unassigned reports
              if (!a.assigned_department && b.assigned_department) return -1;
              if (a.assigned_department && !b.assigned_department) return 1;
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })
            .map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-foreground">{report.title}</h3>
                        <StatusBadge status={report.status} />
                        <PriorityBadge priority={report.priority} />
                        {report.assigned_department && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {report.assigned_department}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {report.citizen_name && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{report.citizen_name}</span>
                          </div>
                        )}
                        {report.location_address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{report.location_address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(report.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Select
                        value={report.priority}
                        onValueChange={(priority: 'low' | 'medium' | 'high') => 
                          updatePriority(report.id, priority)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>

                      {!report.assigned_department ? (
                        <Select
                          onValueChange={(department) => assignToDepartment(report.id, department)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Assign to Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          value={report.assigned_department}
                          onValueChange={(department) => assignToDepartment(report.id, department)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-foreground">{report.description}</p>
                  
                  {report.photo_urls && report.photo_urls.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {report.photo_urls.map((url, index) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Report photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border cursor-pointer"
                          onClick={() => window.open(url, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Display public and internal notes */}
                  {(report.public_notes?.length || report.internal_notes?.length) && (
                    <div className="border-t pt-4 space-y-3">
                      {report.public_notes && report.public_notes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Public Updates</h4>
                          <div className="space-y-2">
                            {report.public_notes.map((note, index) => (
                              <div key={index} className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {report.internal_notes && report.internal_notes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Internal Notes</h4>
                          <div className="space-y-2">
                            {report.internal_notes.map((note, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default AdminAssign;