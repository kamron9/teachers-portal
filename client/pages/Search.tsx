import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search as SearchIcon, Filter, Star, MapPin, Users, ArrowUpDown, 
  ArrowUp, ArrowDown, Heart, MessageCircle, CheckCircle, Globe, 
  SlidersHorizontal, ChevronLeft, ChevronRight
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

// Types
interface TutorCard {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  totalStudents: number;
  subject: string;
  pricePerHour: number;
  isVerified: boolean;
  languages: string[];
  experience: string;
  shortBio: string;
  tags: string[];
  isOnline: boolean;
  responseTime: string;
}

// Mock tutors data - TZ bo'yicha API response
const mockTutors: TutorCard[] = [
  {
    id: 1,
    name: "Aziza Karimova",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalStudents: 127,
    subject: "english",
    pricePerHour: 50000,
    isVerified: true,
    languages: ["O'zbek", "Ingliz", "Rus"],
    experience: "5+ yil",
    shortBio: "IELTS va umumiy ingliz tili mutaxassisi. 100+ o'quvchi IELTS 7+ ball olgan.",
    tags: ["IELTS", "Business English", "Conversation"],
    isOnline: true,
    responseTime: "1 soat ichida javob beradi"
  },
  {
    id: 2,
    name: "Bobur Umarov",
    avatar: "/placeholder.svg",
    rating: 4.8,
    totalStudents: 98,
    subject: "math",
    pricePerHour: 45000,
    isVerified: true,
    languages: ["O'zbek", "Rus"],
    experience: "8+ yil",
    shortBio: "Matematika PhD, universitet o'qituvchisi. Algebra va geometriya mutaxassisi.",
    tags: ["Algebra", "Geometriya", "Analiz"],
    isOnline: false,
    responseTime: "2 soat ichida javob beradi"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5.0,
    totalStudents: 84,
    subject: "english",
    pricePerHour: 65000,
    isVerified: true,
    languages: ["Ingliz"],
    experience: "6+ yil",
    shortBio: "Native English speaker, Cambridge sertifikatli o'qituvchi.",
    tags: ["Native Speaker", "Cambridge", "TOEFL"],
    isOnline: true,
    responseTime: "30 daqiqa ichida javob beradi"
  },
  {
    id: 4,
    name: "Malika Tosheva",
    avatar: "/placeholder.svg",
    rating: 4.7,
    totalStudents: 156,
    subject: "physics",
    pricePerHour: 40000,
    isVerified: true,
    languages: ["O'zbek", "Rus", "Ingliz"],
    experience: "4+ yil",
    shortBio: "Fizika magistri, maktab va universitet darajasida dars beradi.",
    tags: ["Mexanika", "Optika", "Termodinamika"],
    isOnline: true,
    responseTime: "1 soat ichida javob beradi"
  },
  {
    id: 5,
    name: "John Smith",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalStudents: 203,
    subject: "programming",
    pricePerHour: 75000,
    isVerified: true,
    languages: ["Ingliz", "Rus"],
    experience: "10+ yil",
    shortBio: "Senior Developer, Python va JavaScript mutaxassisi.",
    tags: ["Python", "JavaScript", "React"],
    isOnline: false,
    responseTime: "3 soat ichida javob beradi"
  },
  {
    id: 6,
    name: "Dildora Abdullayeva",
    avatar: "/placeholder.svg",
    rating: 4.8,
    totalStudents: 89,
    subject: "chemistry",
    pricePerHour: 35000,
    isVerified: true,
    languages: ["O'zbek", "Rus"],
    experience: "3+ yil",
    shortBio: "Kimyo magistri, organik va anorganik kimyo bo'yicha mutaxassis.",
    tags: ["Organik Kimyo", "Anorganik Kimyo", "Labaratoriya"],
    isOnline: true,
    responseTime: "2 soat ichida javob beradi"
  },
  {
    id: 7,
    name: "Ahmed Hassan",
    avatar: "/placeholder.svg",
    rating: 4.6,
    totalStudents: 145,
    subject: "math",
    pricePerHour: 38000,
    isVerified: true,
    languages: ["Arab", "Ingliz", "O'zbek"],
    experience: "7+ yil",
    shortBio: "Matematik analiz va differensial tenglamalar mutaxassisi.",
    tags: ["Analiz", "Differensial tenglamalar", "Statistika"],
    isOnline: true,
    responseTime: "1 soat ichida javob beradi"
  },
  {
    id: 8,
    name: "Elena Petrova",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalStudents: 67,
    subject: "english",
    pricePerHour: 42000,
    isVerified: true,
    languages: ["Rus", "Ingliz", "O'zbek"],
    experience: "5+ yil",
    shortBio: "Rus va ingliz tillarida tarjimon, business communication mutaxassisi.",
    tags: ["Business English", "Translation", "Grammar"],
    isOnline: false,
    responseTime: "1 soat ichida javob beradi"
  }
];

