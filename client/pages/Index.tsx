import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  MapPin,
  Users,
  ArrowRight,
  BookOpen,
  Heart,
  MessageCircle,
  Calculator,
  Atom,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeacherSearch, useSubjects } from "@/hooks/useMockApi";
import { formatPrice } from "@/lib/mockData";
import HowItWorksSection from "@/components/HowItWorksSection";

// TutorCard component
const TutorCard = ({ tutor }: { tutor: any }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={tutor.profileImage || "/placeholder.svg"}
              alt={`${tutor.firstName} ${tutor.lastName}`}
            />
            <AvatarFallback>
              {tutor.firstName?.[0]}
              {tutor.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          {tutor.isVerified && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {tutor.firstName} {tutor.lastName}
          </h3>
          <p className="text-primary font-medium">
            {tutor.subjectOfferings?.[0]?.subjectName || "Fan belgilanmagan"}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">
                {tutor.averageRating?.toFixed(1) || "N/A"}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {tutor.totalStudents || 0} o'quvchi
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {tutor.languages?.slice(0, 2).map((lang: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            )) || (
              <Badge variant="secondary" className="text-xs">
                O'zbek
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(tutor.subjectOfferings?.[0]?.pricePerHour || 0)}
              </span>
              <span className="text-gray-600 text-sm">/soat</span>
            </div>
            <Link to={`/tutor/${tutor.id}`}>
              <Button size="sm">Ko'rish</Button>
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
    priceTo: "",
  });

  // Fetch featured teachers - TZ bo'yicha GET /teachers?limit=6&sort=rating_desc
  const {
    data: teachersData,
    isLoading,
    error,
  } = useTeacherSearch(
    { limit: 6, sortBy: "rating", sortOrder: "desc" },
    { staleTime: 1000 * 60 * 5 }, // 5 minutes
  );

  // Fetch subjects for search dropdown
  const { data: subjectsData } = useSubjects({}, { staleTime: 1000 * 60 * 10 }); // 10 minutes

  const tutors = teachersData?.teachers || [];
  const subjects = subjectsData?.subjects || [];

  // Search handler - TZ bo'yicha /search?subject=&language=&priceFrom=&priceTo=
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.subject) params.set("subject", searchData.subject);
    if (searchData.language) params.set("language", searchData.language);
    if (searchData.priceFrom) params.set("priceFrom", searchData.priceFrom);
    if (searchData.priceTo) params.set("priceTo", searchData.priceTo);

    // Analytics - TZ bo'yicha search_from_home
    // analytics.track('search_from_home', searchData);

    navigate(`/search?${params.toString()}`);
  };

  // Category click handler
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?subject=${categoryId}`);
  };

  // Get popular categories from subjects data
  const popularCategories = subjects.slice(0, 6).map((subject) => ({
    id: subject.id,
    name: subject.name,
    count: subject.teacherCount || 0,
  }));

  // CTA tutor click handler - TZ bo'yicha cta_tutor_clicked
  const handleTutorCTAClick = () => {
    // analytics.track('cta_tutor_clicked');
    navigate("/teacher-signup");
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
              Malakali o'qituvchilar bilan individual onlayn darslar. Istalgan
              fanni uydan turib o'rganing.
            </p>

            {/* SearchBar - TZ bo'yicha (Subject, Language, PriceFrom/To) */}
            <Card className="p-6 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fan</label>
                  <Select
                    value={searchData.subject}
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, subject: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Til</label>
                  <Select
                    value={searchData.language}
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, language: value })
                    }
                  >
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
                  <label className="text-sm font-medium mb-2 block">
                    Narx (dan)
                  </label>
                  <Select
                    value={searchData.priceFrom}
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, priceFrom: value })
                    }
                  >
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
                  <label className="text-sm font-medium mb-2 block">
                    Narx (gacha)
                  </label>
                  <Select
                    value={searchData.priceTo}
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, priceTo: value })
                    }
                  >
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
            {popularCategories.length > 0 && (
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
            )}
          </div>
        </div>
      </section>

      {/* Teachers by Subject Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fanlarda mavjud o'qituvchilar soni
            </h2>
            <p className="text-xl text-gray-600">
              Har bir fan bo'yicha malakali o'qituvchilar
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { subject: "Dasturlash", count: 1400, icon: "💻" },
                { subject: "Ingliz tili", count: 1000, icon: "🇺🇸" },
                { subject: "Matematika", count: 850, icon: "🔢" },
                { subject: "Ona tili va adabiyot", count: 760, icon: "📚" },
                { subject: "Rus tili", count: 680, icon: "🇷🇺" },
                { subject: "Arab tili", count: 540, icon: "🇸🇦" },
                { subject: "Fizika", count: 420, icon: "⚡" },
                { subject: "Iqtisodiyot", count: 410, icon: "📈" },
                { subject: "Kimyo", count: 390, icon: "🧪" },
                { subject: "Biologiya", count: 370, icon: "🧬" },
                { subject: "Xitoy tili", count: 320, icon: "🇨🇳" },
                { subject: "Yapon tili", count: 280, icon: "🇯🇵" },
                { subject: "Huquq", count: 260, icon: "⚖️" },
                { subject: "Psixologiya", count: 190, icon: "🧠" },
                { subject: "Tarix", count: 300, icon: "🏛️" },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleCategoryClick(item.subject.toLowerCase().replace(/\s+/g, '-'))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {item.subject}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {item.count.toLocaleString()} o'qituvchi
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/teachers">
                <Button size="lg" variant="outline">
                  Barcha o'qituvchilarni ko'rish
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern Preply-inspired Design */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Qanday ishlaydi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Besh oddiy qadam bilan professional o'qituvchilar bilan o'qishni boshlang
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Desktop: Horizontal Stepper */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Connection Lines */}
                <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-cyan-200"></div>

                <div className="grid grid-cols-5 gap-8">
                  {[
                    {
                      number: 1,
                      title: "Fan tanlang",
                      description: "Kerakli fan yoki tilni ro'yxatdan tanlang",
                      icon: "🎯",
                      color: "from-blue-400 to-blue-500"
                    },
                    {
                      number: 2,
                      title: "Ustozni toping",
                      description: "Reyting va tajribaga qarab ustoz tanlang",
                      icon: "👨‍🏫",
                      color: "from-emerald-400 to-emerald-500"
                    },
                    {
                      number: 3,
                      title: "Darsni bron qiling",
                      description: "Qulay vaqtni belgilang va darsni bron qiling",
                      icon: "📅",
                      color: "from-teal-400 to-teal-500"
                    },
                    {
                      number: 4,
                      title: "Online darsga qo'shiling",
                      description: "Platforma orqali video chat orqali darsga qo'shiling",
                      icon: "💻",
                      color: "from-cyan-400 to-cyan-500"
                    },
                    {
                      number: 5,
                      title: "Bilimingizni oshiring",
                      description: "Muntazam darslar bilan bilimlaringizni rivojlantiring",
                      icon: "🚀",
                      color: "from-sky-400 to-sky-500"
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative group">
                      <div className="text-center">
                        {/* Step Number Circle */}
                        <div className={`relative mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform duration-300 z-10`}>
                          {step.number}
                        </div>

                        {/* Step Card */}
                        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                          <CardContent className="p-0">
                            <div className="text-4xl mb-3">{step.icon}</div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {step.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile & Tablet: Vertical Stepper */}
            <div className="lg:hidden space-y-8">
              {[
                {
                  number: 1,
                  title: "Fan tanlang",
                  description: "Kerakli fan yoki tilni ro'yxatdan tanlang",
                  icon: "🎯",
                  color: "from-blue-400 to-blue-500"
                },
                {
                  number: 2,
                  title: "Ustozni toping",
                  description: "Reyting va tajribaga qarab ustoz tanlang",
                  icon: "👨��🏫",
                  color: "from-emerald-400 to-emerald-500"
                },
                {
                  number: 3,
                  title: "Darsni bron qiling",
                  description: "Qulay vaqtni belgilang va darsni bron qiling",
                  icon: "📅",
                  color: "from-teal-400 to-teal-500"
                },
                {
                  number: 4,
                  title: "Online darsga qo'shiling",
                  description: "Platforma orqali video chat orqali darsga qo'shiling",
                  icon: "💻",
                  color: "from-cyan-400 to-cyan-500"
                },
                {
                  number: 5,
                  title: "Bilimingizni oshiring",
                  description: "Muntazam darslar bilan bilimlaringizni rivojlantiring",
                  icon: "🚀",
                  color: "from-sky-400 to-sky-500"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  {/* Connecting Line */}
                  {index < 4 && (
                    <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-green-200"></div>
                  )}

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Step Number Circle */}
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                          {step.number}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{step.icon}</div>
                            <h3 className="font-bold text-xl text-gray-900">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Hozir boshlang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
              Minglab o'quvchilar sizni kutmoqda. Bilimingizni ulashing va
              daromad oling.
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
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white">
                    Qo'llab-quvvatlash
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kompaniya</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white">
                    Biz haqimizda
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white">
                    Karyera
                  </Link>
                </li>
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
