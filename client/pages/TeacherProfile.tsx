import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, Video, MessageCircle, Heart, MapPin, Clock, BookOpen, Award, Users, Calendar, Play, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function TeacherProfile() {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock teacher data (in real app, this would be fetched based on id)
  const teacher = {
    id: 1,
    name: "Aziza Karimova",
    title: "English Language Expert & IELTS Specialist",
    rating: 4.9,
    reviews: 127,
    price: 50000,
    image: "/placeholder.svg",
    languages: ["Uzbek", "English", "Russian"],
    subjects: ["English", "IELTS", "Business English", "Conversation Practice"],
    experience: "5+ years",
    location: "Tashkent, Uzbekistan",
    isOnline: true,
    timezone: "UTC+5",
    responseTime: "Usually responds within 2 hours",
    totalStudents: 89,
    totalLessons: 340,
    description: "Certified English teacher with extensive experience in IELTS preparation and business communication. I help students achieve their language goals through personalized lessons and proven methodologies.",
    education: [
      "Masters in English Literature - National University of Uzbekistan",
      "TESOL Certification - British Council",
      "IELTS Teacher Training Certificate"
    ],
    achievements: [
      "95% student satisfaction rate",
      "IELTS success rate: 87% band 6.5+",
      "Featured teacher of the month - March 2024"
    ],
    teachingStyle: "I believe in interactive and communicative approach to language learning. My lessons are structured yet flexible, focusing on practical usage and real-world application.",
    videoIntro: "/placeholder.svg", // Video thumbnail
    availability: {
      timezone: "Tashkent (UTC+5)",
      nextAvailable: "Today at 3:00 PM",
      weeklyHours: 25
    },
    pricing: {
      trial: 25000,
      single: 50000,
      package5: 225000,
      package10: 425000
    }
  };

  const reviews = [
    {
      id: 1,
      student: "Jahongir M.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent teacher! Aziza helped me improve my IELTS score from 6.0 to 7.5. Her teaching methods are very effective and she's always encouraging.",
      subject: "IELTS Preparation"
    },
    {
      id: 2,
      student: "Sarah K.",
      rating: 5,
      date: "1 month ago", 
      comment: "Professional and patient teacher. The business English lessons were exactly what I needed for my career advancement.",
      subject: "Business English"
    },
    {
      id: 3,
      student: "Dilshod R.",
      rating: 4,
      date: "1 month ago",
      comment: "Great conversation practice sessions. Aziza creates a comfortable environment where you're not afraid to make mistakes.",
      subject: "Conversation Practice"
    }
  ];

  const ratingBreakdown = [
    { stars: 5, count: 89, percentage: 70 },
    { stars: 4, count: 28, percentage: 22 },
    { stars: 3, count: 7, percentage: 5 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/teachers" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Profile</h1>
              <p className="text-gray-600">Learn more about this teacher</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teacher Overview */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={teacher.image} alt={teacher.name} />
                        <AvatarFallback className="text-2xl">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {teacher.isOnline && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full w-8 h-8 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{teacher.name}</h1>
                        <p className="text-xl text-primary font-medium">{teacher.title}</p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{teacher.rating}</span>
                          <span>({teacher.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{teacher.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{teacher.totalStudents} students</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {teacher.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">Languages:</span>
                        {teacher.languages.map((language) => (
                          <Badge key={language} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-gray-700 leading-relaxed">{teacher.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Introduction Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    <img
                      src={teacher.videoIntro}
                      alt="Video intro"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="rounded-full w-16 h-16 p-0">
                        <Play className="h-6 w-6 ml-1" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Watch this 2-minute introduction to learn about my teaching style and approach
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="availability">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Teaching Style</h3>
                        <p className="text-gray-700">{teacher.teachingStyle}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Education</h3>
                        <ul className="space-y-2">
                          {teacher.education.map((edu, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Award className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{edu}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                        <ul className="space-y-2">
                          {teacher.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    {/* Rating Overview */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">{teacher.rating}</div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-gray-600">{teacher.reviews} reviews</p>
                          </div>
                          <div className="space-y-2">
                            {ratingBreakdown.map((rating) => (
                              <div key={rating.stars} className="flex items-center gap-3">
                                <span className="text-sm w-6">{rating.stars}★</span>
                                <Progress value={rating.percentage} className="flex-1" />
                                <span className="text-sm text-gray-600 w-8">{rating.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-medium text-gray-900">{review.student}</div>
                                <div className="text-sm text-gray-600">{review.subject}</div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <div className="text-sm text-gray-600">{review.date}</div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">{teacher.experience}</div>
                          <p className="text-gray-600">Teaching Experience</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">{teacher.totalLessons}</div>
                          <p className="text-gray-600">Lessons Completed</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">{teacher.totalStudents}</div>
                          <p className="text-gray-600">Students Taught</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="availability" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Timezone:</span>
                          <span>{teacher.availability.timezone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Next Available:</span>
                          <span className="text-green-600">{teacher.availability.nextAvailable}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Weekly Hours:</span>
                          <span>{teacher.availability.weeklyHours} hours/week</span>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-2">{teacher.responseTime}</p>
                          <Button className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Full Schedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing & Booking */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book a Lesson</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Trial Lesson</div>
                        <div className="text-sm text-gray-600">30 minutes</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{teacher.pricing.trial.toLocaleString()} UZS</div>
                        <div className="text-xs text-gray-600">50% off</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Single Lesson</div>
                        <div className="text-sm text-gray-600">60 minutes</div>
                      </div>
                      <div className="font-bold">{teacher.pricing.single.toLocaleString()} UZS</div>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg border-primary bg-primary/5">
                      <div>
                        <div className="font-medium">5 Lessons Package</div>
                        <div className="text-sm text-green-600">Save 10%</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{teacher.pricing.package5.toLocaleString()} UZS</div>
                        <div className="text-xs text-gray-600">45,000 UZS/lesson</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link to={`/book-lesson/${teacher.id}`}>
                      <Button className="w-full" size="lg">
                        <Video className="h-4 w-4 mr-2" />
                        Book Trial Lesson
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsFavorited(!isFavorited)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                      {isFavorited ? 'Saved' : 'Save Teacher'}
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Response time:</span>
                      <span>~2 hours</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Cancellation:</span>
                      <span>24h notice</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Teacher */}
              <Card>
                <CardContent className="p-4">
                  <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900">
                    <Flag className="h-4 w-4 mr-2" />
                    Report Teacher
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
