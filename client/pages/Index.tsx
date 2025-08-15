import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Users, ArrowRight, BookOpen, Heart, MessageCircle, Calculator, Atom, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - TZ bo'yicha API GET /tutors?limit=6&sort=rating_desc
const featuredTutors = [
  {
    id: 1,
    name: "Aziza Karimova",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalStudents: 127,
    subject: "Ingliz tili",
    pricePerHour: 50000,
    isVerified: true,
    languages: ["O'zbek", "Ingliz", "Rus"],
    experience: "5+ yil tajriba"
  },
  {
    id: 2,
    name: "Bobur Umarov", 
    avatar: "/placeholder.svg",
    rating: 4.8,
    totalStudents: 98,
    subject: "Matematika",
    pricePerHour: 45000,
    isVerified: true,
    languages: ["O'zbek", "Rus"],
    experience: "8+ yil tajriba"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5.0,
    totalStudents: 84,
    subject: "IELTS",
    pricePerHour: 65000,
    isVerified: true,
    languages: ["Ingliz"],
    experience: "6+ yil tajriba"
  },
  {
    id: 4,
    name: "Malika Tosheva",
    avatar: "/placeholder.svg", 
    rating: 4.7,
    totalStudents: 156,
    subject: "Fizika",
    pricePerHour: 40000,
    isVerified: true,
    languages: ["O'zbek", "Rus", "Ingliz"],
    experience: "4+ yil tajriba"
  },
  {
    id: 5,
    name: "John Smith",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalStudents: 203,
    subject: "Dasturlash",
    pricePerHour: 75000,
    isVerified: true,
    languages: ["Ingliz", "Rus"],
    experience: "10+ yil tajriba"
  },
  {
    id: 6,
    name: "Dildora Abdullayeva",
    avatar: "/placeholder.svg",
    rating: 4.8,
    totalStudents: 89,
    subject: "Kimyo",
    pricePerHour: 35000,
    isVerified: true,
    languages: ["O'zbek", "Rus"],
    experience: "3+ yil tajriba"
  }
];

// Popular categories data
const popularCategories = [
  { id: 'english', name: 'English', count: 150 },
  { id: 'math', name: 'Math', count: 120 },
  { id: 'ielts', name: 'IELTS', count: 95 },
  { id: 'programming', name: 'Dasturlash', count: 80 },
  { id: 'physics', name: 'Fizika', count: 70 },
  { id: 'chemistry', name: 'Kimyo', count: 65 }
];

