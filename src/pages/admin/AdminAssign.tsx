import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useReports } from "@/hooks/useReports";
import { departments } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Users, MapPin, Calendar, CheckSquare } from "lucide-react";

const AdminAssign = () => {
  const { reports, loading, updateReport } = useReports();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [bulkDepartment, setBulkDepartment] = useState("");
  const [bulkPriority, setBulkPriority] = useState("");
  const { toast } = useToast();

  // Filter to show only unassigned or submitted reports
  const assignableReports = reports.filter(
    report => !report.assigned_department || report.status === "submitted"
  );

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportId]);
    } else {
      setSelectedReports(prev => prev.filter(id => id !== reportId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(assignableReports.map(report => report.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedReports.length === 0) {
      toast({
        title: "No Reports Selected",
        description: "Please select reports to assign.",
        variant: "destructive",
      });
      return;
    }

    if (!bulkDepartment) {
      toast({
        title: "Department Required",
        description: "Please select a department to assign the reports to.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update all selected reports
      await Promise.all(selectedReports.map(reportId => 
        updateReport(reportId, {
          assigned_department: bulkDepartment,
          ...(bulkPriority && { priority: bulkPriority as 'low' | 'medium' | 'high' })
        })
      ));

      toast({
        title: "Assignment Successful",
        description: `${selectedReports.length} reports have been assigned to ${bulkDepartment}.`,
      });

      // Reset selections
      setSelectedReports([]);
      setBulkDepartment("");
      setBulkPriority("");
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the reports.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Assignment Management</h1>
        <p className="text-muted-foreground">
          Assign multiple reports to departments and set priorities in bulk
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-civic-blue mr-3" />
              <div>
                <p className="text-2xl font-bold">{assignableReports.length}</p>
                <p className="text-sm text-muted-foreground">Assignable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckSquare className="w-8 h-8 text-civic-green mr-3" />
              <div>
                <p className="text-2xl font-bold">{selectedReports.length}</p>
                <p className="text-sm text-muted-foreground">Selected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-civic-red rounded-full mr-3 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {reports.filter(r => r.priority === "high").length}
                </p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-muted rounded-full mr-3 flex items-center justify-center">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {reports.filter(r => !r.assigned_department).length}
                </p>
                <p className="text-sm text-muted-foreground">Unassigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Assignment Controls */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Bulk Assignment Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={bulkDepartment} onValueChange={setBulkDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority (Optional)</label>
              <Select value={bulkPriority} onValueChange={setBulkPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {selectedReports.length} selected
              </span>
            </div>

            <Button 
              onClick={handleBulkAssign} 
              variant="civic" 
              disabled={selectedReports.length === 0 || !bulkDepartment}
            >
              Assign Selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Available Reports for Assignment</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedReports.length === assignableReports.length && assignableReports.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Issue ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Current Assignment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignableReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{report.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {report.location_address || 'No address provided'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={report.priority} />
                  </TableCell>
                  <TableCell>
                    {report.assigned_department ? (
                      <Badge variant="secondary">{report.assigned_department}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {assignableReports.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports available for assignment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAssign;