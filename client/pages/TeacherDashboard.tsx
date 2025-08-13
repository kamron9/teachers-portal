import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Video, MessageCircle, Star, BookOpen, User, DollarSign, ChevronRight, Play, TrendingUp, Users, CheckCircle, AlertCircle, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function TeacherDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock teacher data
  const teacher = {
    name: "Aziza Karimova",
    email: "aziza@example.com",
    image: "/placeholder.svg",
    title: "English Language Expert",
    joinDate: "2024-01-01",
    isOnline: true,
    profileCompletion: 85,
    rating: 4.9,
    totalStudents: 89,
    totalLessons: 340,
    totalEarnings: 17000000
  };

  // Mock upcoming lessons
  const upcomingLessons = [
    {
      id: 1,
      student: {
        name: "John Doe",
        image: "/placeholder.svg"
      },
      date: "2024-01-20",
      time: "14:00",
      duration: 60,
      type: "IELTS Preparation",
      status: "confirmed",
      isFirstLesson: false,
      meetingLink: "https://meet.tutoruz.com/room123"
    },
    {
      id: 2,
      student: {
        name: "Sarah Smith",
        image: "/placeholder.svg"
      },
      date: "2024-01-20",
      time: "16:00",
      duration: 30,
      type: "Trial Lesson",
      status: "pending",
      isFirstLesson: true,
      meetingLink: null
    },
    {
      id: 3,
      student: {
        name: "Ahmad Hassan",
        image: "/placeholder.svg"
      },
      date: "2024-01-21",
      time: "10:00",
      duration: 60,
      type: "Business English",
      status: "confirmed",
      isFirstLesson: false,
      meetingLink: "https://meet.tutoruz.com/room124"
    }
  ];

  // Mock recent bookings
  const recentBookings = [
    {
      id: 4,
      student: {
        name: "Maria Garcia",
        image: "/placeholder.svg"
      },
      requestedDate: "2024-01-22",
      requestedTime: "15:00",
      type: "English Conversation",
      status: "pending",
      bookedAt: "2024-01-19T10:30:00"
    },
    {
      id: 5,
      student: {
        name: "David Wilson",
        image: "/placeholder.svg"
      },
      requestedDate: "2024-01-23",
      requestedTime: "14:00",
      type: "IELTS Speaking",
      status: "pending",
      bookedAt: "2024-01-19T09:15:00"
    }
  ];

  // Mock earnings data
  const earningsData = {
    thisWeek: 450000,
    thisMonth: 1800000,
    lastMonth: 1650000,
    totalPending: 275000,
    recentPayments: [
      { date: "2024-01-15", amount: 350000, student: "John Doe", type: "Lesson Payment" },
      { date: "2024-01-12", amount: 175000, student: "Sarah Smith", type: "Package Payment" },
      { date: "2024-01-10", amount: 125000, student: "Ahmad Hassan", type: "Trial Lesson" }
    ]
  };

  // Mock reviews
  const recentReviews = [
    {
      id: 1,
      student: "John Doe",
      rating: 5,
      comment: "Excellent teacher! Very patient and explains concepts clearly.",
      date: "2024-01-18",
      lesson: "IELTS Preparation"
    },
    {
      id: 2,
      student: "Sarah Smith",
      rating: 5,
      comment: "Great first lesson. Looking forward to more sessions!",
      date: "2024-01-17",
      lesson: "Trial Lesson"
    }
  ];

  // Mock statistics
  const stats = {
    weeklyHours: 18,
    completionRate: 96,
    responseTime: "2 hours",
    reschedulingRate: 8,
    newStudentsThisMonth: 12
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={teacher.image} alt={teacher.name} />
                  <AvatarFallback className="text-xl">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {teacher.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {teacher.name.split(' ')[0]}!</h1>
                <p className="text-gray-600">{teacher.title}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{teacher.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">{teacher.totalStudents} students</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/teacher-schedule">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Button>
              </Link>
              <Link to="/teacher-profile">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile Completion Alert */}
          {teacher.profileCompletion < 100 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-amber-900">Complete your profile to get more bookings</div>
                      <div className="text-sm text-amber-700">Your profile is {teacher.profileCompletion}% complete</div>
                    </div>
                  </div>
                  <Link to="/teacher-profile">
                    <Button variant="outline" size="sm">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
                <Progress value={teacher.profileCompletion} className="mt-3" />
              </CardContent>
            </Card>
          )}

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{teacher.totalLessons}</div>
                    <div className="text-gray-600">Total Lessons</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{teacher.totalStudents}</div>
                    <div className="text-gray-600">Students Taught</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats.weeklyHours}h</div>
                    <div className="text-gray-600">This Week</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{teacher.rating}</div>
                    <div className="text-gray-600">Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Lessons
                    </span>
                    <Link to="/teacher-schedule">
                      <Button variant="ghost" size="sm">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingLessons.filter(lesson => lesson.date === "2024-01-20").length > 0 ? (
                    <div className="space-y-4">
                      {upcomingLessons.filter(lesson => lesson.date === "2024-01-20").map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={lesson.student.image} alt={lesson.student.name} />
                              <AvatarFallback>
                                {lesson.student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{lesson.student.name}</div>
                              <div className="text-sm text-gray-600">{lesson.type}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.time} ({lesson.duration} min)</span>
                                {lesson.isFirstLesson && (
                                  <Badge variant="secondary">First Lesson</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(lesson.status)}>
                              {lesson.status}
                            </Badge>
                            {lesson.meetingLink && (
                              <Button size="sm">
                                <Video className="h-4 w-4 mr-2" />
                                Join
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No lessons scheduled for today</p>
                      <Link to="/teacher-schedule">
                        <Button className="mt-4">Set Your Availability</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Booking Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={booking.student.image} alt={booking.student.name} />
                              <AvatarFallback>
                                {booking.student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{booking.student.name}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(booking.requestedDate).toLocaleDateString()} at {booking.requestedTime}
                              </div>
                              <div className="text-xs text-gray-500">{booking.type}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Decline</Button>
                            <Button size="sm">Accept</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">{stats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold">{stats.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Students</span>
                      <span className="font-semibold">{stats.newStudentsThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reschedule Rate</span>
                      <span className="font-semibold">{stats.reschedulingRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Lessons ({upcomingLessons.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingLessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={lesson.student.image} alt={lesson.student.name} />
                                <AvatarFallback>
                                  {lesson.student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{lesson.student.name}</div>
                                <div className="text-sm text-gray-600">{lesson.type}</div>
                                {lesson.isFirstLesson && (
                                  <Badge variant="secondary" className="mt-1">First Lesson</Badge>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(lesson.status)}>
                              {lesson.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(lesson.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.time} ({lesson.duration} min)</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              {lesson.meetingLink && (
                                <Button size="sm">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Lesson
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Booking Requests ({recentBookings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={booking.student.image} alt={booking.student.name} />
                              <AvatarFallback>
                                {booking.student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{booking.student.name}</div>
                              <div className="text-sm text-gray-600">{booking.type}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Requested: {new Date(booking.requestedDate).toLocaleDateString()} at {booking.requestedTime}
                              </div>
                              <div className="text-xs text-gray-400">
                                Booked {new Date(booking.bookedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Decline
                            </Button>
                            <Button size="sm">
                              Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {earningsData.thisWeek.toLocaleString()} UZS
                    </div>
                    <div className="text-gray-600">This Week</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {earningsData.thisMonth.toLocaleString()} UZS
                    </div>
                    <div className="text-gray-600">This Month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-2">
                      {earningsData.totalPending.toLocaleString()} UZS
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {earningsData.recentPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{payment.student}</div>
                          <div className="text-sm text-gray-600">{payment.type}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            +{payment.amount.toLocaleString()} UZS
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{teacher.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600">Based on {teacher.totalLessons} lessons</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{review.student}</div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                          <div className="text-xs text-gray-500">
                            {review.lesson} • {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
