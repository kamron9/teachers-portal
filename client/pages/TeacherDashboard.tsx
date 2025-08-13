import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, User, Calendar, BookOpen, DollarSign, Star, Settings, 
  Bell, MessageCircle, Video, Clock, TrendingUp, Users, CheckCircle, 
  AlertCircle, ChevronRight, Play, Download, MoreHorizontal, Edit3, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  count?: number;
}

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

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
    totalEarnings: 17000000,
    pendingBookings: 3,
    unreadMessages: 5
  };

  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile Management", icon: User },
    { id: "schedule", label: "Schedule & Availability", icon: Calendar },
    { id: "bookings", label: "Bookings & Lessons", icon: BookOpen, count: teacher.pendingBookings },
    { id: "earnings", label: "Earnings & Payments", icon: DollarSign },
    { id: "reviews", label: "Reviews & Ratings", icon: Star },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  // Mock upcoming lessons
  const upcomingLessons = [
    {
      id: 1,
      student: { name: "John Doe", image: "/placeholder.svg" },
      date: "2024-01-20",
      time: "14:00",
      duration: 60,
      type: "IELTS Preparation",
      status: "confirmed",
      meetingLink: "https://meet.tutoruz.com/room123"
    },
    {
      id: 2,
      student: { name: "Sarah Smith", image: "/placeholder.svg" },
      date: "2024-01-20",
      time: "16:00",
      duration: 30,
      type: "Trial Lesson",
      status: "pending",
      meetingLink: null
    }
  ];

  // Mock recent bookings
  const recentBookings = [
    {
      id: 1,
      student: { name: "Maria Garcia", image: "/placeholder.svg" },
      requestedDate: "2024-01-22",
      requestedTime: "15:00",
      type: "English Conversation",
      status: "pending",
      bookedAt: "2024-01-19T10:30:00"
    },
    {
      id: 2,
      student: { name: "David Wilson", image: "/placeholder.svg" },
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
    totalPending: 275000,
    recentPayments: [
      { date: "2024-01-15", amount: 350000, student: "John Doe", type: "Lesson Payment" },
      { date: "2024-01-12", amount: 175000, student: "Sarah Smith", type: "Package Payment" }
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {teacher.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Here's what's happening with your teaching today</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setActiveSection("schedule")}>
            <Calendar className="h-4 w-4 mr-2" />
            Manage Schedule
          </Button>
          <Button variant="outline" onClick={() => setActiveSection("profile")}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {teacher.profileCompletion < 100 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-amber-900">Complete your profile to get more bookings</div>
                  <div className="text-sm text-amber-700">Your profile is {teacher.profileCompletion}% complete</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveSection("profile")}>
                Complete Profile
              </Button>
            </div>
            <Progress value={teacher.profileCompletion} className="mt-3" />
          </CardContent>
        </Card>
      )}

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
            <div className="text-3xl font-bold text-primary mb-2">{teacher.rating}</div>
            <div className="text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {(teacher.totalEarnings / 1000000).toFixed(1)}M
            </div>
            <div className="text-gray-600">Total Earnings</div>
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
            <Button variant="ghost" size="sm" onClick={() => setActiveSection("schedule")}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingLessons.length > 0 ? (
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={lesson.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
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
              <Button className="mt-4" onClick={() => setActiveSection("schedule")}>
                Set Your Availability
              </Button>
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
              <span className="font-semibold">96%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="font-semibold">2 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New Students</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Earnings</span>
              <span className="font-semibold text-green-600">
                {(earningsData.thisMonth / 1000000).toFixed(1)}M UZS
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPlaceholderSection = (title: string, description: string) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            This feature is under development and will be available soon.
          </p>
          <Button variant="outline" onClick={() => setActiveSection("overview")}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "profile":
        return renderPlaceholderSection("Profile Management", "Manage your teaching profile, bio, subjects, and qualifications");
      case "schedule":
        return renderPlaceholderSection("Schedule & Availability", "Set your availability and manage your teaching schedule");
      case "bookings":
        return renderPlaceholderSection("Bookings & Lessons", "Manage student bookings and upcoming lessons");
      case "earnings":
        return renderPlaceholderSection("Earnings & Payments", "Track your earnings and payment history");
      case "reviews":
        return renderPlaceholderSection("Reviews & Ratings", "Monitor student reviews and ratings");
      case "settings":
        return renderPlaceholderSection("Settings", "Manage your account settings and preferences");
      default:
        return renderOverview();
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
              <AvatarImage src={teacher.image} alt={teacher.name} />
              <AvatarFallback>
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{teacher.name}</div>
              <div className="text-sm text-gray-600">{teacher.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className={`w-2 h-2 rounded-full ${teacher.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {teacher.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
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
              <DropdownMenuItem onClick={() => setActiveSection("profile")}>
                <User className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveSection("settings")}>
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
              <h2 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {teacher.unreadMessages > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {teacher.unreadMessages}
                  </Badge>
                )}
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
