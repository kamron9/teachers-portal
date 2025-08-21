import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Atom,
  BookOpen,
  Calculator,
  Code,
  DollarSign,
  Filter,
  Globe,
  GraduationCap,
  Grid3X3,
  List,
  Search,
  Star,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Subject {
  id: string
  name: string
  category: string
  icon: React.ComponentType<any>
  tutorCount: number
  averagePrice: { min: number; max: number }
  averageRating: number
  popularity: number
  level: string[]
  description: string
  trending: boolean
  featured: boolean
}

interface SubjectCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  subjects: Subject[]
  description: string
}

export default function Subjects() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [sortBy, setSortBy] = useState<
    'popularity' | 'rating' | 'price' | 'alphabetical'
  >('popularity')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Helper function to get translated category names
  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case 'mathematics':
        return t('mathematics')
      case 'sciences':
        return t('sciences')
      case 'languages':
        return t('languagesCategory')
      case 'computer-science':
        return t('computerScience')
      case 'test-prep':
        return t('testPreparation')
      case 'business':
        return t('businessEconomics')
      default:
        return categoryId
    }
  }

  // Helper function to get translated category descriptions
  const getCategoryDescription = (categoryId: string) => {
    switch (categoryId) {
      case 'mathematics':
        return t('mathDescription')
      case 'sciences':
        return t('sciencesDescription')
      case 'languages':
        return t('languagesDescription')
      case 'computer-science':
        return t('computerScienceDescription')
      case 'test-prep':
        return t('testPrepDescription')
      case 'business':
        return t('businessDescription')
      default:
        return ''
    }
  }

  // Helper function to get translated subject names
  const getSubjectName = (subjectId: string) => {
    switch (subjectId) {
      case 'algebra':
        return t('algebra')
      case 'calculus':
        return t('calculus')
      case 'geometry':
        return t('geometry')
      case 'physics':
        return t('physics')
      case 'chemistry':
        return t('chemistry')
      case 'biology':
        return t('biology')
      case 'english':
        return t('englishSubject')
      case 'spanish':
        return t('spanish')
      case 'french':
        return t('french')
      case 'programming':
        return t('programming')
      case 'web-development':
        return t('webDevelopment')
      case 'data-science':
        return t('dataScience')
      case 'ielts':
        return t('ielts')
      case 'toefl':
        return t('toefl')
      case 'sat':
        return t('sat')
      case 'business-english':
        return t('businessEnglish')
      case 'economics':
        return t('economicsSubject')
      default:
        return subjectId
    }
  }

  // Helper function to get translated subject descriptions
  const getSubjectDescription = (subjectId: string) => {
    switch (subjectId) {
      case 'algebra':
        return t('algebraDescription')
      case 'calculus':
        return t('calculusDescription')
      case 'geometry':
        return t('geometryDescription')
      case 'physics':
        return t('physicsDescription')
      case 'chemistry':
        return t('chemistryDescription')
      case 'biology':
        return t('biologyDescription')
      case 'english':
        return t('englishDescription')
      case 'spanish':
        return t('spanishDescription')
      case 'french':
        return t('frenchDescription')
      case 'programming':
        return t('programmingDescription')
      case 'web-development':
        return t('webDevelopmentDescription')
      case 'data-science':
        return t('dataScienceDescription')
      case 'ielts':
        return t('ieltsDescription')
      case 'toefl':
        return t('toeflDescription')
      case 'sat':
        return t('satDescription')
      case 'business-english':
        return t('businessEnglishDescription')
      case 'economics':
        return t('economicsDescription')
      default:
        return ''
    }
  }

  // Mock subjects data
  const subjectCategories: SubjectCategory[] = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'bg-blue-500',
      description: 'From basic arithmetic to advanced calculus',
      subjects: [
        {
          id: 'algebra',
          name: 'Algebra',
          category: 'mathematics',
          icon: Calculator,
          tutorCount: 45,
          averagePrice: { min: 30000, max: 80000 },
          averageRating: 4.7,
          popularity: 95,
          level: ['middle-school', 'high-school', 'university'],
          description:
            'Master algebraic equations, functions, and problem-solving techniques',
          trending: false,
          featured: true,
        },
        {
          id: 'calculus',
          name: 'Calculus',
          category: 'mathematics',
          icon: Calculator,
          tutorCount: 32,
          averagePrice: { min: 50000, max: 120000 },
          averageRating: 4.8,
          popularity: 78,
          level: ['high-school', 'university'],
          description:
            'Differential and integral calculus for advanced mathematics',
          trending: true,
          featured: false,
        },
        {
          id: 'geometry',
          name: 'Geometry',
          category: 'mathematics',
          icon: Calculator,
          tutorCount: 28,
          averagePrice: { min: 25000, max: 70000 },
          averageRating: 4.6,
          popularity: 82,
          level: ['elementary', 'middle-school', 'high-school'],
          description: 'Shapes, angles, proofs, and spatial reasoning',
          trending: false,
          featured: false,
        },
      ],
    },
    {
      id: 'sciences',
      name: 'Sciences',
      icon: Atom,
      color: 'bg-green-500',
      description: 'Explore the natural world through scientific inquiry',
      subjects: [
        {
          id: 'physics',
          name: 'Physics',
          category: 'sciences',
          icon: Atom,
          tutorCount: 38,
          averagePrice: { min: 40000, max: 100000 },
          averageRating: 4.7,
          popularity: 75,
          level: ['high-school', 'university'],
          description:
            'Mechanics, thermodynamics, electromagnetism, and quantum physics',
          trending: true,
          featured: true,
        },
        {
          id: 'chemistry',
          name: 'Chemistry',
          category: 'sciences',
          icon: Atom,
          tutorCount: 35,
          averagePrice: { min: 35000, max: 90000 },
          averageRating: 4.6,
          popularity: 72,
          level: ['high-school', 'university'],
          description: 'Organic, inorganic, and physical chemistry concepts',
          trending: false,
          featured: false,
        },
        {
          id: 'biology',
          name: 'Biology',
          category: 'sciences',
          icon: Atom,
          tutorCount: 42,
          averagePrice: { min: 30000, max: 85000 },
          averageRating: 4.8,
          popularity: 80,
          level: ['middle-school', 'high-school', 'university'],
          description: 'Cell biology, genetics, ecology, and human anatomy',
          trending: false,
          featured: true,
        },
      ],
    },
    {
      id: 'languages',
      name: 'Languages',
      icon: Globe,
      color: 'bg-purple-500',
      description: 'Master new languages and expand your communication skills',
      subjects: [
        {
          id: 'english',
          name: 'English',
          category: 'languages',
          icon: Globe,
          tutorCount: 89,
          averagePrice: { min: 25000, max: 75000 },
          averageRating: 4.9,
          popularity: 98,
          level: [
            'elementary',
            'middle-school',
            'high-school',
            'university',
            'adult',
          ],
          description:
            'Grammar, vocabulary, conversation, and academic writing',
          trending: false,
          featured: true,
        },
        {
          id: 'spanish',
          name: 'Spanish',
          category: 'languages',
          icon: Globe,
          tutorCount: 24,
          averagePrice: { min: 30000, max: 80000 },
          averageRating: 4.7,
          popularity: 65,
          level: ['elementary', 'middle-school', 'high-school', 'adult'],
          description:
            'Conversational Spanish, grammar, and cultural immersion',
          trending: true,
          featured: false,
        },
        {
          id: 'french',
          name: 'French',
          category: 'languages',
          icon: Globe,
          tutorCount: 18,
          averagePrice: { min: 35000, max: 85000 },
          averageRating: 4.6,
          popularity: 58,
          level: ['middle-school', 'high-school', 'adult'],
          description: 'French language fundamentals and advanced conversation',
          trending: false,
          featured: false,
        },
      ],
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      icon: Code,
      color: 'bg-indigo-500',
      description: 'Programming, algorithms, and technology skills',
      subjects: [
        {
          id: 'programming',
          name: 'Programming',
          category: 'computer-science',
          icon: Code,
          tutorCount: 56,
          averagePrice: { min: 50000, max: 150000 },
          averageRating: 4.8,
          popularity: 92,
          level: ['high-school', 'university', 'adult'],
          description:
            'Python, JavaScript, Java, C++, and more programming languages',
          trending: true,
          featured: true,
        },
        {
          id: 'web-development',
          name: 'Web Development',
          category: 'computer-science',
          icon: Code,
          tutorCount: 41,
          averagePrice: { min: 60000, max: 160000 },
          averageRating: 4.7,
          popularity: 88,
          level: ['high-school', 'university', 'adult'],
          description:
            'HTML, CSS, JavaScript, React, and modern web technologies',
          trending: true,
          featured: true,
        },
        {
          id: 'data-science',
          name: 'Data Science',
          category: 'computer-science',
          icon: Code,
          tutorCount: 23,
          averagePrice: { min: 70000, max: 180000 },
          averageRating: 4.9,
          popularity: 75,
          level: ['university', 'adult'],
          description: 'Statistics, machine learning, and data analysis',
          trending: true,
          featured: false,
        },
      ],
    },
    {
      id: 'test-prep',
      name: 'Test Preparation',
      icon: GraduationCap,
      color: 'bg-orange-500',
      description: 'Ace your standardized tests and entrance exams',
      subjects: [
        {
          id: 'ielts',
          name: 'IELTS',
          category: 'test-prep',
          icon: GraduationCap,
          tutorCount: 67,
          averagePrice: { min: 40000, max: 100000 },
          averageRating: 4.8,
          popularity: 90,
          level: ['high-school', 'university', 'adult'],
          description: 'Comprehensive IELTS preparation for all four skills',
          trending: false,
          featured: true,
        },
        {
          id: 'toefl',
          name: 'TOEFL',
          category: 'test-prep',
          icon: GraduationCap,
          tutorCount: 34,
          averagePrice: { min: 45000, max: 110000 },
          averageRating: 4.7,
          popularity: 72,
          level: ['high-school', 'university', 'adult'],
          description: 'TOEFL iBT preparation and practice tests',
          trending: false,
          featured: false,
        },
        {
          id: 'sat',
          name: 'SAT',
          category: 'test-prep',
          icon: GraduationCap,
          tutorCount: 29,
          averagePrice: { min: 50000, max: 120000 },
          averageRating: 4.6,
          popularity: 68,
          level: ['high-school'],
          description: 'SAT Math and Evidence-Based Reading and Writing',
          trending: false,
          featured: false,
        },
      ],
    },
    {
      id: 'business',
      name: 'Business & Economics',
      icon: DollarSign,
      color: 'bg-emerald-500',
      description: 'Business skills and economic principles',
      subjects: [
        {
          id: 'business-english',
          name: 'Business English',
          category: 'business',
          icon: DollarSign,
          tutorCount: 31,
          averagePrice: { min: 45000, max: 95000 },
          averageRating: 4.7,
          popularity: 77,
          level: ['university', 'adult'],
          description: 'Professional communication and business terminology',
          trending: false,
          featured: true,
        },
        {
          id: 'economics',
          name: 'Economics',
          category: 'business',
          icon: DollarSign,
          tutorCount: 22,
          averagePrice: { min: 40000, max: 90000 },
          averageRating: 4.5,
          popularity: 62,
          level: ['high-school', 'university'],
          description: 'Microeconomics, macroeconomics, and economic theory',
          trending: false,
          featured: false,
        },
      ],
    },
  ]

  // Get all subjects from categories
  const allSubjects = subjectCategories.flatMap((category) => category.subjects)

  // Featured subjects
  const featuredSubjects = allSubjects.filter((subject) => subject.featured)

  // Trending subjects
  const trendingSubjects = allSubjects.filter((subject) => subject.trending)

  // Filter and sort subjects
  const filteredSubjects = allSubjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || subject.category === selectedCategory
    const matchesLevel =
      levelFilter === 'all' || subject.level.includes(levelFilter)
    const matchesPrice =
      subject.averagePrice.min <= priceRange[1] &&
      subject.averagePrice.max >= priceRange[0]
    const matchesRating = subject.averageRating >= ratingFilter

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel &&
      matchesPrice &&
      matchesRating
    )
  })

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity
      case 'rating':
        return b.averageRating - a.averageRating
      case 'price':
        return a.averagePrice.min - b.averagePrice.min
      case 'alphabetical':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const totalTutors = allSubjects.reduce(
    (sum, subject) => sum + subject.tutorCount,
    0
  )

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setLevelFilter('all')
    setRatingFilter(0)
    setSortBy('popularity')
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('searchFilter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('searchSubjects')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchByNameKeyword')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('categoryFilter')}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">{t('allCategories')}</option>
              {subjectCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category.id)}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('levelFilter')}</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">{t('allLevels')}</option>
              <option value="elementary">{t('elementary')}</option>
              <option value="middle-school">{t('middleSchool')}</option>
              <option value="high-school">{t('highSchool')}</option>
              <option value="university">{t('university')}</option>
              <option value="adult">{t('adult')}</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('minimumRating')}</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={0}>{t('allRatings')}</option>
              <option value={4}>4+ {t('reviews')}</option>
              <option value={4.5}>4.5+ {t('reviews')}</option>
              <option value={4.8}>4.8+ {t('reviews')}</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('sortBy')}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="popularity">{t('popularity')}</option>
              <option value="rating">{t('highestRatedSort')}</option>
              <option value="price">{t('priceLowToHighSort')}</option>
              <option value="alphabetical">{t('alphabetical')}</option>
            </select>
          </div>

          <Button variant="outline" className="w-full" onClick={resetFilters}>
            {t('resetFilters')}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Subjects</span>
            <span className="font-semibold">{allSubjects.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Tutors</span>
            <span className="font-semibold">{totalTutors}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg. Rating</span>
            <span className="font-semibold">4.7 ⭐</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Filtered Results</span>
            <span className="font-semibold text-primary">
              {filteredSubjects.length}
            </span>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )

  const renderSubjectCard = (subject: Subject, featured = false) => (
    <Card
      key={subject.id}
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${featured ? 'ring-2 ring-primary/20' : ''}`}
    >
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4 flex-wrap xl:flex-nowrap gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                subjectCategories.find((cat) => cat.id === subject.category)
                  ?.color || 'bg-gray-500'
              }`}
            >
              <subject.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold whitespace-nowrap text-lg group-hover:text-primary transition-colors">
                {getSubjectName(subject.id)}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {getCategoryName(subject.category)}
              </p>
            </div>
          </div>
          <div className="flex xl:justify-end flex-wrap gap-1">
            {subject.trending && (
              <Badge className="bg-orange-100 text-orange-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                {t('trending')}
              </Badge>
            )}
            {subject.featured && (
              <Badge className="bg-purple-100 text-purple-800">
                <Star className="h-3 w-3 mr-1" />
                {t('featured')}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {getSubjectDescription(subject.id)}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{t('availableTutors')}</span>
            <span className="font-semibold">
              {subject.tutorCount} {t('tutorsCount')}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{t('priceRange')}</span>
            <span className="font-semibold">
              {subject.averagePrice.min.toLocaleString()} -{' '}
              {subject.averagePrice.max.toLocaleString()} {t('sum')}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{t('averageRatingLabel')}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{subject.averageRating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {subject.level.slice(0, 3).map((level) => (
              <Badge key={level} variant="outline" className="text-xs">
                {level.replace('-', ' ')}
              </Badge>
            ))}
            {subject.level.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{subject.level.length - 3} {t('more')}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            to={`/search?subject=${subject.name.trim().toLowerCase()}`}
            className="flex-1"
          >
            <Button className="w-full">{t('findTeachersButton')}</Button>
          </Link>
          {/* <Button variant="outline" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="pt-16  bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <div>
            Card {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {t('subjectsPage')}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {t('browseAllSubjects')}
                </p>
                <div className="flex flex-col sm:flex-row  sm:items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {allSubjects.length}+ {t('subjectsAvailable')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {totalTutors}+ {t('expertTutors')}
                  </span>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {allSubjects.length}+
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('subjectsPage')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* All Subjects with Filters */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('allSubjectsFilter')}
            </h2>
            <div className="flex justify-end items-center gap-3">
              {/* Mobile Filter Button with Sheet */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4" />
                    {(searchQuery ||
                      selectedCategory !== 'all' ||
                      levelFilter !== 'all' ||
                      ratingFilter > 0) && (
                      <span className="ml-2 h-2 w-2 bg-primary rounded-full"></span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[400px] sm:w-[540px] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>{t('searchFilter')}</SheetTitle>
                    <SheetDescription>
                      {t('tryAdjustingFiltersSubjects')}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filter Toggle */}
              {/* <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex"
              >
                <Filter className="h-4 w-4 mr-2" />
                {(searchQuery ||
                  selectedCategory !== 'all' ||
                  levelFilter !== 'all' ||
                  ratingFilter > 0) && (
                  <span className="ml-2 h-2 w-2 bg-primary rounded-full"></span>
                )}
              </Button> */}

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <div className={`hidden lg:block w-80`}>
              <FilterContent />
            </div>

            {/* Subjects Grid/List */}
            <div className="flex-1">
              {/* Active Filters Display */}
              {(searchQuery ||
                selectedCategory !== 'all' ||
                levelFilter !== 'all' ||
                ratingFilter > 0) && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      {t('activeFilters')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-blue-700 hover:text-blue-900 p-1 h-auto"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t('clearAll')}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {t('search')}: "{searchQuery}"
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {t('categoryFilter')}:{' '}
                        {getCategoryName(selectedCategory)}
                      </Badge>
                    )}
                    {levelFilter !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {t('levelFilter')}: {levelFilter.replace('-', ' ')}
                      </Badge>
                    )}
                    {ratingFilter > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {t('rating')}: {ratingFilter}+ {t('reviews')}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  {t('showingResults')} {sortedSubjects.length} {t('ofResults')}{' '}
                  {allSubjects.length} {t('subjectsPage')}
                </div>
              </div>

              <div
                className={
                  viewMode === 'grid'
                    ? 'grid sm:grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {sortedSubjects.map((subject) => renderSubjectCard(subject))}
              </div>

              {sortedSubjects.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('noSubjectsFound')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('tryAdjustingFiltersSubjects')}
                  </p>
                  <Button onClick={resetFilters}>{t('clearFilters')}</Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
