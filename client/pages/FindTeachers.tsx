import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star, MapPin, Clock, Filter, Search, ChevronDown, Heart, MessageCircle,
  CheckCircle, Globe, Award, Calendar, DollarSign, Users, ArrowLeft,
  BookOpen, Video, Zap, Target, SortAsc, SortDesc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink as BCLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FindTeachers() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [experience, setExperience] = useState("all");
  const [rating, setRating] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  // Subject information mapping
  const subjectInfo: Record<string, any> = {
    algebra: {
      name: "Algebra",
      category: "Mathematics",
      description: "Master algebraic equations, functions, and problem-solving techniques",
      icon: "🔢"
    },
    calculus: {
      name: "Calculus",
      category: "Mathematics", 
      description: "Differential and integral calculus for advanced mathematics",
      icon: "📊"
    },
    geometry: {
      name: "Geometry",
      category: "Mathematics",
      description: "Shapes, angles, proofs, and spatial reasoning", 
      icon: "📐"
    },
    physics: {
      name: "Physics",
      category: "Sciences",
      description: "Mechanics, thermodynamics, electromagnetism, and quantum physics",
      icon: "⚛️"
    },
    chemistry: {
      name: "Chemistry", 
      category: "Sciences",
      description: "Organic, inorganic, and physical chemistry concepts",
      icon: "🧪"
    },
    biology: {
      name: "Biology",
      category: "Sciences", 
      description: "Cell biology, genetics, ecology, and human anatomy",
      icon: "🧬"
    },
    english: {
      name: "English",
      category: "Languages",
      description: "Grammar, literature, writing, and communication skills",
      icon: "📚"
    },
    spanish: {
      name: "Spanish",
      category: "Languages",
      description: "Conversational Spanish, grammar, and cultural immersion",
      icon: "🇪🇸"
    }
  };

  // Mock teachers data - in real app this would come from API
  const allTeachers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      image: "/placeholder.svg",
      rating: 4.9,
      totalStudents: 127,
      subjects: ["algebra", "calculus", "geometry"],
      hourlyRate: 65000,
      experience: 8,
      location: "Tashkent",
      languages: ["English", "Uzbek"],
      verified: true,
      online: true,
      bio: "Mathematics PhD with 8+ years of teaching experience. Specializes in making complex concepts easy to understand.",
      availability: "Available today",
      responseTime: "Usually responds within 1 hour",
      completedLessons: 450,
      badges: ["Top Rated", "Quick Responder"],
      specializations: ["Exam Preparation", "University Level", "Problem Solving"]
    },
    {
      id: 2,
      name: "Prof. Ahmed Hassan",
      image: "/placeholder.svg", 
      rating: 4.8,
      totalStudents: 98,
      subjects: ["physics", "chemistry"],
      hourlyRate: 70000,
      experience: 12,
      location: "Samarkand",
      languages: ["English", "Arabic", "Uzbek"],
      verified: true,
      online: false,
      bio: "Former university professor with expertise in advanced physics and chemistry. Published researcher.",
      availability: "Available tomorrow",
      responseTime: "Usually responds within 2 hours",
      completedLessons: 380,
      badges: ["Expert", "University Professor"],
      specializations: ["Research Methods", "Advanced Topics", "Lab Work"]
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      image: "/placeholder.svg",
      rating: 5.0,
      totalStudents: 85,
      subjects: ["biology", "chemistry"],
      hourlyRate: 55000,
      experience: 6,
      location: "Tashkent", 
      languages: ["English", "Spanish", "Uzbek"],
      verified: true,
      online: true,
      bio: "Biology specialist with medical background. Excellent at explaining life sciences concepts.",
      availability: "Available now",
      responseTime: "Usually responds within 30 minutes",
      completedLessons: 320,
      badges: ["Fast Responder", "Medical Background"],
      specializations: ["Medical Prep", "Life Sciences", "Lab Techniques"]
    },
    {
      id: 4,
      name: "John Smith",
      image: "/placeholder.svg",
      rating: 4.7,
      totalStudents: 156,
      subjects: ["english", "spanish"],
      hourlyRate: 45000,
      experience: 5,
      location: "Tashkent",
      languages: ["English", "Spanish"],
      verified: true,
      online: true,
      bio: "Native English speaker with TESOL certification. Specializes in conversational practice and exam preparation.",
      availability: "Available today",
      responseTime: "Usually responds within 1 hour", 
      completedLessons: 520,
      badges: ["Native Speaker", "TESOL Certified"],
      specializations: ["Conversation", "IELTS Prep", "Business English"]
    },
    {
      id: 5,
      name: "Elena Petrov",
      image: "/placeholder.svg",
      rating: 4.6,
      totalStudents: 72,
      subjects: ["algebra", "geometry"],
      hourlyRate: 40000,
      experience: 4,
      location: "Bukhara",
      languages: ["Russian", "Uzbek", "English"],
      verified: true,
      online: true,
      bio: "Mathematics teacher with focus on foundational concepts. Great with students who struggle with math.",
      availability: "Available this week",
      responseTime: "Usually responds within 3 hours",
      completedLessons: 280,
      badges: ["Patient Teacher", "Foundation Builder"],
      specializations: ["Basic Math", "Confidence Building", "School Support"]
    },
    {
      id: 6,
      name: "Dr. Carlos Martinez",
      image: "/placeholder.svg",
      rating: 4.9,
      totalStudents: 103,
      subjects: ["physics", "calculus"],
      hourlyRate: 80000,
      experience: 10,
      location: "Tashkent",
      languages: ["Spanish", "English", "Uzbek"],
      verified: true,
      online: true,
      bio: "Physics PhD with industry experience. Combines theoretical knowledge with practical applications.",
      availability: "Available today",
      responseTime: "Usually responds within 1 hour",
      completedLessons: 410,
      badges: ["PhD Holder", "Industry Expert"],
      specializations: ["Applied Physics", "Engineering Prep", "Research"]
    }
  ];

  // Get current subject info
  const currentSubject = subject ? subjectInfo[subject] : null;

  // Filter teachers based on subject and other criteria
  const filteredTeachers = allTeachers.filter(teacher => {
    // Filter by subject
    if (subject && !teacher.subjects.includes(subject)) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !teacher.bio.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by price range
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (teacher.hourlyRate < min || teacher.hourlyRate > max) {
        return false;
      }
    }

    // Filter by experience
    if (experience !== "all") {
      const expNum = parseInt(experience);
      if (teacher.experience < expNum) {
        return false;
      }
    }

    // Filter by rating
    if (rating !== "all") {
      const ratingNum = parseFloat(rating);
      if (teacher.rating < ratingNum) {
        return false;
      }
    }

    // Filter by availability
    if (availability !== "all") {
      if (availability === "online" && !teacher.online) {
        return false;
      }
      if (availability === "today" && !teacher.availability.includes("today") && !teacher.availability.includes("now")) {
        return false;
      }
    }

    return true;
  });

  // Sort teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "rating":
        aValue = a.rating;
        bValue = b.rating;
        break;
      case "price":
        aValue = a.hourlyRate;
        bValue = b.hourlyRate;
        break;
      case "experience":
        aValue = a.experience;
        bValue = b.experience;
        break;
      case "students":
        aValue = a.totalStudents;
        bValue = b.totalStudents;
        break;
      default:
        aValue = a.rating;
        bValue = b.rating;
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Subject Not Found</h1>
          <p className="text-gray-600 mb-6">The subject you're looking for doesn't exist.</p>
          <Link to="/subjects">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/subjects">Subjects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentSubject.name} Teachers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Subject Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{currentSubject.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentSubject.name} Teachers</h1>
              <p className="text-gray-600">{currentSubject.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{sortedTeachers.length} teachers available</span>
                <span>•</span>
                <span>Starting from {Math.min(...sortedTeachers.map(t => t.hourlyRate)).toLocaleString()} UZS/hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Teachers</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range (UZS/hour)</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="0-40000">Under 40,000</SelectItem>
                      <SelectItem value="40000-60000">40,000 - 60,000</SelectItem>
                      <SelectItem value="60000-80000">60,000 - 80,000</SelectItem>
                      <SelectItem value="80000-999999">Above 80,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience</label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Experience</SelectItem>
                      <SelectItem value="2">2+ Years</SelectItem>
                      <SelectItem value="5">5+ Years</SelectItem>
                      <SelectItem value="10">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.7">4.7+ Stars</SelectItem>
                      <SelectItem value="4.9">4.9+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="online">Online Now</SelectItem>
                      <SelectItem value="today">Available Today</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange("all");
                    setExperience("all");
                    setRating("all");
                    setAvailability("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Teachers List */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {sortedTeachers.length} of {allTeachers.filter(t => t.subjects.includes(subject || "")).length} teachers
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="space-y-6">
              {sortedTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Teacher Avatar */}
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={teacher.image} alt={teacher.name} />
                          <AvatarFallback>
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {teacher.online && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>

                      {/* Teacher Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                              {teacher.verified && (
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{teacher.rating}</span>
                                <span>({teacher.totalStudents} students)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{teacher.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                <span>{teacher.experience} years exp.</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {teacher.hourlyRate.toLocaleString()} UZS
                            </div>
                            <div className="text-sm text-gray-600">per hour</div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {teacher.badges.map((badge, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>

                        {/* Bio */}
                        <p className="text-gray-700 mb-3 line-clamp-2">{teacher.bio}</p>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {teacher.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        {/* Languages */}
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                          <Globe className="h-4 w-4" />
                          <span>Languages: {teacher.languages.join(", ")}</span>
                        </div>

                        {/* Availability and Response Time */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <Calendar className="h-4 w-4" />
                              <span>{teacher.availability}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{teacher.responseTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link to={`/book-lesson/${teacher.id}`} className="flex-1">
                            <Button className="w-full">
                              <Video className="h-4 w-4 mr-2" />
                              Book Trial Lesson
                            </Button>
                          </Link>
                          <Button variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {sortedTeachers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No teachers found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find more teachers.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange("all");
                    setExperience("all");
                    setRating("all");
                    setAvailability("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
