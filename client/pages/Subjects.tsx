import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiClient, SubjectOffering, formatPriceShort, getLevelDisplayName, getDeliveryDisplayName } from "@/lib/api";

interface PopularSubject {
  name: string;
  teacherCount: number;
}

interface SubjectCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  subjects: PopularSubject[];
  description: string;
}

export default function Subjects() {
  const { toast } = useToast();
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
  
  // State for real data
  const [popularSubjects, setPopularSubjects] = useState<PopularSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load popular subjects from API
  useEffect(() => {
    const loadPopularSubjects = async () => {
      try {
        setIsLoading(true);
        const subjects = await apiClient.getPopularSubjects();
        setPopularSubjects(subjects);
      } catch (error: any) {
        console.error("Failed to load popular subjects:", error);
        setError(error.message || "Failed to load subjects");
        toast({
          title: "Error",
          description: "Failed to load popular subjects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularSubjects();
  }, [toast]);

  // Subject categories with icons (keeping icons for UI purposes)
  const subjectCategories: SubjectCategory[] = [
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      color: "bg-blue-500",
      description: "From basic arithmetic to advanced calculus",
      subjects: popularSubjects.filter(s => 
        ["Algebra", "Calculus", "Geometry", "Statistics", "Mathematics"].some(math => 
          s.name.toLowerCase().includes(math.toLowerCase())
        )
      ),
    },
    {
      id: "sciences",
      name: "Sciences",
      icon: Atom,
      color: "bg-green-500",
      description: "Explore the natural world through scientific inquiry",
      subjects: popularSubjects.filter(s => 
        ["Physics", "Chemistry", "Biology", "Science"].some(sci => 
          s.name.toLowerCase().includes(sci.toLowerCase())
        )
      ),
    },
    {
      id: "languages",
      name: "Languages",
      icon: Globe,
      color: "bg-purple-500",
      description: "Master new languages and expand your communication skills",
      subjects: popularSubjects.filter(s => 
        ["English", "Spanish", "French", "Russian", "German", "Chinese", "Arabic", "Language"].some(lang => 
          s.name.toLowerCase().includes(lang.toLowerCase())
        )
      ),
    },
    {
      id: "computer-science",
      name: "Computer Science",
      icon: Code,
      color: "bg-indigo-500",
      description: "Programming, algorithms, and technology skills",
      subjects: popularSubjects.filter(s => 
        ["Programming", "Web Development", "Data Science", "JavaScript", "Python", "Java", "React", "Computer"].some(tech => 
          s.name.toLowerCase().includes(tech.toLowerCase())
        )
      ),
    },
    {
      id: "test-prep",
      name: "Test Preparation",
      icon: GraduationCap,
      color: "bg-orange-500",
      description: "Ace your standardized tests and entrance exams",
      subjects: popularSubjects.filter(s => 
        ["IELTS", "TOEFL", "SAT", "GMAT", "GRE", "Test", "Exam"].some(test => 
          s.name.toLowerCase().includes(test.toLowerCase())
        )
      ),
    },
    {
      id: "business",
      name: "Business & Economics",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Business skills and economic principles",
      subjects: popularSubjects.filter(s => 
        ["Business", "Economics", "Marketing", "Finance", "Management"].some(biz => 
          s.name.toLowerCase().includes(biz.toLowerCase())
        )
      ),
    },
  ];

  // Get all subjects from API data
  const allSubjects = popularSubjects;

  // Featured subjects (top 6 by teacher count)
  const featuredSubjects = [...popularSubjects]
    .sort((a, b) => b.teacherCount - a.teacherCount)
    .slice(0, 6);

  // Trending subjects (simulate trending by choosing subjects with good teacher count)
  const trendingSubjects = [...popularSubjects]
    .filter(s => s.teacherCount >= 10)
    .slice(0, 4);

  // Filter subjects based on search and filters
  const filteredSubjects = allSubjects.filter((subject) => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      subjectCategories.find(cat => cat.id === selectedCategory)?.subjects.some(s => s.name === subject.name);
    
    // Since we don't have level and price data from popular subjects API,
    // we'll show all subjects for now
    return matchesSearch && matchesCategory;
  });

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.teacherCount - a.teacherCount;
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return b.teacherCount - a.teacherCount;
    }
  });

  const totalTutors = allSubjects.reduce((sum, subject) => sum + subject.teacherCount, 0);

  const renderSubjectCard = (subject: PopularSubject, featured = false) => {
    // Find which category this subject belongs to for styling
    const category = subjectCategories.find(cat => 
      cat.subjects.some(s => s.name === subject.name)
    ) || subjectCategories[0]; // Default to first category if not found

    const Icon = category.icon;

    return (
      <Card
        key={subject.name}
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${featured ? "ring-2 ring-primary/20" : ""}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {category.name}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {featured && (
                <Badge className="bg-purple-100 text-purple-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Available Tutors</span>
              <span className="font-semibold">{subject.teacherCount} tutors</span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Link to={`/find-teachers?subject=${encodeURIComponent(subject.name)}`} className="flex-1">
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
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load subjects</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
          {featuredSubjects.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Popular Subjects
                </h2>
                <Button variant="outline">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSubjects.map((subject) => renderSubjectCard(subject, true))}
              </div>
            </section>
          )}

          {/* Trending Subjects */}
          {trendingSubjects.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  In Demand
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
                            key={subject.name}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-700">
                              {subject.name}
                            </span>
                            <span className="text-gray-500">
                              {subject.teacherCount} tutors
                            </span>
                          </div>
                        ))}
                        {category.subjects.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{category.subjects.length - 3} more subjects
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedCategory(category.id)}
                      >
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

                    {/* Sort Options */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="popularity">Popularity</option>
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
