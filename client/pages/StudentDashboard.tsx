import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Video, MessageCircle, Star, BookOpen, User, CreditCard, ChevronRight, Play, Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock student data
  const student = {
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg",
    joinDate: "2024-01-01",
    totalLessons: 15,
    totalSpent: 750000,
    favoriteSubjects: ["English", "Mathematics"],
    learningStreak: 12
  };

  // Mock lessons data
  const upcomingLessons = [
    {
      id: 1,
      teacher: {
        name: "Aziza Karimova",
        subject: "English",
        image: "/placeholder.svg"
      },
      date: "2024-01-20",
      time: "14:00",
      duration: 60,
      type: "IELTS Preparation",
      status: "confirmed",
      meetingLink: "https://meet.tutoruz.com/room123"
    },
    {
      id: 2,
      teacher: {
        name: "John Smith",
        subject: "Mathematics",
        image: "/placeholder.svg"
      },
      date: "2024-01-22",
      time: "16:00",
      duration: 60,
      type: "Calculus",
      status: "pending",
      meetingLink: null
    }
  ];

  const completedLessons = [
    {
      id: 3,
      teacher: {
        name: "Aziza Karimova",
        subject: "English",
        image: "/placeholder.svg"
      },
      date: "2024-01-15",
      time: "14:00",
      duration: 60,
      type: "Business English",
      status: "completed",
      rating: 5,
      review: "Excellent lesson! Very helpful with pronunciation.",
      recordingUrl: "/recordings/lesson-3.mp4",
      materials: ["Grammar_Rules.pdf", "Vocabulary_List.docx"]
    },
    {
      id: 4,
      teacher: {
        name: "Malika Tosheva",
        subject: "Programming",
        image: "/placeholder.svg"
      },
      date: "2024-01-12",
      time: "10:00",
      duration: 60,
      type: "React Basics",
      status: "completed",
      rating: 5,
      review: "Great introduction to React concepts!",
      recordingUrl: "/recordings/lesson-4.mp4",
      materials: ["React_Tutorial.pdf", "Code_Examples.zip"]
    },
    {
      id: 5,
      teacher: {
        name: "John Smith",
        subject: "Mathematics",
        image: "/placeholder.svg"
      },
      date: "2024-01-10",
      time: "16:00",
      duration: 30,
      type: "Trial Lesson",
      status: "completed",
      rating: 4,
      review: "Good trial lesson, helped me understand the teaching style.",
      recordingUrl: null,
      materials: []
    }
  ];

  const favoriteTeachers = [
    {
      id: 1,
      name: "Aziza Karimova",
      subject: "English Language",
      image: "/placeholder.svg",
      rating: 4.9,
      totalLessons: 8,
      lastLesson: "2024-01-15"
    },
    {
      id: 2,
      name: "Malika Tosheva",
      subject: "Programming",
      image: "/placeholder.svg",
      rating: 5.0,
      totalLessons: 4,
      lastLesson: "2024-01-12"
    }
  ];

  const learningStats = {
    totalHours: 22.5,
    avgRating: 4.8,
    completionRate: 95,
    subjectProgress: [
      { subject: "English", hours: 12, progress: 75 },
      { subject: "Programming", hours: 6, progress: 60 },
      { subject: "Mathematics", hours: 4.5, progress: 40 }
    ]
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}!</h1>
              <p className="text-gray-600">Here's your learning progress and upcoming lessons</p>
            </div>
            <div className="flex gap-3">
              <Link to="/teachers">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Find New Teacher
                </Button>
              </Link>
              <Link to="/student-profile">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lessons">My Lessons</TabsTrigger>
              <TabsTrigger value="teachers">Favorite Teachers</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
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
                    <div className="text-3xl font-bold text-primary mb-2">{learningStats.totalHours}h</div>
                    <div className="text-gray-600">Learning Hours</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{student.learningStreak}</div>
                    <div className="text-gray-600">Day Streak</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{learningStats.avgRating}</div>
                    <div className="text-gray-600">Avg Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Lessons
                    </span>
                    <Link to="/lessons">
                      <Button variant="ghost" size="sm">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingLessons.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingLessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={lesson.teacher.image} alt={lesson.teacher.name} />
                              <AvatarFallback>
                                {lesson.teacher.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{lesson.teacher.name}</div>
                              <div className="text-sm text-gray-600">{lesson.type}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(lesson.date).toLocaleDateString()}</span>
                                <Clock className="h-3 w-3" />
                                <span>{lesson.time}</span>
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
                      <p>No upcoming lessons scheduled</p>
                      <Link to="/teachers">
                        <Button className="mt-4">Book Your First Lesson</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedLessons.slice(0, 3).map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={lesson.teacher.image} alt={lesson.teacher.name} />
                            <AvatarFallback>
                              {lesson.teacher.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lesson.teacher.name}</div>
                            <div className="text-sm text-gray-600">{lesson.type}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(lesson.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < lesson.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          {lesson.recordingUrl && (
                            <Button variant="ghost" size="sm">
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="space-y-6">
              <div className="grid gap-6">
                {/* Upcoming Lessons */}
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
                                <AvatarImage src={lesson.teacher.image} alt={lesson.teacher.name} />
                                <AvatarFallback>
                                  {lesson.teacher.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{lesson.teacher.name}</div>
                                <div className="text-sm text-gray-600">{lesson.type}</div>
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

                {/* Completed Lessons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson History ({completedLessons.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {completedLessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={lesson.teacher.image} alt={lesson.teacher.name} />
                                <AvatarFallback>
                                  {lesson.teacher.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{lesson.teacher.name}</div>
                                <div className="text-sm text-gray-600">{lesson.type}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < lesson.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 ml-1">({lesson.rating}/5)</span>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {lesson.recordingUrl && (
                                  <DropdownMenuItem>
                                    <Play className="h-4 w-4 mr-2" />
                                    Watch Recording
                                  </DropdownMenuItem>
                                )}
                                {lesson.materials.length > 0 && (
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Materials
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  Update Review
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {new Date(lesson.date).toLocaleDateString()} at {lesson.time}
                          </div>
                          
                          {lesson.review && (
                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-3">
                              "{lesson.review}"
                            </div>
                          )}
                          
                          {lesson.materials.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {lesson.materials.map((material, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  📎 {material}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Favorite Teachers Tab */}
            <TabsContent value="teachers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Favorite Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {favoriteTeachers.map((teacher) => (
                      <div key={teacher.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={teacher.image} alt={teacher.name} />
                            <AvatarFallback>
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{teacher.name}</div>
                            <div className="text-sm text-gray-600">{teacher.subject}</div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{teacher.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          {teacher.totalLessons} lessons completed • Last: {new Date(teacher.lastLesson).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/book-lesson/${teacher.id}`}>
                            <Button size="sm" className="flex-1">Book Again</Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours</span>
                      <span className="font-semibold">{learningStats.totalHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">{learningStats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-semibold">{learningStats.avgRating}/5</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {learningStats.subjectProgress.map((subject) => (
                      <div key={subject.subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject.subject}</span>
                          <span>{subject.hours}h</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">{subject.progress}% complete</div>
                      </div>
                    ))}
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
