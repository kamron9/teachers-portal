import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search as SearchIcon, Filter, Star, MapPin, Users, ArrowUpDown, 
  ArrowUp, ArrowDown, Heart, MessageCircle, CheckCircle, Globe, 
  SlidersHorizontal, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { useSearchTeachers } from "@/hooks/useApi";
import { TeacherProfile, formatPriceShort, getBioText } from "@/lib/api";

export default function Search() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search parameters
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subject") || "");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Build search parameters
  const searchParameters = {
    query: query || undefined,
    subjects: selectedSubject ? [selectedSubject] : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 200000 ? priceRange[1] : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    experienceLevel: experienceLevel.length > 0 ? experienceLevel : undefined,
    languages: languages.length > 0 ? languages : undefined,
    page: currentPage,
    limit: 12,
    sortBy,
    sortOrder,
  };

  // Fetch teachers
  const { 
    data: teachersData, 
    isLoading, 
    error 
  } = useSearchTeachers(searchParameters);

  const teachers = teachersData?.data || [];
  const totalPages = teachersData?.pagination?.pages || 1;
  const totalCount = teachersData?.pagination?.total || 0;

  // Update URL params when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (selectedSubject) params.set("subject", selectedSubject);
    if (currentPage > 1) params.set("page", currentPage.toString());
    
    setSearchParams(params);
  }, [query, selectedSubject, currentPage, setSearchParams]);

  // Subject options
  const subjectOptions = [
    { value: "", label: "Barcha fanlar" },
    { value: "English", label: "Ingliz tili" },
    { value: "Mathematics", label: "Matematika" },
    { value: "Physics", label: "Fizika" },
    { value: "Chemistry", label: "Kimyo" },
    { value: "Biology", label: "Biologiya" },
    { value: "Programming", label: "Dasturlash" },
    { value: "IELTS", label: "IELTS" },
    { value: "TOEFL", label: "TOEFL" },
  ];

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTeacherSubjects = (teacher: TeacherProfile) => {
    return teacher.subjectOfferings?.map(so => so.subjectName).join(", ") || "No subjects";
  };

  const getTeacherMinPrice = (teacher: TeacherProfile) => {
    if (!teacher.subjectOfferings?.length) return 0;
    return Math.min(...teacher.subjectOfferings.map(so => so.pricePerHour));
  };

  const renderTeacherCard = (teacher: TeacherProfile) => (
    <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          {/* Header with avatar and basic info */}
          <div className="p-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.firstName} />
                  <AvatarFallback>
                    {teacher.firstName[0]}{teacher.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {teacher.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  {teacher.verificationStatus === "APPROVED" && (
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{teacher.rating || 0}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {teacher.totalLessons || 0} dars
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {teacher.experienceYears || 0}+ yil tajriba
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {getBioText(teacher, "uz") || "Professional teacher"}
                </p>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {teacher.subjectOfferings?.slice(0, 3).map((offering) => (
                    <Badge key={offering.id} variant="secondary" className="text-xs">
                      {offering.subjectName}
                    </Badge>
                  ))}
                  {(teacher.subjectOfferings?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(teacher.subjectOfferings?.length || 0) - 3} ko'p
                    </Badge>
                  )}
                </div>

                {/* Languages */}
                {teacher.languagesTaught && teacher.languagesTaught.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <Globe className="h-4 w-4" />
                    <span>{teacher.languagesTaught.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer with price and actions */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="text-sm text-gray-600">Boshlang'ich narx</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatPriceShort(getTeacherMinPrice(teacher))} so'm/soat
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast({ title: "Sevimlilar", description: "O'qituvchi sevimlilarga qo'shildi" })}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast({ title: "Xabar", description: "Xabar yuborish funksiyasi tez orada" })}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/teacher-details/${teacher.id}`)}
                >
                  Profil ko'rish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Bosh sahifa</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Qidiruv</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Search Header */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">O'qituvchilarni qidirish</h1>
                <p className="text-gray-600 mt-1">
                  {totalCount > 0 ? `${totalCount} ta o'qituvchi topildi` : "O'qituvchilarni qidiring"}
                </p>
              </div>

              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filterlar
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="O'qituvchi, fan yoki mavzu qidiring..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Fan tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <SearchIcon className="h-4 w-4 mr-2" />
                Qidirish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className={`w-80 space-y-6 ${showFilters ? "block" : "hidden"} lg:block`}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Filterlar</h3>

                  {/* Price Range */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium">Narx oralig'i (soatiga)</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPriceShort(priceRange[0])} so'm</span>
                      <span>{formatPriceShort(priceRange[1])} so'm</span>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium">Minimal reyting</label>
                    <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Barcha reytinglar</SelectItem>
                        <SelectItem value="4">4+ yulduz</SelectItem>
                        <SelectItem value="4.5">4.5+ yulduz</SelectItem>
                        <SelectItem value="4.8">4.8+ yulduz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Verification */}
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-sm font-medium">Faqat tasdiqlangan</label>
                    <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                  </div>

                  {/* Online Only */}
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-sm font-medium">Faqat online</label>
                    <Switch checked={onlineOnly} onCheckedChange={setOnlineOnly} />
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Saralash</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Mos kelishi bo'yicha</SelectItem>
                        <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                        <SelectItem value="price">Narx bo'yicha</SelectItem>
                        <SelectItem value="experience">Tajriba bo'yicha</SelectItem>
                        <SelectItem value="lessons">Darslar soni bo'yicha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    "Qidirilmoqda..."
                  ) : (
                    `${totalCount} ta o'qituvchidan ${(currentPage - 1) * 12 + 1}-${Math.min(currentPage * 12, totalCount)} ko'rsatilmoqda`
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Saralash:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Xatolik yuz berdi</p>
                  <Button onClick={() => window.location.reload()}>Qayta urinish</Button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && !error && teachers.length === 0 && (
                <div className="text-center py-12">
                  <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hech qanday o'qituvchi topilmadi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Qidiruv so'zingizni o'zgartiring yoki filterlarni qayta sozlang
                  </p>
                  <Button onClick={() => {
                    setQuery("");
                    setSelectedSubject("");
                    setPriceRange([0, 200000]);
                    setMinRating(0);
                    setVerifiedOnly(false);
                    setOnlineOnly(false);
                  }}>
                    Filterlarni tozalash
                  </Button>
                </div>
              )}

              {/* Teachers Grid */}
              {!isLoading && teachers.length > 0 && (
                <>
                  <div className="grid gap-6">
                    {teachers.map(renderTeacherCard)}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Oldingi
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 3 || page === currentPage + 3) {
                          return <span key={page} className="text-gray-400">...</span>;
                        }
                        return null;
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Keyingi
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
