import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCreatePayment } from "@/hooks/useApi";
import { formatPrice } from "@/lib/api";
import { ArrowLeft, CreditCard, Shield, Lock, Check, Loader2, AlertCircle, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("payme");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const createPaymentMutation = useCreatePayment();
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  // Extract booking details from URL params
  const teacherId = searchParams.get("teacherId");
  const packageType = searchParams.get("package");
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");

  // Mock data (in real app, fetch based on params)
  const bookingDetails = {
    teacher: {
      name: "Aziza Karimova",
      title: "English Language Expert",
      image: "/placeholder.svg",
      subjects: ["English", "IELTS"]
    },
    lesson: {
      date: selectedDate ? new Date(selectedDate).toLocaleDateString() : "",
      time: selectedTime || "",
      package: packageType === "trial" ? "Trial Lesson" :
               packageType === "single" ? "Single Lesson" :
               packageType === "package5" ? "5 Lessons Package" : "10 Lessons Package",
      duration: packageType === "trial" ? 30 : 60,
      price: packageType === "trial" ? 25000 :
             packageType === "single" ? 50000 :
             packageType === "package5" ? 225000 : 425000
    }
  };

  const paymentMethods = [
    {
      id: "payme",
      name: "Payme",
      logo: "💳",
      description: "O'zbekistonda eng mashhur to'lov usuli",
      fee: 0
    },
    {
      id: "click",
      name: "Click",
      logo: "📱",
      description: "Tez va xavfsiz mobil to'lovlar",
      fee: 0
    },
    {
      id: "uzum",
      name: "Uzum Pay",
      logo: "🟣",
      description: "Yangi raqamli to'lov yechimi",
      fee: 0
    },
    {
      id: "stripe",
      name: "Kredit/Debit Karta",
      logo: "💳",
      description: "Xalqaro kartalar (Visa, MasterCard)",
      fee: Math.round(bookingDetails.lesson.price * 0.03)
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "🅿️",
      description: "Xavfsiz xalqaro to'lovlar",
      fee: Math.round(bookingDetails.lesson.price * 0.035)
    }
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);
  const totalAmount = bookingDetails.lesson.price + (selectedPaymentMethod?.fee || 0);

  const handlePayment = async () => {
    if (!agreedToTerms) {
      alert("Iltimos, shartlar va qoidalarni qabul qiling");
      return;
    }

    setIsProcessing(true);

    try {
      const bookingId = searchParams.get("bookingId");
      const amount = searchParams.get("amount");

      if (!bookingId || !amount) {
        throw new Error("To'lov ma'lumotlari topilmadi");
      }

      const paymentData = {
        bookingId,
        provider: paymentMethod,
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`
      };

      const result = await createPaymentMutation.mutateAsync(paymentData);

      if (result.paymentUrl) {
        // Redirect to payment provider
        window.location.href = result.paymentUrl;
      } else {
        // Navigate to success page for local payments
        navigate(`/payment-success?payment=${result.id}`);
      }
    } catch (error: any) {
      alert(error?.message || "To'lov amalga oshmadi. Qayta urinib ko'ring.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={`/book-lesson/${teacherId}`} className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">To'lovni yakunlash</h1>
              <p className="text-gray-600">Dars buyurtmangiz uchun xavfsiz to'lov</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Security Notice */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-green-800">
                    <Shield className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Xavfsiz to'lov</div>
                      <div className="text-sm">To'lov ma'lumotlaringiz shifrlangan va himoyalangan</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    To'lov usulini tanlang
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <label
                          htmlFor={method.id}
                          className="flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{method.logo}</span>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                          {method.fee > 0 && (
                            <div className="text-sm text-gray-600">
                              +{formatPrice(method.fee * 100)} komissiya
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Card Details (for international payments) */}
              {(paymentMethod === "stripe") && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Karta ma'lumotlari
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Karta egasining ismi</Label>
                      <Input
                        id="cardName"
                        placeholder="Ism Familiya"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({...prev, name: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Karta raqami</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({...prev, number: e.target.value}))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Amal qilish muddati</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({...prev, expiry: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({...prev, cvv: e.target.value}))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={setAgreedToTerms}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                        Men{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Foydalanish shartlari
                        </Link>{" "}
                        va{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Maxfiylik siyosati
                        </Link>
                        ni qabul qilaman. Bekor qilish siyosati va to'lov shartlarini tushunaman.
                      </label>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                      <div className="font-medium mb-2">Bekor qilish siyosati:</div>
                      <ul className="space-y-1 text-xs">
                        <li>• Darsdan 24 soat oldin bepul bekor qilish</li>
                        <li>• 12-24 soat oldin bekor qilganda 50% qaytariladi</li>
                        <li>• 12 soatdan kam vaqt qolganda pul qaytarilmaydi</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Buyurtma xulosasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Teacher Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={bookingDetails.teacher.image} alt={bookingDetails.teacher.name} />
                      <AvatarFallback>
                        {bookingDetails.teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{bookingDetails.teacher.name}</div>
                      <div className="text-sm text-gray-600">{bookingDetails.teacher.title}</div>
                    </div>
                  </div>

                  {/* Lesson Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Sana</span>
                      </div>
                      <span className="font-medium">{bookingDetails.lesson.date}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Vaqt</span>
                      </div>
                      <span className="font-medium">{bookingDetails.lesson.time}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Paket</span>
                      </div>
                      <span className="font-medium">{bookingDetails.lesson.package}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Davomiyligi</span>
                      <span className="font-medium">{bookingDetails.lesson.duration} daqiqa</span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Fanlar:</div>
                    <div className="flex flex-wrap gap-1">
                      {bookingDetails.teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dars narxi</span>
                      <span>{formatPrice(bookingDetails.lesson.price * 100)}</span>
                    </div>
                    
                    {selectedPaymentMethod?.fee && selectedPaymentMethod.fee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">To'lov jarayoni komissi</span>
                        <span>{formatPrice(selectedPaymentMethod.fee * 100)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Jami</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(totalAmount * 100)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !agreedToTerms}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        To'lov amalga oshirilmoqda...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {formatPrice(totalAmount * 100)} to'lash
                      </>
                    )}
                  </Button>

                  {!agreedToTerms && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Davom etish uchun shartlarni qabul qiling</span>
                    </div>
                  )}

                  {/* Security Features */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>256-bit SSL shifrlash</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>PCI DSS standartiga mos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>Pul qaytarish kafolati</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
