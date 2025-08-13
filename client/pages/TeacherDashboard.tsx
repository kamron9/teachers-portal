import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Calendar, BookOpen, DollarSign, Star, Settings,
  Bell, MessageCircle, Video, Clock, TrendingUp, Users, CheckCircle,
  AlertCircle, ChevronRight, Play, Download, MoreHorizontal, Edit3, LogOut,
  Camera, Upload, Award, GraduationCap
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
    const [isEditing, setIsEditing] = useState(false);
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
