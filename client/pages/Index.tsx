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
import { ArrowRight, BookOpen, Search, Star, Users, Video } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const featuredTeachers = [
  {
    id: 1,
    name: 'Aziza Karimova',
    subject: 'English Language',
    rating: 4.9,
    reviews: 127,
    price: 50000,
    image: '/placeholder.svg',
    languages: ['Uzbek', 'English', 'Russian'],
    experience: '5+ years',
  },
  {
    id: 2,
    name: 'John Smith',
    subject: 'Mathematics',
    rating: 4.8,
    reviews: 98,
    price: 45000,
    image: '/placeholder.svg',
    languages: ['English', 'Russian'],
    experience: '8+ years',
  },
  {
    id: 3,
    name: 'Malika Tosheva',
    subject: 'Programming',
    rating: 5.0,
    reviews: 84,
    price: 75000,
    image: '/placeholder.svg',
    languages: ['Uzbek', 'Russian', 'English'],
    experience: '6+ years',
  },
]

// Use objects for Select
const subjects = [
  { id: 'english', name: 'English' },
  { id: 'russian', name: 'Rus tili' },
  { id: 'math', name: 'Mathematics' },
  { id: 'programming', name: 'Programming' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' },
  { id: 'literature', name: 'Literature' },
  { id: 'music', name: 'Music' },
]

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

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('')
  // Mock data for search/filter
  const [searchData, setSearchData] = useState({
    subject: '',
    language: '',
    priceFrom: '',
    priceTo: '',
  })

  const [popularCategories] = useState([
    { id: 'english', name: 'Ingliz tili', count: 120 },
    { id: 'math', name: 'Matematika', count: 95 },
    { id: 'programming', name: 'Dasturlash', count: 80 },
    { id: 'russian', name: 'Rus tili', count: 60 },
  ])

  function handleSearch() {
    // Mock search handler
    alert('Qidiruv amalga oshirildi!')
  }

  function handleCategoryClick(categoryId: string) {
    setSearchData({ ...searchData, subject: categoryId })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {[
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
            ].map((item, index) => (
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

      {/* how its works section */}
      {/* <section>
        <HowItWorksSection />
      </section> */}

      {/* Featured Teachers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Top Teachers
              </h2>
              <p className="text-xl text-gray-600">
                Learn from experienced professionals who care about your success
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="overflow-hidden hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">
                        {teacher.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {teacher.name}
                      </h3>
                      <p className="text-primary font-medium">
                        {teacher.subject}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{teacher.experience} experience</span>
                      <span>•</span>
                      <span>{teacher.reviews} reviews</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {teacher.languages.map((lang) => (
                        <Badge
                          key={lang}
                          variant="secondary"
                          className="text-xs"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {teacher.price.toLocaleString()} UZS
                        </span>
                        <span className="text-gray-600">/hour</span>
                      </div>
                      <Button>Book Lesson</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Link to="/teachers">
              <Button variant="outline" size="lg">
                View All Teachers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with online tutoring in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Register & Search',
                description:
                  'Sign up with SMS verification and search for teachers by subject, price, and rating',
              },
              {
                step: '2',
                title: 'Book & Pay',
                description:
                  'Choose your preferred time slot and pay securely using local payment methods',
              },
              {
                step: '3',
                title: 'Learn Online',
                description:
                  'Join your live video lesson and start learning with personalized attention',
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Learning?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of students who are already improving their skills
            with our expert teachers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/teachers">
              <Button size="lg" variant="secondary" className="text-primary">
                Find a Teacher
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/student-register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
