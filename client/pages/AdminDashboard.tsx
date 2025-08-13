import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, GraduationCap, DollarSign, Star, TrendingUp, AlertTriangle, 
  Calendar, MessageSquare, FileText, Settings, BarChart3, Shield,
  CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock admin data
  const adminData = {
    name: "Admin User",
    role: "Super Administrator",
    lastLogin: "2024-01-20T10:30:00"
  };

  // Mock platform statistics
  const stats = {
    totalUsers: 2847,
    totalStudents: 2134,
    totalTeachers: 713,
    activeTeachers: 456,
    pendingApprovals: 24,
    totalLessons: 15672,
    completedLessons: 14890,
    totalRevenue: 89750000,
    monthlyRevenue: 12450000,
    commission: 1245000,
    avgRating: 4.7,
    disputesOpen: 8,
    reportsUnresolved: 12
  };

  // Growth metrics
  const growth = {
    users: 12.5,
    revenue: 8.3,
    lessons: 15.7,
    teachers: 6.2
  };

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "user_registration",
      user: "Sarah Johnson",
      action: "New student registered",
      timestamp: "2024-01-20T15:30:00",
      status: "success"
    },
    {
      id: 2,
      type: "teacher_approval",
      user: "Ahmed Hassan",
      action: "Teacher application approved",
      timestamp: "2024-01-20T14:15:00",
      status: "success"
    },
    {
      id: 3,
      type: "payment",
      user: "John Doe",
      action: "Payment processed - 75,000 UZS",
      timestamp: "2024-01-20T13:45:00",
      status: "success"
    },
    {
      id: 4,
      type: "dispute",
      user: "Maria Garcia",
      action: "Lesson dispute reported",
      timestamp: "2024-01-20T12:20:00",
      status: "warning"
    },
    {
      id: 5,
      type: "review",
      user: "David Wilson",
      action: "Inappropriate review flagged",
      timestamp: "2024-01-20T11:10:00",
      status: "warning"
    }
  ];

  // Pending actions
  const pendingActions = [
    {
      id: 1,
      type: "teacher_approval",
      title: "Teacher Applications",
      count: 24,
      urgency: "high",
      description: "New teacher applications awaiting approval"
    },
    {
      id: 2,
      type: "disputes",
      title: "Lesson Disputes",
      count: 8,
      urgency: "medium",
      description: "Student-teacher disputes requiring resolution"
    },
    {
      id: 3,
      type: "reports",
      title: "Content Reports",
      count: 12,
      urgency: "medium",
      description: "Reported reviews and content for moderation"
    },
    {
      id: 4,
      type: "payouts",
      title: "Pending Payouts",
      count: 156,
      urgency: "low",
      description: "Teacher payment requests pending processing"
    }
  ];

  // Top performing teachers
  const topTeachers = [
    {
      id: 1,
      name: "Aziza Karimova",
      subject: "English",
      rating: 4.9,
      lessons: 127,
      revenue: 3175000,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "John Smith",
      subject: "Mathematics",
      rating: 4.8,
      lessons: 98,
      revenue: 2450000,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Malika Tosheva",
      subject: "Programming",
      rating: 5.0,
      lessons: 84,
      revenue: 4200000,
      image: "/placeholder.svg"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration": return Users;
      case "teacher_approval": return GraduationCap;
      case "payment": return DollarSign;
      case "dispute": return AlertTriangle;
      case "review": return Star;
      default: return FileText;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TutorUZ Admin Panel</h1>
            <p className="text-gray-600">Welcome back, {adminData.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Shield className="h-3 w-3 mr-1" />
              {adminData.role}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin-settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              localStorage.removeItem("adminAuth");
              window.location.href = "/admin-login";
            }}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">+{growth.users}% this month</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.activeTeachers}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">+{growth.teachers}% this month</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">{(stats.monthlyRevenue / 1000000).toFixed(1)}M UZS</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">+{growth.revenue}% this month</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.completedLessons.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">+{growth.lessons}% this month</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Actions</span>
                  <Badge variant="destructive">{pendingActions.reduce((sum, action) => sum + action.count, 0)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pendingActions.map((action) => (
                    <Card key={action.id} className={`border-l-4 ${getUrgencyColor(action.urgency)} cursor-pointer hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{action.title}</h4>
                          <Badge variant="outline">{action.count}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <Button size="sm" variant="outline" className="mt-3 w-full">
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Top Teachers */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)} bg-gray-100`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.user}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Performing Teachers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topTeachers.map((teacher, index) => (
                      <div key={teacher.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-bold text-gray-500">#{index + 1}</div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={teacher.image} alt={teacher.name} />
                            <AvatarFallback>
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{teacher.name}</p>
                            <p className="text-sm text-gray-600">{teacher.subject}</p>
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{teacher.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600">{teacher.lessons} lessons</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lesson Completion Rate</span>
                    <span className="font-medium">{((stats.completedLessons / stats.totalLessons) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.completedLessons / stats.totalLessons) * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Teacher Approval Rate</span>
                    <span className="font-medium">92.5%</span>
                  </div>
                  <Progress value={92.5} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Rating</span>
                    <span className="font-medium">{stats.avgRating}/5.0</span>
                  </div>
                  <Progress value={(stats.avgRating / 5) * 100} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-medium">{(stats.totalRevenue / 1000000).toFixed(1)}M UZS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Commission Earned</span>
                    <span className="font-medium">{(stats.commission / 1000000).toFixed(1)}M UZS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Payouts</span>
                    <span className="font-medium">2.3M UZS</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Net Profit</span>
                    <span className="font-bold text-green-600">
                      {((stats.commission - 500000) / 1000000).toFixed(1)}M UZS
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issues & Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Open Disputes</span>
                    </div>
                    <Badge variant="destructive">{stats.disputesOpen}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Unresolved Reports</span>
                    </div>
                    <Badge variant="secondary">{stats.reportsUnresolved}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">System Status</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">Healthy</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs content will be placeholder for now */}
          {["users", "content", "finance", "quality", "analytics", "reports"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab} Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This section is under development. Full {tab} management features coming soon.
                    </p>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
