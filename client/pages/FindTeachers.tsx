import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Heart,
  MessageCircle,
  CheckCircle,
  Globe,
  Award,
  Calendar,
  DollarSign,
  Users,
  ArrowLeft,
  BookOpen,
  Video,
  Zap,
  Target,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useTeacherSearch, useSubjects } from "@/hooks/useApi";
import { formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink as BCLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FindTeachers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get initial search parameters from URL
  const initialSubject = searchParams.get('subject') || '';
  const initialQuery = searchParams.get('query') || '';
  const initialLanguage = searchParams.get('language') || '';
  const initialPriceFrom = searchParams.get('priceFrom') || '';
  const initialPriceTo = searchParams.get('priceTo') || '';

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [priceRange, setPriceRange] = useState(() => {
    if (initialPriceFrom && initialPriceTo) {
      return `${initialPriceFrom}-${initialPriceTo}`;
    }
    return "all";
  });
  const [experience, setExperience] = useState("all");
  const [rating, setRating] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");

  // Fetch subjects and teachers data
  const { data: subjectsData } = useSubjects();
  const subjects = subjectsData?.subjects || [];

  // Build search parameters for API
  const searchApiParams = {
    query: searchQuery || undefined,
    subjects: selectedSubject ? [selectedSubject] : undefined,
    languages: selectedLanguage ? [selectedLanguage] : undefined,
    minPrice: priceRange !== "all" ? parseInt(priceRange.split("-")[0]) * 100 : undefined, // Convert UZS to kopeks
    maxPrice: priceRange !== "all" ? parseInt(priceRange.split("-")[1]) * 100 : undefined, // Convert UZS to kopeks
    minRating: rating !== "all" ? parseFloat(rating) : undefined,
    experienceLevel: experience !== "all" ? [`${experience}+`] : undefined,
    sortBy,
    sortOrder,
    limit: 50,
  };

  const { data: teachersData, isLoading, error } = useTeacherSearch(searchApiParams);

  const teachers = teachersData?.teachers || [];
  const currentSubject = subjects.find(s => s.id === selectedSubject);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedSubject) params.set('subject', selectedSubject);
    if (selectedLanguage) params.set('language', selectedLanguage);
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-');
      params.set('priceFrom', min);
      params.set('priceTo', max);
    }

    const newSearch = params.toString();
    if (newSearch !== searchParams.toString()) {
      setSearchParams(params);
    }
  }, [searchQuery, selectedSubject, selectedLanguage, priceRange, searchParams, setSearchParams]);

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Subject Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The subject you're looking for doesn't exist.
          </p>
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
                <BCLink href="/">Home</BCLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BCLink href="/subjects">Subjects</BCLink>
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
              <h1 className="text-3xl font-bold text-gray-900">
                {currentSubject.name} Teachers
              </h1>
              <p className="text-gray-600">{currentSubject.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{sortedTeachers.length} teachers available</span>
                <span>•</span>
                <span>
                  Starting from{" "}
                  {Math.min(
                    ...sortedTeachers.map((t) => t.hourlyRate),
                  ).toLocaleString()}{" "}
                  UZS/hour
                </span>
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
                  <label className="text-sm font-medium mb-2 block">
                    Search Teachers
                  </label>
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
                  <label className="text-sm font-medium mb-2 block">
                    Price Range (UZS/hour)
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="0-40000">Under 40,000</SelectItem>
                      <SelectItem value="40000-60000">
                        40,000 - 60,000
                      </SelectItem>
                      <SelectItem value="60000-80000">
                        60,000 - 80,000
                      </SelectItem>
                      <SelectItem value="80000-999999">Above 80,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Experience
                  </label>
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
                  <label className="text-sm font-medium mb-2 block">
                    Minimum Rating
                  </label>
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
                  <label className="text-sm font-medium mb-2 block">
                    Availability
                  </label>
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
                Showing {sortedTeachers.length} of{" "}
                {
                  allTeachers.filter((t) => t.subjects.includes(subject || ""))
                    .length
                }{" "}
                teachers
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
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="space-y-6">
              {sortedTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Teacher Avatar */}
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={teacher.image} alt={teacher.name} />
                          <AvatarFallback>
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
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
                              <h3 className="text-xl font-semibold text-gray-900">
                                {teacher.name}
                              </h3>
                              {teacher.verified && (
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-medium">
                                  {teacher.rating}
                                </span>
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
                            <div className="text-sm text-gray-600">
                              per hour
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {teacher.badges.map((badge, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>

                        {/* Bio */}
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {teacher.bio}
                        </p>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {teacher.specializations.map((spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
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
                          <Link
                            to={`/book-lesson/${teacher.id}`}
                            className="flex-1"
                          >
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No teachers found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find more
                  teachers.
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
