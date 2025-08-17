import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen, Calendar, Clock } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Qanday ishlaydi?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uchta oddiy qadam bilan professional o'qituvchilar bilan o'qishni
            boshlang
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1: Find your tutor */}
            <Card className="bg-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-xl flex items-center justify-center text-xl font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Ustozingizni toping
                    </h3>
                    <p className="text-gray-600">
                      Sizni qiziqtirgan, rag'batlantirgan va ilhomlantirgan
                      ustoz bilan bog'laning.
                    </p>
                  </div>
                </div>

                {/* Visual Mockup - Tutor Cards */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder.svg" alt="Millena" />
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            Millena
                          </h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">4.9</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          🇺🇸 Ingliz tili ustozi
                        </p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Ingliz tili (Native)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Anvar</h4>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          🇷🇺 Rus tili ustozi
                        </p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Rus tili (Native)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border opacity-60">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Sardor</h4>
                        <p className="text-sm text-gray-600">
                          🔢 Matematika ustozi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Start learning */}
            <Card className="bg-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center text-xl font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      O'qishni boshlang
                    </h3>
                    <p className="text-gray-600">
                      Ustozingiz sizni birinchi darsda yo'naltirib, keyingi
                      qadamlarni rejalashtiradi.
                    </p>
                  </div>
                </div>

                {/* Visual Mockup - Video Lesson */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                        <AvatarImage src="/placeholder.svg" alt="Tutor" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="text-2xl">📹</div>
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                        <AvatarFallback>O</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Jonli video dars</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>50 daqiqa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Speak, Read, Write, Repeat */}
            <Card className="bg-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center text-xl font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Gapiring. O'qing. Yozing. Takrorlang.
                    </h3>
                    <p className="text-gray-600">
                      Har hafta qancha dars olishni tanlang va maqsadlaringizga
                      erishishga tayyor bo'ling!
                    </p>
                  </div>
                </div>

                {/* Visual Mockup - Lesson Schedule */}
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          Haftada 3 dars
                        </span>
                      </div>
                      <Badge variant="default" className="bg-blue-600">
                        Tavsiya etiladi
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Tez rivojlanish uchun
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        Haftada 2 dars
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Barqaror o'qish
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        Haftada 1 dars
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Sekin sur'atda</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              O'qishni bugun boshlang!
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Minglab o'quvchi bizning platformada muvaffaqiyatli o'qib kelmoqda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  O'quvchi sifatida boshlang
                </Button>
              </Link>
              <Link to="/teacher-signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-xl"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  O'qituvchi bo'ling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
