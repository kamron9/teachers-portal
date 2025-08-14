import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, Calendar, History, CreditCard, Star, Settings,
  User, BookOpen, Filter, MapPin, Clock, DollarSign, Heart, MessageCircle,
  Phone, Mail, ChevronRight, Award, CheckCircle, AlertCircle, Eye, Edit3,
  LogOut, Upload, Plus, X, Download, Video, Bell, Users, TrendingUp
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
  count?: number;
}

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  // Profile management state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+998901234567",
    location: "Tashkent, Uzbekistan",
    dateOfBirth: "1995-06-15",
    bio: "Passionate language learner focused on improving my English and IELTS preparation.",
    learningGoals: "IELTS 7.0 band score, Business English fluency",
    preferredLanguages: ["English", "Uzbek"],
    subjects: ["English", "IELTS", "Business English"]
  });
  const [profileImage, setProfileImage] = useState("/placeholder.svg");

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [priceRange, setPriceRange] = useState([10000, 100000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

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

  // Mock data for teachers
  const featuredTeachers = [
    {
      id: 1,
      name: "Aziza Karimova",
      image: "/placeholder.svg",
      rating: 4.9,
      totalStudents: 89,
      subject: "English & IELTS",
      hourlyRate: 50000,
      experience: "5+ years",
      verified: true,
      online: true,
      location: "Tashkent",
      bio: "Certified English teacher specializing in IELTS preparation with 5+ years of experience.",
      languages: ["English", "Uzbek", "Russian"],
      availability: "Available today"
    },
    {
      id: 2,
      name: "Bobur Umarov",
      image: "/placeholder.svg",
      rating: 4.8,
      totalStudents: 67,
      subject: "Mathematics",
      hourlyRate: 45000,
      experience: "4+ years",
      verified: true,
      online: false,
      location: "Samarkand",
      bio: "Mathematics expert helping students excel in algebra, geometry, and calculus.",
      languages: ["Uzbek", "Russian"],
      availability: "Tomorrow 9 AM"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      image: "/placeholder.svg",
      rating: 5.0,
      totalStudents: 45,
      subject: "Business English",
      hourlyRate: 65000,
      experience: "3+ years",
      verified: true,
      online: true,
      location: "Tashkent",
      bio: "Native English speaker specializing in business communication and presentation skills.",
      languages: ["English"],
      availability: "Available now"
    }
  ];

  // Mock bookings data
  const upcomingBookings = [
    {
      id: 1,
      teacher: { name: "Aziza Karimova", image: "/placeholder.svg" },
      subject: "English Conversation",
      date: "2024-01-20",
      time: "14:00",
      duration: 60,
      status: "confirmed",
      meetingLink: "https://meet.tutoruz.com/room123",
      price: 50000
    },
    {
      id: 2,
      teacher: { name: "Bobur Umarov", image: "/placeholder.svg" },
      subject: "Mathematics",
      date: "2024-01-21",
      time: "16:00",
      duration: 90,
      status: "pending",
      meetingLink: null,
      price: 67500
    }
  ];

  const lessonHistory = [
    {
      id: 1,
      teacher: { name: "Aziza Karimova", image: "/placeholder.svg" },
      subject: "IELTS Preparation",
      date: "2024-01-18",
      time: "14:00",
      duration: 60,
      status: "completed",
      rating: 5,
      review: "Excellent lesson! Very helpful with IELTS speaking practice.",
      price: 50000,
      materials: ["Grammar exercises", "Speaking topics"]
    },
    {
      id: 2,
      teacher: { name: "Sarah Johnson", image: "/placeholder.svg" },
      subject: "Business English",
      date: "2024-01-15",
      time: "10:00",
      duration: 45,
      status: "completed",
      rating: 5,
      review: "Great business English session with practical examples.",
      price: 48750,
      materials: ["Business vocabulary", "Email templates"]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setActiveSection("find-teachers")}>
            <Search className="h-4 w-4 mr-2" />
            Find Teachers
          </Button>
          <Button variant="outline" onClick={() => setActiveSection("profile")}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {student.profileCompletion < 100 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-amber-900">Complete your profile</div>
                  <div className="text-sm text-amber-700">Your profile is {student.profileCompletion}% complete</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveSection("profile")}>
                Complete Profile
              </Button>
            </div>
            <Progress value={student.profileCompletion} className="mt-3" />
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{student.totalLessons}</div>
            <div className="text-gray-600">Total Lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{student.favoriteTeachers}</div>
            <div className="text-gray-600">Favorite Teachers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{upcomingBookings.length}</div>
            <div className="text-gray-600">Upcoming Lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9</div>
            <div className="text-gray-600">Avg. Rating Given</div>
          </CardContent>
        </Card>
      </div>

      {/* Next Lesson */}
      {student.nextLesson && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div>
                <div className="font-semibold text-lg">{student.nextLesson.subject}</div>
                <div className="text-gray-600">with {student.nextLesson.teacher}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(student.nextLesson.date).toLocaleDateString()} at {student.nextLesson.time}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button>
                  <Video className="h-4 w-4 mr-2" />
                  Join Lesson
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Teachers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Teachers
            </span>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection("find-teachers")}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTeachers.slice(0, 3).map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={teacher.image} alt={teacher.name} />
                        <AvatarFallback>
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {teacher.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        {teacher.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{teacher.subject}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm">{teacher.rating}</span>
                        <span className="text-xs text-gray-500">({teacher.totalStudents} students)</span>
                      </div>
                      <div className="text-sm font-semibold text-primary mt-1">
                        {teacher.hourlyRate.toLocaleString()} UZS/hour
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1">
                      Book Lesson
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={booking.teacher.image} alt={booking.teacher.name} />
                      <AvatarFallback>
                        {booking.teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.teacher.name}</div>
                      <div className="text-sm text-gray-600">{booking.subject}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </div>
                    </div>
                  </div>
                  <Badge className={booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">English Level</span>
              <span className="font-semibold">Intermediate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hours This Month</span>
              <span className="font-semibold">12.5 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Goal Progress</span>
              <span className="font-semibold text-green-600">75%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Favorite Subject</span>
              <span className="font-semibold">IELTS Preparation</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFindTeachers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Teachers</h1>
          <p className="text-gray-600">Discover expert teachers for your learning goals</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers by name, subject, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Subjects</option>
                  <option value="english">English</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="ielts">IELTS</option>
                  <option value="business">Business English</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Price Range (UZS)</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="all">Any Price</option>
                  <option value="low">10,000 - 30,000</option>
                  <option value="medium">30,000 - 60,000</option>
                  <option value="high">60,000+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="all">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="all">Any Time</option>
                  <option value="today">Available Today</option>
                  <option value="week">This Week</option>
                  <option value="online">Online Now</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={teacher.image} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {teacher.online && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{teacher.name}</h3>
                    {teacher.verified && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="text-gray-600 mb-2">{teacher.subject}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{teacher.rating}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{teacher.totalStudents} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{teacher.location}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{teacher.bio}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Experience:</span>
                  <span className="font-medium">{teacher.experience}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Languages:</span>
                  <span className="text-sm">{teacher.languages.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">{teacher.hourlyRate.toLocaleString()} UZS/hour</span>
                  <Badge variant="outline" className="text-green-600">
                    {teacher.availability}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">
                  Book Lesson
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {!isEditingProfile ? (
            <Button onClick={() => setIsEditingProfile(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditingProfile(false)}>
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
              <div className="text-sm text-blue-700">{student.profileCompletion}% complete</div>
            </div>
            <Badge variant="outline" className="bg-white">
              {student.profileCompletion >= 90 ? 'Excellent' : student.profileCompletion >= 70 ? 'Good' : 'Needs Work'}
            </Badge>
          </div>
          <Progress value={student.profileCompletion} className="h-2" />
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
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback className="text-xl">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditingProfile && (
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profileData.firstName}
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profileData.lastName}
                  disabled={!isEditingProfile}
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
                  disabled={!isEditingProfile}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Goals</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={profileData.learningGoals}
              disabled={!isEditingProfile}
              placeholder="Describe your learning goals and what you want to achieve..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subjects of Interest</label>
            <div className="flex flex-wrap gap-2">
              {profileData.subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="cursor-pointer">
                  {subject}
                  {isEditingProfile && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
              {isEditingProfile && (
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subject
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
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
      case "find-teachers":
        return renderFindTeachers();
      case "profile":
        return renderProfile();
      case "bookings":
        return renderPlaceholderSection("My Bookings", "Manage your lesson bookings and schedule");
      case "history":
        return renderPlaceholderSection("Lesson History", "View your completed lessons and progress");
      case "payments":
        return renderPlaceholderSection("Payments & Billing", "Manage your payment methods and billing");
      case "reviews":
        return renderPlaceholderSection("Reviews & Ratings", "Rate your teachers and view feedback");
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
              <h2 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h2>
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
