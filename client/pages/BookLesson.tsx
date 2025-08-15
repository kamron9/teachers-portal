import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTeacherById, useAvailableSlots, useCreateBooking } from "@/hooks/useApi";
import { formatPrice } from "@/lib/api";
import { ArrowLeft, Calendar, Clock, Video, CreditCard, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BookLesson() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState("trial");
  const [lessonNotes, setLessonNotes] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch teacher data
  const { data: teacher, isLoading: teacherLoading, error: teacherError } = useTeacherById(teacherId || '', !!teacherId);

  // Get available slots for selected date range
  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const { data: slotsData } = useAvailableSlots(
    teacherId || '',
    {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timezone: 'Asia/Tashkent',
      duration: 60
    },
    !!teacherId && !!selectedDate
  );

  // Booking mutation
  const createBookingMutation = useCreateBooking();

  // Generate packages based on teacher's hourly rate
  const basePrice = teacher?.subjectOfferings?.[0]?.pricePerHour || 5000000; // Default 50,000 UZS in kopeks
  const packages = [
    {
      id: "trial",
      name: "Sinov darsi",
      price: Math.round(basePrice * 0.5), // 50% off for trial
      duration: 30,
      discount: "50% chegirma"
    },
    {
      id: "single",
      name: "Yakka dars",
      price: basePrice,
      duration: 60
    },
    {
      id: "package5",
      name: "5 darslik paket",
      price: Math.round(basePrice * 5 * 0.9), // 10% off
      duration: 60,
      savings: "10% tejash"
    },
    {
      id: "package10",
      name: "10 darslik paket",
      price: Math.round(basePrice * 10 * 0.85), // 15% off
      duration: 60,
      savings: "15% tejash"
    }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Process available slots from API
  const availableSlotsByDate = slotsData?.slots?.reduce((acc: any, slot: any) => {
    const date = new Date(slot.startAt).toISOString().split('T')[0];
    const time = new Date(slot.startAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({ time, slot });
    return acc;
  }, {}) || {};

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableSlotsByDate[dateStr]?.length > 0;
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date) && isDateInCurrentMonth(date)) {
      setSelectedDate(date);
      setSelectedTime("");
    }
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return availableSlotsByDate[dateStr] || [];
  };

  const selectedPackageDetails = packages.find(p => p.id === selectedPackage);
  const totalPrice = selectedPackageDetails?.price || 0;

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !teacher) return;

    const selectedSlot = getAvailableSlots().find(s => s.time === selectedTime);
    if (!selectedSlot) return;

    try {
      const bookingData = {
        teacherId: teacher.id,
        subjectOfferingId: teacher.subjectOfferings?.[0]?.id || '',
        startAt: selectedSlot.slot.startAt,
        endAt: selectedSlot.slot.endAt,
        type: selectedPackage === 'trial' ? 'TRIAL' as const : 'SINGLE' as const,
        studentTimezone: 'Asia/Tashkent'
      };

      await createBookingMutation.mutateAsync(bookingData);

      // Navigate to payment or success page
      navigate(`/payment?bookingId=${Date.now()}&amount=${totalPrice}`);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={`/teacher/${teacherId}`} className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book a Lesson</h1>
              <p className="text-gray-600">Schedule your lesson with {teacher.name}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teacher Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={teacher.image} alt={teacher.name} />
                      <AvatarFallback>
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{teacher.name}</h2>
                      <p className="text-gray-600">{teacher.title}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {teacher.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Package Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Choose Lesson Package
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPackage === pkg.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{pkg.name}</div>
                          <div className="text-sm text-gray-600">{pkg.duration} minutes</div>
                          {pkg.savings && (
                            <div className="text-sm text-green-600 font-medium">{pkg.savings}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{pkg.price.toLocaleString()} UZS</div>
                          {pkg.discount && (
                            <div className="text-sm text-green-600">{pkg.discount}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((date, index) => {
                      const isAvailable = isDateAvailable(date);
                      const isCurrentMonth = isDateInCurrentMonth(date);
                      const isSelected = isDateSelected(date);
                      const isPast = date < new Date();

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          disabled={!isAvailable || !isCurrentMonth || isPast}
                          className={`
                            aspect-square p-2 text-sm rounded-lg transition-colors
                            ${!isCurrentMonth ? 'text-gray-300' : ''}
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${isAvailable && isCurrentMonth && !isPast
                              ? 'hover:bg-primary/10 cursor-pointer'
                              : 'cursor-not-allowed'
                            }
                            ${isSelected ? 'bg-primary text-white' : ''}
                            ${isAvailable && isCurrentMonth && !isPast && !isSelected
                              ? 'bg-green-50 text-green-700 font-medium'
                              : ''
                            }
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Selection */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Select Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 mb-4">
                      Available slots for {selectedDate.toLocaleDateString()} ({teacher.timezone})
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableSlots().map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="justify-center"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lesson Notes */}
              {selectedDate && selectedTime && (
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Notes (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="notes">What would you like to focus on in this lesson?</Label>
                      <Textarea
                        id="notes"
                        placeholder="e.g., IELTS speaking practice, business presentation skills, grammar review..."
                        value={lessonNotes}
                        onChange={(e) => setLessonNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">{selectedPackageDetails?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedPackageDetails?.duration} minutes</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{selectedDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span>{selectedTime} ({teacher.timezone})</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {totalPrice.toLocaleString()} UZS
                      </span>
                    </div>
                    {selectedPackageDetails?.discount && (
                      <div className="text-sm text-green-600 text-right">
                        {selectedPackageDetails.discount}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Link to={`/payment?teacherId=${teacherId}&package=${selectedPackage}&date=${selectedDate?.toISOString()}&time=${selectedTime}`}>
                      <Button 
                        className="w-full" 
                        size="lg"
                        disabled={!selectedDate || !selectedTime}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Payment
                      </Button>
                    </Link>
                  </div>

                  {(!selectedDate || !selectedTime) && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Please select both date and time to continue</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Free cancellation up to 24 hours before</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Instant booking confirmation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Secure payment processing</span>
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
