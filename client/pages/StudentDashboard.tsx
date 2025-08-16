import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Star,
  BookOpen,
  Video,
  MessageCircle,
  Settings,
  User as UserIcon,
  CreditCard,
  Search,
  Filter,
  Bell,
  Award,
  TrendingUp,
  MapPin,
  Globe,
  Users,
  Edit3,
  ChevronRight,
  Play,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  useCurrentUser,
  useBookings,
  useStudentProfile,
  useUpdateBookingStatus,
  useCancelBooking,
} from "@/hooks/useApi";
import { 
  formatPrice, 
  formatTimezone,
  Booking,
  StudentProfile as StudentProfileType,
  User,
} from "@/lib/api";

export default function StudentDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  // Fetch current user and profile
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: studentProfile, isLoading: profileLoading } = useStudentProfile();
  
  // Fetch bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings({
    limit: 10,
    sortBy: "startAt",
    sortOrder: "asc",
  });

  const { data: upcomingBookingsData } = useBookings({
    status: ["PENDING", "CONFIRMED"],
    limit: 5,
    sortBy: "startAt",
    sortOrder: "asc",
  });

  const { data: completedBookingsData } = useBookings({
    status: ["COMPLETED"],
    limit: 5,
    sortBy: "startAt",
    sortOrder: "desc",
  });

  // Booking mutations
  const updateBookingMutation = useUpdateBookingStatus();
  const cancelBookingMutation = useCancelBooking();

  // Extract data with fallbacks
  const bookings = bookingsData?.data || [];
  const upcomingBookings = upcomingBookingsData?.data || [];
  const completedBookings = completedBookingsData?.data || [];

  // Get profile info
  const student = {
    name: studentProfile ? `${studentProfile.firstName} ${studentProfile.lastName}` : "Student",
    avatar: studentProfile?.avatar || "/placeholder.svg",
    timezone: studentProfile?.timezone || "Asia/Tashkent",
    preferredLanguages: studentProfile?.preferredLanguages || ["uz"],
  };

  // Statistics
  const stats = {
    totalLessons: completedBookings.length,
    upcomingLessons: upcomingBookings.length,
    totalSpent: completedBookings.reduce((sum, booking) => sum + (booking.priceAtBooking || 0), 0),
    averageRating: 4.8, // This would come from your reviews
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBookingMutation.mutateAsync({
        id: bookingId,
        reason: "Student requested cancellation",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleJoinLesson = (booking: Booking) => {
    // In a real app, this would open the video call or redirect to lesson room
    toast({
      title: "Joining lesson...",
      description: `Opening lesson with ${booking.teacher?.firstName}`,
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {student.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/find-teachers")}>
            <Search className="h-4 w-4 mr-2" />
            Find Teachers
          </Button>
          <Button variant="outline" onClick={() => navigate("/student-profile")}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Lessons</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSection("bookings")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No upcoming lessons
              </h3>
              <p className="text-gray-600 mb-4">
                Book your first lesson to get started
              </p>
              <Button onClick={() => navigate("/find-teachers")}>
                Find Teachers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={booking.teacher?.avatar || "/placeholder.svg"}
                        alt={`${booking.teacher?.firstName} ${booking.teacher?.lastName}`}
                      />
                      <AvatarFallback>
                        {booking.teacher?.firstName?.[0]}{booking.teacher?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {booking.teacher?.firstName} {booking.teacher?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {booking.subjectOffering?.subjectName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimezone(booking.startAt, student.timezone)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={booking.status === "CONFIRMED" ? "default" : "secondary"}
                    >
                      {booking.status.toLowerCase()}
                    </Badge>
                    {booking.status === "CONFIRMED" && (
                      <Button size="sm" onClick={() => handleJoinLesson(booking)}>
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelBookingMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Lessons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Lessons</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveSection("history")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {completedBookings.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No completed lessons yet
              </h3>
              <p className="text-gray-600">
                Your lesson history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={booking.teacher?.avatar || "/placeholder.svg"}
                        alt={`${booking.teacher?.firstName} ${booking.teacher?.lastName}`}
                      />
                      <AvatarFallback>
                        {booking.teacher?.firstName?.[0]}{booking.teacher?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {booking.teacher?.firstName} {booking.teacher?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {booking.subjectOffering?.subjectName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTimezone(booking.startAt, student.timezone)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Completed</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/review-teacher?bookingId=${booking.id}`)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Other render methods would be similar, using real data instead of mock data
  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Button onClick={() => navigate("/find-teachers")}>
          <Plus className="h-4 w-4 mr-2" />
          Book New Lesson
        </Button>
      </div>

      <div className="space-y-4">
        {bookingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Book your first lesson with a qualified teacher
              </p>
              <Button onClick={() => navigate("/find-teachers")}>
                Find Teachers
              </Button>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={booking.teacher?.avatar || "/placeholder.svg"}
                        alt={`${booking.teacher?.firstName} ${booking.teacher?.lastName}`}
                      />
                      <AvatarFallback>
                        {booking.teacher?.firstName?.[0]}{booking.teacher?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.teacher?.firstName} {booking.teacher?.lastName}
                      </h3>
                      <p className="text-gray-600">
                        {booking.subjectOffering?.subjectName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimezone(booking.startAt, student.timezone)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {formatPrice(booking.priceAtBooking)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        booking.status === "CONFIRMED" ? "default" :
                        booking.status === "PENDING" ? "secondary" :
                        booking.status === "COMPLETED" ? "outline" : "destructive"
                      }
                    >
                      {booking.status.toLowerCase()}
                    </Badge>
                    
                    {booking.status === "CONFIRMED" && (
                      <Button onClick={() => handleJoinLesson(booking)}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Lesson
                      </Button>
                    )}
                    
                    {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                      <Button
                        variant="outline"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelBookingMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    {booking.status === "COMPLETED" && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/review-teacher?bookingId=${booking.id}`)}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  if (userLoading || profileLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">{renderOverview()}</TabsContent>
            <TabsContent value="bookings">{renderBookings()}</TabsContent>
            <TabsContent value="history">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Lesson history coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Payment history coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="profile">
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Profile management coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
