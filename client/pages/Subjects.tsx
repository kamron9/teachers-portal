import { useState } from "react";
import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Code,
  DollarSign,
  GraduationCap,
  Palette,
  Users,
  Stethoscope,
  Search,
  Filter,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  ChevronDown,
  Play,
  Award,
  Target,
  Zap,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Subject {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  tutorCount: number;
  averagePrice: { min: number; max: number };
  averageRating: number;
  popularity: number;
  level: string[];
  description: string;
  trending: boolean;
  featured: boolean;
}

interface SubjectCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  subjects: Subject[];
  description: string;
}

export default function Subjects() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState<
    "popularity" | "rating" | "price" | "alphabetical"
  >("popularity");
  const [showFilters, setShowFilters] = useState(false);

  // Mock subjects data
  const subjectCategories: SubjectCategory[] = [
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      color: "bg-blue-500",
      description: "From basic arithmetic to advanced calculus",
      subjects: [
        {
          id: "algebra",
          name: "Algebra",
          category: "mathematics",
          icon: Calculator,
          tutorCount: 45,
          averagePrice: { min: 30000, max: 80000 },
          averageRating: 4.7,
          popularity: 95,
          level: ["middle-school", "high-school", "university"],
          description:
            "Master algebraic equations, functions, and problem-solving techniques",
          trending: false,
          featured: true,
        },
        {
          id: "calculus",
          name: "Calculus",
          category: "mathematics",
          icon: Calculator,
          tutorCount: 32,
          averagePrice: { min: 50000, max: 120000 },
          averageRating: 4.8,
          popularity: 78,
          level: ["high-school", "university"],
          description:
            "Differential and integral calculus for advanced mathematics",
          trending: true,
          featured: false,
        },
        {
          id: "geometry",
          name: "Geometry",
          category: "mathematics",
          icon: Calculator,
          tutorCount: 28,
          averagePrice: { min: 25000, max: 70000 },
          averageRating: 4.6,
          popularity: 82,
          level: ["elementary", "middle-school", "high-school"],
          description: "Shapes, angles, proofs, and spatial reasoning",
          trending: false,
          featured: false,
        },
      ],
    },
    {
      id: "sciences",
      name: "Sciences",
      icon: Atom,
      color: "bg-green-500",
      description: "Explore the natural world through scientific inquiry",
      subjects: [
        {
          id: "physics",
          name: "Physics",
          category: "sciences",
          icon: Atom,
          tutorCount: 38,
          averagePrice: { min: 40000, max: 100000 },
          averageRating: 4.7,
          popularity: 75,
          level: ["high-school", "university"],
          description:
            "Mechanics, thermodynamics, electromagnetism, and quantum physics",
          trending: true,
          featured: true,
        },
        {
          id: "chemistry",
          name: "Chemistry",
          category: "sciences",
          icon: Atom,
          tutorCount: 35,
          averagePrice: { min: 35000, max: 90000 },
          averageRating: 4.6,
          popularity: 72,
          level: ["high-school", "university"],
          description: "Organic, inorganic, and physical chemistry concepts",
          trending: false,
          featured: false,
        },
        {
          id: "biology",
          name: "Biology",
          category: "sciences",
          icon: Atom,
          tutorCount: 42,
          averagePrice: { min: 30000, max: 85000 },
          averageRating: 4.8,
          popularity: 80,
          level: ["middle-school", "high-school", "university"],
          description: "Cell biology, genetics, ecology, and human anatomy",
          trending: false,
          featured: true,
        },
      ],
    },
    {
      id: "languages",
      name: "Languages",
      icon: Globe,
      color: "bg-purple-500",
      description: "Master new languages and expand your communication skills",
      subjects: [
        {
          id: "english",
          name: "English",
          category: "languages",
          icon: Globe,
          tutorCount: 89,
          averagePrice: { min: 25000, max: 75000 },
          averageRating: 4.9,
          popularity: 98,
          level: [
            "elementary",
            "middle-school",
            "high-school",
            "university",
            "adult",
          ],
          description:
            "Grammar, vocabulary, conversation, and academic writing",
          trending: false,
          featured: true,
        },
        {
          id: "spanish",
          name: "Spanish",
          category: "languages",
          icon: Globe,
          tutorCount: 24,
          averagePrice: { min: 30000, max: 80000 },
          averageRating: 4.7,
          popularity: 65,
          level: ["elementary", "middle-school", "high-school", "adult"],
          description:
            "Conversational Spanish, grammar, and cultural immersion",
          trending: true,
          featured: false,
        },
        {
          id: "french",
          name: "French",
          category: "languages",
          icon: Globe,
          tutorCount: 18,
          averagePrice: { min: 35000, max: 85000 },
          averageRating: 4.6,
          popularity: 58,
          level: ["middle-school", "high-school", "adult"],
          description: "French language fundamentals and advanced conversation",
          trending: false,
          featured: false,
        },
      ],
    },
    {
      id: "computer-science",
      name: "Computer Science",
      icon: Code,
      color: "bg-indigo-500",
      description: "Programming, algorithms, and technology skills",
      subjects: [
        {
          id: "programming",
          name: "Programming",
          category: "computer-science",
          icon: Code,
          tutorCount: 56,
          averagePrice: { min: 50000, max: 150000 },
          averageRating: 4.8,
          popularity: 92,
          level: ["high-school", "university", "adult"],
          description:
            "Python, JavaScript, Java, C++, and more programming languages",
          trending: true,
          featured: true,
        },
        {
          id: "web-development",
          name: "Web Development",
          category: "computer-science",
          icon: Code,
          tutorCount: 41,
          averagePrice: { min: 60000, max: 160000 },
          averageRating: 4.7,
          popularity: 88,
          level: ["high-school", "university", "adult"],
          description:
            "HTML, CSS, JavaScript, React, and modern web technologies",
          trending: true,
          featured: true,
        },
        {
          id: "data-science",
          name: "Data Science",
          category: "computer-science",
          icon: Code,
          tutorCount: 23,
          averagePrice: { min: 70000, max: 180000 },
          averageRating: 4.9,
          popularity: 75,
          level: ["university", "adult"],
          description: "Statistics, machine learning, and data analysis",
          trending: true,
          featured: false,
        },
      ],
    },
    {
      id: "test-prep",
      name: "Test Preparation",
      icon: GraduationCap,
      color: "bg-orange-500",
      description: "Ace your standardized tests and entrance exams",
      subjects: [
        {
          id: "ielts",
          name: "IELTS",
          category: "test-prep",
          icon: GraduationCap,
          tutorCount: 67,
          averagePrice: { min: 40000, max: 100000 },
          averageRating: 4.8,
          popularity: 90,
          level: ["high-school", "university", "adult"],
          description: "Comprehensive IELTS preparation for all four skills",
          trending: false,
          featured: true,
        },
        {
          id: "toefl",
          name: "TOEFL",
          category: "test-prep",
          icon: GraduationCap,
          tutorCount: 34,
          averagePrice: { min: 45000, max: 110000 },
          averageRating: 4.7,
          popularity: 72,
          level: ["high-school", "university", "adult"],
          description: "TOEFL iBT preparation and practice tests",
          trending: false,
          featured: false,
        },
        {
          id: "sat",
          name: "SAT",
          category: "test-prep",
          icon: GraduationCap,
          tutorCount: 29,
          averagePrice: { min: 50000, max: 120000 },
          averageRating: 4.6,
          popularity: 68,
          level: ["high-school"],
          description: "SAT Math and Evidence-Based Reading and Writing",
          trending: false,
          featured: false,
        },
      ],
    },
    {
      id: "business",
      name: "Business & Economics",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Business skills and economic principles",
      subjects: [
        {
          id: "business-english",
          name: "Business English",
          category: "business",
          icon: DollarSign,
          tutorCount: 31,
          averagePrice: { min: 45000, max: 95000 },
          averageRating: 4.7,
          popularity: 77,
          level: ["university", "adult"],
          description: "Professional communication and business terminology",
          trending: false,
          featured: true,
        },
        {
          id: "economics",
          name: "Economics",
          category: "business",
          icon: DollarSign,
          tutorCount: 22,
          averagePrice: { min: 40000, max: 90000 },
          averageRating: 4.5,
          popularity: 62,
          level: ["high-school", "university"],
          description: "Microeconomics, macroeconomics, and economic theory",
          trending: false,
          featured: false,
        },
      ],
    },
  ];

  // Get all subjects from categories
  const allSubjects = subjectCategories.flatMap(
    (category) => category.subjects,
  );

  // Featured subjects
  const featuredSubjects = allSubjects.filter((subject) => subject.featured);

  // Trending subjects
  const trendingSubjects = allSubjects.filter((subject) => subject.trending);

  // Filter and sort subjects
  const filteredSubjects = allSubjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || subject.category === selectedCategory;
    const matchesLevel =
      levelFilter === "all" || subject.level.includes(levelFilter);
    const matchesPrice =
      subject.averagePrice.min <= priceRange[1] &&
      subject.averagePrice.max >= priceRange[0];
    const matchesRating = subject.averageRating >= ratingFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel &&
      matchesPrice &&
      matchesRating
    );
  });

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity;
      case "rating":
        return b.averageRating - a.averageRating;
      case "price":
        return a.averagePrice.min - b.averagePrice.min;
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalTutors = allSubjects.reduce(
    (sum, subject) => sum + subject.tutorCount,
    0,
  );

  const renderSubjectCard = (subject: Subject, featured = false) => (
    <Card
      key={subject.id}
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${featured ? "ring-2 ring-primary/20" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                subjectCategories.find((cat) => cat.id === subject.category)
                  ?.color || "bg-gray-500"
              }`}
            >
              <subject.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {
                  subjectCategories.find((cat) => cat.id === subject.category)
                    ?.name
                }
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {subject.trending && (
              <Badge className="bg-orange-100 text-orange-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
            {featured && (
              <Badge className="bg-purple-100 text-purple-800">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {subject.description}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Available Tutors</span>
            <span className="font-semibold">{subject.tutorCount} tutors</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Price Range</span>
            <span className="font-semibold">
              {subject.averagePrice.min.toLocaleString()} -{" "}
              {subject.averagePrice.max.toLocaleString()} UZS
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Average Rating</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{subject.averageRating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {subject.level.slice(0, 3).map((level) => (
              <Badge key={level} variant="outline" className="text-xs">
                {level.replace("-", " ")}
              </Badge>
            ))}
            {subject.level.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{subject.level.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link to={`/find-teachers/${subject.id}`} className="flex-1">
            <Button className="w-full">Find Teachers</Button>
          </Link>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Subjects</span>
            </div>

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Subjects
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  Browse all available subjects and find the perfect tutor for
                  your learning goals
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {allSubjects.length}+ subjects available
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {totalTutors}+ expert tutors
                  </span>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {allSubjects.length}+
                  </div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Featured Subjects */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Subjects
              </h2>
              <Button variant="outline">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSubjects
                .slice(0, 6)
                .map((subject) => renderSubjectCard(subject, true))}
            </div>
          </section>

          {/* Trending Subjects */}
          {trendingSubjects.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Trending Subjects
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingSubjects.map((subject) => renderSubjectCard(subject))}
              </div>
            </section>
          )}

          {/* Subject Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center ${category.color}`}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.subjects.length} subjects
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {category.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        {category.subjects.slice(0, 3).map((subject) => (
                          <div
                            key={subject.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-700">
                              {subject.name}
                            </span>
                            <span className="text-gray-500">
                              {subject.tutorCount} tutors
                            </span>
                          </div>
                        ))}
                        {category.subjects.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{category.subjects.length - 3} more subjects
                          </div>
                        )}
                      </div>

                      <Button variant="outline" className="w-full">
                        Explore {category.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* All Subjects with Filters */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Subjects</h2>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <div
                className={`w-80 space-y-6 ${showFilters ? "block" : "hidden"} md:block`}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search & Filter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Search Subjects
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by name or keyword..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="all">All Categories</option>
                        {subjectCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Level Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Level</label>
                      <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="all">All Levels</option>
                        <option value="elementary">Elementary</option>
                        <option value="middle-school">Middle School</option>
                        <option value="high-school">High School</option>
                        <option value="university">University</option>
                        <option value="adult">Adult</option>
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Minimum Rating
                      </label>
                      <select
                        value={ratingFilter}
                        onChange={(e) =>
                          setRatingFilter(Number(e.target.value))
                        }
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value={0}>All Ratings</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                        <option value={4.8}>4.8+ Stars</option>
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="popularity">Popularity</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price">Price (Low to High)</option>
                        <option value="alphabetical">Alphabetical</option>
                      </select>
                    </div>

                    <Button variant="outline" className="w-full">
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Subjects</span>
                      <span className="font-semibold">
                        {allSubjects.length}
                      </span>
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
                </Card>
              </div>

              {/* Subjects Grid/List */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-600">
                    Showing {sortedSubjects.length} of {allSubjects.length}{" "}
                    subjects
                  </div>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 gap-6"
                      : "space-y-4"
                  }
                >
                  {sortedSubjects.map((subject) => renderSubjectCard(subject))}
                </div>

                {sortedSubjects.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No subjects found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setLevelFilter("all");
                        setRatingFilter(0);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
