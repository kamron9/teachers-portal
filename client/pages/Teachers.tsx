import { useState } from "react";
import { Search, Filter, Star, Video, MessageCircle, Heart, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockTeachers = [
  {
    id: 1,
    name: "Aziza Karimova",
    title: "English Language Expert",
    rating: 4.9,
    reviews: 127,
    price: 50000,
    image: "/placeholder.svg",
    languages: ["Uzbek", "English", "Russian"],
    subjects: ["English", "IELTS", "Business English"],
    experience: "5+ years",
    location: "Tashkent, Uzbekistan",
    isOnline: true,
    description: "Certified English teacher with experience in IELTS preparation and business communication.",
    availability: "Available today"
  },
  {
    id: 2,
    name: "John Smith",
    title: "Mathematics Professor",
    rating: 4.8,
    reviews: 98,
    price: 45000,
    image: "/placeholder.svg",
    languages: ["English", "Russian"],
    subjects: ["Mathematics", "Calculus", "Statistics"],
    experience: "8+ years",
    location: "New York, USA",
    isOnline: false,
    description: "PhD in Mathematics with extensive experience in teaching calculus and statistics.",
    availability: "Available tomorrow"
  },
  {
    id: 3,
    name: "Malika Tosheva",
    title: "Programming Mentor",
    rating: 5.0,
    reviews: 84,
    price: 75000,
    image: "/placeholder.svg",
    languages: ["Uzbek", "Russian", "English"],
    subjects: ["Programming", "Python", "JavaScript", "React"],
    experience: "6+ years",
    location: "Samarkand, Uzbekistan",
    isOnline: true,
    description: "Senior developer and coding instructor specializing in web development technologies.",
    availability: "Available now"
  },
  {
    id: 4,
    name: "David Wilson",
    title: "Physics & Chemistry Tutor",
    rating: 4.7,
    reviews: 156,
    price: 40000,
    image: "/placeholder.svg",
    languages: ["English"],
    subjects: ["Physics", "Chemistry", "Math"],
    experience: "10+ years",
    location: "London, UK",
    isOnline: true,
    description: "Experienced science teacher helping students excel in physics and chemistry.",
    availability: "Available in 2 hours"
  },
  {
    id: 5,
    name: "Sevara Abdullayeva",
    title: "Uzbek Language & Literature",
    rating: 4.9,
    reviews: 73,
    price: 35000,
    image: "/placeholder.svg",
    languages: ["Uzbek", "Russian"],
    subjects: ["Uzbek", "Literature", "History"],
    experience: "4+ years",
    location: "Bukhara, Uzbekistan",
    isOnline: false,
    description: "Native Uzbek speaker specializing in language learning and literature studies.",
    availability: "Available tomorrow"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    title: "Arabic & Islamic Studies",
    rating: 4.8,
    reviews: 92,
    price: 55000,
    image: "/placeholder.svg",
    languages: ["Arabic", "English", "Uzbek"],
    subjects: ["Arabic", "Quran", "Islamic Studies"],
    experience: "7+ years",
    location: "Cairo, Egypt",
    isOnline: true,
    description: "Islamic scholar and Arabic language expert with traditional and modern teaching methods.",
    availability: "Available now"
  }
];

const subjects = [
  "All Subjects", "Mathematics", "English", "Programming", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Literature", "Arabic", "Uzbek", "Russian"
];

const languages = ["All Languages", "Uzbek", "English", "Russian", "Arabic"];

export default function Teachers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("rating");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "All Subjects" || teacher.subjects.includes(selectedSubject);
    const matchesLanguage = selectedLanguage === "All Languages" || teacher.languages.includes(selectedLanguage);
    const matchesPrice = teacher.price >= priceRange[0] && teacher.price <= priceRange[1];
    const matchesOnline = !showOnlineOnly || teacher.isOnline;

    return matchesSearch && matchesSubject && matchesLanguage && matchesPrice && matchesOnline;
  });

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Find Your Perfect Teacher
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse {mockTeachers.length} expert teachers ready to help you achieve your learning goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by teacher name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 text-lg"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} UZS
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
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="online-only"
                checked={showOnlineOnly}
                onChange={e => setShowOnlineOnly(e.target.checked)}
              />
              <label htmlFor="online-only" className="text-sm font-medium">
                Online now only
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedTeachers.length} of {mockTeachers.length} teachers
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {sortedTeachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Teacher Image */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage src={teacher.image} alt={teacher.name} />
                      <AvatarFallback className="rounded-none text-2xl">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {teacher.isOnline && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="flex-1 p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                        <p className="text-primary font-medium">{teacher.title}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{teacher.rating}</span>
                        <span>({teacher.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{teacher.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">{teacher.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 3).map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {teacher.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {teacher.languages.map((language) => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{teacher.availability}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {teacher.price.toLocaleString()} UZS
                        </span>
                        <span className="text-gray-600">/hour</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Book Trial
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {sortedTeachers.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Teachers
            </Button>
          </div>
        )}

        {/* No Results */}
        {sortedTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find more teachers.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("All Subjects");
                setSelectedLanguage("All Languages");
                setPriceRange([0, 100000]);
                setShowOnlineOnly(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
