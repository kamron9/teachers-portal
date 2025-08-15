import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Clock, User, Calendar, DollarSign, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import LoginModal from '../components/LoginModal';

interface BookingStep {
  id: number;
  title: string;
  description: string;
}

interface SlotData {
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  tutorRating: number;
  subject: string;
  slotStart: string;
  slotEnd: string;
  price: number;
  serviceFee: number;
}

interface BookingState {
  isLoading: boolean;
  error: string | null;
  slotAvailable: boolean;
  bookingId: string | null;
  termsAccepted: boolean;
  selectedProvider: string | null;
}

const steps: BookingStep[] = [
  { id: 1, title: "Slotni tekshirish", description: "Mavjudlik tasdiqlash" },
  { id: 2, title: "Tasdiq", description: "Ma'lumotlarni ko'rib chiqish" },
  { id: 3, title: "To'lov", description: "To'lov tizimini tanlash" }
];

const paymentProviders = [
  { id: 'click', name: 'Click', logo: '💳', description: 'Kartalar va mobil to\'lov' },
  { id: 'payme', name: 'Payme', logo: '📱', description: 'Payme orqali to\'lov' },
  { id: 'stripe', name: 'Stripe', logo: '🌐', description: 'Xalqaro kartalar' }
];

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [slotData, setSlotData] = useState<SlotData>({
    tutorId: searchParams.get('tutorId') || '',
    tutorName: searchParams.get('tutorName') || '',
    tutorAvatar: searchParams.get('tutorAvatar') || '',
    tutorRating: parseFloat(searchParams.get('tutorRating') || '0'),
    subject: searchParams.get('subject') || '',
    slotStart: searchParams.get('slotStart') || '',
    slotEnd: searchParams.get('slotEnd') || '',
    price: parseFloat(searchParams.get('price') || '0'),
    serviceFee: parseFloat(searchParams.get('serviceFee') || '0')
  });

  const [bookingState, setBookingState] = useState<BookingState>({
    isLoading: false,
    error: null,
    slotAvailable: true,
    bookingId: null,
    termsAccepted: false,
    selectedProvider: null
  });

  useEffect(() => {
    // Analytics: booking_view
    console.log('Analytics: booking_view', { tutorId: slotData.tutorId, slotStart: slotData.slotStart });
    
    // Check authentication
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (slotData.tutorId && slotData.slotStart) {
      checkSlotAvailability();
    }
  }, []);

  const checkSlotAvailability = async () => {
    if (!slotData.tutorId || !slotData.slotStart) return;

    setBookingState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock API call - simulating slot check
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // Mock random availability (90% chance available)
      const isAvailable = Math.random() > 0.1;

      setBookingState(prev => ({
        ...prev,
        isLoading: false,
        slotAvailable: isAvailable
      }));

      if (isAvailable) {
        setCurrentStep(2);
      }
    } catch (error) {
      setBookingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Yuklashda xatolik'
      }));
    }
  };

  const handleBookingConfirm = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Analytics: booking_confirm_attempt
    console.log('Analytics: booking_confirm_attempt', { tutorId: slotData.tutorId });

    setBookingState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock API call - simulating booking creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock booking ID
      const mockBookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setBookingState(prev => ({
        ...prev,
        isLoading: false,
        bookingId: mockBookingId
      }));

      setCurrentStep(3);
    } catch (error) {
      setBookingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Yuklashda xatolik'
      }));
    }
  };

  const handlePaymentProceed = async () => {
    if (!bookingState.selectedProvider || !bookingState.termsAccepted) {
      return;
    }

    // Analytics: payment_redirect
    console.log('Analytics: payment_redirect', { 
      bookingId: bookingState.bookingId, 
      provider: bookingState.selectedProvider 
    });
    
    setBookingState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: bookingState.bookingId,
          provider: bookingState.selectedProvider
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'To\'lov sahifasiga o\'tishda xatolik');
      }

      // Redirect to payment provider
      window.location.href = data.redirectUrl;
    } catch (error) {
      setBookingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Yuklashda xatolik'
      }));
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('uz-UZ', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const totalPrice = slotData.price + slotData.serviceFee;
  const progressPercentage = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Slotni tekshirish
              </CardTitle>
              <CardDescription>
                Tanlangan vaqt mavjudligini tekshirayapmiz...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookingState.isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Tekshirilmoqda...</span>
                </div>
              )}

              {bookingState.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {bookingState.error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={checkSlotAvailability}
                    >
                      Qayta urinish
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {!bookingState.slotAvailable && !bookingState.isLoading && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Kechirasiz, bu vaqt band bo'lib qolgan. 
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={() => navigate('/teachers')}
                    >
                      Boshqa slot tanlash
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {bookingState.slotAvailable && !bookingState.isLoading && !bookingState.error && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Slot mavjud! Keyingi bosqichga o'tish uchun tasdiqlang.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        const startDateTime = formatDateTime(slotData.slotStart);
        const endDateTime = formatDateTime(slotData.slotEnd);
        
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Ma'lumotlarni tasdiqlash
              </CardTitle>
              <CardDescription>
                Booking ma'lumotlarini ko'rib chiqing va tasdiqlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tutor Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={slotData.tutorAvatar} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{slotData.tutorName}</h3>
                  <p className="text-muted-foreground">{slotData.subject}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{slotData.tutorRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Date & Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Sana va vaqt</span>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-medium">{startDateTime.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {startDateTime.time} - {endDateTime.time}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Narx tafsiloti</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Dars narxi</span>
                    <span>{slotData.price.toLocaleString()} so'm</span>
                  </div>
                  {slotData.serviceFee > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Xizmat haqi</span>
                      <span>{slotData.serviceFee.toLocaleString()} so'm</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Jami</span>
                    <span>{totalPrice.toLocaleString()} so'm</span>
                  </div>
                </div>
              </div>

              {bookingState.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {bookingState.error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={handleBookingConfirm}
                    >
                      Qayta urinish
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleBookingConfirm}
                disabled={bookingState.isLoading}
                className="w-full"
                size="lg"
              >
                {bookingState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Bookingni tasdiqlash
              </Button>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                To'lov
              </CardTitle>
              <CardDescription>
                To'lov tizimini tanlang va to'lovni amalga oshiring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Amount */}
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">To'lov miqdori</p>
                <p className="text-2xl font-bold">{totalPrice.toLocaleString()} so'm</p>
              </div>

              {/* Payment Providers */}
              <div className="space-y-3">
                <p className="font-medium">To'lov tizimini tanlang:</p>
                {paymentProviders.map((provider) => (
                  <Card 
                    key={provider.id}
                    className={`cursor-pointer transition-all ${
                      bookingState.selectedProvider === provider.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setBookingState(prev => ({ 
                      ...prev, 
                      selectedProvider: provider.id 
                    }))}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <span className="text-2xl">{provider.logo}</span>
                      <div className="flex-1">
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.description}</p>
                      </div>
                      {bookingState.selectedProvider === provider.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={bookingState.termsAccepted}
                  onCheckedChange={(checked) => 
                    setBookingState(prev => ({ 
                      ...prev, 
                      termsAccepted: !!checked 
                    }))
                  }
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Men{' '}
                  <a href="/terms" className="text-primary underline" target="_blank">
                    Foydalanish shartlari
                  </a>{' '}
                  va{' '}
                  <a href="/privacy" className="text-primary underline" target="_blank">
                    Maxfiylik siyosati
                  </a>{' '}
                  bilan tanishdim va ularni qabul qilaman
                </label>
              </div>

              {bookingState.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {bookingState.error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                      onClick={handlePaymentProceed}
                    >
                      Qayta urinish
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handlePaymentProceed}
                disabled={
                  !bookingState.selectedProvider || 
                  !bookingState.termsAccepted || 
                  bookingState.isLoading
                }
                className="w-full"
                size="lg"
              >
                {bookingState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                To'lovga o'tish
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (!slotData.tutorId || !slotData.slotStart) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Booking ma'lumotlari topilmadi. Iltimos, qayta urinib ko'ring.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => navigate('/teachers')}
              >
                O'qituvchilar sahifasiga qaytish
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Darsni bron qilish</h1>
          <p className="text-muted-foreground">
            {slotData.tutorName} bilan {slotData.subject} darsini bron qiling
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 text-center">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-xs">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            // Continue with booking confirmation
            handleBookingConfirm();
          }}
        />
      </div>
    </div>
  );
};

export default Booking;
