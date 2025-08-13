import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Calendar, BookOpen, DollarSign, Star, Settings,
  Bell, MessageCircle, Video, Clock, TrendingUp, Users, CheckCircle,
  AlertCircle, ChevronRight, Play, Download, MoreHorizontal, Edit3, LogOut,
  Camera, Upload, Award, GraduationCap, Plus, Minus, ChevronLeft, ChevronDown,
  Eye, Filter, Search, RefreshCw, Printer, Globe, Save, X, Check, AlertTriangle,
  BarChart3, PieChart, Calendar as CalendarIcon, Timer, MapPin, Phone, Mail,
  ZoomIn, ZoomOut, Grid3X3, List, Sun, Moon, Coffee, BookOpenCheck
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

  // Profile management state - moved to top level to follow Rules of Hooks
  const [isEditing, setIsEditing] = useState(false);

  // Schedule management state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [scheduleTemplate, setScheduleTemplate] = useState('default');
  const [autoApproval, setAutoApproval] = useState(false);
  const [minAdvanceBooking, setMinAdvanceBooking] = useState('2h');
  const [maxFutureBooking, setMaxFutureBooking] = useState('1m');
  const [bufferTime, setBufferTime] = useState(15);
  const [maxLessonsPerDay, setMaxLessonsPerDay] = useState(8);
  const [defaultLessonDuration, setDefaultLessonDuration] = useState(60);
  const [weeklyAvailability, setWeeklyAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00', breaks: [] },
    tuesday: { enabled: true, start: '09:00', end: '17:00', breaks: [] },
    wednesday: { enabled: true, start: '09:00', end: '17:00', breaks: [] },
    thursday: { enabled: true, start: '09:00', end: '17:00', breaks: [] },
    friday: { enabled: true, start: '09:00', end: '17:00', breaks: [] },
    saturday: { enabled: false, start: '10:00', end: '16:00', breaks: [] },
    sunday: { enabled: false, start: '10:00', end: '16:00', breaks: [] }
  });
  const [profileData, setProfileData] = useState({
    firstName: "Aziza",
    lastName: "Karimova",
    email: "aziza@example.com",
    phone: "+998901234567",
    location: "Tashkent, Uzbekistan",
    title: "English Language Expert & IELTS Specialist",
    bio: "Certified English teacher with extensive experience in IELTS preparation and business communication. I help students achieve their language goals through personalized lessons and proven methodologies.",
    experience: "5+ years",
    education: "Masters in English Literature - National University of Uzbekistan\nTESOL Certification - British Council\nIELTS Teacher Training Certificate",
    subjects: ["English", "IELTS", "Business English", "Conversation Practice"],
    hourlyRate: "50000",
    languages: ["Uzbek", "English", "Russian"]
  });
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const renderProfileManagement = () => {
    const profileCompletion = 85;
    const subjects = [
      'Mathematics', 'English', 'Programming', 'Physics', 'Chemistry', 'Biology',
      'History', 'Geography', 'Literature', 'Music', 'Art', 'Economics', 'Psychology'
    ];
    const languages = ['Uzbek', 'English', 'Russian', 'Arabic', 'Turkish', 'Korean', 'Chinese', 'French', 'German', 'Spanish'];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
            <p className="text-gray-600">Manage your teaching profile, bio, subjects, and qualifications</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={() => { setIsEditing(false); setHasUnsavedChanges(false); }}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-blue-900">Profile Completion</div>
                <div className="text-sm text-blue-700">{profileCompletion}% complete</div>
              </div>
              <Badge variant="outline" className="bg-white">
                {profileCompletion >= 90 ? 'Excellent' : profileCompletion >= 70 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
            <Progress value={profileCompletion} className="h-2" />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="text-xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                )}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name *</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setProfileData(prev => ({...prev, firstName: e.target.value}));
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name *</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setProfileData(prev => ({...prev, lastName: e.target.value}));
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profileData.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profileData.phone}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setProfileData(prev => ({...prev, phone: e.target.value}));
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Title *</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profileData.title}
                disabled={!isEditing}
                placeholder="e.g., English Language Expert & IELTS Specialist"
                onChange={(e) => {
                  setProfileData(prev => ({...prev, title: e.target.value}));
                  setHasUnsavedChanges(true);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Professional Bio & Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Bio *</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profileData.bio}
                disabled={!isEditing}
                placeholder="Tell students about your teaching experience, methodology, and what makes you a great teacher..."
                onChange={(e) => {
                  setProfileData(prev => ({...prev, bio: e.target.value}));
                  setHasUnsavedChanges(true);
                }}
              />
              <div className="text-xs text-gray-500">{profileData.bio.length}/500 characters</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Education & Certifications *</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profileData.education}
                disabled={!isEditing}
                placeholder="List your education background and certifications..."
                onChange={(e) => {
                  setProfileData(prev => ({...prev, education: e.target.value}));
                  setHasUnsavedChanges(true);
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Teaching Experience</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profileData.experience}
                disabled={!isEditing}
                onChange={(e) => {
                  setProfileData(prev => ({...prev, experience: e.target.value}));
                  setHasUnsavedChanges(true);
                }}
              >
                <option value="0-1">Less than 1 year</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Video Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Video Introduction</h3>
              <p className="text-gray-600 mb-4">
                Help students get to know you with a 2-3 minute introduction video
              </p>
              {isEditing ? (
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  No video uploaded
                </Button>
              )}
              <div className="text-xs text-gray-500 mt-3">
                • Max file size: 50MB • Formats: MP4, MOV • Recommended: 2-3 minutes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Subjects & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Languages You Teach In</label>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Badge
                    key={language}
                    variant={profileData.languages.includes(language) ? "default" : "outline"}
                    className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Subjects You Teach</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant={profileData.subjects.includes(subject) ? "default" : "outline"}
                    className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hourly Rate (UZS)</label>
              <div className="relative">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-12"
                  type="number"
                  value={profileData.hourlyRate}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setProfileData(prev => ({...prev, hourlyRate: e.target.value}));
                    setHasUnsavedChanges(true);
                  }}
                />
                <span className="absolute right-3 top-3 text-sm text-gray-500">UZS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifications & Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Qualifications & Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">Upload Certificates & Documents</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upload teaching certificates, degrees, and other qualifications
                </p>
                {isEditing ? (
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                ) : (
                  <div className="text-sm text-gray-500">No documents uploaded</div>
                )}
                <div className="text-xs text-gray-500 mt-3">
                  Supported formats: PDF, JPG, PNG • Max size: 10MB per file
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Status */}
        {hasUnsavedChanges && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center text-amber-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">You have unsaved changes</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Mock schedule data
  const mockBookings = [
    {
      id: 1,
      date: '2024-01-20',
      time: '14:00',
      duration: 60,
      student: { name: 'John Doe', image: '/placeholder.svg', phone: '+998901234567' },
      subject: 'IELTS Preparation',
      status: 'confirmed',
      type: 'regular',
      rate: 50000
    },
    {
      id: 2,
      date: '2024-01-20',
      time: '16:00',
      duration: 30,
      student: { name: 'Sarah Smith', image: '/placeholder.svg', phone: '+998901234568' },
      subject: 'Trial Lesson',
      status: 'pending',
      type: 'trial',
      rate: 25000
    },
    {
      id: 3,
      date: '2024-01-21',
      time: '10:00',
      duration: 90,
      student: { name: 'Ahmad Karim', image: '/placeholder.svg', phone: '+998901234569' },
      subject: 'Business English',
      status: 'confirmed',
      type: 'regular',
      rate: 75000
    }
  ];

  const scheduleAnalytics = {
    bookingRate: 78,
    peakHours: ['14:00-16:00', '19:00-21:00'],
    utilizationRate: 65,
    avgBookingAdvance: '2.5 days',
    monthlyProjection: 2850000,
    popularTimeSlots: ['10:00', '14:00', '16:00', '19:00']
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getBookingForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockBookings.find(booking =>
      booking.date === dateStr && booking.time === time
    );
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayAvailability = weeklyAvailability[dayName as keyof typeof weeklyAvailability];

    if (!dayAvailability?.enabled) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const [startHours, startMinutes] = dayAvailability.start.split(':').map(Number);
    const [endHours, endMinutes] = dayAvailability.end.split(':').map(Number);
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  };

  const renderScheduleManagement = () => {
    const timeSlots = generateTimeSlots();
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Availability</h1>
            <p className="text-gray-600">Set your availability and manage your teaching schedule</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAvailabilityModal(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Set Availability
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Break
            </Button>
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              View Bookings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{scheduleAnalytics.bookingRate}%</div>
                  <div className="text-sm text-gray-600">Booking Rate</div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{scheduleAnalytics.utilizationRate}%</div>
                  <div className="text-sm text-gray-600">Utilization</div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{mockBookings.filter(b => b.status === 'pending').length}</div>
                  <div className="text-sm text-gray-600">Pending Bookings</div>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {(scheduleAnalytics.monthlyProjection / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">Monthly Projection</div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      if (calendarView === 'month') {
                        newDate.setMonth(newDate.getMonth() - 1);
                      } else if (calendarView === 'week') {
                        newDate.setDate(newDate.getDate() - 7);
                      } else {
                        newDate.setDate(newDate.getDate() - 1);
                      }
                      setCurrentDate(newDate);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      if (calendarView === 'month') {
                        newDate.setMonth(newDate.getMonth() + 1);
                      } else if (calendarView === 'week') {
                        newDate.setDate(newDate.getDate() + 7);
                      } else {
                        newDate.setDate(newDate.getDate() + 1);
                      }
                      setCurrentDate(newDate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold">
                    {currentDate.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                      ...(calendarView !== 'month' && { day: 'numeric' })
                    })}
                  </h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex border rounded-lg p-1">
                  {(['month', 'week', 'day'] as const).map((view) => (
                    <Button
                      key={view}
                      variant={calendarView === view ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCalendarView(view)}
                      className="capitalize"
                    >
                      {view}
                    </Button>
                  ))}
                </div>

                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Display */}
        {calendarView === 'month' && (
          <Card>
            <CardContent className="p-0">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-4 text-center font-medium text-gray-600 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              <div className="grid grid-cols-7">
                {daysInMonth.map((day, index) => {
                  const isToday = day && day.toDateString() === today.toDateString();
                  const dayBookings = day ? mockBookings.filter(booking =>
                    booking.date === day.toISOString().split('T')[0]
                  ) : [];

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] border-r border-b p-2 ${
                        !day ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'
                      } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-2 ${
                            isToday ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayBookings.slice(0, 3).map((booking) => (
                              <div
                                key={booking.id}
                                className={`text-xs p-1 rounded truncate ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {booking.time} - {booking.student.name}
                              </div>
                            ))}
                            {dayBookings.length > 3 && (
                              <div className="text-xs text-gray-500 font-medium">
                                +{dayBookings.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Day/Week View */}
        {(calendarView === 'day' || calendarView === 'week') && (
          <Card>
            <CardContent className="p-0">
              <div className="flex">
                {/* Time column */}
                <div className="w-20 border-r">
                  <div className="h-12 border-b"></div>
                  {timeSlots.filter((_, index) => index % 2 === 0).map((time) => (
                    <div key={time} className="h-16 border-b flex items-center justify-center text-sm text-gray-600">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 h-12 border-b">
                    <div className="flex items-center justify-center font-medium">
                      {formatDate(currentDate)}
                    </div>
                  </div>

                  <div className="relative">
                    {timeSlots.filter((_, index) => index % 2 === 0).map((time, index) => {
                      const booking = getBookingForSlot(currentDate, time);
                      const isAvailable = isTimeSlotAvailable(currentDate, time);

                      return (
                        <div
                          key={time}
                          className={`h-16 border-b flex items-center px-4 cursor-pointer ${
                            booking
                              ? booking.status === 'confirmed'
                                ? 'bg-blue-100 hover:bg-blue-200'
                                : 'bg-yellow-100 hover:bg-yellow-200'
                              : isAvailable
                              ? 'hover:bg-green-50'
                              : 'bg-gray-50'
                          }`}
                        >
                          {booking ? (
                            <div className="flex-1">
                              <div className="font-medium text-sm">{booking.student.name}</div>
                              <div className="text-xs text-gray-600">{booking.subject}</div>
                              <Badge
                                variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {booking.status}
                              </Badge>
                            </div>
                          ) : isAvailable ? (
                            <div className="text-sm text-gray-500">Available</div>
                          ) : (
                            <div className="text-sm text-gray-400">Unavailable</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Bookings
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={booking.student.image} alt={booking.student.name} />
                        <AvatarFallback>
                          {booking.student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{booking.student.name}</div>
                        <div className="text-sm text-gray-600">{booking.subject}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.time} ({booking.duration} min)
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {booking.rate.toLocaleString()} UZS
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </Badge>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Call Student
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Schedule Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peak Hours</span>
                <div className="flex gap-2">
                  {scheduleAnalytics.peakHours.map((hour) => (
                    <Badge key={hour} variant="outline">{hour}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Booking Advance</span>
                <span className="font-semibold">{scheduleAnalytics.avgBookingAdvance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilization Rate</span>
                <span className="font-semibold text-green-600">{scheduleAnalytics.utilizationRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Popular Time Slots</span>
                <div className="flex gap-1">
                  {scheduleAnalytics.popularTimeSlots.slice(0, 3).map((slot) => (
                    <Badge key={slot} variant="secondary" className="text-xs">{slot}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-approve bookings</div>
                  <div className="text-sm text-gray-600">Automatically accept bookings from regular students</div>
                </div>
                <Button
                  variant={autoApproval ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoApproval(!autoApproval)}
                >
                  {autoApproval ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum advance booking</label>
                <select
                  value={minAdvanceBooking}
                  onChange={(e) => setMinAdvanceBooking(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="2h">2 hours</option>
                  <option value="4h">4 hours</option>
                  <option value="24h">24 hours</option>
                  <option value="48h">48 hours</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Buffer time between lessons</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={bufferTime}
                    onChange={(e) => setBufferTime(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{bufferTime} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Settings Modal */}
        {showAvailabilityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Set Weekly Availability</h2>
                <Button variant="outline" size="sm" onClick={() => setShowAvailabilityModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(weeklyAvailability).map(([day, schedule]) => (
                  <div key={day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={(e) => {
                            setWeeklyAvailability(prev => ({
                              ...prev,
                              [day]: { ...prev[day as keyof typeof prev], enabled: e.target.checked }
                            }));
                          }}
                          className="w-4 h-4"
                        />
                        <span className="font-medium capitalize">{day}</span>
                      </div>
                    </div>

                    {schedule.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Start Time</label>
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => {
                              setWeeklyAvailability(prev => ({
                                ...prev,
                                [day]: { ...prev[day as keyof typeof prev], start: e.target.value }
                              }));
                            }}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">End Time</label>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => {
                              setWeeklyAvailability(prev => ({
                                ...prev,
                                [day]: { ...prev[day as keyof typeof prev], end: e.target.value }
                              }));
                            }}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowAvailabilityModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAvailabilityModal(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Availability
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
        return renderProfileManagement();
      case "schedule":
        return renderScheduleManagement();
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
