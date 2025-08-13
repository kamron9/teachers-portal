import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Users, Video, Star, Globe, ArrowRight, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const featuredTeachers = [
  {
    id: 1,
    name: "Aziza Karimova",
    subject: "English Language",
    rating: 4.9,
    reviews: 127,
    price: 50000,
    image: "/placeholder.svg",
    languages: ["Uzbek", "English", "Russian"],
    experience: "5+ years"
  },
  {
    id: 2,
    name: "John Smith",
    subject: "Mathematics",
    rating: 4.8,
    reviews: 98,
    price: 45000,
    image: "/placeholder.svg",
    languages: ["English", "Russian"],
    experience: "8+ years"
  },
  {
    id: 3,
    name: "Malika Tosheva",
    subject: "Programming",
    rating: 5.0,
    reviews: 84,
    price: 75000,
    image: "/placeholder.svg",
    languages: ["Uzbek", "Russian", "English"],
    experience: "6+ years"
  }
];

const subjects = [
  "English", "Mathematics", "Programming", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Literature", "Music"
];

const features = [
  {
    icon: Search,
    title: "Find Perfect Teachers",
    description: "Search by subject, price, rating, and language to find the ideal tutor for your needs"
  },
  {
    icon: Video,
    title: "Live Video Lessons",
    description: "High-quality video calls with integrated whiteboard and screen sharing tools"
  },
  {
    icon: Users,
    title: "Local & International",
    description: "Connect with both local Uzbek teachers and international experts worldwide"
  },
  {
    icon: BookOpen,
    title: "All Subjects Covered",
    description: "From languages to sciences, find expert tutors for any subject you want to learn"
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  🇺🇿 Made for Uzbekistan
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Learn with the
                  <span className="text-primary block">Best Teachers</span>
                  in Uzbekistan
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with qualified local and international teachers for personalized online lessons. 
                  Master any subject from the comfort of your home.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="What subject do you want to learn?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 text-lg border-0 focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                    <Button size="lg" className="h-12 px-8">
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjects.slice(0, 6).map((subject) => (
                      <Badge
                        key={subject}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Expert Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-gray-600">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">25+</div>
                  <div className="text-gray-600">Subjects</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/placeholder.svg"
                  alt="Online tutoring illustration"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make learning accessible, effective, and enjoyable for students across Uzbekistan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Top Teachers
              </h2>
              <p className="text-xl text-gray-600">
                Learn from experienced professionals who care about your success
              </p>
            </div>
            <Link to="/teachers">
              <Button variant="outline" size="lg">
                View All Teachers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTeachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{teacher.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-primary font-medium">{teacher.subject}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{teacher.experience} experience</span>
                      <span>•</span>
                      <span>{teacher.reviews} reviews</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {teacher.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
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
                      <Button>
                        Book Lesson
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                step: "1",
                title: "Register & Search",
                description: "Sign up with SMS verification and search for teachers by subject, price, and rating"
              },
              {
                step: "2",
                title: "Book & Pay",
                description: "Choose your preferred time slot and pay securely using local payment methods"
              },
              {
                step: "3",
                title: "Learn Online",
                description: "Join your live video lesson and start learning with personalized attention"
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
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
            Join thousands of students who are already improving their skills with our expert teachers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              Find a Teacher
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Become a Teacher
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
