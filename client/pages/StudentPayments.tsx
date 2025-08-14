import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Search, Calendar, History, CreditCard, Star, Settings,
  User, BookOpen, Filter, MapPin, Clock, DollarSign, Heart, MessageCircle,
  Phone, Mail, ChevronRight, Award, CheckCircle, AlertCircle, Eye, Edit3,
  LogOut, Upload, Plus, X, Download, Video, Bell, Users, TrendingUp, MoreHorizontal,
  Receipt, Wallet, Shield, Banknote, FileText, AlertTriangle, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
}

export default function StudentPayments() {
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Mock student data
  const student = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder.svg",
    joinDate: "2024-01-01",
    profileCompletion: 75,
    totalLessons: 24,
    favoriteTeachers: 5
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

  // Mock payment data
  const paymentStats = {
    totalSpent: 1250000,
    thisMonth: 180000,
    avgPerLesson: 52000,
    savedAmount: 85000,
    pendingPayments: 2,
    autoPayEnabled: true
  };

  const paymentHistory = [
    {
      id: 1,
      teacher: "Aziza Karimova",
      teacherImage: "/placeholder.svg",
      subject: "English Conversation",
      amount: 50000,
      date: "2024-01-18",
      status: "completed",
      transactionId: "TXN-001",
      paymentMethod: "UZCard •••• 1234",
      lessonDuration: 60
    },
    {
      id: 2,
      teacher: "Sarah Johnson",
      teacherImage: "/placeholder.svg",
      subject: "Business English",
      amount: 65000,
      date: "2024-01-16",
      status: "completed",
      transactionId: "TXN-002",
      paymentMethod: "Humo •••• 5678",
      lessonDuration: 45
    },
    {
      id: 3,
      teacher: "Bobur Umarov",
      teacherImage: "/placeholder.svg",
      subject: "Mathematics",
      amount: 67500,
      date: "2024-01-15",
      status: "pending",
      transactionId: "TXN-003",
      paymentMethod: "UZCard •••• 1234",
      lessonDuration: 90
    }
  ];

  const savedCards = [
    {
      id: 1,
      type: "UZCard",
      last4: "1234",
      expiry: "12/26",
      isDefault: true,
      bank: "NBU"
    },
    {
      id: 2,
      type: "Humo",
      last4: "5678",
      expiry: "08/25",
      isDefault: false,
      bank: "Kapital Bank"
    }
  ];

  const monthlySpending = [
    { month: "Oct", amount: 95000 },
    { month: "Nov", amount: 120000 },
    { month: "Dec", amount: 145000 },
    { month: "Jan", amount: 180000 }
  ];

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
            <BreadcrumbPage>Payments & Billing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600">Manage your payment methods and transaction history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Statement
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {paymentStats.totalSpent.toLocaleString()} UZS
            </div>
            <div className="text-gray-600">Total Spent</div>
            <div className="text-sm text-green-600 mt-1">All time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {paymentStats.thisMonth.toLocaleString()} UZS
            </div>
            <div className="text-gray-600">This Month</div>
            <div className="text-sm text-blue-600 mt-1">+24% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {paymentStats.avgPerLesson.toLocaleString()} UZS
            </div>
            <div className="text-gray-600">Avg. per Lesson</div>
            <div className="text-sm text-gray-500 mt-1">Based on {student.totalLessons} lessons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{paymentStats.pendingPayments}</div>
            <div className="text-gray-600">Pending Payments</div>
            <div className="text-sm text-amber-600 mt-1">Requires action</div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlySpending.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <div className="font-medium">{item.month} 2024</div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold">{item.amount.toLocaleString()} UZS</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{card.type} •••• {card.last4}</div>
                      <div className="text-sm text-gray-500">{card.bank} • Expires {card.expiry}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Set as Default</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Recent Transactions
            </span>
            <Button variant="ghost" size="sm" onClick={() => setActiveSection("history")}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={payment.teacherImage} alt={payment.teacher} />
                    <AvatarFallback>
                      {payment.teacher.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{payment.teacher}</div>
                    <div className="text-gray-600 text-sm">{payment.subject}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(payment.date).toLocaleDateString()} • {payment.lessonDuration} minutes
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{payment.amount.toLocaleString()} UZS</div>
                  <Badge className={payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {payment.status}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">{payment.paymentMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-pay Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Shield className="h-5 w-5" />
            Auto-pay Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-green-900">Auto-pay is enabled</div>
              <div className="text-sm text-green-700">
                Payments will be automatically processed after each lesson using your default payment method
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage Auto-pay
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">View all your payment transactions and receipts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input 
              placeholder="Search by teacher name, subject, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={payment.teacherImage} alt={payment.teacher} />
                      <AvatarFallback>
                        {payment.teacher.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{payment.teacher}</h3>
                      <div className="text-gray-600">{payment.subject}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(payment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {payment.lessonDuration} minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {payment.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {payment.amount.toLocaleString()} UZS
                    </div>
                    <Badge className={`${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    } mb-2`}>
                      {payment.status}
                    </Badge>
                    <div className="text-xs text-gray-500">ID: {payment.transactionId}</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Rate: {(payment.amount / payment.lessonDuration * 60).toLocaleString()} UZS/hour
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {payment.status === 'pending' && (
                      <Button size="sm">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Complete Payment
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
  );

  const renderComingSoon = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
        <p className="text-gray-600">Manage your payment methods and billing information</p>
      </div>
      
      <Card className="text-center p-12">
        <CardContent>
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our comprehensive payment and billing management system is under development and will be available soon. 
            You'll be able to manage payment methods, view transaction history, and handle billing seamlessly.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Wallet className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-semibold mb-1">Payment Methods</div>
              <div className="text-sm text-gray-600">Securely manage your cards and payment options</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Receipt className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="font-semibold mb-1">Transaction History</div>
              <div className="text-sm text-gray-600">View detailed payment history and receipts</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="font-semibold mb-1">Secure Billing</div>
              <div className="text-sm text-gray-600">Auto-pay and secure payment processing</div>
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
              <Calendar className="h-4 w-4 mr-2" />
              View Bookings
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
      case "history":
        return renderHistory();
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
              const isActive = item.id === "payments";
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === "payments") {
                        setActiveSection("coming-soon");
                      } else if (item.id === "reviews") {
                        navigate("/student-reviews");
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
              <h2 className="text-xl font-semibold text-gray-900">Payments & Billing</h2>
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
