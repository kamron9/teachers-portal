import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTeacherById, useTeacherReviews } from "@/hooks/useApi";
import { formatPrice } from "@/lib/api";
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Users,
  BookOpen,
  Globe,
  Clock,
  Calendar,
  Video,
  MessageCircle,
  CheckCircle,
  Play,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  MapPin,
  Award,
  GraduationCap,
  Languages,
  TrendingUp,
  Badge as BadgeIcon,
  Camera,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// Interface is imported from API client

const TeacherDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [isSaved, setIsSaved] = useState(false);

  // Fetch teacher data
  const { data: teacher, isLoading, error } = useTeacherById(id || "", !!id);

  // Fetch teacher reviews
  const { data: reviewsData } = useTeacherReviews(
    id || "",
    {
      rating: reviewFilter !== "all" ? [parseInt(reviewFilter)] : undefined,
      limit: 20,
    },
    { enabled: !!id },
  );

  useEffect(() => {
    if (teacher?.subjectOfferings?.[0]) {
      setSelectedSubject(teacher.subjectOfferings[0].subjectName);
    }
  }, [teacher]);

  const handleBookTrial = () => {
    if (!teacher) return;

    const params = new URLSearchParams({
      tutorId: teacher.id,
      tutorName: `${teacher.firstName} ${teacher.lastName}`,
      tutorAvatar: teacher.profileImage || "/placeholder.svg",
      tutorRating: teacher.averageRating?.toString() || "0",
      subject: selectedSubject,
      slotStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      slotEnd: new Date(
        Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      price: "2500000", // 25,000 UZS trial in kopeks
      serviceFee: "0",
    });

    navigate(`/booking?${params.toString()}`);
  };

  const handleBookRegular = () => {
    if (!teacher) return;

    const selectedSubjectData = teacher.subjectOfferings?.find(
      (s) => s.subjectName === selectedSubject,
    );
    const price = selectedSubjectData?.pricePerHour || 5000000; // Default 50,000 UZS in kopeks

    const params = new URLSearchParams({
      tutorId: teacher.id,
      tutorName: `${teacher.firstName} ${teacher.lastName}`,
      tutorAvatar: teacher.profileImage || "/placeholder.svg",
      tutorRating: teacher.averageRating?.toString() || "0",
      subject: selectedSubject,
      slotStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      slotEnd: new Date(
        Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
      ).toISOString(),
      price: price.toString(),
      serviceFee: "500000", // 5,000 UZS in kopeks
    });

    navigate(`/booking?${params.toString()}`);
  };

  const reviews = reviewsData?.reviews || [];
  const filteredReviews = reviews.filter((review) => {
    if (reviewFilter === "all") return true;
    return review.rating === parseInt(reviewFilter);
  });

  const totalReviews = reviewsData?.totalCount || 0;
  const ratingDistribution = teacher
    ? [
        { stars: 5, count: Math.floor(totalReviews * 0.8) },
        { stars: 4, count: Math.floor(totalReviews * 0.15) },
        { stars: 3, count: Math.floor(totalReviews * 0.03) },
        { stars: 2, count: Math.floor(totalReviews * 0.01) },
        { stars: 1, count: Math.floor(totalReviews * 0.01) },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            O'qituvchi topilmadi
          </h1>
          <p className="text-gray-600 mb-6">
            Siz qidirayotgan o'qituvchi mavjud emas.
          </p>
          <Button onClick={() => navigate("/teachers")}>
            O'qituvchilar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/teachers")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Teachers
              </Button>
              <div className="hidden md:flex items-center text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link to="/teachers" className="hover:text-primary">
                  Teachers
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground">
                  {teacher.firstName} {teacher.lastName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className={isSaved ? "text-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Teacher Hero Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Avatar className="w-32 h-32">
                          <AvatarImage
                            src={teacher.profileImage}
                            alt={teacher.name}
                          />
                          <AvatarFallback className="text-2xl">
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
                            teacher.isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {teacher.isVerified && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-2xl font-bold">{teacher.name}</h1>
                          {teacher.isVerified && (
                            <Badge
                              variant="secondary"
                              className="text-blue-600"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg text-muted-foreground mb-2">
                          {teacher.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {teacher.countryFlag} {teacher.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {teacher.responseTime}
                          </div>
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {teacher.languages.map((lang, index) => (
                            <Badge key={index} variant="outline">
                              {lang.language} ({lang.proficiency})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-bold text-lg">
                              {teacher.rating}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {teacher.totalReviews} reviews
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="font-bold text-lg">
                              {teacher.totalLessons.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            lessons
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="h-4 w-4 text-green-500" />
                            <span className="font-bold text-lg">
                              {teacher.studentsCount}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            students
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            <span className="font-bold text-lg">
                              {teacher.experienceYears}+
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            years exp.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About {teacher.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {isDescriptionExpanded
                        ? teacher.bio
                        : `${teacher.bio.substring(0, 200)}...`}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                      >
                        {isDescriptionExpanded ? "Read less" : "Read more"}
                      </Button>
                    </p>
                  </div>

                  {isDescriptionExpanded && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">
                          Teaching Philosophy
                        </h4>
                        <p className="text-muted-foreground">
                          {teacher.teachingPhilosophy}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Why I Teach</h4>
                        <p className="text-muted-foreground">
                          {teacher.whyITeach}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Subjects & Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle>Subjects & Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {teacher.subjects.map((subject, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{subject.icon}</span>
                              <div>
                                <h4 className="font-semibold">
                                  {subject.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {subject.level}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {subject.price.toLocaleString()} UZS
                              </p>
                              <p className="text-xs text-muted-foreground">
                                per hour
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {subject.format}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Teaching Levels</h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.teachingLevels.map((level, index) => (
                          <Badge key={index} variant="secondary">
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Exam Preparation</h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.examPrep.map((exam, index) => (
                          <Badge key={index} variant="secondary">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Education & Qualifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </h4>
                    <div className="space-y-3">
                      {teacher.education.map((edu, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium">{edu.degree}</h5>
                            <p className="text-sm text-muted-foreground">
                              {edu.institution}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.year}
                            </p>
                          </div>
                          {edu.verified && (
                            <Badge
                              variant="secondary"
                              className="text-green-600"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Certifications
                    </h4>
                    <div className="space-y-3">
                      {teacher.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium">{cert.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {cert.issuer}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cert.year}
                            </p>
                          </div>
                          <Badge
                            variant={cert.verified ? "secondary" : "outline"}
                            className={
                              cert.verified
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {cert.verified ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              "Pending"
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Student Reviews ({teacher.totalReviews})
                    </CardTitle>
                    <Select
                      value={reviewFilter}
                      onValueChange={setReviewFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="4">4 stars</SelectItem>
                        <SelectItem value="3">3 stars</SelectItem>
                        <SelectItem value="2">2 stars</SelectItem>
                        <SelectItem value="1">1 star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rating Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">
                        {teacher.rating}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= teacher.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {teacher.totalReviews} reviews
                      </p>
                    </div>
                    <div className="space-y-2">
                      {ratingDistribution.map((dist) => (
                        <div
                          key={dist.stars}
                          className="flex items-center gap-2"
                        >
                          <span className="text-sm w-6">{dist.stars}★</span>
                          <Progress
                            value={(dist.count / teacher.totalReviews) * 100}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-8">
                            {dist.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {filteredReviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.studentAvatar} />
                            <AvatarFallback>
                              {review.studentName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">
                                {review.studentName}
                              </h5>
                              <Badge variant="outline" className="text-xs">
                                {review.subject}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? "text-yellow-500 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {review.lessonCount} lessons • {review.date}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {review.comment}
                            </p>
                            {review.teacherResponse && (
                              <div className="bg-muted p-3 rounded-lg mt-2">
                                <p className="text-xs font-medium mb-1">
                                  Teacher's response:
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {review.teacherResponse}
                                </p>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 p-0 h-auto"
                            >
                              👍 Helpful ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredReviews.length > 5 && (
                    <Button variant="outline" className="w-full">
                      Show more reviews
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Teaching Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Materials & Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Intro Video */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Introduction Video
                    </h4>
                    <div className="relative bg-muted rounded-lg h-48 flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Watch Introduction (2:30)
                      </Button>
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Teaching Resources
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {teacher.materials.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">
                                {resource.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {resource.type}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Widget - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Book a Lesson</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subject Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Choose Subject
                      </label>
                      <Select
                        value={selectedSubject}
                        onValueChange={setSelectedSubject}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {teacher.subjects.map((subject) => (
                            <SelectItem key={subject.name} value={subject.name}>
                              {subject.name} - {subject.price.toLocaleString()}{" "}
                              UZS/hr
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Schedule Info */}
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Next Available
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {teacher.schedule.nextAvailable}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {teacher.schedule.timezone}
                      </p>
                    </div>

                    {/* Trial Lesson */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleBookTrial}
                        className="w-full"
                        size="lg"
                      >
                        Book Trial Lesson
                      </Button>
                      <div className="text-center">
                        <span className="text-lg font-bold">
                          {teacher.pricing.trialPrice.toLocaleString()} UZS
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          • 30 minutes
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          or
                        </span>
                      </div>
                    </div>

                    {/* Regular Lesson */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleBookRegular}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        Book Regular Lesson
                      </Button>
                      <div className="text-center">
                        <span className="text-lg font-bold">
                          {teacher.subjects
                            .find((s) => s.name === selectedSubject)
                            ?.price.toLocaleString() ||
                            teacher.pricing.regularPrice.toLocaleString()}{" "}
                          UZS
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          • 60 minutes
                        </span>
                      </div>
                    </div>

                    {/* Contact */}
                    <Button variant="ghost" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>

                {/* Package Deals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Package Deals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teacher.pricing.packages.map((pkg, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {pkg.lessons} Lessons
                          </span>
                          <Badge variant="secondary">{pkg.discount}% off</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {(pkg.price / pkg.lessons).toLocaleString()}{" "}
                            UZS/lesson
                          </span>
                          <span className="font-bold">
                            {pkg.price.toLocaleString()} UZS
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
