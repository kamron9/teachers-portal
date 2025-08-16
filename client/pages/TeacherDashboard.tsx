import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  BookOpen,
  DollarSign,
  Star,
  Settings,
  Bell,
  MessageCircle,
  Video,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Play,
  Download,
  MoreHorizontal,
  Edit3,
  LogOut,
  Camera,
  Upload,
  Award,
  GraduationCap,
  Plus,
  Minus,
  ChevronLeft,
  ChevronDown,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Printer,
  Globe,
  Save,
  X,
  Check,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  Timer,
  MapPin,
  Phone,
  Mail,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  List,
  Sun,
  Moon,
  Coffee,
  BookOpenCheck,
  CreditCard,
  Wallet,
  Receipt,
  TrendingDown,
  Target,
  Percent,
  Calculator,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Building,
  CreditCard as BankCard,
  Smartphone,
  ChartLine,
  Coins,
  PiggyBank,
  ShieldCheck,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Flag,
  TrendingUp as TrendingUpIcon,
  Quote,
  Verified,
  Shield,
  FilterX,
  SortAsc,
  SortDesc,
  Reply,
  Send,
  Share,
  Lock,
  KeyRound,
  Volume2,
  VolumeX,
  Monitor,
  Wifi,
  Database,
  Cloud,
  Link2,
  UserCheck,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  useTeacherProfile,
  useBookings,
  useUpdateBookingStatus,
  useCancelBooking,
} from "@/hooks/useApi";
import { formatPrice, formatTimezone, Booking } from "@/lib/api";

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
  const { toast } = useToast();

  // Fetch real data
  const { data: teacherProfile, isLoading: profileLoading } = useTeacherProfile();
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

  // Booking mutations
  const updateBookingMutation = useUpdateBookingStatus();
  const cancelBookingMutation = useCancelBooking();

  // Extract data
  const bookings = bookingsData?.data || [];
  const upcomingBookings = upcomingBookingsData?.data || [];

  // Profile management state - moved to top level to follow Rules of Hooks
  const [isEditing, setIsEditing] = useState(false);

  // Schedule management state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
    "month",
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [scheduleTemplate, setScheduleTemplate] = useState("default");
  const [autoApproval, setAutoApproval] = useState(false);
  const [minAdvanceBooking, setMinAdvanceBooking] = useState("2h");
  const [maxFutureBooking, setMaxFutureBooking] = useState("1m");
  const [bufferTime, setBufferTime] = useState(15);
  const [maxLessonsPerDay, setMaxLessonsPerDay] = useState(8);
  const [defaultLessonDuration, setDefaultLessonDuration] = useState(60);
  const [weeklyAvailability, setWeeklyAvailability] = useState({
    monday: { enabled: true, start: "09:00", end: "17:00", breaks: [] },
    tuesday: { enabled: true, start: "09:00", end: "17:00", breaks: [] },
    wednesday: { enabled: true, start: "09:00", end: "17:00", breaks: [] },
    thursday: { enabled: true, start: "09:00", end: "17:00", breaks: [] },
    friday: { enabled: true, start: "09:00", end: "17:00", breaks: [] },
    saturday: { enabled: false, start: "10:00", end: "16:00", breaks: [] },
    sunday: { enabled: false, start: "10:00", end: "16:00", breaks: [] },
  });

  // Bookings management state
  const [activeBookingTab, setActiveBookingTab] = useState<
    "pending" | "today" | "upcoming" | "history"
  >("pending");
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "confirmed" | "pending" | "cancelled" | "completed"
  >("all");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Earnings management state
  const [earningsTimeframe, setEarningsTimeframe] = useState<
    "week" | "month" | "year"
  >("month");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");
  const [earningsGoal, setEarningsGoal] = useState(3000000); // 3M UZS

  // Reviews management state
  const [reviewsTab, setReviewsTab] = useState<"recent" | "all" | "analytics">(
    "recent",
  );
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "5" | "4" | "3" | "2" | "1"
  >("all");
  const [reviewSort, setReviewSort] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [searchReviews, setSearchReviews] = useState("");

  // Settings management state
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    | "account"
    | "professional"
    | "notifications"
    | "privacy"
    | "billing"
    | "calendar"
    | "communication"
    | "integrations"
    | "data"
  >("account");
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    bookingRequests: true,
    paymentConfirmations: true,
    studentMessages: true,
    scheduleReminders: true,
    marketing: false,
  });
  const [smsNotifications, setSmsNotifications] = useState({
    urgentBookings: true,
    lessonReminders: true,
    payments: false,
    emergency: true,
  });
  const [pushNotifications, setPushNotifications] = useState({
    mobile: true,
    browser: true,
    sounds: true,
    quietHours: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    searchVisible: true,
    contactSharing: "verified",
    showReviews: true,
    activityStatus: true,
  });
  const [calendarSync, setCalendarSync] = useState({
    google: false,
    outlook: false,
    apple: false,
  });
  const [languageSettings, setLanguageSettings] = useState({
    primary: "English",
    interface: "English",
    autoTranslate: true,
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
    education:
      "Masters in English Literature - National University of Uzbekistan\nTESOL Certification - British Council\nIELTS Teacher Training Certificate",
    subjects: ["English", "IELTS", "Business English", "Conversation Practice"],
    hourlyRate: "50000",
    languages: ["Uzbek", "English", "Russian"],
  });
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Subjects & Pricing management state
  const [subjectCards, setSubjectCards] = useState([
    {
      id: "1",
      name: "General English",
      level: "All Levels",
      price: 50000,
      delivery: "Online",
      icon: "book",
    },
    {
      id: "2",
      name: "IELTS Preparation",
      level: "Intermediate+",
      price: 65000,
      delivery: "Online",
      icon: "bar-chart",
    },
    {
      id: "3",
      name: "Business English",
      level: "Intermediate+",
      price: 70000,
      delivery: "Online",
      icon: "briefcase",
    },
    {
      id: "4",
      name: "Conversation Practice",
      level: "All Levels",
      price: 40000,
      delivery: "Online",
      icon: "speech-bubble",
    },
  ]);
  const [teachingLevels, setTeachingLevels] = useState([
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper-Intermediate",
    "Advanced",
  ]);
  const [examPreparation, setExamPreparation] = useState([
    "IELTS",
    "TOEFL",
    "Cambridge English",
    "Business English Certificate",
  ]);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: "",
    level: "All Levels",
    price: 50000,
    delivery: "Online",
    icon: "book",
  });
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [draggedSubject, setDraggedSubject] = useState<string | null>(null);

  // Helper functions for subjects & pricing
  const levelOptions = [
    "All Levels",
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper-Intermediate",
    "Advanced",
    "Intermediate+",
  ];
  const deliveryOptions = ["Online", "Offline", "Hybrid"];
  const iconOptions = [
    { value: "book", label: "📚 Book", component: BookOpen },
    { value: "bar-chart", label: "📊 Chart", component: BarChart3 },
    { value: "briefcase", label: "💼 Briefcase", component: null },
    { value: "speech-bubble", label: "💬 Speech", component: MessageCircle },
  ];
  const allTeachingLevels = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper-Intermediate",
    "Advanced",
  ];
  const allExamPreparations = [
    "IELTS",
    "TOEFL",
    "Cambridge English",
    "Business English Certificate",
    "OET",
    "TOEIC",
    "PTE",
  ];

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " UZS";
  };

  const getIconComponent = (iconValue: string) => {
    switch (iconValue) {
      case "book":
        return BookOpen;
      case "bar-chart":
        return BarChart3;
      case "briefcase":
        return null; // Will use emoji
      case "speech-bubble":
        return MessageCircle;
      default:
        return BookOpen;
    }
  };

  const getIconEmoji = (iconValue: string) => {
    switch (iconValue) {
      case "book":
        return "📚";
      case "bar-chart":
        return "📊";
      case "briefcase":
        return "💼";
      case "speech-bubble":
        return "💬";
      default:
        return "📚";
    }
  };

  const addSubject = () => {
    if (!newSubject.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject name is required.",
        variant: "destructive",
      });
      return;
    }

    if (newSubject.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const subject = {
      ...newSubject,
      id: Date.now().toString(),
    };
    setSubjectCards([...subjectCards, subject]);
    setNewSubject({
      name: "",
      level: "All Levels",
      price: 50000,
      delivery: "Online",
      icon: "book",
    });
    setShowAddSubject(false);
    setHasUnsavedChanges(true);

    toast({
      title: "Subject Added",
      description: `${subject.name} has been added to your offerings.`,
    });
  };

  const updateSubject = (id: string, updates: any) => {
    setSubjectCards((cards) =>
      cards.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    );
    setHasUnsavedChanges(true);
  };

  const deleteSubject = (id: string) => {
    const subject = subjectCards.find((card) => card.id === id);
    setSubjectCards((cards) => cards.filter((card) => card.id !== id));
    setHasUnsavedChanges(true);

    if (subject) {
      toast({
        title: "Subject Removed",
        description: `${subject.name} has been removed from your offerings.`,
      });
    }
  };

  const moveSubject = (dragIndex: number, hoverIndex: number) => {
    const draggedCard = subjectCards[dragIndex];
    const newCards = [...subjectCards];
    newCards.splice(dragIndex, 1);
    newCards.splice(hoverIndex, 0, draggedCard);
    setSubjectCards(newCards);
    setHasUnsavedChanges(true);
  };

  const toggleTeachingLevel = (level: string) => {
    setTeachingLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
    setHasUnsavedChanges(true);
  };

  const toggleExamPreparation = (exam: string) => {
    setExamPreparation((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam],
    );
    setHasUnsavedChanges(true);
  };

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
    unreadMessages: 5,
  };

  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile Management", icon: User },
    { id: "schedule", label: "Schedule & Availability", icon: Calendar },
    {
      id: "bookings",
      label: "Bookings & Lessons",
      icon: BookOpen,
      count: teacher.pendingBookings,
    },
    { id: "earnings", label: "Earnings & Payments", icon: DollarSign },
    { id: "reviews", label: "Reviews & Ratings", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
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
      bookedAt: "2024-01-19T10:30:00",
    },
    {
      id: 2,
      student: { name: "David Wilson", image: "/placeholder.svg" },
      requestedDate: "2024-01-23",
      requestedTime: "14:00",
      type: "IELTS Speaking",
      status: "pending",
      bookedAt: "2024-01-19T09:15:00",
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {teacher.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your teaching today
          </p>
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
                  <div className="font-medium text-amber-900">
                    Complete your profile to get more bookings
                  </div>
                  <div className="text-sm text-amber-700">
                    Your profile is {teacher.profileCompletion}% complete
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSection("profile")}
              >
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
            <div className="text-3xl font-bold text-primary mb-2">
              {teacher.totalLessons}
            </div>
            <div className="text-gray-600">Total Lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {teacher.totalStudents}
            </div>
            <div className="text-gray-600">Students Taught</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {teacher.rating}
            </div>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("schedule")}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockBookings.filter((b) => b.status === "confirmed").length > 0 ? (
            <div className="space-y-4">
              {mockBookings
                .filter((b) => b.status === "confirmed")
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={lesson.student.image}
                          alt={lesson.student.name}
                        />
                        <AvatarFallback>
                          {lesson.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {lesson.student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {lesson.type}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {lesson.time} ({lesson.duration} min)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          lesson.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
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
              <Button
                className="mt-4"
                onClick={() => setActiveSection("schedule")}
              >
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
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={booking.student.image}
                        alt={booking.student.name}
                      />
                      <AvatarFallback>
                        {booking.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.student.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(booking.requestedDate).toLocaleDateString()}{" "}
                        at {booking.requestedTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
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
      "Mathematics",
      "English",
      "Programming",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Literature",
      "Music",
      "Art",
      "Economics",
      "Psychology",
    ];
    const languages = [
      "Uzbek",
      "English",
      "Russian",
      "Arabic",
      "Turkish",
      "Korean",
      "Chinese",
      "French",
      "German",
      "Spanish",
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Management
            </h1>
            <p className="text-gray-600">
              Manage your teaching profile, bio, subjects, and qualifications
            </p>
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
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setHasUnsavedChanges(false);
                    toast({
                      title: "Profile Updated",
                      description: "Subjects & pricing updated successfully.",
                    });
                  }}
                >
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
                <div className="font-medium text-blue-900">
                  Profile Completion
                </div>
                <div className="text-sm text-blue-700">
                  {profileCompletion}% complete
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                {profileCompletion >= 90
                  ? "Excellent"
                  : profileCompletion >= 70
                    ? "Good"
                    : "Needs Work"}
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
                    {profileData.firstName[0]}
                    {profileData.lastName[0]}
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
                      setProfileData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }));
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
                      setProfileData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }));
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
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Professional Title *
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profileData.title}
                disabled={!isEditing}
                placeholder="e.g., English Language Expert & IELTS Specialist"
                onChange={(e) => {
                  setProfileData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
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
                  setProfileData((prev) => ({ ...prev, bio: e.target.value }));
                  setHasUnsavedChanges(true);
                }}
              />
              <div className="text-xs text-gray-500">
                {profileData.bio.length}/500 characters
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Education & Certifications *
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profileData.education}
                disabled={!isEditing}
                placeholder="List your education background and certifications..."
                onChange={(e) => {
                  setProfileData((prev) => ({
                    ...prev,
                    education: e.target.value,
                  }));
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
                  setProfileData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }));
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Video Introduction
              </h3>
              <p className="text-gray-600 mb-4">
                Help students get to know you with a 2-3 minute introduction
                video
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
                • Max file size: 50MB • Formats: MP4, MOV • Recommended: 2-3
                minutes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Subjects & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Cards Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Subject Offerings</h4>
                  <p className="text-sm text-muted-foreground">
                    Add subjects you teach with individual pricing
                  </p>
                </div>
                {isEditing && (
                  <Button onClick={() => setShowAddSubject(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                )}
              </div>

              {/* Subject Cards Grid */}
              {subjectCards.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No subjects added yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first subject to show students what you teach and
                    your hourly rate.
                  </p>
                  {isEditing && (
                    <Button onClick={() => setShowAddSubject(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {subjectCards.map((subject, index) => (
                    <Card
                      key={subject.id}
                      className="relative group hover:shadow-md transition-shadow"
                      draggable={isEditing}
                      onDragStart={() => setDraggedSubject(subject.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedSubject && draggedSubject !== subject.id) {
                          const dragIndex = subjectCards.findIndex(
                            (s) => s.id === draggedSubject,
                          );
                          moveSubject(dragIndex, index);
                          setDraggedSubject(null);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">
                              {getIconEmoji(subject.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              {editingSubjectId === subject.id ? (
                                <input
                                  className="font-medium text-base w-full border rounded px-2 py-1"
                                  value={subject.name}
                                  onChange={(e) =>
                                    updateSubject(subject.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  onBlur={() => setEditingSubjectId(null)}
                                  onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    setEditingSubjectId(null)
                                  }
                                  autoFocus
                                />
                              ) : (
                                <h4
                                  className="font-medium text-base cursor-pointer hover:text-primary"
                                  onClick={() =>
                                    isEditing && setEditingSubjectId(subject.id)
                                  }
                                >
                                  {subject.name}
                                </h4>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {subject.level}
                              </p>
                            </div>
                          </div>
                          {isEditing && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSubjectId(subject.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Remove "${subject.name}" from your offerings?`,
                                    )
                                  ) {
                                    deleteSubject(subject.id);
                                  }
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                title="Remove this subject"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right mb-3">
                          {editingSubjectId === subject.id ? (
                            <input
                              type="number"
                              className="text-lg font-bold text-right border rounded px-2 py-1 w-24"
                              value={subject.price}
                              onChange={(e) =>
                                updateSubject(subject.id, {
                                  price: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          ) : (
                            <div className="text-lg font-bold">
                              {formatPrice(subject.price)}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            per hour
                          </div>
                        </div>

                        {/* Delivery Badge */}
                        <div className="flex justify-between items-center">
                          {editingSubjectId === subject.id ? (
                            <select
                              value={subject.delivery}
                              onChange={(e) =>
                                updateSubject(subject.id, {
                                  delivery: e.target.value,
                                })
                              }
                              className="text-xs border rounded px-2 py-1"
                            >
                              {deliveryOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {subject.delivery}
                            </Badge>
                          )}

                          {editingSubjectId === subject.id && (
                            <select
                              value={subject.icon}
                              onChange={(e) =>
                                updateSubject(subject.id, {
                                  icon: e.target.value,
                                })
                              }
                              className="text-xs border rounded px-2 py-1 ml-2"
                            >
                              {iconOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add Subject Form */}
              {showAddSubject && isEditing && (
                <Card className="border-2 border-primary">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Add New Subject</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddSubject(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">
                            Subject Name *
                          </label>
                          <input
                            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                              !newSubject.name.trim()
                                ? "border-red-300 focus:border-red-500"
                                : "border-input"
                            } bg-background`}
                            placeholder="e.g., General English"
                            value={newSubject.name}
                            onChange={(e) =>
                              setNewSubject((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                          {!newSubject.name.trim() && (
                            <p className="text-xs text-red-500 mt-1">
                              Subject name is required
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Level *</label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newSubject.level}
                            onChange={(e) =>
                              setNewSubject((prev) => ({
                                ...prev,
                                level: e.target.value,
                              }))
                            }
                          >
                            {levelOptions.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Price per hour (UZS) *
                          </label>
                          <input
                            type="number"
                            min="1000"
                            max="1000000"
                            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                              newSubject.price <= 0
                                ? "border-red-300 focus:border-red-500"
                                : "border-input"
                            } bg-background`}
                            placeholder="50000"
                            value={newSubject.price}
                            onChange={(e) =>
                              setNewSubject((prev) => ({
                                ...prev,
                                price: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          {newSubject.price <= 0 && (
                            <p className="text-xs text-red-500 mt-1">
                              Price must be greater than 0
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Delivery *
                          </label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newSubject.delivery}
                            onChange={(e) =>
                              setNewSubject((prev) => ({
                                ...prev,
                                delivery: e.target.value,
                              }))
                            }
                          >
                            {deliveryOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Icon</label>
                        <div className="flex gap-2 mt-2">
                          {iconOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={`p-2 border rounded ${newSubject.icon === option.value ? "border-primary bg-primary/10" : "border-gray-300"}`}
                              onClick={() =>
                                setNewSubject((prev) => ({
                                  ...prev,
                                  icon: option.value,
                                }))
                              }
                            >
                              {getIconEmoji(option.value)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={addSubject}
                          disabled={
                            !newSubject.name.trim() || newSubject.price <= 0
                          }
                          className={
                            !newSubject.name.trim() || newSubject.price <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Subject
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddSubject(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Global Settings */}
            {isEditing && (
              <>
                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Teaching Levels</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select all levels you can teach (shown below subject
                        grid)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {allTeachingLevels.map((level) => (
                          <Badge
                            key={level}
                            variant={
                              teachingLevels.includes(level)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleTeachingLevel(level)}
                          >
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Exam Preparation</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select exams you can prepare students for
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {allExamPreparations.map((exam) => (
                          <Badge
                            key={exam}
                            variant={
                              examPreparation.includes(exam)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleExamPreparation(exam)}
                          >
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Live Preview */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">📍 Public Profile Preview</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Preview Subject Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-6">
                  {subjectCards.map((subject) => (
                    <Card
                      key={subject.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {getIconEmoji(subject.icon)}
                            </span>
                            <div>
                              <h4 className="font-medium">{subject.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {subject.level}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {formatPrice(subject.price)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              per hour
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {subject.delivery}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Preview Chip Groups */}
                {(teachingLevels.length > 0 || examPreparation.length > 0) && (
                  <div className="space-y-4">
                    {teachingLevels.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Teaching Levels</h4>
                        <div className="flex flex-wrap gap-2">
                          {teachingLevels.map((level) => (
                            <Badge key={level} variant="outline">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {examPreparation.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Exam Preparation</h4>
                        <div className="flex flex-wrap gap-2">
                          {examPreparation.map((exam) => (
                            <Badge key={exam} variant="outline">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                <h4 className="font-medium text-gray-900 mb-2">
                  Upload Certificates & Documents
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upload teaching certificates, degrees, and other
                  qualifications
                </p>
                {isEditing ? (
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                ) : (
                  <div className="text-sm text-gray-500">
                    No documents uploaded
                  </div>
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

  // Mock bookings data
  const pendingBookingRequests = [
    {
      id: 1,
      student: {
        name: "Maria Garcia",
        image: "/placeholder.svg",
        email: "maria@example.com",
        phone: "+998901234567",
        rating: 4.8,
        totalLessons: 25,
        memberSince: "2023-08-15",
      },
      requestedDate: "2024-01-22",
      requestedTime: "15:00",
      duration: 60,
      subject: "English Conversation",
      type: "regular",
      rate: 50000,
      message:
        "Hello! I would like to continue improving my conversational English skills. I'm particularly interested in business communication.",
      requestedAt: "2024-01-19T10:30:00",
      paymentConfirmed: true,
      specialRequirements: "Prefers slower pace, beginner level",
    },
    {
      id: 2,
      student: {
        name: "David Wilson",
        image: "/placeholder.svg",
        email: "david@example.com",
        phone: "+998901234568",
        rating: 4.9,
        totalLessons: 45,
        memberSince: "2023-06-10",
      },
      requestedDate: "2024-01-23",
      requestedTime: "14:00",
      duration: 90,
      subject: "IELTS Speaking",
      type: "intensive",
      rate: 75000,
      message:
        "I need to prepare for IELTS speaking test next month. Can we focus on Part 2 and 3?",
      requestedAt: "2024-01-19T09:15:00",
      paymentConfirmed: true,
      specialRequirements: "IELTS preparation, advanced level",
    },
    {
      id: 3,
      student: {
        name: "Sophie Chen",
        image: "/placeholder.svg",
        email: "sophie@example.com",
        phone: "+998901234569",
        rating: 5.0,
        totalLessons: 5,
        memberSince: "2024-01-05",
      },
      requestedDate: "2024-01-24",
      requestedTime: "16:30",
      duration: 30,
      subject: "Trial Lesson",
      type: "trial",
      rate: 25000,
      message:
        "Hi! I'm new to the platform and would like to try a lesson to see if we're a good match.",
      requestedAt: "2024-01-19T14:45:00",
      paymentConfirmed: false,
      specialRequirements: "New student, needs assessment",
    },
  ];

  // Mock schedule data
  const mockBookings = [
    {
      id: 1,
      date: "2024-01-20",
      time: "14:00",
      duration: 60,
      student: {
        name: "John Doe",
        image: "/placeholder.svg",
        phone: "+998901234567",
      },
      subject: "IELTS Preparation",
      status: "confirmed",
      type: "regular",
      rate: 50000,
    },
    {
      id: 2,
      date: "2024-01-20",
      time: "16:00",
      duration: 30,
      student: {
        name: "Sarah Smith",
        image: "/placeholder.svg",
        phone: "+998901234568",
      },
      subject: "Trial Lesson",
      status: "pending",
      type: "trial",
      rate: 25000,
    },
    {
      id: 3,
      date: "2024-01-21",
      time: "10:00",
      duration: 90,
      student: {
        name: "Ahmad Karim",
        image: "/placeholder.svg",
        phone: "+998901234569",
      },
      subject: "Business English",
      status: "confirmed",
      type: "regular",
      rate: 75000,
    },
  ];

  const completedLessons = [
    {
      id: 101,
      date: "2024-01-18",
      time: "14:00",
      duration: 60,
      student: { name: "John Doe", image: "/placeholder.svg", rating: 5 },
      subject: "IELTS Preparation",
      status: "completed",
      studentRating: 5,
      studentFeedback:
        "Excellent lesson! Very clear explanations and helpful practice exercises.",
      teacherNotes:
        "Student showed good progress in speaking. Focus on pronunciation next time.",
      paymentStatus: "paid",
      earnings: 50000,
    },
    {
      id: 102,
      date: "2024-01-17",
      time: "16:00",
      duration: 30,
      student: { name: "Sarah Smith", image: "/placeholder.svg", rating: 5 },
      subject: "Trial Lesson",
      status: "completed",
      studentRating: 5,
      studentFeedback: "Great first lesson! Looking forward to more sessions.",
      teacherNotes:
        "Enthusiastic student, good foundation. Recommended regular package.",
      paymentStatus: "paid",
      earnings: 25000,
    },
    {
      id: 103,
      date: "2024-01-16",
      time: "10:00",
      duration: 90,
      student: { name: "Ahmad Karim", image: "/placeholder.svg", rating: 4 },
      subject: "Business English",
      status: "completed",
      studentRating: 4,
      studentFeedback: "Good lesson, but would like more practical examples.",
      teacherNotes:
        "Student needs more real-world business scenarios. Prepare case studies.",
      paymentStatus: "paid",
      earnings: 75000,
    },
  ];

  const todaysLessons = mockBookings.filter(
    (booking) =>
      booking.date === new Date().toISOString().split("T")[0] &&
      booking.status === "confirmed",
  );

  const upcomingLessons = mockBookings.filter(
    (booking) =>
      new Date(booking.date) > new Date() && booking.status === "confirmed",
  );

  const recentMessages = [
    {
      id: 1,
      student: { name: "John Doe", image: "/placeholder.svg" },
      message:
        "Thank you for the great lesson yesterday! When can we schedule the next one?",
      timestamp: "2024-01-19T15:30:00",
      unread: true,
      lessonRelated: true,
    },
    {
      id: 2,
      student: { name: "Maria Garcia", image: "/placeholder.svg" },
      message:
        "Hi! I have a question about the homework you assigned. Could you clarify the grammar exercise?",
      timestamp: "2024-01-19T12:15:00",
      unread: true,
      lessonRelated: true,
    },
    {
      id: 3,
      student: { name: "David Wilson", image: "/placeholder.svg" },
      message:
        "I need to reschedule tomorrow's lesson. Is 4 PM available instead?",
      timestamp: "2024-01-19T09:45:00",
      unread: false,
      lessonRelated: false,
    },
  ];

  const bookingStats = {
    todayLessons: todaysLessons.length,
    pendingRequests: pendingBookingRequests.length,
    weeklyEarnings: 450000,
    monthlyLessons: 42,
    acceptanceRate: 89,
    noShowRate: 3,
    averageRating: 4.9,
    totalStudents: 89,
    completionRate: 97,
  };

  const scheduleAnalytics = {
    bookingRate: 78,
    peakHours: ["14:00-16:00", "19:00-21:00"],
    utilizationRate: 65,
    avgBookingAdvance: "2.5 days",
    monthlyProjection: 2850000,
    popularTimeSlots: ["10:00", "14:00", "16:00", "19:00"],
  };

  // Earnings data
  const earningsData = {
    totalLifetime: 17500000,
    thisMonth: 2850000,
    lastMonth: 2450000,
    pendingPayments: 425000,
    nextPayoutDate: "2024-01-25",
    nextPayoutAmount: 2100000,
    averageHourlyRate: 65000,
    platformFeeRate: 15,
    totalPlatformFees: 382500,

    monthlyTrend: [
      { month: "Jul", amount: 1800000 },
      { month: "Aug", amount: 2100000 },
      { month: "Sep", amount: 2300000 },
      { month: "Oct", amount: 2450000 },
      { month: "Nov", amount: 2650000 },
      { month: "Dec", amount: 2850000 },
    ],

    subjectBreakdown: [
      {
        subject: "English",
        earnings: 1200000,
        percentage: 42,
        color: "#3B82F6",
      },
      { subject: "IELTS", earnings: 950000, percentage: 33, color: "#10B981" },
      {
        subject: "Business English",
        earnings: 500000,
        percentage: 18,
        color: "#F59E0B",
      },
      {
        subject: "Conversation",
        earnings: 200000,
        percentage: 7,
        color: "#EF4444",
      },
    ],

    topStudents: [
      { name: "John Doe", earnings: 350000, lessons: 14 },
      { name: "Sarah Smith", earnings: 280000, lessons: 11 },
      { name: "Ahmad Karim", earnings: 245000, lessons: 9 },
      { name: "Maria Garcia", earnings: 210000, lessons: 8 },
    ],
  };

  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-18",
      student: { name: "John Doe", image: "/placeholder.svg" },
      subject: "IELTS Preparation",
      amount: 50000,
      platformFee: 7500,
      netAmount: 42500,
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN-001234",
      lessonId: "LSN-5678",
    },
    {
      id: 2,
      date: "2024-01-17",
      student: { name: "Sarah Smith", image: "/placeholder.svg" },
      subject: "Trial Lesson",
      amount: 25000,
      platformFee: 3750,
      netAmount: 21250,
      status: "completed",
      paymentMethod: "UzCard",
      transactionId: "TXN-001235",
      lessonId: "LSN-5679",
    },
    {
      id: 3,
      date: "2024-01-16",
      student: { name: "Ahmad Karim", image: "/placeholder.svg" },
      subject: "Business English",
      amount: 75000,
      platformFee: 11250,
      netAmount: 63750,
      status: "pending",
      paymentMethod: "Bank Transfer",
      transactionId: "TXN-001236",
      lessonId: "LSN-5680",
    },
    {
      id: 4,
      date: "2024-01-15",
      student: { name: "Maria Garcia", image: "/placeholder.svg" },
      subject: "English Conversation",
      amount: 40000,
      platformFee: 6000,
      netAmount: 34000,
      status: "completed",
      paymentMethod: "PayPal",
      transactionId: "TXN-001237",
      lessonId: "LSN-5681",
    },
    {
      id: 5,
      date: "2024-01-14",
      student: { name: "David Wilson", image: "/placeholder.svg" },
      subject: "IELTS Speaking",
      amount: 65000,
      platformFee: 9750,
      netAmount: 55250,
      status: "failed",
      paymentMethod: "Credit Card",
      transactionId: "TXN-001238",
      lessonId: "LSN-5682",
    },
  ];

  const payoutHistory = [
    {
      id: 1,
      date: "2024-01-15",
      amount: 1850000,
      status: "completed",
      method: "Bank Transfer",
      reference: "PAY-2024-001",
      processingFee: 15000,
    },
    {
      id: 2,
      date: "2023-12-15",
      amount: 1650000,
      status: "completed",
      method: "Bank Transfer",
      reference: "PAY-2023-012",
      processingFee: 15000,
    },
    {
      id: 3,
      date: "2023-11-15",
      amount: 1450000,
      status: "completed",
      method: "Bank Transfer",
      reference: "PAY-2023-011",
      processingFee: 15000,
    },
  ];

  const calculateGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const monthlyGrowth = calculateGrowthPercentage(
    earningsData.thisMonth,
    earningsData.lastMonth,
  );
  const goalProgress = ((earningsData.thisMonth / earningsGoal) * 100).toFixed(
    1,
  );

  // Reviews and ratings data
  const reviewsData = {
    overallRating: 4.8,
    totalReviews: 287,
    recentRating: 4.9, // last 30 days
    ratingTrend: "+0.2", // improvement
    ranking: 12, // position among teachers
    responseRate: 89,

    ratingDistribution: [
      { stars: 5, count: 201, percentage: 70 },
      { stars: 4, count: 57, percentage: 20 },
      { stars: 3, count: 20, percentage: 7 },
      { stars: 2, count: 6, percentage: 2 },
      { stars: 1, count: 3, percentage: 1 },
    ],

    monthlyTrend: [
      { month: "Jul", rating: 4.6 },
      { month: "Aug", rating: 4.7 },
      { month: "Sep", rating: 4.7 },
      { month: "Oct", rating: 4.8 },
      { month: "Nov", rating: 4.8 },
      { month: "Dec", rating: 4.9 },
    ],

    subjectRatings: [
      { subject: "English", rating: 4.9, reviews: 120 },
      { subject: "IELTS", rating: 4.8, reviews: 95 },
      { subject: "Business English", rating: 4.7, reviews: 45 },
      { subject: "Conversation", rating: 4.9, reviews: 27 },
    ],

    commonKeywords: [
      { word: "patient", count: 89 },
      { word: "helpful", count: 76 },
      { word: "clear", count: 71 },
      { word: "professional", count: 65 },
      { word: "encouraging", count: 52 },
    ],
  };

  const recentReviews = [
    {
      id: 1,
      student: {
        name: "John Doe",
        image: "/placeholder.svg",
        level: "Intermediate",
        verified: true,
      },
      rating: 5,
      date: "2024-01-18",
      lesson: {
        subject: "IELTS Preparation",
        date: "2024-01-17",
        duration: 60,
      },
      review:
        "Excellent teacher! Aziza explains complex grammar concepts in a very clear and understandable way. Her IELTS preparation methods are highly effective and she provides great practice materials. I've seen significant improvement in my speaking and writing scores.",
      helpful: 12,
      replied: true,
      response:
        "Thank you so much, John! I'm thrilled to hear about your progress. Keep practicing and you'll achieve your target score soon!",
    },
    {
      id: 2,
      student: {
        name: "Sarah Smith",
        image: "/placeholder.svg",
        level: "Beginner",
        verified: true,
      },
      rating: 5,
      date: "2024-01-17",
      lesson: {
        subject: "Trial Lesson",
        date: "2024-01-16",
        duration: 30,
      },
      review:
        "Amazing first lesson! Aziza was very patient with me as a beginner and made me feel comfortable speaking English. She quickly identified my learning needs and created a personalized plan. Looking forward to more lessons!",
      helpful: 8,
      replied: false,
      response: null,
    },
    {
      id: 3,
      student: {
        name: "Ahmad Karim",
        image: "/placeholder.svg",
        level: "Advanced",
        verified: true,
      },
      rating: 4,
      date: "2024-01-16",
      lesson: {
        subject: "Business English",
        date: "2024-01-15",
        duration: 90,
      },
      review:
        "Good lesson with practical business scenarios. Aziza has strong knowledge of business English terminology. However, I would appreciate more real-world case studies and interactive exercises during the lesson.",
      helpful: 5,
      replied: true,
      response:
        "Thank you for the feedback, Ahmad! I'll incorporate more case studies in our next sessions. Your suggestions help me improve my teaching methods.",
    },
    {
      id: 4,
      student: {
        name: "Maria Garcia",
        image: "/placeholder.svg",
        level: "Intermediate",
        verified: false,
      },
      rating: 5,
      date: "2024-01-15",
      lesson: {
        subject: "English Conversation",
        date: "2024-01-14",
        duration: 60,
      },
      review:
        "Perfect conversation practice! Aziza creates a relaxed environment where I feel confident to speak. She corrects my mistakes gently and provides useful phrases for everyday situations.",
      helpful: 15,
      replied: false,
      response: null,
    },
    {
      id: 5,
      student: {
        name: "David Wilson",
        image: "/placeholder.svg",
        level: "Intermediate",
        verified: true,
      },
      rating: 5,
      date: "2024-01-14",
      lesson: {
        subject: "IELTS Speaking",
        date: "2024-01-13",
        duration: 60,
      },
      review:
        "Outstanding IELTS speaking preparation! Aziza simulates real exam conditions and provides detailed feedback on pronunciation, fluency, and vocabulary. Her tips are invaluable for exam success.",
      helpful: 9,
      replied: true,
      response:
        "I'm so happy to help you prepare for IELTS, David! Your dedication to practice is impressive. You're going to do great on the exam!",
    },
  ];

  const allReviews = [
    ...recentReviews,
    {
      id: 6,
      student: {
        name: "Lisa Chen",
        image: "/placeholder.svg",
        level: "Beginner",
        verified: true,
      },
      rating: 4,
      date: "2024-01-12",
      lesson: {
        subject: "English Basics",
        date: "2024-01-11",
        duration: 45,
      },
      review:
        "Great teacher for beginners. Very patient and encouraging. Sometimes the pace is a bit fast for me, but overall very helpful.",
      helpful: 7,
      replied: false,
      response: null,
    },
    {
      id: 7,
      student: {
        name: "Robert Johnson",
        image: "/placeholder.svg",
        level: "Advanced",
        verified: true,
      },
      rating: 5,
      date: "2024-01-10",
      lesson: {
        subject: "Business English",
        date: "2024-01-09",
        duration: 90,
      },
      review:
        "Exceptional business English training. Aziza understands corporate communication needs and provides relevant examples. Highly recommend for professionals.",
      helpful: 11,
      replied: true,
      response:
        "Thank you, Robert! It's wonderful working with professionals like you who are committed to excellence in communication.",
    },
  ];

  const filterReviews = (reviews: any[]) => {
    let filtered = reviews;

    if (reviewFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(reviewFilter),
      );
    }

    if (searchReviews) {
      filtered = filtered.filter(
        (review) =>
          review.student.name
            .toLowerCase()
            .includes(searchReviews.toLowerCase()) ||
          review.review.toLowerCase().includes(searchReviews.toLowerCase()) ||
          review.lesson.subject
            .toLowerCase()
            .includes(searchReviews.toLowerCase()),
      );
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (reviewSort) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
    const dateStr = date.toISOString().split("T")[0];
    return mockBookings.find(
      (booking) => booking.date === dateStr && booking.time === time,
    );
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const dayAvailability =
      weeklyAvailability[dayName as keyof typeof weeklyAvailability];

    if (!dayAvailability?.enabled) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const [startHours, startMinutes] = dayAvailability.start
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = dayAvailability.end.split(":").map(Number);
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
            <h1 className="text-3xl font-bold text-gray-900">
              Schedule & Availability
            </h1>
            <p className="text-gray-600">
              Set your availability and manage your teaching schedule
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAvailabilityModal(true)}
            >
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
                  <div className="text-2xl font-bold text-primary">
                    {scheduleAnalytics.bookingRate}%
                  </div>
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
                  <div className="text-2xl font-bold text-primary">
                    {scheduleAnalytics.utilizationRate}%
                  </div>
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
                  <div className="text-2xl font-bold text-primary">
                    {mockBookings.filter((b) => b.status === "pending").length}
                  </div>
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
                    {(scheduleAnalytics.monthlyProjection / 1000000).toFixed(1)}
                    M
                  </div>
                  <div className="text-sm text-gray-600">
                    Monthly Projection
                  </div>
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
                      if (calendarView === "month") {
                        newDate.setMonth(newDate.getMonth() - 1);
                      } else if (calendarView === "week") {
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
                      if (calendarView === "month") {
                        newDate.setMonth(newDate.getMonth() + 1);
                      } else if (calendarView === "week") {
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
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                      ...(calendarView !== "month" && { day: "numeric" }),
                    })}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex border rounded-lg p-1">
                  {(["month", "week", "day"] as const).map((view) => (
                    <Button
                      key={view}
                      variant={calendarView === view ? "default" : "ghost"}
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
        {calendarView === "month" && (
          <Card>
            <CardContent className="p-0">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-4 text-center font-medium text-gray-600 bg-gray-50"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Calendar Body */}
              <div className="grid grid-cols-7">
                {daysInMonth.map((day, index) => {
                  const isToday =
                    day && day.toDateString() === today.toDateString();
                  const dayBookings = day
                    ? mockBookings.filter(
                        (booking) =>
                          booking.date === day.toISOString().split("T")[0],
                      )
                    : [];

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] border-r border-b p-2 ${
                        !day ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer"
                      } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      {day && (
                        <>
                          <div
                            className={`text-sm font-medium mb-2 ${
                              isToday ? "text-blue-600" : "text-gray-900"
                            }`}
                          >
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayBookings.slice(0, 3).map((booking) => (
                              <div
                                key={booking.id}
                                className={`text-xs p-1 rounded truncate ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
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
        {(calendarView === "day" || calendarView === "week") && (
          <Card>
            <CardContent className="p-0">
              <div className="flex">
                {/* Time column */}
                <div className="w-20 border-r">
                  <div className="h-12 border-b"></div>
                  {timeSlots
                    .filter((_, index) => index % 2 === 0)
                    .map((time) => (
                      <div
                        key={time}
                        className="h-16 border-b flex items-center justify-center text-sm text-gray-600"
                      >
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
                    {timeSlots
                      .filter((_, index) => index % 2 === 0)
                      .map((time, index) => {
                        const booking = getBookingForSlot(currentDate, time);
                        const isAvailable = isTimeSlotAvailable(
                          currentDate,
                          time,
                        );

                        return (
                          <div
                            key={time}
                            className={`h-16 border-b flex items-center px-4 cursor-pointer ${
                              booking
                                ? booking.status === "confirmed"
                                  ? "bg-blue-100 hover:bg-blue-200"
                                  : "bg-yellow-100 hover:bg-yellow-200"
                                : isAvailable
                                  ? "hover:bg-green-50"
                                  : "bg-gray-50"
                            }`}
                          >
                            {booking ? (
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {booking.student.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {booking.subject}
                                </div>
                                <Badge
                                  variant={
                                    booking.status === "confirmed"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                            ) : isAvailable ? (
                              <div className="text-sm text-gray-500">
                                Available
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">
                                Unavailable
                              </div>
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
                        <AvatarImage
                          src={booking.student.image}
                          alt={booking.student.name}
                        />
                        <AvatarFallback>
                          {booking.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {booking.student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.subject}
                        </div>
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
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </Badge>

                      {booking.status === "pending" && (
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

                      {booking.status === "confirmed" && (
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
                    <Badge key={hour} variant="outline">
                      {hour}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Booking Advance</span>
                <span className="font-semibold">
                  {scheduleAnalytics.avgBookingAdvance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilization Rate</span>
                <span className="font-semibold text-green-600">
                  {scheduleAnalytics.utilizationRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Popular Time Slots</span>
                <div className="flex gap-1">
                  {scheduleAnalytics.popularTimeSlots
                    .slice(0, 3)
                    .map((slot) => (
                      <Badge key={slot} variant="secondary" className="text-xs">
                        {slot}
                      </Badge>
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
                  <div className="text-sm text-gray-600">
                    Automatically accept bookings from regular students
                  </div>
                </div>
                <Button
                  variant={autoApproval ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoApproval(!autoApproval)}
                >
                  {autoApproval ? "On" : "Off"}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Minimum advance booking
                </label>
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
                <label className="text-sm font-medium">
                  Buffer time between lessons
                </label>
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
                  <span className="text-sm font-medium w-12">
                    {bufferTime} min
                  </span>
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
                <h2 className="text-xl font-semibold">
                  Set Weekly Availability
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAvailabilityModal(false)}
                >
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
                            setWeeklyAvailability((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day as keyof typeof prev],
                                enabled: e.target.checked,
                              },
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
                          <label className="text-sm font-medium">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => {
                              setWeeklyAvailability((prev) => ({
                                ...prev,
                                [day]: {
                                  ...prev[day as keyof typeof prev],
                                  start: e.target.value,
                                },
                              }));
                            }}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => {
                              setWeeklyAvailability((prev) => ({
                                ...prev,
                                [day]: {
                                  ...prev[day as keyof typeof prev],
                                  end: e.target.value,
                                },
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
                <Button
                  variant="outline"
                  onClick={() => setShowAvailabilityModal(false)}
                >
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

        {/* Message Modal */}
        {showMessageModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Send Message</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMessageModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedStudent.image}
                      alt={selectedStudent.name}
                    />
                    <AvatarFallback>
                      {selectedStudent.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedStudent.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedStudent.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-3 border rounded-md min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageText("");
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Reschedule Lesson</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRescheduleModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {selectedBooking.student.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Current:{" "}
                    {new Date(selectedBooking.date).toLocaleDateString()} at{" "}
                    {selectedBooking.time}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">New Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">New Time</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Reason (Optional)
                  </label>
                  <textarea
                    placeholder="Let the student know why you're rescheduling..."
                    className="w-full p-2 border rounded-md min-h-[60px] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowRescheduleModal(false)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleAcceptBooking = (bookingId: number) => {
    // Handle accepting booking
    console.log("Accepting booking:", bookingId);
  };

  const handleDeclineBooking = (bookingId: number) => {
    // Handle declining booking
    console.log("Declining booking:", bookingId);
  };

  const handleBulkAction = (action: "accept" | "decline") => {
    console.log(`Bulk ${action} for bookings:`, selectedBookings);
    setSelectedBookings([]);
  };

  const renderBookingsManagement = () => {
    const filteredLessons = (() => {
      let lessons: any[] = [];

      switch (activeBookingTab) {
        case "pending":
          return pendingBookingRequests;
        case "today":
          return todaysLessons;
        case "upcoming":
          return upcomingLessons;
        case "history":
          return completedLessons;
        default:
          return [];
      }
    })();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bookings & Lessons
            </h1>
            <p className="text-gray-600">
              Manage student bookings and upcoming lessons
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowMessageModal(true)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Manual Booking
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {bookingStats.todayLessons}
                  </div>
                  <div className="text-sm text-gray-600">Today's Lessons</div>
                </div>
                <Sun className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {bookingStats.pendingRequests}
                  </div>
                  <div className="text-sm text-gray-600">Pending Requests</div>
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
                    {(bookingStats.weeklyEarnings / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {bookingStats.acceptanceRate}%
                  </div>
                  <div className="text-sm text-gray-600">Acceptance Rate</div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b">
              {(
                [
                  {
                    id: "pending",
                    label: "Pending Requests",
                    count: pendingBookingRequests.length,
                  },
                  {
                    id: "today",
                    label: "Today's Lessons",
                    count: todaysLessons.length,
                  },
                  {
                    id: "upcoming",
                    label: "Upcoming",
                    count: upcomingLessons.length,
                  },
                  {
                    id: "history",
                    label: "History",
                    count: completedLessons.length,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBookingTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeBookingTab === tab.id
                      ? "border-b-2 border-primary text-primary bg-primary/5"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Filter and Search */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students, subjects, or notes..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="p-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedBookings.length > 0 && (
                <div className="flex items-center gap-3 mt-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedBookings.length} selected
                  </span>
                  {activeBookingTab === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleBulkAction("accept")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept All
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("decline")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline All
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBookings([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Based on Active Tab */}
        <div className="space-y-4">
          {activeBookingTab === "pending" && (
            <div className="space-y-4">
              {pendingBookingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(request.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBookings([
                                ...selectedBookings,
                                request.id,
                              ]);
                            } else {
                              setSelectedBookings(
                                selectedBookings.filter(
                                  (id) => id !== request.id,
                                ),
                              );
                            }
                          }}
                          className="mt-1"
                        />
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={request.student.image}
                            alt={request.student.name}
                          />
                          <AvatarFallback>
                            {request.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {request.student.name}
                            </h3>
                            <Badge variant="outline">
                              {request.student.totalLessons} lessons
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">
                                {request.student.rating}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                Requested Date & Time
                              </div>
                              <div className="font-medium">
                                {new Date(
                                  request.requestedDate,
                                ).toLocaleDateString()}{" "}
                                at {request.requestedTime}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                Subject & Duration
                              </div>
                              <div className="font-medium">
                                {request.subject} ({request.duration} min)
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="text-sm text-gray-600">
                              Message from student:
                            </div>
                            <div className="text-sm bg-gray-50 p-3 rounded-lg">
                              {request.message}
                            </div>
                          </div>

                          {request.specialRequirements && (
                            <div className="space-y-1 mb-3">
                              <div className="text-sm text-gray-600">
                                Special Requirements:
                              </div>
                              <Badge variant="secondary">
                                {request.specialRequirements}
                              </Badge>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Requested{" "}
                              {new Date(request.requestedAt).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {request.rate.toLocaleString()} UZS
                            </span>
                            <span className="flex items-center gap-1">
                              {request.paymentConfirmed ? (
                                <>
                                  <CheckCircle className="h-3 w-3 text-green-500" />{" "}
                                  Payment Confirmed
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3 w-3 text-yellow-500" />{" "}
                                  Payment Pending
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(request.student);
                            setShowMessageModal(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineBooking(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptBooking(request.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeBookingTab === "today" && (
            <div className="space-y-4">
              {todaysLessons.length > 0 ? (
                todaysLessons.map((lesson) => (
                  <Card key={lesson.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage
                              src={lesson.student.image}
                              alt={lesson.student.name}
                            />
                            <AvatarFallback>
                              {lesson.student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {lesson.student.name}
                            </h3>
                            <div className="text-gray-600">
                              {lesson.subject}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.time} ({lesson.duration} min)
                              </span>
                              <Badge className="bg-green-100 text-green-800">
                                {lesson.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Start Lesson
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Sun className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No lessons today
                    </h3>
                    <p className="text-gray-600">
                      Enjoy your free day or set your availability for tomorrow!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeBookingTab === "upcoming" && (
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage
                            src={lesson.student.image}
                            alt={lesson.student.name}
                          />
                          <AvatarFallback>
                            {lesson.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {lesson.student.name}
                          </h3>
                          <div className="text-gray-600">{lesson.subject}</div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {new Date(lesson.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.time} ({lesson.duration} min)
                            </span>
                            <Badge className="bg-blue-100 text-blue-800">
                              {lesson.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedStudent(lesson.student);
                                setShowMessageModal(true);
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBooking(lesson);
                                setShowRescheduleModal(true);
                              }}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="h-4 w-4 mr-2" />
                              Cancel Lesson
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeBookingTab === "history" && (
            <div className="space-y-4">
              {completedLessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage
                            src={lesson.student.image}
                            alt={lesson.student.name}
                          />
                          <AvatarFallback>
                            {lesson.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {lesson.student.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < lesson.studentRating
                                      ? "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                Date & Time
                              </div>
                              <div className="text-sm font-medium">
                                {new Date(lesson.date).toLocaleDateString()} at{" "}
                                {lesson.time}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                Subject
                              </div>
                              <div className="text-sm font-medium">
                                {lesson.subject}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                Earnings
                              </div>
                              <div className="text-sm font-medium text-green-600">
                                {lesson.earnings.toLocaleString()} UZS
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Student Feedback:
                              </div>
                              <div className="text-sm bg-blue-50 p-3 rounded-lg">
                                {lesson.studentFeedback}
                              </div>
                            </div>

                            {lesson.teacherNotes && (
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Your Notes:
                                </div>
                                <div className="text-sm bg-gray-50 p-3 rounded-lg">
                                  {lesson.teacherNotes}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={`${
                            lesson.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lesson.paymentStatus}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Recent Messages
              </span>
              <Button variant="outline" size="sm">
                View All Messages
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={message.student.image}
                      alt={message.student.name}
                    />
                    <AvatarFallback>
                      {message.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {message.student.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{message.message}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Acceptance Rate</span>
                <span className="font-semibold text-green-600">
                  {bookingStats.acceptanceRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No-Show Rate</span>
                <span className="font-semibold">
                  {bookingStats.noShowRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-green-600">
                  {bookingStats.completionRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    {bookingStats.averageRating}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Monthly Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Lessons</span>
                <span className="font-semibold">
                  {bookingStats.monthlyLessons}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Students</span>
                <span className="font-semibold">
                  {bookingStats.totalStudents}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Bookings</span>
                <span className="font-semibold text-blue-600">+15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Earnings</span>
                <span className="font-semibold text-green-600">
                  {((bookingStats.weeklyEarnings * 4) / 1000000).toFixed(1)}M
                  UZS
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderEarningsManagement = () => {
    const filteredPayments = paymentHistory.filter(
      (payment) => paymentFilter === "all" || payment.status === paymentFilter,
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Earnings & Payments
            </h1>
            <p className="text-gray-600">
              Track your earnings and payment history
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowTaxModal(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Tax Documents
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => setShowPayoutModal(true)}>
              <Wallet className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total Lifetime Earnings
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {(earningsData.totalLifetime / 1000000).toFixed(1)}M UZS
                  </div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Overall growth
                  </div>
                </div>
                <Coins className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">This Month</div>
                  <div className="text-2xl font-bold text-primary">
                    {(earningsData.thisMonth / 1000000).toFixed(1)}M UZS
                  </div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />+{monthlyGrowth}%
                    vs last month
                  </div>
                </div>
                <BarChart3 className="h-10 w-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Pending Payments
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {(earningsData.pendingPayments / 1000).toFixed(0)}K UZS
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Available for payout
                  </div>
                </div>
                <Clock className="h-10 w-10 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Next Payout</div>
                  <div className="text-2xl font-bold text-primary">
                    {new Date(earningsData.nextPayoutDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {(earningsData.nextPayoutAmount / 1000000).toFixed(1)}M UZS
                    expected
                  </div>
                </div>
                <CalendarIcon className="h-10 w-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart and Analytics */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ChartLine className="h-5 w-5" />
                  Earnings Trend
                </CardTitle>
                <div className="flex border rounded-lg p-1">
                  {(["week", "month", "year"] as const).map((period) => (
                    <Button
                      key={period}
                      variant={
                        earningsTimeframe === period ? "default" : "ghost"
                      }
                      size="sm"
                      onClick={() => setEarningsTimeframe(period)}
                      className="capitalize"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 flex items-end justify-between gap-2">
                  {earningsData.monthlyTrend.map((data, index) => {
                    const height =
                      (data.amount /
                        Math.max(
                          ...earningsData.monthlyTrend.map((d) => d.amount),
                        )) *
                      100;
                    return (
                      <div
                        key={data.month}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="text-xs text-gray-600 mb-2">
                          {(data.amount / 1000000).toFixed(1)}M
                        </div>
                        <div
                          className="w-full bg-primary rounded-t transition-all duration-500 hover:bg-primary/80"
                          style={{ height: `${height}%`, minHeight: "20px" }}
                        ></div>
                        <div className="text-xs font-medium mt-2">
                          {data.month}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {earningsData.averageHourlyRate.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Avg. Hourly Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {earningsData.platformFeeRate}%
                    </div>
                    <div className="text-sm text-gray-600">Platform Fee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {goalProgress}%
                    </div>
                    <div className="text-sm text-gray-600">Goal Progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Subject Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.subjectBreakdown.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {subject.subject}
                      </span>
                      <span className="text-sm text-gray-600">
                        {subject.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${subject.percentage}%`,
                          backgroundColor: subject.color,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(subject.earnings / 1000000).toFixed(1)}M UZS
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Goal Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Current Goal</div>
                  <div className="text-xl font-bold">
                    {(earningsGoal / 1000000).toFixed(1)}M UZS / month
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-xl font-bold text-primary">
                    {goalProgress}%
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(parseFloat(goalProgress), 100)}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Current: {(earningsData.thisMonth / 1000000).toFixed(1)}M UZS
                </span>
                <span>
                  Remaining:{" "}
                  {((earningsGoal - earningsData.thisMonth) / 1000000).toFixed(
                    1,
                  )}
                  M UZS
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment History
              </CardTitle>
              <div className="flex gap-3">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="p-2 border rounded-md text-sm"
                >
                  <option value="all">All Payments</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={payment.student.image}
                          alt={payment.student.name}
                        />
                        <AvatarFallback>
                          {payment.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {payment.student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {payment.subject}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(payment.date).toLocaleDateString()}
                          </span>
                          <span>{payment.paymentMethod}</span>
                          <span>ID: {payment.transactionId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold">
                            {payment.netAmount.toLocaleString()} UZS
                          </div>
                          <div className="text-xs text-gray-500">
                            Gross: {payment.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Fee: -{payment.platformFee.toLocaleString()}
                          </div>
                        </div>
                        <Badge
                          className={`${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Students and Payout History */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Earning Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.topStudents.map((student, index) => (
                  <div
                    key={student.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-600">
                          {student.lessons} lessons
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {(student.earnings / 1000).toFixed(0)}K UZS
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Recent Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutHistory.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <BankCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{payout.method}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(payout.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payout.reference}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {(payout.amount / 1000000).toFixed(1)}M UZS
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Financial Insights & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Growth Tip</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your IELTS lessons earn 23% more than average. Consider
                  promoting this specialty.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    Savings Goal
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  You're on track to save 25% of earnings this month. Great
                  financial discipline!
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">
                    Tax Reminder
                  </span>
                </div>
                <p className="text-sm text-purple-700">
                  Q1 tax documents will be available March 1st. Set aside 20%
                  for taxes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Request Payout</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPayoutModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">
                    Available Balance
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {earningsData.pendingPayments.toLocaleString()} UZS
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payout Method</label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="bank">Bank Transfer (Free)</option>
                    <option value="paypal">PayPal (2% fee)</option>
                    <option value="wise">Wise (1.5% fee)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    max={earningsData.pendingPayments}
                    defaultValue={earningsData.pendingPayments}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="text-xs text-gray-500">
                  • Minimum payout: 100,000 UZS
                  <br />
                  • Processing time: 1-3 business days
                  <br />• You'll receive a confirmation email
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPayoutModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowPayoutModal(false)}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tax Modal */}
        {showTaxModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tax Information</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTaxModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">
                      This Year (2024)
                    </div>
                    <div className="text-xl font-bold text-blue-700">
                      {((earningsData.thisMonth * 12) / 1000000).toFixed(1)}M
                      UZS
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600">Platform Fees</div>
                    <div className="text-xl font-bold text-purple-700">
                      {earningsData.totalPlatformFees.toLocaleString()} UZS
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Available Documents</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">2024 Tax Summary</div>
                          <div className="text-sm text-gray-600">
                            January - Current
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Monthly Statements</div>
                          <div className="text-sm text-gray-600">
                            All months available
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm text-amber-800">
                    <strong>Tax Note:</strong> These documents are for reference
                    only. Please consult with a tax professional for official
                    tax filing requirements in Uzbekistan.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowTaxModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReviewsManagement = () => {
    const displayReviews =
      reviewsTab === "recent" ? recentReviews : filterReviews(allReviews);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reviews & Ratings
            </h1>
            <p className="text-gray-600">Monitor student reviews and ratings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reviews
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Quick Response
            </Button>
            <Button>
              <TrendingUpIcon className="h-4 w-4 mr-2" />
              Improve Rating
            </Button>
          </div>
        </div>

        {/* Rating Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.floor(reviewsData.overallRating), "lg")}
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {reviewsData.overallRating}
              </div>
              <div className="text-sm text-gray-600">Overall Rating</div>
              <div className="text-xs text-green-600 mt-1">
                {reviewsData.ratingTrend} this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {reviewsData.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
              <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {reviewsData.recentRating}
              </div>
              <div className="text-sm text-gray-600">Recent Rating</div>
              <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                #{reviewsData.ranking}
              </div>
              <div className="text-sm text-gray-600">Subject Ranking</div>
              <div className="text-xs text-green-600 mt-1">
                Top 5% in English
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Analytics and Breakdown */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rating Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-48 flex items-end justify-between gap-2">
                  {reviewsData.monthlyTrend.map((data, index) => {
                    const height = (data.rating / 5) * 100;
                    return (
                      <div
                        key={data.month}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="text-xs text-gray-600 mb-2">
                          {data.rating}
                        </div>
                        <div
                          className="w-full bg-primary rounded-t transition-all duration-500 hover:bg-primary/80"
                          style={{ height: `${height}%`, minHeight: "20px" }}
                        ></div>
                        <div className="text-xs font-medium mt-2">
                          {data.month}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {reviewsData.responseRate}%
                    </div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-gray-600">Avg. Platform</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      +15%
                    </div>
                    <div className="text-sm text-gray-600">Above Average</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviewsData.ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {dist.stars}
                        </span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {dist.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${dist.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {dist.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviewsData.subjectRatings.map((subject) => (
                <div key={subject.subject} className="p-4 border rounded-lg">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">{subject.subject}</h3>
                    <div className="flex items-center justify-center">
                      {renderStars(Math.floor(subject.rating))}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {subject.rating}
                    </div>
                    <div className="text-sm text-gray-600">
                      {subject.reviews} reviews
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Card>
          <CardContent className="p-0">
            <div className="flex border-b">
              {(
                [
                  {
                    id: "recent",
                    label: "Recent Reviews",
                    count: recentReviews.length,
                  },
                  { id: "all", label: "All Reviews", count: allReviews.length },
                  { id: "analytics", label: "Analytics", count: 0 },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReviewsTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    reviewsTab === tab.id
                      ? "border-b-2 border-primary text-primary bg-primary/5"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Filters and Search */}
            {reviewsTab !== "analytics" && (
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search reviews by student, content, or subject..."
                        value={searchReviews}
                        onChange={(e) => setSearchReviews(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value as any)}
                    className="p-2 border rounded-md"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as any)}
                    className="p-2 border rounded-md"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Content */}
        {reviewsTab === "analytics" ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Common Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviewsData.commonKeywords.map((keyword, index) => (
                    <div
                      key={keyword.word}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            #{index + 1}
                          </span>
                        </div>
                        <span className="font-medium capitalize">
                          {keyword.word}
                        </span>
                      </div>
                      <Badge variant="outline">{keyword.count} mentions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Review Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verified Reviews</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Review Length</span>
                  <span className="font-semibold">127 words</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold text-blue-600">
                    {reviewsData.responseRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Helpful Votes</span>
                  <span className="font-semibold">156 total</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {displayReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={review.student.image}
                            alt={review.student.name}
                          />
                          <AvatarFallback>
                            {review.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              {review.student.name}
                            </h3>
                            {review.student.verified && (
                              <Verified className="h-4 w-4 text-blue-500" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {review.student.level}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-600">
                              {review.lesson.subject} • {review.lesson.duration}{" "}
                              min
                            </span>
                          </div>

                          <div className="text-gray-700 mb-3">
                            {review.review}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-blue-600">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{review.helpful} helpful</span>
                            </button>
                            <span>•</span>
                            <span>
                              Lesson:{" "}
                              {new Date(
                                review.lesson.date,
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          {review.replied && review.response && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-2">
                                <Reply className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  Your Response
                                </span>
                              </div>
                              <p className="text-sm text-blue-800">
                                {review.response}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!review.replied && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReview(review);
                              setShowReplyModal(true);
                            }}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
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
                              <Flag className="h-4 w-4 mr-2" />
                              Report Review
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Message Student
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              Share Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Reply to Review</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">
                      {selectedReview.student.name}
                    </span>
                    {renderStars(selectedReview.rating, "sm")}
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedReview.review}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Response</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Thank the student for their feedback and address any points they mentioned..."
                    className="w-full p-3 border rounded-md min-h-[100px] resize-none"
                  />
                  <div className="text-xs text-gray-500">
                    Keep your response professional, positive, and helpful.
                    Students can see all replies.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowReplyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText("");
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSettingsManagement = () => {
    const settingsTabs = [
      {
        id: "account",
        label: "Account",
        icon: User,
        description: "Personal information and security",
      },
      {
        id: "professional",
        label: "Professional",
        icon: GraduationCap,
        description: "Teaching profile and preferences",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        description: "Email, SMS, and push notifications",
      },
      {
        id: "privacy",
        label: "Privacy",
        icon: Shield,
        description: "Visibility and data sharing",
      },
      {
        id: "billing",
        label: "Billing",
        icon: CreditCard,
        description: "Payment methods and billing",
      },
      {
        id: "calendar",
        label: "Calendar",
        icon: CalendarIcon,
        description: "Schedule integration and sync",
      },
      {
        id: "communication",
        label: "Communication",
        icon: MessageCircle,
        description: "Language and communication tools",
      },
      {
        id: "integrations",
        label: "Integrations",
        icon: Link2,
        description: "Third-party apps and services",
      },
      {
        id: "data",
        label: "Data",
        icon: Database,
        description: "Account data and management",
      },
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex gap-3">
            {settingsChanged && (
              <Button onClick={() => setSettingsChanged(false)}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1 p-4">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id as any)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeSettingsTab === tab.id
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div
                          className={`text-xs mt-1 ${
                            activeSettingsTab === tab.id
                              ? "text-white/80"
                              : "text-gray-500"
                          }`}
                        >
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeSettingsTab === "account" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profileImage} alt="Profile" />
                          <AvatarFallback className="text-xl">
                            {profileData.firstName[0]}
                            {profileData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            First Name
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue={profileData.firstName}
                            onChange={() => setSettingsChanged(true)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Last Name
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue={profileData.lastName}
                            onChange={() => setSettingsChanged(true)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Email Address
                          </label>
                          <div className="flex gap-2">
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              defaultValue={profileData.email}
                              onChange={() => setSettingsChanged(true)}
                            />
                            <Button variant="outline" size="sm">
                              <Verified className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Phone Number
                          </label>
                          <div className="flex gap-2">
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              defaultValue={profileData.phone}
                              onChange={() => setSettingsChanged(true)}
                            />
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Change Password
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="password"
                          placeholder="Current password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        <input
                          type="password"
                          placeholder="Confirm password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          Two-Factor Authentication
                        </div>
                        <div className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          twoFactorEnabled ? "bg-primary" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium">Login History</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Current session - Tashkent, Uzbekistan</span>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>2 days ago - Tashkent, Uzbekistan</span>
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "professional" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Teaching Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Professional Title
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue={profileData.title}
                        onChange={() => setSettingsChanged(true)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Years of Experience
                      </label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue={profileData.experience}
                      >
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Teaching Specializations
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.subjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="outline"
                            className="cursor-pointer"
                          >
                            {subject}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Subject
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Hourly Rate (UZS)
                      </label>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue={profileData.hourlyRate}
                        onChange={() => setSettingsChanged(true)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Preferred Student Age Groups
                        </label>
                        <div className="space-y-2">
                          {[
                            "Children (6-12)",
                            "Teenagers (13-17)",
                            "Adults (18-65)",
                            "Seniors (65+)",
                          ].map((age) => (
                            <label
                              key={age}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                defaultChecked
                                className="rounded"
                              />
                              <span className="text-sm">{age}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Maximum Students per Lesson
                        </label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="1">1 student (Individual)</option>
                          <option value="2">2 students</option>
                          <option value="3">3 students</option>
                          <option value="5">5 students (Small group)</option>
                          <option value="10">10+ students (Large group)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries({
                      bookingRequests: "New booking requests",
                      paymentConfirmations: "Payment confirmations",
                      studentMessages: "Student messages",
                      scheduleReminders: "Schedule reminders",
                      marketing: "Marketing and promotional emails",
                    }).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-gray-600">
                            Receive notifications via email
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEmailNotifications((prev) => ({
                              ...prev,
                              [key]: !prev[key as keyof typeof prev],
                            }));
                            setSettingsChanged(true);
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            emailNotifications[
                              key as keyof typeof emailNotifications
                            ]
                              ? "bg-primary"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              emailNotifications[
                                key as keyof typeof emailNotifications
                              ]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      SMS Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries({
                      urgentBookings: "Urgent booking requests",
                      lessonReminders: "Lesson reminders (30 min before)",
                      payments: "Payment notifications",
                      emergency: "Emergency and important alerts",
                    }).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-gray-600">
                            Receive notifications via SMS
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSmsNotifications((prev) => ({
                              ...prev,
                              [key]: !prev[key as keyof typeof prev],
                            }));
                            setSettingsChanged(true);
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            smsNotifications[
                              key as keyof typeof smsNotifications
                            ]
                              ? "bg-primary"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              smsNotifications[
                                key as keyof typeof smsNotifications
                              ]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Push Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries({
                      mobile: "Mobile app notifications",
                      browser: "Browser notifications",
                      sounds: "Notification sounds",
                      quietHours: "Quiet hours (10 PM - 8 AM)",
                    }).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-gray-600">
                            Enable push notifications
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setPushNotifications((prev) => ({
                              ...prev,
                              [key]: !prev[key as keyof typeof prev],
                            }));
                            setSettingsChanged(true);
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            pushNotifications[
                              key as keyof typeof pushNotifications
                            ]
                              ? "bg-primary"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              pushNotifications[
                                key as keyof typeof pushNotifications
                              ]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "privacy" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Profile Visibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Profile Visibility
                        </label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={privacySettings.profileVisibility}
                          onChange={(e) => {
                            setPrivacySettings((prev) => ({
                              ...prev,
                              profileVisibility: e.target.value,
                            }));
                            setSettingsChanged(true);
                          }}
                        >
                          <option value="public">
                            Public - Visible to all users
                          </option>
                          <option value="verified">
                            Verified students only
                          </option>
                          <option value="private">
                            Private - Direct bookings only
                          </option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Show in search results
                          </div>
                          <div className="text-sm text-gray-600">
                            Allow students to find you through search
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setPrivacySettings((prev) => ({
                              ...prev,
                              searchVisible: !prev.searchVisible,
                            }));
                            setSettingsChanged(true);
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            privacySettings.searchVisible
                              ? "bg-primary"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              privacySettings.searchVisible
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Show online status</div>
                          <div className="text-sm text-gray-600">
                            Display when you're online and available
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setPrivacySettings((prev) => ({
                              ...prev,
                              activityStatus: !prev.activityStatus,
                            }));
                            setSettingsChanged(true);
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            privacySettings.activityStatus
                              ? "bg-primary"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              privacySettings.activityStatus
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          GDPR Compliance
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        We comply with GDPR regulations. You have the right to
                        access, modify, or delete your personal data.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download My Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Privacy Policy
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Cookie Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-medium">Bank Transfer</div>
                            <div className="text-sm text-gray-600">
                              **** **** **** 1234
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            Primary
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Wallet className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-gray-600">
                              aziza@example.com
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payout Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Payout Schedule
                        </label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="weekly">Weekly (Fridays)</option>
                          <option value="biweekly">
                            Bi-weekly (1st & 15th)
                          </option>
                          <option value="monthly">
                            Monthly (1st of month)
                          </option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Minimum Payout (UZS)
                        </label>
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          defaultValue="100000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "calendar" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Calendar Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries({
                      google: { name: "Google Calendar", icon: Globe },
                      outlook: { name: "Outlook Calendar", icon: Mail },
                      apple: { name: "Apple Calendar", icon: Monitor },
                    }).map(([key, calendar]) => {
                      const Icon = calendar.icon;
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-8 w-8 text-blue-600" />
                            <div>
                              <div className="font-medium">{calendar.name}</div>
                              <div className="text-sm text-gray-600">
                                {calendarSync[key as keyof typeof calendarSync]
                                  ? "Connected"
                                  : "Not connected"}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={
                              calendarSync[key as keyof typeof calendarSync]
                                ? "outline"
                                : "default"
                            }
                            size="sm"
                            onClick={() => {
                              setCalendarSync((prev) => ({
                                ...prev,
                                [key]: !prev[key as keyof typeof prev],
                              }));
                              setSettingsChanged(true);
                            }}
                          >
                            {calendarSync[key as keyof typeof calendarSync]
                              ? "Disconnect"
                              : "Connect"}
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time Zone</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="Asia/Tashkent">
                            Tashkent (UTC+5)
                          </option>
                          <option value="Asia/Almaty">Almaty (UTC+6)</option>
                          <option value="Europe/Moscow">Moscow (UTC+3)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Buffer Time (minutes)
                        </label>
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          defaultValue="15"
                          min="0"
                          max="60"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "communication" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Language Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Primary Teaching Language
                        </label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={languageSettings.primary}
                          onChange={(e) => {
                            setLanguageSettings((prev) => ({
                              ...prev,
                              primary: e.target.value,
                            }));
                            setSettingsChanged(true);
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Uzbek">Uzbek</option>
                          <option value="Russian">Russian</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Platform Interface
                        </label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={languageSettings.interface}
                          onChange={(e) => {
                            setLanguageSettings((prev) => ({
                              ...prev,
                              interface: e.target.value,
                            }));
                            setSettingsChanged(true);
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Uzbek">O'zbek</option>
                          <option value="Russian">Русский</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          Auto-translate messages
                        </div>
                        <div className="text-sm text-gray-600">
                          Automatically translate student messages
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLanguageSettings((prev) => ({
                            ...prev,
                            autoTranslate: !prev.autoTranslate,
                          }));
                          setSettingsChanged(true);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          languageSettings.autoTranslate
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            languageSettings.autoTranslate
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Communication Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Video className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-medium">Video Lessons</div>
                            <div className="text-sm text-gray-600">
                              Zoom integration active
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Connected
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MessageCircle className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-medium">Messaging</div>
                            <div className="text-sm text-gray-600">
                              Platform messaging enabled
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "integrations" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Connected Apps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        name: "Zoom",
                        description: "Video conferencing",
                        connected: true,
                        icon: Video,
                      },
                      {
                        name: "Google Drive",
                        description: "File storage and sharing",
                        connected: true,
                        icon: Cloud,
                      },
                      {
                        name: "Calendly",
                        description: "Appointment scheduling",
                        connected: false,
                        icon: CalendarIcon,
                      },
                      {
                        name: "Slack",
                        description: "Team communication",
                        connected: false,
                        icon: MessageCircle,
                      },
                    ].map((app) => {
                      const Icon = app.icon;
                      return (
                        <div
                          key={app.name}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-8 w-8 text-blue-600" />
                            <div>
                              <div className="font-medium">{app.name}</div>
                              <div className="text-sm text-gray-600">
                                {app.description}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={app.connected ? "outline" : "default"}
                            size="sm"
                          >
                            {app.connected ? "Disconnect" : "Connect"}
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSettingsTab === "data" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Account Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All My Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export Learning History
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Download Financial Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <Trash2 className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="font-medium text-red-900 mb-2">
                        Delete Account
                      </div>
                      <p className="text-sm text-red-700 mb-4">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-600">
                    Delete Account
                  </h2>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete your account? This will
                  permanently remove:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Your profile and teaching information</li>
                  <li>• All student reviews and ratings</li>
                  <li>• Lesson history and records</li>
                  <li>• Financial and payment data</li>
                </ul>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="DELETE"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            This feature is under development and will be available soon.
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveSection("overview")}
          >
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
        return renderBookingsManagement();
      case "earnings":
        return renderEarningsManagement();
      case "reviews":
        return renderReviewsManagement();
      case "settings":
        return renderSettingsManagement();
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
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{teacher.name}</div>
              <div className="text-sm text-gray-600">{teacher.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`w-2 h-2 rounded-full ${teacher.isOnline ? "bg-green-500" : "bg-gray-400"}`}
            ></div>
            <span className="text-sm text-gray-600">
              {teacher.isOnline ? "Online" : "Offline"}
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
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.count && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className="ml-auto"
                      >
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
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
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
                {sidebarItems.find((item) => item.id === activeSection)
                  ?.label || "Dashboard"}
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
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
