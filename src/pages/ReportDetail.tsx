import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useReports } from "@/hooks/useReports";
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, FileText } from "lucide-react";

const ReportDetail = () => {
  const { id } = useParams();
  const { reports, loading } = useReports();
  const report = reports.find(r => r.id === id);

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
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The report you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="civic">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusSteps = () => {
    const steps = [
      { key: 'submitted', label: 'Submitted', date: report.created_at },
      { key: 'acknowledged', label: 'Acknowledged', date: report.date_acknowledged },
      { key: 'in-progress', label: 'In Progress', date: report.date_in_progress },
      { key: 'resolved', label: 'Resolved', date: report.date_resolved },
    ];

    const currentStatusIndex = steps.findIndex(step => step.key === report.status);
    
    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentStatusIndex,
      isCurrent: index === currentStatusIndex,
    }));
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{report.title}</h1>
            <p className="text-muted-foreground">Report ID: {report.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
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
                  {report.assigned_department && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Assigned to:</strong> {report.assigned_department}
                      </span>
                    </div>
                  )}
                </div>

                {/* Media Files */}
                {report.photo_urls && report.photo_urls.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Media</h3>
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
                                alt={`Report media ${index + 1}`}
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

            {/* Progress Updates */}
            {report.public_notes && report.public_notes.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Progress Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.public_notes.map((note, index) => (
                      <div key={index} className="border-l-4 border-civic-blue pl-4">
                        <p className="text-sm">{note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date().toLocaleDateString()} - Municipal Staff
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex items-start">
                      <div className={`w-4 h-4 rounded-full mt-1 mr-3 ${
                        step.isCompleted 
                          ? step.key === 'resolved' 
                            ? 'bg-status-resolved' 
                            : 'bg-status-progress'
                          : 'bg-muted'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-medium ${step.isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(step.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
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
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;