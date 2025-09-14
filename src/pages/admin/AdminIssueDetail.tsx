import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useReports } from "@/hooks/useReports";
import { departments } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText,
  Save,
  MessageSquare,
  Building
} from "lucide-react";

const AdminIssueDetail = () => {
  const { id } = useParams();
  const { reports, loading, updateReport, addNote } = useReports();
  const report = reports.find(r => r.id === id);
  const { toast } = useToast();

  const [status, setStatus] = useState<string>(report?.status || "submitted");
  const [priority, setPriority] = useState<string>(report?.priority || "medium");
  const [assignedDepartment, setAssignedDepartment] = useState<string>(report?.assigned_department || "");
  const [publicNote, setPublicNote] = useState("");
  const [internalNote, setInternalNote] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-civic-blue"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Issue Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The issue you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="civic">
            <Link to="/admin/issues">Back to Issues</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveChanges = async () => {
    if (!report || !id) return;
    
    try {
      await updateReport(id, {
        status: status as 'submitted' | 'acknowledged' | 'in-progress' | 'resolved',
        priority: priority as 'low' | 'medium' | 'high',
        assigned_department: assignedDepartment
      });
    } catch (error) {
      // Error is handled in updateReport function
    }
  };

  const handleAddNote = async (isPublic: boolean) => {
    const note = isPublic ? publicNote : internalNote;
    if (!note.trim() || !id) return;

    try {
      await addNote(id, note, isPublic);
      
      if (isPublic) {
        setPublicNote("");
      } else {
        setInternalNote("");
      }
    } catch (error) {
      // Error is handled in addNote function
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/issues">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Issues
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{report.title}</h1>
          <p className="text-muted-foreground">Issue ID: {report.id}</p>
        </div>
        <Button onClick={handleSaveChanges} variant="civic">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Issue Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={report.status} />
                <PriorityBadge priority={report.priority} />
                <Badge variant="outline">{report.category}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{report.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Submitted:</strong> {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Location:</strong> {report.location_address || 'No address provided'}
                  </span>
                </div>
              </div>

              {/* Media Files */}
              {report.photo_urls && report.photo_urls.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Attached Media</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {report.photo_urls.map((url, index) => {
                      const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
                      const isAudio = url.includes('.mp3') || url.includes('.wav') || url.includes('.m4a');
                      
                      if (isVideo) {
                        return (
                          <div key={index} className="aspect-video bg-muted rounded-lg border overflow-hidden">
                            <video
                              src={url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      } else if (isAudio) {
                        return (
                          <div key={index} className="p-4 bg-muted rounded-lg border">
                            <audio
                              src={url}
                              controls
                              className="w-full"
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div key={index} className="aspect-square bg-muted rounded-lg border overflow-hidden">
                            <img
                              src={url}
                              alt={`Issue media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Public Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Public Updates</CardTitle>
              <p className="text-sm text-muted-foreground">
                These updates are visible to the citizen who reported the issue.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {(report.public_notes || []).map((note, index) => (
                <div key={index} className="border-l-4 border-civic-blue pl-4 py-2">
                  <p className="text-sm">{note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString()} - Municipal Staff
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Add a public update for the citizen..."
                  value={publicNote}
                  onChange={(e) => setPublicNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={() => handleAddNote(true)} 
                  className="mt-2" 
                  size="sm"
                  disabled={!publicNote.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Public Update
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
              <p className="text-sm text-muted-foreground">
                These notes are only visible to municipal staff.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {(report.internal_notes || []).map((note, index) => (
                <div key={index} className="border-l-4 border-civic-amber pl-4 py-2">
                  <p className="text-sm">{note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString()} - Staff Member
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Add an internal note for staff..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={() => handleAddNote(false)} 
                  className="mt-2" 
                  size="sm" 
                  variant="outline"
                  disabled={!internalNote.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Internal Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Issue Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Assigned Department</label>
                <Select value={assignedDepartment} onValueChange={setAssignedDepartment}>
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
            </CardContent>
          </Card>

          {/* Citizen Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Citizen Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{report.citizen_name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{report.citizen_email || 'No email provided'}</span>
              </div>
              {report.citizen_phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{report.citizen_phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <Mail className="w-4 h-4 mr-2" />
                Email Citizen
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueDetail;