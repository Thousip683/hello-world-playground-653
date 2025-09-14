import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Upload, Camera, Phone, Zap, AlertTriangle, Video, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReports } from "@/hooks/useReports";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MediaPreview } from "@/components/MediaPreview";

const categories = [
  "Road Maintenance",
  "Street Lighting", 
  "Vandalism",
  "Trash Collection",
  "Water Issues",
  "Parks and Recreation",
  "Noise Complaints",
  "Traffic Signals",
  "Sidewalk Repair",
  "Other"
];

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    mediaFiles: [] as File[],
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createReport, uploadMedia } = useReports();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Upload media files if any
      let mediaUrls: string[] = [];
      if (formData.mediaFiles.length > 0) {
        mediaUrls = await uploadMedia(formData.mediaFiles);
      }

      // Parse location coordinates if provided
      let locationLat: number | undefined;
      let locationLng: number | undefined;
      if (formData.location) {
        const coords = formData.location.split(',');
        if (coords.length === 2) {
          locationLat = parseFloat(coords[0].trim());
          locationLng = parseFloat(coords[1].trim());
        }
      }

      // Create report
      await createReport({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location_address: formData.location,
        location_lat: locationLat,
        location_lng: locationLng,
        photo_urls: mediaUrls
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in useReports hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, mediaFiles: [...prev.mediaFiles, ...files] }));
  };

  const removeMediaFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          toast({
            title: "Location Detected",
            description: "Your current location has been added to the report.",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to detect your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full mb-6 mx-auto">
                <AlertTriangle className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Report a Civic Issue
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help us build a better community by reporting issues that need attention. 
                Your voice matters in making our city a better place to live.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-2xl">
                      <div className="p-2 bg-primary/10 rounded-lg mr-3">
                        <Camera className="w-6 h-6 text-primary" />
                      </div>
                      Issue Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Issue Title *</Label>
                        <Input
                          id="title"
                          placeholder="Brief description of the issue"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                          required
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select issue category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide detailed information about the issue, including when you first noticed it and any relevant details."
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          required
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="flex gap-2">
                          <Input
                            id="location"
                            placeholder="Enter address or coordinates"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="flex-1 h-12"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleLocationDetect}
                            className="px-4 h-12"
                          >
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click the location icon to auto-detect your current location
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="media">Media Files</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                          <div className="flex justify-center items-center space-x-4 mb-4">
                            <Camera className="w-8 h-8 text-primary" />
                            <Video className="w-8 h-8 text-green-500" />
                            <Mic className="w-8 h-8 text-blue-500" />
                          </div>
                          <p className="text-lg font-medium mb-2">
                            Upload photos, videos, or audio recordings
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Optional but recommended - media helps our teams respond faster
                          </p>
                          <input
                            type="file"
                            id="media"
                            multiple
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('media')?.click()}
                            className="h-12 px-6"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Media Files
                          </Button>
                          {formData.mediaFiles.length > 0 && (
                            <p className="text-sm text-primary mt-3 font-medium">
                              {formData.mediaFiles.length} file(s) selected
                            </p>
                          )}
                        </div>
                        
                        <MediaPreview files={formData.mediaFiles} onRemove={removeMediaFile} />
                      </div>

                      <div className="flex gap-4 pt-6">
                        <Button 
                          type="submit" 
                          className="flex-1 h-12 text-lg font-semibold" 
                          disabled={submitting}
                        >
                          {submitting ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Submitting...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Zap className="w-5 h-5 mr-2" />
                              Submit Report
                            </div>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/")}
                          className="px-8 h-12"
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Emergency Info */}
                <Card className="shadow-lg border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="p-2 bg-amber-500/20 rounded-lg mr-3">
                        <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Emergency Issues</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                          For urgent issues that pose immediate danger (gas leaks, water main breaks, etc.)
                        </p>
                        <div className="bg-amber-100 dark:bg-amber-900/50 rounded-lg p-3">
                          <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                            📞 (555) 911-CITY
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      Reporting Tips
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Be specific about the location and issue details
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Include photos if possible - they help our teams respond faster
                      </li>
                      <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        You'll receive updates via email as we work on your report
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportIssue;