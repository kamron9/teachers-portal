import React, { useState, useEffect } from "react";
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
  Camera,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Data Interfaces
interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  title: string;
  bio: string;
  teachingPhilosophy: string;
  whyITeach: string;
  profileImage: string;
  isOnline: boolean;
  isVerified: boolean;
  rating: number;
  averageRating: number;
  totalReviews: number;
  totalLessons: number;
  studentsCount: number;
  experienceYears: number;
  location: string;
  countryFlag: string;
  responseTime: string;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  subjects: Array<{
    name: string;
    icon: string;
    level: string;
    price: number;
    format: string;
  }>;
  subjectOfferings: Array<{
    subjectName: string;
    pricePerHour: number;
  }>;
  teachingLevels: string[];
  examPrep: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    verified: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    verified: boolean;
  }>;
  pricing: {
    trialPrice: number;
    regularPrice: number;
    packages: Array<{
      lessons: number;
      price: number;
      discount: number;
    }>;
  };
  schedule: {
    nextAvailable: string;
    timezone: string;
  };
  materials: {
    resources: Array<{
      name: string;
      type: string;
    }>;
  };
}

interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  subject: string;
  lessonCount: number;
  date: string;
  helpful: number;
  teacherResponse?: string;
}

// Mock Teacher Data
const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    firstName: 'Aziz',
    lastName: 'Karimov',
    name: 'Aziz Karimov',
    title: 'Matematika va Fizika o\'qituvchisi',
    bio: 'Men 10 yildan ortiq tajribaga ega matematik va fizika o\'qituvchisiman. Toshkent Davlat Universitetini tugatganman va matematika fanidan magistr darajasiga egaman. Mening maqsadim har bir o\'quvchiga matematika va fizikani oson va qiziqarli tarzda o\'rgatishdir. O\'quvchilarimning ko\'pchiligi davlat imtihonlarida yuqori natijalar ko\'rsatishgan.',
    teachingPhilosophy: 'Men har bir o\'quvchining o\'ziga xos o\'rganish uslubi borligi va individual yondashuvning muhimligiga ishonaman. Matematik tushunchalarni real hayot misollari orqali tushuntirish va amaliy masalalar yechish orqali bilimlarni mustahkamlash mening asosiy usullarimdir.',
    whyITeach: 'O\'qitish - bu mening ehtirosin. Har bir o\'quvchining "Aha!" deb aytgan lahzasi, tushunmagan mavzuni egallab olgandagi quvonchi - meni ilhomlantiradigan narsalardir. Men kelajak avlodga bilim berishni o\'z vazifam deb bilaman.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    isOnline: true,
    isVerified: true,
    rating: 4.9,
    averageRating: 4.9,
    totalReviews: 127,
    totalLessons: 2450,
    studentsCount: 89,
    experienceYears: 10,
    location: 'Toshkent, O\'zbekiston',
    countryFlag: '🇺🇿',
    responseTime: 'Odatda 1 soat ichida',
    languages: [
      { language: 'O\'zbek', proficiency: 'Native' },
      { language: 'Rus', proficiency: 'Fluent' },
      { language: 'Ingliz', proficiency: 'Advanced' },
    ],
    subjects: [
      {
        name: 'Matematika',
        icon: '📐',
        level: 'Barcha darajalar',
        price: 75000,
        format: 'Online/Offline',
      },
      {
        name: 'Fizika',
        icon: '⚛️',
        level: '8-11 sinf',
        price: 80000,
        format: 'Online/Offline',
      },
      {
        name: 'Oliy matematika',
        icon: '∑',
        level: 'Universitet',
        price: 100000,
        format: 'Online',
      },
    ],
    subjectOfferings: [
      { subjectName: 'Matematika', pricePerHour: 7500000 }, // 75,000 UZS in kopeks
      { subjectName: 'Fizika', pricePerHour: 8000000 },
      { subjectName: 'Oliy matematika', pricePerHour: 10000000 },
    ],
    teachingLevels: ['Boshlang\'ich', 'O\'rta maktab', 'Yuqori sinf', 'Universitet', 'IELTS/TOEFL'],
    examPrep: ['DTM', 'Grant imtihonlari', 'Olimpiada', 'SAT Math'],
    education: [
      {
        degree: 'Magistr - Matematika',
        institution: 'Toshkent Davlat Universiteti',
        year: '2012-2014',
        verified: true,
      },
      {
        degree: 'Bakalavr - Amaliy matematika',
        institution: 'Toshkent Davlat Universiteti', 
        year: '2008-2012',
        verified: true,
      },
    ],
    certifications: [
      {
        name: 'TESOL Sertifikati',
        issuer: 'Cambridge Assessment',
        year: '2020',
        verified: true,
      },
      {
        name: 'Google Educator Level 1',
        issuer: 'Google for Education',
        year: '2021',
        verified: true,
      },
      {
        name: 'Advanced Mathematics Teaching',
        issuer: 'O\'zbekiston Ta\'lim Vazirligi',
        year: '2019',
        verified: false,
      },
    ],
    pricing: {
      trialPrice: 25000,
      regularPrice: 75000,
      packages: [
        { lessons: 5, price: 350000, discount: 7 },
        { lessons: 10, price: 675000, discount: 10 },
        { lessons: 20, price: 1200000, discount: 20 },
      ],
    },
    schedule: {
      nextAvailable: 'Bugun, 15:00',
      timezone: 'GMT+5 (Toshkent)',
    },
    materials: {
      resources: [
        { name: 'Algebra formulalar to\'plami', type: 'PDF' },
        { name: 'Geometriya mashqlar', type: 'PDF' },
        { name: 'Fizika qonunlari spravochnik', type: 'PDF' },
        { name: 'Video darsliklar', type: 'Video' },
      ],
    },
  },
  // Add more mock teachers if needed...
];

// Mock Reviews Data
const mockReviews: Review[] = [
  {
    id: 'review-1',
    studentName: 'Malika T.',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b5e31b9c?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Aziz o\'qituvchi juda professional. Matematikani oson va tushunarli tarzda tushuntiradi. 3 oyda algebra bo\'yicha katta yutuqlarga erishdim.',
    subject: 'Matematika',
    lessonCount: 24,
    date: '2 hafta oldin',
    helpful: 8,
    teacherResponse: 'Rahmat, Malika! Sizning g\'ayratli o\'rganishingiz meni ham ilhomlantiryapti. Davom eting!',
  },
  {
    id: 'review-2',
    studentName: 'Javohir U.',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Fizika fanini hayotimda birinchi marta bunday qiziq deb hisobladim. O\'qituvchi har bir mavzuni misol bilan tushuntiradi.',
    subject: 'Fizika',
    lessonCount: 16,
    date: '1 hafta oldin',
    helpful: 12,
  },
  {
    id: 'review-3',
    studentName: 'Dilnoza R.',
    studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    comment: 'Yaxshi o\'qituvchi, sabr-toqatli. Universitet matematikasini o\'rganishda juda yordam berdi.',
    subject: 'Oliy matematika',
    lessonCount: 8,
    date: '3 hafta oldin',
    helpful: 6,
  },
  {
    id: 'review-4',
    studentName: 'Bobur N.',
    studentAvatar: '',
    rating: 5,
    comment: 'DTM ga tayyorgarlik ko\'rayotgan edim. Aziz o\'qituvchi bilan 2 oyda juda ko\'p narsani o\'rgandim. Natijam kutganimdan ham yaxshi bo\'ldi!',
    subject: 'Matematika',
    lessonCount: 32,
    date: '1 oy oldin',
    helpful: 15,
    teacherResponse: 'Tabriklayman, Bobur! DTMda muvaffaqiyat qozonganingizdan juda xursandman.',
  },
  {
    id: 'review-5',
    studentName: 'Feruza S.',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Professional yondashuv, aniq tushuntirishlar. Har bir darsdan so\'ng yangi bilimlar olaman.',
    subject: 'Matematika',
    lessonCount: 12,
    date: '2 hafta oldin',
    helpful: 9,
  },
];

// Mock API Functions
const useTeacherById = (id: string, enabled: boolean) => {
  const [data, setData] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !id) return;

    // Simulate API delay
    const timer = setTimeout(() => {
      const teacher = mockTeachers.find(t => t.id === id);
      if (teacher) {
        setData(teacher);
        setError(null);
      } else {
        setError(new Error('Teacher not found'));
      }
      setIsLoading(false);
    }, 1000); // 1 second delay to simulate network

    return () => clearTimeout(timer);
  }, [id, enabled]);

  return { data, isLoading, error };
};

