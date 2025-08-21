import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  Clock,
  Heart,
  MessageCircle,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

const mockTeachers = [
  {
    id: 1,
    name: 'Aziza Karimova',
    title: 'English Language Expert',
    rating: 4.9,
    reviews: 127,
    price: 50000,
    image: '/placeholder.svg',
    languages: ['Uzbek', 'English', 'Russian'],
    subjects: ['English', 'IELTS', 'Business English'],
    experience: '5+ years',
    location: 'Tashkent, Uzbekistan',
    isOnline: true,
    isVerified: true,
    description:
      'Certified English teacher with experience in IELTS preparation and business communication.',
    availability: 'Available today',
  },
  {
    id: 2,
    name: 'John Smith',
    title: 'Mathematics Professor',
    rating: 4.8,
    reviews: 98,
    price: 45000,
    image: '/placeholder.svg',
    languages: ['English', 'Russian'],
    subjects: ['Mathematics', 'Calculus', 'Statistics'],
    experience: '8+ years',
    location: 'New York, USA',
    isOnline: false,
    isVerified: true,
    description:
      'PhD in Mathematics with extensive experience in teaching calculus and statistics.',
    availability: 'Available tomorrow',
  },
  {
    id: 3,
    name: 'Malika Tosheva',
    title: 'Programming Mentor',
    rating: 5.0,
    reviews: 84,
    price: 75000,
    image: '/placeholder.svg',
    languages: ['Uzbek', 'Russian', 'English'],
    subjects: ['Programming', 'Python', 'JavaScript', 'React'],
    experience: '6+ years',
    location: 'Samarkand, Uzbekistan',
    isOnline: true,
    isVerified: false,
    description:
      'Senior developer and coding instructor specializing in web development technologies.',
    availability: 'Available now',
  },
  {
    id: 4,
    name: 'David Wilson',
    title: 'Physics & Chemistry Tutor',
    rating: 4.7,
    reviews: 156,
    price: 40000,
    image: '/placeholder.svg',
    languages: ['English'],
    subjects: ['Physics', 'Chemistry', 'Math'],
    experience: '10+ years',
    location: 'London, UK',
    isOnline: true,
    isVerified: true,
    description:
      'Experienced science teacher helping students excel in physics and chemistry.',
    availability: 'Available in 2 hours',
  },
  {
    id: 5,
    name: 'Sevara Abdullayeva',
    title: 'Uzbek Language & Literature',
    rating: 4.9,
    reviews: 73,
    price: 35000,
    image: '/placeholder.svg',
    languages: ['Uzbek', 'Russian'],
    subjects: ['Uzbek', 'Literature', 'History'],
    experience: '4+ years',
    location: 'Bukhara, Uzbekistan',
    isOnline: false,
    isVerified: false,
    description:
      'Native Uzbek speaker specializing in language learning and literature studies.',
    availability: 'Available tomorrow',
  },
  {
    id: 6,
    name: 'Ahmed Hassan',
    title: 'Arabic & Islamic Studies',
    rating: 4.8,
    reviews: 92,
    price: 55000,
    image: '/placeholder.svg',
    languages: ['Arabic', 'English', 'Uzbek'],
    subjects: ['Arabic', 'Quran', 'Islamic Studies'],
    experience: '7+ years',
    location: 'Cairo, Egypt',
    isOnline: true,
    isVerified: true,
    description:
      'Islamic scholar and Arabic language expert with traditional and modern teaching methods.',
    availability: 'Available now',
  },
]

const subjects = [
  'All Subjects',
  'Mathematics',
  'English',
  'Programming',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Literature',
  'Arabic',
  'Uzbek',
  'Russian',
]

const languages = ['All Languages', 'Uzbek', 'English', 'Russian', 'Arabic']

