import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Search, Filter, Users, GraduationCap, UserCheck, UserX, 
  MoreHorizontal, Mail, Phone, Calendar, Star, DollarSign, Eye, Edit3,
  Trash2, Download, Upload, Shield, AlertTriangle, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'student' | 'teacher';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  image: string;
  verified: boolean;
  stats?: {
    lessons?: number;
    rating?: number;
    earnings?: number;
    students?: number;
  };
}

export default function AdminUsers() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock users data
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+998901234567",
      type: "student",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20T10:30:00",
      image: "/placeholder.svg",
      verified: true,
      stats: { lessons: 12 }
    },
    {
      id: "2",
      name: "Aziza Karimova",
      email: "aziza@example.com",
      phone: "+998909876543",
      type: "teacher",
      status: "active",
      joinDate: "2024-01-01",
      lastActive: "2024-01-20T15:45:00",
      image: "/placeholder.svg",
      verified: true,
      stats: { lessons: 127, rating: 4.9, earnings: 3175000, students: 89 }
    },
    {
      id: "3",
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+998905551234",
      type: "student",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-19T20:15:00",
      image: "/placeholder.svg",
      verified: true,
      stats: { lessons: 8 }
    },
    {
      id: "4",
      name: "Ahmad Hassan",
      email: "ahmad@example.com",
      phone: "+998907778899",
      type: "teacher",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-20T09:00:00",
      image: "/placeholder.svg",
      verified: false,
      stats: { lessons: 0, rating: 0, earnings: 0, students: 0 }
    },
    {
      id: "5",
      name: "Maria Garcia",
      email: "maria@example.com",
      phone: "+998906667788",
      type: "student",
      status: "suspended",
      joinDate: "2024-01-05",
      lastActive: "2024-01-18T14:30:00",
      image: "/placeholder.svg",
      verified: true,
      stats: { lessons: 3 }
    },
    {
      id: "6",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+998904443322",
      type: "teacher",
      status: "inactive",
      joinDate: "2023-12-20",
      lastActive: "2024-01-10T11:20:00",
      image: "/placeholder.svg",
      verified: true,
      stats: { lessons: 45, rating: 4.2, earnings: 1125000, students: 23 }
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || user.type === selectedTab;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesTab && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "pending": return AlertTriangle;
      case "suspended": return UserX;
      case "inactive": return UserCheck;
      default: return UserCheck;
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implement bulk actions
    setSelectedUsers([]);
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.type === 'student').length,
    teachers: users.filter(u => u.type === 'teacher').length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage students, teachers, and user accounts</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
              <div className="text-sm text-gray-600">Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.teachers}</div>
              <div className="text-sm text-gray-600">Teachers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{stats.suspended}</div>
              <div className="text-sm text-gray-600">Suspended</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All Users ({stats.total})</TabsTrigger>
              <TabsTrigger value="student">Students ({stats.students})</TabsTrigger>
              <TabsTrigger value="teacher">Teachers ({stats.teachers})</TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <TabsContent value={selectedTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 w-12">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Joined</th>
                        <th className="text-left p-4">Last Active</th>
                        <th className="text-left p-4">Stats</th>
                        <th className="text-left p-4 w-12">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const StatusIcon = getStatusIcon(user.status);
                        return (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleSelectUser(user.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={user.image} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900 flex items-center gap-2">
                                    {user.name}
                                    {user.verified && (
                                      <Shield className="h-3 w-3 text-blue-500" />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-sm text-gray-500">{user.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="capitalize">
                                {user.type === 'student' ? (
                                  <Users className="h-3 w-3 mr-1" />
                                ) : (
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                )}
                                {user.type}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(user.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-gray-900">
                                {new Date(user.joinDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-gray-900">
                                {new Date(user.lastActive).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(user.lastActive).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="p-4">
                              {user.type === 'teacher' ? (
                                <div className="space-y-1">
                                  <div className="text-sm flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {user.stats?.lessons} lessons
                                  </div>
                                  <div className="text-sm flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    {user.stats?.rating}
                                  </div>
                                  <div className="text-sm flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {user.stats?.earnings?.toLocaleString()} UZS
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {user.stats?.lessons} lessons
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  {user.status === 'active' ? (
                                    <DropdownMenuItem className="text-red-600">
                                      <UserX className="h-4 w-4 mr-2" />
                                      Suspend User
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem className="text-green-600">
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Activate User
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
