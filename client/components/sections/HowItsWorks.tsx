export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Qanday ishlaydi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Besh oddiy qadam bilan professional o'qituvchilar bilan o'qishni
            boshlang
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Modern Large Card Layout */}
          <div className="space-y-20">
            {[
              {
                number: '01',
                title: 'Fan tanlang',
                description:
                  "Kerakli fan yoki tilni ro'yxatdan tanlang. 100+ fanlar mavjud.",
                visual: '🎯',
                color: 'bg-blue-500',
                bgColor: 'bg-blue-50',
                accent: 'text-blue-600',
              },
              {
                number: '02',
                title: 'Ustozni toping',
                description:
                  "Reyting, tajriba va narxlarga qarab o'zingizga mos ustozni tanlang.",
                visual: '👨‍🏫',
                color: 'bg-emerald-500',
                bgColor: 'bg-emerald-50',
                accent: 'text-emerald-600',
              },
              {
                number: '03',
                title: 'Darsni bron qiling',
                description:
                  'Qulay vaqtni belgilang va darsni bron qiling. Moslashuvchan jadval.',
                visual: '📅',
                color: 'bg-purple-500',
                bgColor: 'bg-purple-50',
                accent: 'text-purple-600',
              },
              {
                number: '04',
                title: "Online darsga qo'shiling",
                description:
                  "Platforma orqali video chat orqali darsga qo'shiling. Interaktiv o'qish.",
                visual: '💻',
                color: 'bg-orange-500',
                bgColor: 'bg-orange-50',
                accent: 'text-orange-600',
              },
              {
                number: '05',
                title: 'Bilimingizni oshiring',
                description:
                  'Muntazam darslar bilan bilimlaringizni rivojlantiring va maqsadlaringizga erishing.',
                visual: '🚀',
                color: 'bg-pink-500',
                bgColor: 'bg-pink-50',
                accent: 'text-pink-600',
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`relative group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row items-center gap-12 lg:gap-20`}
              >
                {/* Visual Side */}
                <div className="flex-1 lg:max-w-xl">
                  <div
                    className={`relative ${step.bgColor} rounded-3xl p-12 lg:p-16 transition-all duration-500 group-hover:scale-105`}
                  >
                    <div className="text-center">
                      <div className="text-8xl md:text-9xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                        {step.visual}
                      </div>
                      <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full opacity-60 animate-pulse"></div>
                      <div className="absolute bottom-12 left-8 w-6 h-6 bg-white rounded-full opacity-40 animate-pulse delay-300"></div>
                      <div className="absolute top-1/2 left-4 w-3 h-3 bg-white rounded-full opacity-50 animate-pulse delay-700"></div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 lg:max-w-xl text-center lg:text-left">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 ${step.color} text-white rounded-2xl text-2xl font-bold mb-6 shadow-lg`}
                  >
                    {step.number}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    {step.description}
                  </p>

                  {/* Step indicator dots */}
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          i === index
                            ? `${step.color} shadow-lg`
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Connecting Arrow (except last) */}
                {index < 4 && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 lg:hidden">
                    <div className="w-0.5 h-20 bg-gradient-to-b from-gray-300 to-transparent"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        {/* <div className="text-center mt-24">
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
        </div> */}
      </div>
    </section>
  )
}
