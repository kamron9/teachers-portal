import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSubjects, useTeacherSearch } from '@/hooks/useMockApi'
import { formatPrice } from '@/lib/mockData'
import { ArrowRight, BookOpen, Search, Star, Users, Video } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const features = [
  {
    icon: Search,
    title: 'Find Perfect Teachers',
    description:
      'Search by subject, price, rating, and language to find the ideal tutor for your needs',
  },
  {
    icon: Video,
    title: 'Live Video Lessons',
    description:
      'High-quality video calls with integrated whiteboard and screen sharing tools',
  },
  {
    icon: Users,
    title: 'Local & International',
    description:
      'Connect with both local Uzbek teachers and international experts worldwide',
  },
  {
    icon: BookOpen,
    title: 'All Subjects Covered',
    description:
      'From languages to sciences, find expert tutors for any subject you want to learn',
  },
]

const topics = [
  { subject: 'Dasturlash', count: 1400 },
  { subject: 'Ingliz tili', count: 1000 },
  { subject: 'Matematika', count: 850 },
  { subject: 'Rus tili', count: 680 },
  { subject: 'Arab tili', count: 540 },
  { subject: 'Fizika', count: 420 },
  { subject: 'Kimyo', count: 390 },
  { subject: 'Biologiya', count: 370 },
  { subject: 'Xitoy tili', count: 320 },
  { subject: 'Huquq', count: 260 },
  { subject: 'Psixologiya', count: 190 },
  { subject: 'Tarix', count: 300 },
]

// TutorCard component
const TutorCard = ({ tutor }: { tutor: any }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={tutor.profileImage || '/placeholder.svg'}
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
            {tutor.subjectOfferings?.[0]?.subjectName || 'Fan belgilanmagan'}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">
                {tutor.averageRating?.toFixed(1) || 'N/A'}
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
              <span className="text-gray-600 text-sm ml-1">so'm/soat</span>
            </div>
            <Link to={`/tutor/${tutor.id}`}>
              <Button size="sm">Ko'rish</Button>
            </Link>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function Index() {
  const navigate = useNavigate()

  // Search state - TZ bo'yicha SearchBar (Subject, Language, PriceFrom/To)
  const [searchData, setSearchData] = useState({
    subject: '',
    language: '',
    priceFrom: '',
    priceTo: '',
  })

  // Fetch featured teachers - TZ bo'yicha GET /teachers?limit=6&sort=rating_desc
  type Teacher = {
    id: string
    firstName: string
    lastName: string
    profileImage?: string
    isVerified?: boolean
    subjectOfferings?: { subjectName?: string; pricePerHour?: number }[]
    averageRating?: number
    totalStudents?: number
    languages?: string[]
  }

  type TeachersData = {
    teachers: Teacher[]
  }

  const {
    data: teachersData,
    isLoading,
    error,
  } = useTeacherSearch(
    { limit: 6, sortBy: 'rating', sortOrder: 'desc' },
    { staleTime: 1000 * 60 * 5 }
  ) as { data: TeachersData | undefined; isLoading: boolean; error: any }

  // Fetch subjects for search dropdown
  type Subject = { id: string; name: string; teacherCount?: number }
  type SubjectsData = { subjects: Subject[] }
  const { data: subjectsData } = useSubjects(
    {},
    { staleTime: 1000 * 60 * 10 }
  ) as { data: SubjectsData | undefined }

  const tutors = teachersData?.teachers || []
  const subjects = subjectsData?.subjects || []

  // Search handler - TZ bo'yicha /search?subject=&language=&priceFrom=&priceTo=
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchData.subject) params.set('subject', searchData.subject)
    if (searchData.language) params.set('language', searchData.language)
    if (searchData.priceFrom) params.set('priceFrom', searchData.priceFrom)
    if (searchData.priceTo) params.set('priceTo', searchData.priceTo)

    // Analytics - TZ bo'yicha search_from_home
    // analytics.track('search_from_home', searchData);

    navigate(`/search?${params.toString()}`)
  }

  // Category click handler
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?subject=${categoryId}`)
  }

  // Get popular categories from subjects data
  const popularCategories = subjects.slice(0, 6).map((subject) => ({
    id: subject.id,
    name: subject.name,
    count: subject.teacherCount || 0,
  }))

  // CTA tutor click handler - TZ bo'yicha cta_tutor_clicked
  const handleTutorCTAClick = () => {
    // analytics.track('cta_tutor_clicked');
    navigate('/teacher-signup')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="pt-10 lg:pt-20">
              {/* Hero content */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                Eng yaxshi o'qituvchilar bilan
                <span className="text-primary"> o'rganing</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Malakali o'qituvchilar bilan individual onlayn darslar. Istalgan
                fanni uydan turib o'rganing.
              </p>

              {/* SearchBar - TZ bo'yicha (Subject, Language, PriceFrom/To) */}
              <Card className="p-6 max-w-4xl mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Fan
                    </label>
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
                    <label className="text-sm font-medium mb-2 block">
                      Til
                    </label>
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

                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 mr-2" />
                  O'qituvchi qidirish
                </Button>
              </Card>

              {/* Popular categories - TZ bo'yicha tez filter chiplar */}
              {popularCategories.length > 0 && (
                <div className="flex flex-wrap gap-3">
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

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&w=800&h=600&fit=crop"
                alt="Students learning languages online with tutors"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />
              {/* Floating language elements */}
              <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg font-medium text-primary">
                Bonjour! 🇫🇷
              </div>
              <div className="absolute top-1/3 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg font-medium text-green-500">
                ¡Hola! 🇪🇸
              </div>
              <div className="absolute -bottom-4 left-1/3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg font-medium text-red-500">
                こんにちは 🇯🇵
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers by Subject Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Har bir fan bo'yicha malakali o'qituvchilar
            </h2>
          </div>
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topics.map((item, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() =>
                    handleCategoryClick(
                      item.subject.toLowerCase().replace(/\s+/g, '-')
                    )
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">
                          {item.subject}
                        </h3>
                        <p className="text-gray-400 font-medium text-sm">
                          {item.count.toLocaleString()} o'qituvchi
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              
              <Button variant="outline" onClick={() => navigate('/subjects')}>
                Barcha fanlar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We make learning accessible, effective, and enjoyable for
                students across Uzbekistan
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern Preply-inspired Design */}

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
  )
}