// TutorCard component
const TutorCardComponent = ({ tutor }: { tutor: TutorCard }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage src={tutor.avatar} alt={tutor.name} />
            <AvatarFallback>
              {tutor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {tutor.isVerified && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
          {tutor.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{tutor.name}</h3>
              <p className="text-sm text-gray-600">{tutor.experience} tajriba</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {tutor.pricePerHour.toLocaleString()} so'm
              </div>
              <div className="text-sm text-gray-600">/soat</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{tutor.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{tutor.totalStudents} o'quvchi</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{tutor.responseTime}</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{tutor.shortBio}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tutor.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Languages */}
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {tutor.languages.slice(0, 2).join(", ")}
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Link to={`/book-lesson/${tutor.id}`} className="flex-1">
              <Button className="w-full" size="sm">
                Book dars
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states - TZ bo'yicha FilterBar
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || 'all',
    language: searchParams.get('language') || 'all',
    priceFrom: parseInt(searchParams.get('priceFrom') || '0'),
    priceTo: parseInt(searchParams.get('priceTo') || '100000'),
    rating: parseFloat(searchParams.get('rating') || '0'),
    onlineNow: searchParams.get('online') === 'true'
  });
  
  // Sort state - TZ bo'yicha Sort options
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state - TZ talabi
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pageSize] = useState(parseInt(searchParams.get('pageSize') || '6'));
  
  // Loading states - TZ talabi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tutors, setTutors] = useState<TutorCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // URL sync - TZ talabi
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.subject && filters.subject !== 'all') params.set('subject', filters.subject);
    if (filters.language && filters.language !== 'all') params.set('language', filters.language);
    if (filters.priceFrom > 0) params.set('priceFrom', filters.priceFrom.toString());
    if (filters.priceTo < 100000) params.set('priceTo', filters.priceTo.toString());
    if (filters.rating > 0) params.set('rating', filters.rating.toString());
    if (filters.onlineNow) params.set('online', 'true');
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (pageSize !== 6) params.set('pageSize', pageSize.toString());

    setSearchParams(params);
  }, [filters, sortBy, currentPage, pageSize, setSearchParams]);

  // Mock API call - TZ bo'yicha GET /tutors?...
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setIsLoading(true);
        setError(false);
        
        // Analytics - TZ bo'yicha search_view
        // analytics.track('search_view', { filters, sortBy, page: currentPage });
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock error (5% chance)
        if (Math.random() < 0.05) {
          throw new Error('API Error');
        }
        
        // Filter tutors
        let filteredTutors = mockTutors.filter(tutor => {
          if (filters.subject && filters.subject !== 'all' && tutor.subject !== filters.subject) return false;
          if (filters.language && filters.language !== 'all' && !tutor.languages.some(lang =>
            lang.toLowerCase().includes(filters.language.toLowerCase()))) return false;
          if (tutor.pricePerHour < filters.priceFrom || tutor.pricePerHour > filters.priceTo) return false;
          if (tutor.rating < filters.rating) return false;
          if (filters.onlineNow && !tutor.isOnline) return false;
          return true;
        });
        
        // Sort tutors
        filteredTutors.sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case 'rating':
              comparison = b.rating - a.rating;
              break;
            case 'price':
              comparison = a.pricePerHour - b.pricePerHour;
              break;
            case 'relevance':
            default:
              comparison = b.totalStudents - a.totalStudents;
              break;
          }
          return sortOrder === 'desc' ? comparison : -comparison;
        });
        
        // Pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTutors = filteredTutors.slice(startIndex, endIndex);
        
        setTutors(paginatedTutors);
        setTotalCount(filteredTutors.length);
        
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, [filters, sortBy, sortOrder, currentPage, pageSize]);

  // Filter change handler - TZ bo'yicha search_filter_change
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
    
    // Analytics - TZ bo'yicha search_filter_change
    // analytics.track('search_filter_change', { filter: key, value });
  };

  // Sort change handler
  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Tutor click handler - TZ bo'yicha search_result_click
  const handleTutorClick = (tutorId: number) => {
    // analytics.track('search_result_click', { tutorId, position: tutors.findIndex(t => t.id === tutorId) + 1 });
  };

  // Retry handler
  const handleRetry = () => {
    setError(false);
    // This will trigger useEffect to refetch
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs - TZ bo'yicha (opcional) */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* FilterBar (sticky) - TZ talabi */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <SlidersHorizontal className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Filtrlar</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Subject filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fan</label>
                      <Select 
                        value={filters.subject} 
                        onValueChange={(value) => handleFilterChange('subject', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Fanni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Barcha fanlar</SelectItem>
                          <SelectItem value="english">Ingliz tili</SelectItem>
                          <SelectItem value="math">Matematika</SelectItem>
                          <SelectItem value="physics">Fizika</SelectItem>
                          <SelectItem value="chemistry">Kimyo</SelectItem>
                          <SelectItem value="programming">Dasturlash</SelectItem>
                          <SelectItem value="ielts">IELTS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Language filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Til</label>
                      <Select 
                        value={filters.language} 
                        onValueChange={(value) => handleFilterChange('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tilni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Barcha tillar</SelectItem>
                          <SelectItem value="o'zbek">O'zbek</SelectItem>
                          <SelectItem value="rus">Rus</SelectItem>
                          <SelectItem value="ingliz">Ingliz</SelectItem>
                          <SelectItem value="arab">Arab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price range filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Narx diapazoni ({filters.priceFrom.toLocaleString()} - {filters.priceTo.toLocaleString()} so'm)
                      </label>
                      <div className="px-2">
                        <Slider
                          value={[filters.priceFrom, filters.priceTo]}
                          onValueChange={([from, to]) => {
                            handleFilterChange('priceFrom', from);
                            handleFilterChange('priceTo', to);
                          }}
                          max={100000}
                          min={0}
                          step={5000}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Rating filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Minimal reyting</label>
                      <Select 
                        value={filters.rating.toString()} 
                        onValueChange={(value) => handleFilterChange('rating', parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Reytingni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Barcha reytinglar</SelectItem>
                          <SelectItem value="4.5">4.5+ yulduz</SelectItem>
                          <SelectItem value="4.7">4.7+ yulduz</SelectItem>
                          <SelectItem value="4.9">4.9+ yulduz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Online now filter */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Hozir onlayn</label>
                      <Switch
                        checked={filters.onlineNow}
                        onCheckedChange={(checked) => handleFilterChange('onlineNow', checked)}
                      />
                    </div>

                    {/* Clear filters */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setFilters({
                          subject: '',
                          language: '',
                          priceFrom: 0,
                          priceTo: 100000,
                          rating: 0,
                          onlineNow: false
                        });
                        setCurrentPage(1);
                      }}
                    >
                      Filtrlarni tozalash
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results section */}
          <div className="lg:col-span-3">
            {/* Sort controls - TZ bo'yicha Sort: Relevance / Rating / Price ↑↓ */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  "Qidirilmoqda..."
                ) : error ? (
                  "Xatolik yuz berdi"
                ) : (
                  `${startResult}-${endResult} dan ${totalCount} ta natija`
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Saralash:</span>
                <Button
                  variant={sortBy === 'relevance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('relevance')}
                >
                  Mos kelish
                  {sortBy === 'relevance' && (
                    sortOrder === 'desc' ? <ArrowDown className="h-4 w-4 ml-1" /> : <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                </Button>
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('rating')}
                >
                  Reyting
                  {sortBy === 'rating' && (
                    sortOrder === 'desc' ? <ArrowDown className="h-4 w-4 ml-1" /> : <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                </Button>
                <Button
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('price')}
                >
                  Narx
                  {sortBy === 'price' && (
                    sortOrder === 'desc' ? <ArrowDown className="h-4 w-4 ml-1" /> : <ArrowUp className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>

            {/* Loading state - TZ talabi */}
            {isLoading && (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error state - TZ talabi */}
            {error && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <SearchIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Xatolik</h3>
                <p className="text-gray-600 mb-4">
                  O'qituvchilarni yuklab bo'lmadi. Iltimos, qayta urinib ko'ring.
                </p>
                <Button onClick={handleRetry}>
                  Qayta urinish
                </Button>
              </div>
            )}

            {/* Empty state - TZ talabi */}
            {!isLoading && !error && tutors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mos tutor topilmadi
                </h3>
                <p className="text-gray-600 mb-4">
                  Filtrlarni o'zgartiring yoki boshqa kalit so'zlar bilan qidiring.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      subject: '',
                      language: '',
                      priceFrom: 0,
                      priceTo: 100000,
                      rating: 0,
                      onlineNow: false
                    });
                    setCurrentPage(1);
                  }}
                >
                  Filtrlarni tozalash
                </Button>
              </div>
            )}

            {/* Results grid - TZ bo'yicha TutorCard[] */}
            {!isLoading && !error && tutors.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {tutors.map((tutor) => (
                    <div key={tutor.id} onClick={() => handleTutorClick(tutor.id)}>
                      <TutorCardComponent tutor={tutor} />
                    </div>
                  ))}
                </div>

                {/* Pagination - TZ talabi */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Oldingi
                    </Button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
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
  );
}
