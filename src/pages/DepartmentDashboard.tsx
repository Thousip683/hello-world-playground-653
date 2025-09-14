import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useReports } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Clock, MapPin, User, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const DepartmentDashboard = () => {
  const { user } = useAuth();
  const { reports, loading, updateReport, addNote } = useReports();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [internalNote, setInternalNote] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // Filter reports assigned to user's department (for demo, using user email domain as department)
  const userDepartment = user?.email?.split('@')[0] || '';
  const assignedReports = reports.filter(report => 
    report.assigned_department?.toLowerCase().includes(userDepartment.toLowerCase()) ||
    report.assigned_department === 'Fire' || // Demo departments
    report.assigned_department === 'Public Works' ||
    report.assigned_department === 'Electrical'
  );

  const acknowledgeReport = async (reportId: string) => {
    try {
      await updateReport(reportId, {
        status: 'acknowledged',
      });
      toast({
        title: "Report Acknowledged",
        description: "Citizen has been notified that you've seen their report.",
      });
    } catch (error) {
      console.error('Error acknowledging report:', error);
    }
  };

  const startProgress = async (reportId: string) => {
    try {
      await updateReport(reportId, {
        status: 'in-progress',
      });
      toast({
        title: "Work Started",
        description: "Report status updated to In Progress.",
      });
    } catch (error) {
      console.error('Error starting progress:', error);
    }
  };

  const resolveReport = async (reportId: string) => {
    if (!resolutionNote.trim()) {
      toast({
        title: "Resolution Note Required",
        description: "Please provide details about how this issue was resolved.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateReport(reportId, {
        status: 'resolved',
      });
      
      await addNote(reportId, `Issue Resolved: ${resolutionNote}`, true);
      
      setResolutionNote("");
      setSelectedReport(null);
      
      toast({
        title: "Report Resolved",
        description: "Citizen has been notified of the resolution.",
      });
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const addInternalNote = async (reportId: string) => {
    if (!internalNote.trim()) return;

    try {
      await addNote(reportId, internalNote, false);
      setInternalNote("");
      toast({
        title: "Internal Note Added",
        description: "Note added for admin visibility only.",
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      submitted: assignedReports.filter(r => r.status === 'submitted').length,
      acknowledged: assignedReports.filter(r => r.status === 'acknowledged').length,
      inProgress: assignedReports.filter(r => r.status === 'in-progress').length,
      resolved: assignedReports.filter(r => r.status === 'resolved').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your assigned reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Department Portal</h1>
          <p className="text-muted-foreground mt-1">
            Manage your assigned civic reports
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {assignedReports.length} Total Assigned
        </Badge>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.submitted}</div>
            <p className="text-xs text-muted-foreground">Awaiting acknowledgment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.acknowledged}</div>
            <p className="text-xs text-muted-foreground">Ready to start work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.resolved}</div>
            <p className="text-xs text-muted-foreground">Completed work</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Assigned Reports</h2>
        
        {assignedReports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Reports Assigned</h3>
              <p className="text-muted-foreground">
                You don't have any reports assigned to your department yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          assignedReports
            .sort((a, b) => {
              const statusOrder = { 'submitted': 0, 'acknowledged': 1, 'in-progress': 2, 'resolved': 3 };
              return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
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
                      {report.status === 'submitted' && (
                        <Button 
                          size="sm" 
                          onClick={() => acknowledgeReport(report.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Acknowledge
                        </Button>
                      )}
                      
                      {report.status === 'acknowledged' && (
                        <Button 
                          size="sm" 
                          onClick={() => startProgress(report.id)}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Start Work
                        </Button>
                      )}
                      
                      {report.status === 'in-progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Resolved
                        </Button>
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

                  {/* Internal Notes Section */}
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add internal note for admin..."
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button 
                        onClick={() => addInternalNote(report.id)}
                        disabled={!internalNote.trim()}
                        size="sm"
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>

                  {/* Resolution Form */}
                  {selectedReport === report.id && (
                    <div className="border-t pt-4 space-y-3">
                      <h4 className="font-medium text-foreground">Resolution Details</h4>
                      <Textarea
                        placeholder="Describe how this issue was resolved..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => resolveReport(report.id)}
                          disabled={!resolutionNote.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm Resolution
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedReport(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Display Internal Notes */}
                  {report.internal_notes && report.internal_notes.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-foreground mb-2">Internal Notes</h4>
                      <div className="space-y-2">
                        {report.internal_notes.map((note, index) => (
                          <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                            {note}
                          </div>
                        ))}
                      </div>
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

export default DepartmentDashboard;