const useTeacherReviews = (
  teacherId: string,
  filters: { rating?: number[]; limit?: number },
  options: { enabled: boolean }
) => {
  const [data, setData] = useState<{ reviews: Review[]; totalCount: number } | null>(null);

  useEffect(() => {
    if (!options.enabled || !teacherId) return;

    // Simulate API delay
    const timer = setTimeout(() => {
      let filteredReviews = mockReviews;
      
      if (filters.rating && filters.rating.length > 0) {
        filteredReviews = mockReviews.filter(review => 
          filters.rating!.includes(review.rating)
        );
      }

      if (filters.limit) {
        filteredReviews = filteredReviews.slice(0, filters.limit);
      }

      setData({
        reviews: filteredReviews,
        totalCount: mockReviews.length,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [teacherId, filters.rating, filters.limit, options.enabled]);

  return { data };
};

// Utility function
const formatPrice = (price: number) => price.toLocaleString();

const TeacherDetails: React.FC = () => {
  // Mock current teacher ID for demo
  const id = 'teacher-1';
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [isSaved, setIsSaved] = useState(false);

  // Mock navigation functions
  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
    alert(`Demo: Navigating to ${path}`);
  };

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

    // For demo purposes, just show alert
    alert(`Sinov darsi bron qilindi: ${selectedSubject} - ${teacher.pricing.trialPrice.toLocaleString()} UZS`);
    // navigate(`/booking?${params.toString()}`);
  };

  const handleBookRegular = () => {
    if (!teacher) return;

    const selectedSubjectData = teacher.subjectOfferings?.find(
      (s) => s.subjectName === selectedSubject,
    );
    const price = selectedSubjectData?.pricePerHour || 5000000; // Default 50,000 UZS in kopeks

    // For demo purposes, just show alert
    alert(`Oddiy dars bron qilindi: ${selectedSubject} - ${formatPrice(price/100)} UZS`);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            O'qituvchi topilmadi
          </h1>
          <p className="text-gray-600 mb-6">
            Siz qidirayotgan o'qituvchi mavjud emas.
          </p>
          <Button onClick={() => navigate("/teachers")} className="bg-blue-600 hover:bg-blue-700">
            O'qituvchilar ro'yxatiga qaytish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                O'qituvchilarga qaytish
              </Button>
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <button className="hover:text-blue-600">
                  Bosh sahifa
                </button>
                <ChevronRight className="h-4 w-4 mx-2" />
                <button className="hover:text-blue-600">
                  O'qituvchilar
                </button>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-900">
                  {teacher.firstName} {teacher.lastName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Ulashish
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
                {isSaved ? "Saqlangan" : "Saqlash"}
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
                              Tasdiqlangan
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg text-gray-600 mb-2">
                          {teacher.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                          Tillar
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
                          <p className="text-xs text-gray-600">
                            {teacher.totalReviews} ta sharh
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="font-bold text-lg">
                              {teacher.totalLessons.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            ta dars
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="h-4 w-4 text-green-500" />
                            <span className="font-bold text-lg">
                              {teacher.studentsCount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            ta talaba
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            <span className="font-bold text-lg">
                              {teacher.experienceYears}+
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            yil tajriba
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
                  <CardTitle>{teacher.name} haqida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-600 leading-relaxed">
                      {isDescriptionExpanded
                        ? teacher.bio
                        : `${teacher.bio.substring(0, 200)}...`}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600"
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                      >
                        {isDescriptionExpanded ? "Kamroq o'qish" : "Ko'proq o'qish"}
                      </Button>
                    </p>
                  </div>

                  {isDescriptionExpanded && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">
                          O'qitish falsafasi
                        </h4>
                        <p className="text-gray-600">
                          {teacher.teachingPhilosophy}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Nega o'qitaman</h4>
                        <p className="text-gray-600">
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
                  <CardTitle>Fanlar va narxlar</CardTitle>
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
                                <p className="text-sm text-gray-600">
                                  {subject.level}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {subject.price.toLocaleString()} UZS
                              </p>
                              <p className="text-xs text-gray-600">
                                soatiga
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
                      <h4 className="font-semibold mb-3">O'qitish darajalari</h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.teachingLevels.map((level, index) => (
                          <Badge key={index} variant="secondary">
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Imtihon tayyorgarligi</h4>
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
                  <CardTitle>Ta'lim va malaka</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Ta'lim
                    </h4>
                    <div className="space-y-3">
                      {teacher.education.map((edu, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium">{edu.degree}</h5>
                            <p className="text-sm text-gray-600">
                              {edu.institution}
                            </p>
                            <p className="text-xs text-gray-600">
                              {edu.year}
                            </p>
                          </div>
                          {edu.verified && (
                            <Badge
                              variant="secondary"
                              className="text-green-600"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Tasdiqlangan
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Sertifikatlar
                    </h4>
                    <div className="space-y-3">
                      {teacher.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h5 className="font-medium">{cert.name}</h5>
                            <p className="text-sm text-gray-600">
                              {cert.issuer}
                            </p>
                            <p className="text-xs text-gray-600">
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
                                Tasdiqlangan
                              </>
                            ) : (
                              "Kutilmoqda"
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
                      Talabalar sharhlari ({teacher.totalReviews})
                    </CardTitle>
                    <Select
                      value={reviewFilter}
                      onValueChange={setReviewFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barcha baholash</SelectItem>
                        <SelectItem value="5">5 yulduz</SelectItem>
                        <SelectItem value="4">4 yulduz</SelectItem>
                        <SelectItem value="3">3 yulduz</SelectItem>
                        <SelectItem value="2">2 yulduz</SelectItem>
                        <SelectItem value="1">1 yulduz</SelectItem>
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
                      <p className="text-sm text-gray-600">
                        {teacher.totalReviews} ta sharh
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
                          <span className="text-sm text-gray-600 w-8">
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
                              <span className="text-xs text-gray-600">
                                {review.lessonCount} dars • {review.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {review.comment}
                            </p>
                            {review.teacherResponse && (
                              <div className="bg-gray-100 p-3 rounded-lg mt-2">
                                <p className="text-xs font-medium mb-1">
                                  O'qituvchi javobi:
                                </p>
                                <p className="text-xs text-gray-600">
                                  {review.teacherResponse}
                                </p>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 p-0 h-auto"
                            >
                              👍 Foydali ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredReviews.length > 5 && (
                    <Button variant="outline" className="w-full">
                      Ko'proq sharhlarni ko'rish
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Teaching Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>O'quv materiallari va namuna</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Intro Video */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Tanishuv videosi
                    </h4>
                    <div className="relative bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Tanishuvni tomosha qiling (2:30)
                      </Button>
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      O'quv resurslari
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
                              <p className="text-xs text-gray-600">
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
                    <CardTitle>Dars bron qilish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subject Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Fan tanlang
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
                              UZS/soat
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Schedule Info */}
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Keyingi bo'sh vaqt
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {teacher.schedule.nextAvailable}
                      </p>
                      <p className="text-xs text-gray-600">
                        {teacher.schedule.timezone}
                      </p>
                    </div>

                    {/* Trial Lesson */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleBookTrial}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        Sinov darsini bron qilish
                      </Button>
                      <div className="text-center">
                        <span className="text-lg font-bold">
                          {teacher.pricing.trialPrice.toLocaleString()} UZS
                        </span>
                        <span className="text-sm text-gray-600 ml-1">
                          • 30 daqiqa
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-600">
                          yoki
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
                        Oddiy dars bron qilish
                      </Button>
                      <div className="text-center">
                        <span className="text-lg font-bold">
                          {teacher.subjects
                            .find((s) => s.name === selectedSubject)
                            ?.price.toLocaleString() ||
                            teacher.pricing.regularPrice.toLocaleString()}{" "}
                          UZS
                        </span>
                        <span className="text-sm text-gray-600 ml-1">
                          • 60 daqiqa
                        </span>
                      </div>
                    </div>

                    {/* Contact */}
                    <Button variant="ghost" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Xabar yuborish
                    </Button>
                  </CardContent>
                </Card>

                {/* Package Deals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Paket takliflar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teacher.pricing.packages.map((pkg, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {pkg.lessons} ta dars
                          </span>
                          <Badge variant="secondary">{pkg.discount}% chegirma</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {(pkg.price / pkg.lessons).toLocaleString()}{" "}
                            UZS/dars
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