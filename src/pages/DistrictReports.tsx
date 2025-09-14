import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from 'lucide-react';
import { useReports, Report } from '@/hooks/useReports';
import { useVoting } from '@/hooks/useVoting';
import { useComments, Comment } from '@/hooks/useComments';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { MediaPreview } from '@/components/MediaPreview';
import { URLMediaPreview } from '@/components/URLMediaPreview';
import { CATEGORIES, DISTRICTS } from '@/data/constants';

interface ReportWithVotes extends Report {
  upvotes?: number;
  downvotes?: number;
  userVote?: 'upvote' | 'downvote' | null;
  comments?: Comment[];
}

const DistrictReports = () => {
  const { reports, loading: reportsLoading } = useReports();
  const { vote, getVoteCounts, loading: voteLoading } = useVoting();
  const { comments, fetchComments, addComment, loading: commentsLoading } = useComments();
  
  const [filteredReports, setFilteredReports] = useState<ReportWithVotes[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [topVotedReports, setTopVotedReports] = useState<ReportWithVotes[]>([]);

  // Load vote counts for reports
  useEffect(() => {
    const loadVotesForReports = async () => {
      if (!reports.length) return;

      const reportsWithVotes = await Promise.all(
        reports.map(async (report) => {
          const votes = await getVoteCounts(report.id);
          return {
            ...report,
            upvotes: votes.upvotes,
            downvotes: votes.downvotes,
            userVote: votes.userVote,
          };
        })
      );

      setFilteredReports(reportsWithVotes);
      
      // Set top voted reports
      const sorted = [...reportsWithVotes]
        .sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)))
        .slice(0, 5);
      setTopVotedReports(sorted);
    };

    loadVotesForReports();
  }, [reports, getVoteCounts]);

  // Filter and sort reports
  useEffect(() => {
    let filtered = [...filteredReports];

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict && selectedDistrict !== 'all') {
      filtered = filtered.filter(report => 
        report.location_address?.toLowerCase().includes(selectedDistrict.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(report => report.category === selectedCategory);
    }

    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    if (selectedPriority) {
      filtered = filtered.filter(report => report.priority === selectedPriority);
    }

    // Sort reports
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'votes':
        filtered.sort((a, b) => 
          ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0))
        );
        break;
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
    }

    setFilteredReports(filtered);
  }, [searchTerm, selectedDistrict, selectedCategory, selectedStatus, selectedPriority, sortBy, reports]);

  const handleVote = async (reportId: string, voteType: 'upvote' | 'downvote') => {
    await vote(reportId, voteType);
    
    // Refresh vote counts
    const votes = await getVoteCounts(reportId);
    setFilteredReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, upvotes: votes.upvotes, downvotes: votes.downvotes, userVote: votes.userVote }
          : report
      )
    );
  };

  const toggleComments = async (reportId: string) => {
    const newExpanded = new Set(expandedComments);
    if (expandedComments.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
      await fetchComments(reportId);
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = async (reportId: string) => {
    const content = commentInputs[reportId];
    if (!content?.trim()) return;

    await addComment(reportId, content);
    setCommentInputs(prev => ({ ...prev, [reportId]: '' }));
  };

  if (reportsLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">DISTRICT REPORTS</h1>
            <p className="text-xl text-muted-foreground">
              Browse issues in your district. Vote to prioritize.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {DISTRICTS.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="votes">Most Voted</SelectItem>
                    <SelectItem value="priority">Highest Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Reports List */}
            <div className="lg:col-span-3 space-y-6">
              {filteredReports.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">No reports found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Media */}
                        <div className="md:col-span-1">
                          {report.photo_urls && report.photo_urls.length > 0 ? (
                            <URLMediaPreview 
                              urls={report.photo_urls} 
                              className="w-full h-48 rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                              <MapPin className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <PriorityBadge priority={report.priority} />
                            <StatusBadge status={report.status} />
                            <Badge variant="outline">{report.category}</Badge>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              <Link 
                                to={`/report/${report.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {report.title}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground mb-2">{report.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(report.created_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {report.location_address || 'Location not specified'}
                              </div>
                            </div>
                          </div>

                          {/* Voting */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant={report.userVote === 'upvote' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleVote(report.id, 'upvote')}
                                disabled={voteLoading}
                                className="flex items-center gap-1"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                {report.upvotes || 0}
                              </Button>
                              
                              <Button
                                variant={report.userVote === 'downvote' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => handleVote(report.id, 'downvote')}
                                disabled={voteLoading}
                                className="flex items-center gap-1"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                {report.downvotes || 0}
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleComments(report.id)}
                              className="flex items-center gap-1"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Comments ({comments.length})
                              {expandedComments.has(report.id) ? 
                                <ChevronUp className="w-4 h-4" /> : 
                                <ChevronDown className="w-4 h-4" />
                              }
                            </Button>
                          </div>

                          {/* Comments Section */}
                          {expandedComments.has(report.id) && (
                            <div className="space-y-4 pt-4 border-t">
                              {/* Recent comments */}
                              {comments.slice(0, 2).map((comment) => (
                                <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">{comment.user_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              ))}

                              {/* Add comment */}
                              <div className="flex gap-2">
                                <Textarea
                                  placeholder="Add a comment..."
                                  value={commentInputs[report.id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({
                                    ...prev,
                                    [report.id]: e.target.value
                                  }))}
                                  className="flex-1 min-h-[80px]"
                                />
                                <Button
                                  onClick={() => handleAddComment(report.id)}
                                  disabled={commentsLoading || !commentInputs[report.id]?.trim()}
                                  size="sm"
                                >
                                  Post
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top 5 Most Voted Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topVotedReports.map((report, index) => (
                      <div key={report.id} className="border-l-4 border-primary/30 pl-3">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-primary mr-2">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <Link 
                              to={`/report/${report.id}`}
                              className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                            >
                              {report.title}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                              {((report.upvotes || 0) - (report.downvotes || 0))} votes
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DistrictReports;