// TutorCard component
const TutorCard = ({ tutor }: { tutor: typeof featuredTutors[0] }) => (
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
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{tutor.name}</h3>
          <p className="text-primary font-medium">{tutor.subject}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{tutor.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{tutor.totalStudents} o'quvchi</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {tutor.languages.slice(0, 2).map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {tutor.pricePerHour.toLocaleString()} so'm
              </span>
              <span className="text-gray-600 text-sm">/soat</span>
            </div>
            <Link to={`/tutor/${tutor.id}`}>
              <Button size="sm">
                Ko'rish
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Index() {
  const navigate = useNavigate();
  
  // Search state - TZ bo'yicha SearchBar (Subject, Language, PriceFrom/To)
  const [searchData, setSearchData] = useState({
    subject: "",
    language: "",
    priceFrom: "",
    priceTo: ""
  });
  
  // Loading states - TZ talabi
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tutors, setTutors] = useState(featuredTutors);

  // Mock API call - TZ bo'yicha GET /tutors?limit=6&sort=rating_desc
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setIsLoading(true);
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock error for demo (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('API Error');
        }
        
        setTutors(featuredTutors);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
    
    // Analytics - TZ bo'yicha home_view
    // analytics.track('home_view');
  }, []);

  // Search handler - TZ bo'yicha /search?subject=&language=&priceFrom=&priceTo=
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.subject) params.set('subject', searchData.subject);
    if (searchData.language) params.set('language', searchData.language);
    if (searchData.priceFrom) params.set('priceFrom', searchData.priceFrom);
    if (searchData.priceTo) params.set('priceTo', searchData.priceTo);
    
    // Analytics - TZ bo'yicha search_from_home
    // analytics.track('search_from_home', searchData);
    
    navigate(`/search?${params.toString()}`);
  };

  // Category click handler
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?subject=${categoryId}`);
  };

  // CTA tutor click handler - TZ bo'yicha cta_tutor_clicked
  const handleTutorCTAClick = () => {
    // analytics.track('cta_tutor_clicked');
    navigate('/auth/register?role=tutor');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero content */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Eng yaxshi o'qituvchilar bilan
              <span className="text-primary block">o'rganing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Malakali o'qituvchilar bilan individual onlayn darslar. 
              Istalgan fanni uydan turib o'rganing.
            </p>

            {/* SearchBar - TZ bo'yicha (Subject, Language, PriceFrom/To) */}
            <Card className="p-6 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fan</label>
                  <Select value={searchData.subject} onValueChange={(value) => setSearchData({...searchData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">Ingliz tili</SelectItem>
                      <SelectItem value="math">Matematika</SelectItem>
                      <SelectItem value="physics">Fizika</SelectItem>
                      <SelectItem value="chemistry">Kimyo</SelectItem>
                      <SelectItem value="programming">Dasturlash</SelectItem>
                      <SelectItem value="ielts">IELTS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Til</label>
                  <Select value={searchData.language} onValueChange={(value) => setSearchData({...searchData, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tilni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uzbek">O'zbek</SelectItem>
                      <SelectItem value="russian">Rus</SelectItem>
                      <SelectItem value="english">Ingliz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Narx (dan)</label>
                  <Select value={searchData.priceFrom} onValueChange={(value) => setSearchData({...searchData, priceFrom: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="0 so'm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 so'm</SelectItem>
                      <SelectItem value="20000">20,000 so'm</SelectItem>
                      <SelectItem value="40000">40,000 so'm</SelectItem>
                      <SelectItem value="60000">60,000 so'm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Narx (gacha)</label>
                  <Select value={searchData.priceTo} onValueChange={(value) => setSearchData({...searchData, priceTo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="100,000 so'm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40000">40,000 so'm</SelectItem>
                      <SelectItem value="60000">60,000 so'm</SelectItem>
                      <SelectItem value="80000">80,000 so'm</SelectItem>
                      <SelectItem value="100000">100,000 so'm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="w-full mt-6" size="lg" onClick={handleSearch}>
                <Search className="h-5 w-5 mr-2" />
                O'qituvchi qidirish
              </Button>
            </Card>

            {/* Popular categories - TZ bo'yicha tez filter chiplar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {popularCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="rounded-full"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Tutors Section - TZ bo'yicha 4-6 ta TutorCard */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top o'qituvchilar
            </h2>
            <p className="text-xl text-gray-600">
              Eng yaxshi bahoga ega o'qituvchilar bilan tanishing
            </p>
          </div>

          {/* Loading state - TZ talabi */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xatolik yuz berdi
              </h3>
              <p className="text-gray-600 mb-4">
                O'qituvchilar ma'lumotlarini yuklab bo'lmadi
              </p>
              <Button onClick={() => window.location.reload()}>
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
                Top o'qituvchilar hozircha yo'q
              </h3>
              <p className="text-gray-600">
                Tez orada yangi o'qituvchilar qo'shiladi
              </p>
            </div>
          )}

          {/* Tutors grid - TZ bo'yicha TutorCard */}
          {!isLoading && !error && tutors.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner - TZ bo'yicha "Tutor bo'ling" */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O'qituvchi bo'lib ishlashni xohlaysizmi?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Minglab o'quvchilar sizni kutmoqda. Bilimingizni ulashing va daromad oling.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary"
              onClick={handleTutorCTAClick}
            >
              O'qituvchi bo'ling
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer - TZ bo'yicha minimal havolalar */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TutorUZ</span>
              </div>
              <p className="text-gray-400">
                O'zbekistondagi eng yaxshi onlayn ta'lim platformasi
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Yordam</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/support" className="hover:text-white">Qo'llab-quvvatlash</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Kompaniya</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">Biz haqimizda</Link></li>
                <li><Link to="/careers" className="hover:text-white">Karyera</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Bog'lanish</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+998 90 123 45 67</li>
                <li>info@tutoruz.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TutorUZ. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
