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
  User,
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

  const pageTitle = currentSubject ? `${currentSubject.name} o'qituvchilari` : "O'qituvchilarni qidirish";
  const pageDescription = currentSubject
    ? `${currentSubject.name} fani bo'yicha malakali o'qituvchilar`
    : "Barcha fanlar bo'yicha malakali o'qituvchilarni toping";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BCLink href="/">Bosh sahifa</BCLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BCLink href="/teachers">O'qituvchilar</BCLink>
              </BreadcrumbItem>
              {currentSubject && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentSubject.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{currentSubject ? '📚' : '👨‍🏫'}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {pageTitle}
              </h1>
              <p className="text-gray-600">{pageDescription}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{teachers.length} o'qituvchi mavjud</span>
                {teachers.length > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      Boshlang'ich narx{" "}
                      {formatPrice(
                        Math.min(
                          ...teachers.map((t) => t.subjectOfferings?.[0]?.pricePerHour || 0)
                        )
                      )}
                      /soat
                    </span>
                  </>
                )}
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
                    O'qituvchi qidirish
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Ism yoki tavsif bo'yicha qidirish..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fan
                  </label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Barcha fanlar</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Til
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tilni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Barcha tillar</SelectItem>
                      <SelectItem value="uzbek">O'zbek</SelectItem>
                      <SelectItem value="russian">Rus</SelectItem>
                      <SelectItem value="english">Ingliz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Narx oralig'i (so'm/soat)
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Har qanday narx" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Har qanday narx</SelectItem>
                      <SelectItem value="0-40000">40,000 gacha</SelectItem>
                      <SelectItem value="40000-60000">
                        40,000 - 60,000
                      </SelectItem>
                      <SelectItem value="60000-80000">
                        60,000 - 80,000
                      </SelectItem>
                      <SelectItem value="80000-999999">80,000 dan yuqori</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Tajriba
                  </label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Har qanday tajriba" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Har qanday tajriba</SelectItem>
                      <SelectItem value="2">2+ yil</SelectItem>
                      <SelectItem value="5">5+ yil</SelectItem>
                      <SelectItem value="10">10+ yil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimal reyting
                  </label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Har qanday reyting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Har qanday reyting</SelectItem>
                      <SelectItem value="4.5">4.5+ yulduz</SelectItem>
                      <SelectItem value="4.7">4.7+ yulduz</SelectItem>
                      <SelectItem value="4.9">4.9+ yulduz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mavjudlik
                  </label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Har qanday vaqt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Har qanday vaqt</SelectItem>
                      <SelectItem value="online">Hozir onlayn</SelectItem>
                      <SelectItem value="today">Bugun mavjud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject("");
                    setSelectedLanguage("");
                    setPriceRange("all");
                    setExperience("all");
                    setRating("all");
                    setAvailability("all");
                  }}
                >
                  Barcha filtrlarni tozalash
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