export default function Teachers() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState('rating')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  const filteredTeachers = mockTeachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesSubject =
      selectedSubject === 'All Subjects' ||
      teacher.subjects.includes(selectedSubject)
    const matchesLanguage =
      selectedLanguage === 'All Languages' ||
      teacher.languages.includes(selectedLanguage)
    const matchesPrice =
      teacher.price >= priceRange[0] && teacher.price <= priceRange[1]
    const matchesOnline = !showOnlineOnly || teacher.isOnline

    return (
      matchesSearch &&
      matchesSubject &&
      matchesLanguage &&
      matchesPrice &&
      matchesOnline
    )
  })

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'reviews':
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  return (
    <div className="py-16 min-h-screen bg-gray-50">
      <div>
        <div className="bg-white border-b">
          <div className="container py-8">
            <div className="mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {t('teachers')}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {t('browsePerfectTutor')}
                  </p>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {mockTeachers.length}+ {t('expertTutors')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container">
          <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8 space-y-6 mt-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t('searchByTeacherName')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-lg"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('subject')} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('language')} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('price')}: {priceRange[0].toLocaleString()} -{' '}
                  {priceRange[1].toLocaleString()} UZS
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{t('highestRated')}</SelectItem>
                  <SelectItem value="price-low">
                    {t('priceLowToHigh')}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {t('priceHighToLow')}
                  </SelectItem>
                  <SelectItem value="reviews">{t('mostReviews')}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online-only"
                  checked={showOnlineOnly}
                  onCheckedChange={(checked: boolean) =>
                    setShowOnlineOnly(checked)
                  }
                />
                <label htmlFor="online-only" className="text-sm font-medium">
                  {t('onlineNowOnly')}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="container mb-6">
          <p className="text-gray-600">
            {t('showing')} {sortedTeachers.length} {t('of')}{' '}
            {mockTeachers.length} {t('teachersCount')}
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4  container">
          {sortedTeachers.map((teacher) => (
            <Link to={`/tutor/${teacher.id}`} key={teacher.id}>
              <Card
                key={teacher.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200"
              >
                <CardContent className="p-0">
                  {/* Teacher Image & Price */}
                  <div className="relative">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                          src={teacher.image}
                          alt={teacher.name}
                          className="object-cover w-full h-full"
                        />
                        <AvatarFallback className="rounded-none text-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {teacher.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Verification Badge */}
                      {teacher.isVerified ? (
                        <Badge className="absolute top-3 right-3 bg-green-100 text-green-800 shadow-lg hover:bg-green-200">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          {t('verified')}
                        </Badge>
                      ) : (
                        <Badge className="absolute top-3 right-3 bg-orange-100 text-orange-800 shadow-lg hover:bg-orange-200">
                          <Shield className="h-3 w-3 mr-1" />
                          {t('unverified')}
                        </Badge>
                      )}

                      {/* Favorite Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 left-3 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded-full shadow-md"
                      >
                        <Heart className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-2 left-1 bg-white rounded-lg px-2 py-1 shadow-lg">
                      <div className="text-xs font-bold text-gray-900">
                        {teacher.price.toLocaleString()} {t('sum')}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        50-{t('minLesson')}
                      </div>
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="p-4 space-y-3">
                    {/* Name & Rating */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
                          {teacher.name}
                        </h3>
                      </div>
                      <p className="text-primary font-medium text-sm">
                        {teacher.title}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">
                            {teacher.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {teacher.reviews} reviews
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <div className="font-semibold text-gray-900">45</div>
                        <div>{t('students')}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">1,200</div>
                        <div>{t('lessonsCount')}</div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="text-sm">
                      <span className="text-gray-600">{t('speaks')} </span>
                      {teacher.languages.slice(0, 2).map((language, index) => (
                        <span key={language} className="text-gray-900">
                          {language}
                          {index === 0 && teacher.languages.length > 1 && (
                            <span className="text-gray-600">, </span>
                          )}
                        </span>
                      ))}
                      {teacher.languages.length > 2 && (
                        <span className="text-gray-600">
                          {teacher.languages.length > 2 &&
                            ` +${teacher.languages.length - 2}`}
                        </span>
                      )}
                    </div>

                    {/* Subjects as tags */}
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 2).map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {subject}
                        </Badge>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.subjects.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {teacher.description}
                    </p>

                    {/* Availability */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">
                          {teacher.availability}
                        </span>
                      </div>
                      {teacher.isOnline && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 text-xs font-medium">
                            {t('online')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap md:flex-nowrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-sm font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {t('message')}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9 text-sm font-medium"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const params = new URLSearchParams({
                            tutorId: teacher.id.toString(),
                            tutorName: teacher.name,
                            tutorAvatar: teacher.image || '',
                            tutorRating: teacher.rating.toString(),
                            subject: teacher.subjects[0] || '',
                            slotStart: new Date(
                              Date.now() + 24 * 60 * 60 * 1000
                            ).toISOString(),
                            slotEnd: new Date(
                              Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000
                            ).toISOString(),
                            price: teacher.price.toString(),
                            serviceFee: '0',
                          })
                          navigate(`/booking?${params.toString()}`)
                        }}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        {t('bookTrial')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {sortedTeachers.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {t('loadMoreTeachers')}
            </Button>
          </div>
        )}

        {/* No Results */}
        {sortedTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('noTeachersFound')}
            </h3>
            <p className="text-gray-600 mb-4">{t('tryAdjustingFilters')}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('All Subjects')
                setSelectedLanguage('All Languages')
                setPriceRange([0, 100000])
                setShowOnlineOnly(false)
              }}
            >
              {t('clearAllFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

//  <Card
//               key={teacher.id}
//               className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200"
//             >
//               <CardContent className="p-0">
//                 {/* Teacher Image & Price */}
//                 <div className="relative">
//                   <div className="relative w-full h-48 overflow-hidden">
//                     <Avatar className="w-full h-full rounded-none">
//                       <AvatarImage
//                         src={teacher.image}
//                         alt={teacher.name}
//                         className="object-cover w-full h-full"
//                       />
//                       <AvatarFallback className="rounded-none text-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white">
//                         {teacher.name
//                           .split(' ')
//                           .map((n) => n[0])
//                           .join('')}
//                       </AvatarFallback>
//                     </Avatar>
//                     {teacher.isOnline && (
//                       <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
//                     )}
//                     {/* Favorite Button */}
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="absolute top-3 left-3 bg-white/80 hover:bg-white h-8 w-8 p-0 rounded-full shadow-md"
//                     >
//                       <Heart className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </div>

//                   {/* Price Tag */}
//                   <div className="absolute bottom-3 left-3 bg-white rounded-lg px-3 py-1 shadow-lg">
//                     <div className="text-lg font-bold text-gray-900">
//                       {teacher.price.toLocaleString()} UZS
//                     </div>
//                     <div className="text-xs text-gray-500">50-min lesson</div>
//                   </div>
//                 </div>

//                 {/* Teacher Info */}
//                 <div className="p-4 space-y-3">
//                   {/* Name & Rating */}
//                   <div className="space-y-1">
//                     <h3 className="font-semibold text-gray-900 text-lg leading-tight truncate">
//                       {teacher.name}
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <span className="font-semibold text-sm">
//                           {teacher.rating}
//                         </span>
//                       </div>
//                       <span className="text-sm text-gray-500">
//                         {teacher.reviews} reviews
//                       </span>
//                     </div>
//                   </div>

//                   {/* Stats */}
//                   <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
//                     <div>
//                       <div className="font-semibold text-gray-900">45</div>
//                       <div>students</div>
//                     </div>
//                     <div>
//                       <div className="font-semibold text-gray-900">1,200</div>
//                       <div>lessons</div>
//                     </div>
//                   </div>

//                   {/* Languages */}
//                   <div className="text-sm">
//                     <span className="text-gray-600">Speaks </span>
//                     {teacher.languages.slice(0, 2).map((language, index) => (
//                       <span key={language} className="text-gray-900">
//                         {language}
//                         {index === 0 && teacher.languages.length > 1 && (
//                           <span className="text-gray-600">, </span>
//                         )}
//                       </span>
//                     ))}
//                     {teacher.languages.length > 2 && (
//                       <span className="text-gray-600">
//                         {teacher.languages.length > 2 &&
//                           ` +${teacher.languages.length - 2}`}
//                       </span>
//                     )}
//                   </div>

//                   {/* Subjects as tags */}
//                   <div className="flex flex-wrap gap-1">
//                     {teacher.subjects.slice(0, 2).map((subject) => (
//                       <Badge
//                         key={subject}
//                         variant="secondary"
//                         className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
//                       >
//                         {subject}
//                       </Badge>
//                     ))}
//                     {teacher.subjects.length > 2 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{teacher.subjects.length - 2}
//                       </Badge>
//                     )}
//                   </div>

//                   {/* Description */}
//                   <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//                     {teacher.description}
//                   </p>

//                   {/* Availability */}
//                   <div className="flex items-center gap-2 text-sm">
//                     <Clock className="h-4 w-4 text-green-500" />
//                     <span className="text-gray-600">
//                       {teacher.availability}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2 pt-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1 h-9 text-sm font-medium border-gray-300 hover:bg-gray-50"
//                     >
//                       <MessageCircle className="h-4 w-4 mr-1" />
//                       Message
//                     </Button>
//                     <Button
//                       size="sm"
//                       className="flex-1 h-9 text-sm font-medium bg-blue-600 hover:bg-blue-700"
//                       onClick={() => {
//                         const params = new URLSearchParams({
//                           tutorId: teacher.id.toString(),
//                           tutorName: teacher.name,
//                           tutorAvatar: teacher.image || '',
//                           tutorRating: teacher.rating.toString(),
//                           subject: teacher.subjects[0] || '',
//                           slotStart: new Date(
//                             Date.now() + 24 * 60 * 60 * 1000
//                           ).toISOString(),
//                           slotEnd: new Date(
//                             Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000
//                           ).toISOString(),
//                           price: teacher.price.toString(),
//                           serviceFee: '0',
//                         })
//                         navigate(`/booking?${params.toString()}`)
//                       }}
//                     >
//                       <Video className="h-4 w-4 mr-1" />
//                       Book Trial
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

// large card
//  <Card
//             key={teacher.id}
//             className="overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             <CardContent className="p-0">
//               <div className="flex flex-col sm:flex-row">
//                 {/* Teacher Image */}
//                 <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
//                   <Avatar className="w-full h-full rounded-none">
//                     <AvatarImage
//                       src={teacher.image}
//                       alt={teacher.name}
//                       className="object-cover"
//                     />
//                     <AvatarFallback className="rounded-none text-2xl">
//                       {teacher.name
//                         .split(' ')
//                         .map((n) => n[0])
//                         .join('')}
//                     </AvatarFallback>
//                   </Avatar>
//                   {teacher.isOnline && (
//                     <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                   )}
//                 </div>

//                 {/* Teacher Info */}
//                 <div className="flex-1 p-4 sm:p-6 space-y-3">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
//                         {teacher.name}
//                       </h3>
//                       <p className="text-primary font-medium text-sm sm:text-base">
//                         {teacher.title}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="ml-2 flex-shrink-0"
//                     >
//                       <Heart className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-medium">{teacher.rating}</span>
//                       <span>({teacher.reviews} reviews)</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       <span className="truncate">{teacher.location}</span>
//                     </div>
//                   </div>

//                   <p className="text-gray-600 text-sm line-clamp-2">
//                     {teacher.description}
//                   </p>

//                   <div className="flex flex-wrap gap-1">
//                     {teacher.subjects.slice(0, 3).map((subject) => (
//                       <Badge
//                         key={subject}
//                         variant="secondary"
//                         className="text-xs"
//                       >
//                         {subject}
//                       </Badge>
//                     ))}
//                     {teacher.subjects.length > 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{teacher.subjects.length - 3} more
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="flex flex-wrap gap-1">
//                     {teacher.languages.map((language) => (
//                       <Badge
//                         key={language}
//                         variant="outline"
//                         className="text-xs"
//                       >
//                         {language}
//                       </Badge>
//                     ))}
//                   </div>

//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Clock className="h-4 w-4" />
//                     <span>{teacher.availability}</span>
//                   </div>

//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2 border-t gap-3 sm:gap-0">
//                     <div>
//                       <span className="text-xl sm:text-2xl font-bold text-gray-900">
//                         {teacher.price.toLocaleString()} UZS
//                       </span>
//                       <span className="text-gray-600">/hour</span>
//                     </div>
//                     <div className="flex gap-2 flex-wrap">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1 sm:flex-none"
//                       >
//                         <MessageCircle className="h-4 w-4 mr-1" />
//                         <span className="hidden xs:inline">Message</span>
//                       </Button>
//                       <Button
//                         size="sm"
//                         className="flex-1 sm:flex-none"
//                         onClick={() => {
//                           const params = new URLSearchParams({
//                             tutorId: teacher.id.toString(),
//                             tutorName: teacher.name,
//                             tutorAvatar: teacher.image || '',
//                             tutorRating: teacher.rating.toString(),
//                             subject: teacher.subjects[0] || '',
//                             slotStart: new Date(
//                               Date.now() + 24 * 60 * 60 * 1000
//                             ).toISOString(), // Tomorrow
//                             slotEnd: new Date(
//                               Date.now() +
//                                 24 * 60 * 60 * 1000 +
//                                 60 * 60 * 1000
//                             ).toISOString(), // +1 hour
//                             price: teacher.price.toString(),
//                             serviceFee: '0',
//                           })
//                           navigate(`/booking?${params.toString()}`)
//                         }}
//                       >
//                         <Video className="h-4 w-4 mr-1" />
//                         <span className="hidden xs:inline">Book Trial</span>
//                         <span className="xs:hidden">Book</span>
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
