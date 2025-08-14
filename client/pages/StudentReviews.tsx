import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, Calendar, History, CreditCard, Star, Settings,
  User, BookOpen, Filter, MapPin, Clock, DollarSign, Heart, MessageCircle,
  Phone, Mail, ChevronRight, Award, CheckCircle, AlertCircle, Eye, Edit3,
  LogOut, Upload, Plus, X, Download, Video, Bell, Users, TrendingUp, MoreHorizontal,
  ThumbsUp, Reply, Share, Flag, FileText, Image, Camera, Mic, Send, Trash2,
  ArrowUp, ArrowDown, BarChart3, Target, Globe, BookmarkPlus, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
}

export default function StudentReviews() {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  // Review management state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterRating, setFilterRating] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    teachingQuality: 0,
    communicationSkills: 0,
    punctuality: 0,
    lessonPreparation: 0,
    overallExperience: 0,
    reviewText: "",
    isAnonymous: false,
    wouldRecommend: true
  });

  // Mock student data
  const student = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder.svg",
    joinDate: "2024-01-01",
    profileCompletion: 75,
    totalLessons: 24,
    favoriteTeachers: 5,
    nextLesson: {
      teacher: "Aziza Karimova",
      subject: "English Conversation",
      date: "2024-01-20",
      time: "14:00"
    }
  };

  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "find-teachers", label: "Find Teachers", icon: Search },
    { id: "bookings", label: "My Bookings", icon: Calendar, count: 3 },
    { id: "history", label: "Lesson History", icon: History },
    { id: "payments", label: "Payments & Billing", icon: CreditCard },
    { id: "reviews", label: "Reviews & Ratings", icon: Star },
    { id: "profile", label: "Profile Settings", icon: Settings }
  ];

  // Mock review statistics
  const reviewStats = {
    totalReviews: 18,
    averageRatingGiven: 4.7,
    pendingReviews: 3,
    helpfulVotes: 42,
    responseRate: 85,
    reviewStreak: 12,
    topReviewerBadge: true,
    credibilityScore: 92
  };

  // Mock pending reviews data
  const pendingReviews = [
    {
      id: 1,
      teacher: {
        name: "Aziza Karimova",
        image: "/placeholder.svg",
        id: 1
      },
      lesson: {
        subject: "IELTS Preparation",
        date: "2024-01-18",
        duration: 60,
        completed: true
      },
      deadline: "2024-01-25"
    },
    {
      id: 2,
      teacher: {
        name: "Sarah Johnson",
        image: "/placeholder.svg",
        id: 2
      },
      lesson: {
        subject: "Business English",
        date: "2024-01-16",
        duration: 45,
        completed: true
      },
      deadline: "2024-01-23"
    },
    {
      id: 3,
      teacher: {
        name: "Bobur Umarov",
        image: "/placeholder.svg",
        id: 3
      },
      lesson: {
        subject: "Mathematics",
        date: "2024-01-15",
        duration: 90,
        completed: true
      },
      deadline: "2024-01-22"
    }
  ];

  // Mock my reviews data
  const myReviews = [
    {
      id: 1,
      teacher: {
        name: "Elena Rodriguez",
        image: "/placeholder.svg",
        id: 4
      },
      lesson: {
        subject: "Spanish Conversation",
        date: "2024-01-10",
        duration: 60
      },
      rating: 5,
      teachingQuality: 5,
      communicationSkills: 5,
      punctuality: 4,
      lessonPreparation: 5,
      reviewText: "Elena is an exceptional Spanish teacher! Her interactive teaching methods and patience made learning enjoyable. She provided excellent materials and always came prepared. Highly recommend!",
      dateSubmitted: "2024-01-11",
      helpfulVotes: 8,
      teacherResponse: {
        text: "Thank you so much, John! It was a pleasure teaching you. Your dedication to learning Spanish is inspiring. Looking forward to our next session!",
        date: "2024-01-12"
      },
      isEditable: false,
      photos: ["/placeholder.svg"]
    },
    {
      id: 2,
      teacher: {
        name: "David Kim",
        image: "/placeholder.svg",
        id: 5
      },
      lesson: {
        subject: "Python Programming",
        date: "2024-01-08",
        duration: 90
      },
      rating: 4,
      teachingQuality: 4,
      communicationSkills: 4,
      punctuality: 5,
      lessonPreparation: 4,
      reviewText: "Great Python instructor with deep knowledge. Explained complex concepts clearly. Would have liked more practical exercises during the session.",
      dateSubmitted: "2024-01-09",
      helpfulVotes: 5,
      teacherResponse: null,
      isEditable: true,
      photos: []
    },
    {
      id: 3,
      teacher: {
        name: "Fatima Al-Zahra",
        image: "/placeholder.svg",
        id: 6
      },
      lesson: {
        subject: "Arabic Language",
        date: "2024-01-05",
        duration: 75
      },
      rating: 5,
      teachingQuality: 5,
      communicationSkills: 5,
      punctuality: 5,
      lessonPreparation: 5,
      reviewText: "Outstanding Arabic teacher! Fatima's cultural insights and structured approach to teaching Arabic grammar and conversation were excellent. The lesson materials were top-notch.",
      dateSubmitted: "2024-01-06",
      helpfulVotes: 12,
      teacherResponse: {
        text: "شكرا جزيلا! Thank you for your kind words, John. Your enthusiasm for Arabic culture and language makes teaching a joy. Keep practicing!",
        date: "2024-01-07"
      },
      isEditable: false,
      photos: ["/placeholder.svg", "/placeholder.svg"]
    }
  ];

  // Mock analytics data
  const reviewAnalytics = {
    ratingDistribution: [
      { rating: 5, count: 12, percentage: 67 },
      { rating: 4, count: 4, percentage: 22 },
      { rating: 3, count: 2, percentage: 11 },
      { rating: 2, count: 0, percentage: 0 },
      { rating: 1, count: 0, percentage: 0 }
    ],
    subjectBreakdown: [
      { subject: "English", reviews: 8, avgRating: 4.8 },
      { subject: "Mathematics", reviews: 4, avgRating: 4.5 },
      { subject: "Spanish", reviews: 3, avgRating: 4.9 },
      { subject: "Programming", reviews: 2, avgRating: 4.2 },
      { subject: "Arabic", reviews: 1, avgRating: 5.0 }
    ],
    monthlyActivity: [
      { month: "Nov", reviews: 3 },
      { month: "Dec", reviews: 7 },
      { month: "Jan", reviews: 8 }
    ]
  };

  const renderStarRating = (rating: number, size: "sm" | "md" | "lg" = "md", interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-6 w-6"
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const calculateOverallRating = () => {
    const { teachingQuality, communicationSkills, punctuality, lessonPreparation, overallExperience } = reviewForm;
    const ratings = [teachingQuality, communicationSkills, punctuality, lessonPreparation, overallExperience];
    const validRatings = ratings.filter(r => r > 0);
    return validRatings.length > 0 ? Math.round(validRatings.reduce((a, b) => a + b, 0) / validRatings.length * 10) / 10 : 0;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student-dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reviews & Ratings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-gray-600">Share your learning experience and help other students</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setActiveSection("pending")}>
            <Star className="h-4 w-4 mr-2" />
            {pendingReviews.length} Pending Reviews
          </Button>
          <Button onClick={() => setActiveSection("write")}>
            <PenTool className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{reviewStats.totalReviews}</div>
            <div className="text-gray-600">Reviews Written</div>
            <div className="text-sm text-green-600 mt-1">+3 this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{reviewStats.averageRatingGiven}</div>
            <div className="text-gray-600">Average Rating Given</div>
            <div className="flex items-center justify-center mt-1">
              {renderStarRating(Math.round(reviewStats.averageRatingGiven), "sm")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{reviewStats.pendingReviews}</div>
            <div className="text-gray-600">Pending Reviews</div>
            <div className="text-sm text-amber-600 mt-1">Awaiting feedback</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{reviewStats.helpfulVotes}</div>
            <div className="text-gray-600">Helpful Votes</div>
            <div className="text-sm text-green-600 mt-1">From other students</div>
          </CardContent>
        </Card>
      </div>

      {/* Review Analytics Dashboard */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewAnalytics.ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{item.rating}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1">
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600 w-12">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewAnalytics.subjectBreakdown.map((item) => (
                <div key={item.subject} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.subject}</div>
                    <div className="text-sm text-gray-600">{item.reviews} reviews</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.avgRating}</div>
                    <div className="flex items-center gap-1">
                      {renderStarRating(Math.round(item.avgRating), "sm")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Review Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-blue-900">Top Reviewer</div>
                <div className="text-sm text-blue-700">18+ quality reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-900">Review Streak</div>
                <div className="text-sm text-green-700">{reviewStats.reviewStreak} consecutive reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-purple-900">Helpful Reviewer</div>
                <div className="text-sm text-purple-700">{reviewStats.credibilityScore}% credibility score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Review Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Activity
            </span>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection("my-reviews")}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.teacher.image} alt={review.teacher.name} />
                  <AvatarFallback>
                    {review.teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{review.teacher.name}</h3>
                    <Badge variant="outline">{review.lesson.subject}</Badge>
                    {renderStarRating(review.rating, "sm")}
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2 mb-2">{review.reviewText}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(review.dateSubmitted).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {review.helpfulVotes} helpful
                    </span>
                    {review.teacherResponse && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Reply className="h-3 w-3" />
                        Teacher replied
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPendingReviews = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Reviews</h1>
          <p className="text-gray-600">Complete your feedback for recent lessons</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pendingReviews.length} Reviews Pending
        </Badge>
      </div>

      {/* Pending Reviews List */}
      <div className="space-y-4">
        {pendingReviews.map((pendingReview) => (
          <Card key={pendingReview.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={pendingReview.teacher.image} alt={pendingReview.teacher.name} />
                    <AvatarFallback>
                      {pendingReview.teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{pendingReview.teacher.name}</h3>
                    <div className="text-gray-600">{pendingReview.lesson.subject}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(pendingReview.lesson.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pendingReview.lesson.duration} minutes
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-3 w-3" />
                        Due {new Date(pendingReview.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedTeacherId(pendingReview.teacher.id);
                      setIsWritingReview(true);
                      setActiveSection("write");
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Quick Rate
                  </Button>
                </div>
              </div>

              {/* Quick Rating Interface */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-3">Quick Rating (optional - you can write a detailed review later)</div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Overall experience:</span>
                  {renderStarRating(0, "lg", true)}
                  <Button size="sm" variant="outline">
                    Submit Quick Rating
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BookOpen className="h-5 w-5" />
            Review Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">What makes a helpful review:</h4>
              <ul className="space-y-1">
                <li>• Be specific about teaching methods</li>
                <li>• Mention lesson preparation quality</li>
                <li>• Comment on communication style</li>
                <li>• Include punctuality feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Review best practices:</h4>
              <ul className="space-y-1">
                <li>• Be honest but constructive</li>
                <li>• Avoid personal information</li>
                <li>• Focus on the learning experience</li>
                <li>• Help other students decide</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMyReviews = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600">Manage and track your teacher reviews</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reviews
          </Button>
          <Button onClick={() => setActiveSection("write")}>
            <Plus className="h-4 w-4 mr-2" />
            Write New Review
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search reviews by teacher name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="date-old">Date (Oldest)</SelectItem>
                <SelectItem value="rating-high">Rating (Highest)</SelectItem>
                <SelectItem value="rating-low">Rating (Lowest)</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {myReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={review.teacher.image} alt={review.teacher.name} />
                    <AvatarFallback>
                      {review.teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{review.teacher.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{review.lesson.subject}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(review.lesson.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      {renderStarRating(review.rating, "md")}
                      <span className="font-medium">{review.rating}.0</span>
                      <span className="text-sm text-gray-500">
                        Submitted {new Date(review.dateSubmitted).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {review.isEditable && (
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share Review
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report Issue
                      </DropdownMenuItem>
                      {review.isEditable && (
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Review
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Detailed Ratings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Teaching Quality</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {renderStarRating(review.teachingQuality, "sm")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Communication</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {renderStarRating(review.communicationSkills, "sm")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Punctuality</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {renderStarRating(review.punctuality, "sm")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Preparation</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {renderStarRating(review.lessonPreparation, "sm")}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
              </div>

              {/* Review Photos */}
              {review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Lesson Materials:</div>
                  <div className="flex gap-2">
                    {review.photos.map((photo, index) => (
                      <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={photo} alt="Review photo" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Engagement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpfulVotes} found this helpful</span>
                  </div>
                  {review.teacherResponse && (
                    <Badge variant="outline" className="text-green-600">
                      <Reply className="h-3 w-3 mr-1" />
                      Teacher Responded
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {review.lesson.duration} min lesson
                </div>
              </div>

              {/* Teacher Response */}
              {review.teacherResponse && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={review.teacher.image} alt={review.teacher.name} />
                      <AvatarFallback>
                        {review.teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        Response from {review.teacher.name}
                      </div>
                      <p className="text-blue-800 text-sm mb-2">{review.teacherResponse.text}</p>
                      <div className="text-xs text-blue-600">
                        {new Date(review.teacherResponse.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWriteReview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Write Review</h1>
          <p className="text-gray-600">Share your learning experience with the community</p>
        </div>
        <Button variant="outline" onClick={() => setActiveSection("overview")}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Teacher Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Teacher</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a teacher to review" />
              </SelectTrigger>
              <SelectContent>
                {pendingReviews.map((review) => (
                  <SelectItem key={review.teacher.id} value={review.teacher.id.toString()}>
                    {review.teacher.name} - {review.lesson.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rate Your Experience</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Teaching Quality</label>
                <div className="flex items-center gap-2">
                  {renderStarRating(reviewForm.teachingQuality, "lg", true, (rating) => 
                    setReviewForm({...reviewForm, teachingQuality: rating})
                  )}
                  <span className="text-sm text-gray-600 ml-2">{reviewForm.teachingQuality}/5</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Communication Skills</label>
                <div className="flex items-center gap-2">
                  {renderStarRating(reviewForm.communicationSkills, "lg", true, (rating) => 
                    setReviewForm({...reviewForm, communicationSkills: rating})
                  )}
                  <span className="text-sm text-gray-600 ml-2">{reviewForm.communicationSkills}/5</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Punctuality</label>
                <div className="flex items-center gap-2">
                  {renderStarRating(reviewForm.punctuality, "lg", true, (rating) => 
                    setReviewForm({...reviewForm, punctuality: rating})
                  )}
                  <span className="text-sm text-gray-600 ml-2">{reviewForm.punctuality}/5</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Lesson Preparation</label>
                <div className="flex items-center gap-2">
                  {renderStarRating(reviewForm.lessonPreparation, "lg", true, (rating) => 
                    setReviewForm({...reviewForm, lessonPreparation: rating})
                  )}
                  <span className="text-sm text-gray-600 ml-2">{reviewForm.lessonPreparation}/5</span>
                </div>
              </div>
            </div>

            {/* Overall Rating Display */}
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Rating:</span>
                <div className="flex items-center gap-2">
                  {renderStarRating(Math.round(calculateOverallRating()), "lg")}
                  <span className="text-lg font-bold">{calculateOverallRating()}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Written Review */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Written Review</label>
            <Textarea
              placeholder="Share your experience with this teacher. What did you like? What could be improved? Help other students make informed decisions..."
              value={reviewForm.reviewText}
              onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
              className="min-h-[120px]"
            />
            <div className="text-xs text-gray-500">
              {reviewForm.reviewText.length}/500 characters (recommended: 100-300 characters)
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Photos (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-2">Upload lesson materials or screenshots</div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </div>

          {/* Review Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="anonymous"
                checked={reviewForm.isAnonymous}
                onChange={(e) => setReviewForm({...reviewForm, isAnonymous: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="anonymous" className="text-sm font-medium">
                Submit anonymously
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="recommend"
                checked={reviewForm.wouldRecommend}
                onChange={(e) => setReviewForm({...reviewForm, wouldRecommend: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="recommend" className="text-sm font-medium">
                I would recommend this teacher to other students
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => {
                // Handle review submission
                setActiveSection("my-reviews");
              }}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">What to include:</h4>
              <ul className="space-y-1">
                <li>• Specific teaching methods used</li>
                <li>• Quality of lesson materials</li>
                <li>• Teacher's communication style</li>
                <li>• Punctuality and reliability</li>
                <li>• Overall learning experience</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Review policy:</h4>
              <ul className="space-y-1">
                <li>• Be honest and constructive</li>
                <li>• Avoid personal information</li>
                <li>• Focus on the learning experience</li>
                <li>• No inappropriate language</li>
                <li>• Reviews are moderated for quality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComingSoon = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600">Share your learning experience and help other students</p>
      </div>
      
      <Card className="text-center p-12">
        <CardContent>
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our comprehensive review and rating system is under development and will be available soon. 
            You'll be able to rate teachers, write detailed reviews, and help other students make informed decisions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-semibold mb-1">Rate Teachers</div>
              <div className="text-sm text-gray-600">Give detailed ratings for teaching quality, communication, and more</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="font-semibold mb-1">Write Reviews</div>
              <div className="text-sm text-gray-600">Share your learning experience with detailed feedback</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-semibold mb-1">Help Community</div>
              <div className="text-sm text-gray-600">Help other students choose the right teachers</div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/student-dashboard")}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/teachers")}>
              <Search className="h-4 w-4 mr-2" />
              Browse Teachers
            </Button>
            <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
              <History className="h-4 w-4 mr-2" />
              View Lesson History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "pending":
        return renderPendingReviews();
      case "my-reviews":
        return renderMyReviews();
      case "write":
        return renderWriteReview();
      case "coming-soon":
        return renderComingSoon();
      default:
        return renderComingSoon();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={student.image} alt={student.name} />
              <AvatarFallback>
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{student.name}</div>
              <div className="text-sm text-gray-600">Student</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === "reviews";
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === "reviews") {
                        setActiveSection("coming-soon");
                      } else {
                        navigate("/student-dashboard");
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.count && (
                      <Badge variant={isActive ? "secondary" : "default"} className="ml-auto">
                        {item.count}
                      </Badge>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/student-dashboard")}>
                <User className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  localStorage.removeItem("userAuth");
                  navigate("/");
                }}
                className="text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Reviews & Ratings</h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
