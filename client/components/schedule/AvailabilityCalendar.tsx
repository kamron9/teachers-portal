import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Video,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUZS } from "@/lib/currency";
import { useAvailableSlots } from "@/hooks/useApi";

interface TimeSlot {
  id: string;
  startAt: string;
  endAt: string;
  isAvailable: boolean;
  price: number;
  duration: number;
  type: "trial" | "regular";
}

interface AvailabilityCalendarProps {
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  timezone?: string;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlotId?: string;
  className?: string;
}

const WEEKDAYS = ["Yak", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];
const MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  teacherId,
  teacherName,
  teacherAvatar,
  timezone = "Asia/Tashkent",
  onSlotSelect,
  selectedSlotId,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("week");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState(60);

  // Calculate date range for API call
  const startDate =
    viewMode === "month"
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      : new Date(
          currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000,
        );

  const endDate =
    viewMode === "month"
      ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      : new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

  const {
    data: slotsData,
    isLoading: slotsLoading,
    error: slotsError,
  } = useAvailableSlots(teacherId, {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    timezone,
    duration,
  });

  const slots: TimeSlot[] = slotsData?.slots || [];

  // Group slots by date
  const slotsByDate = slots.reduce(
    (acc, slot) => {
      const date = new Date(slot.startAt).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    },
    {} as Record<string, TimeSlot[]>,
  );

  const navigateMonth = (direction: 1 | -1) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month") {
        newDate.setMonth(newDate.getMonth() + direction);
      } else {
        newDate.setDate(newDate.getDate() + direction * 7);
      }
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    if (viewMode === "week") {
      const days = [];
      const start = new Date(startDate);
      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day);
      }
      return days;
    }

    // Month view
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const hasSlots = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return slotsByDate[dateStr]?.length > 0;
  };

  const getDaySlots = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return slotsByDate[dateStr] || [];
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    });
  };

  const getSlotTypeLabel = (type: string) => {
    return type === "trial" ? "Sinov" : "Oddiy";
  };

  const getSlotTypeColor = (type: string) => {
    return type === "trial"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  const handleDateClick = (date: Date) => {
    if (isPast(date) || !hasSlots(date)) return;
    setSelectedDate(date);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    onSlotSelect(slot);
  };

  const renderCalendarGrid = () => {
    if (viewMode === "week") {
      return (
        <div className="space-y-4">
          {/* Week Header */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <div key={index} className="text-center p-2">
                <div className="text-xs text-gray-500">
                  {WEEKDAYS[date.getDay()]}
                </div>
                <div
                  className={cn(
                    "text-lg font-medium mt-1 w-8 h-8 flex items-center justify-center rounded-full mx-auto",
                    isToday(date) && "bg-primary text-white",
                    selectedDate?.toDateString() === date.toDateString() &&
                      "bg-primary/20",
                    isPast(date) && "text-gray-300",
                  )}
                >
                  {date.getDate()}
                </div>
                {hasSlots(date) && !isPast(date) && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const daySlots = getDaySlots(date);
              return (
                <div key={index} className="space-y-1">
                  {isPast(date) ? (
                    <div className="text-center text-gray-400 text-xs py-4">
                      O'tgan kun
                    </div>
                  ) : daySlots.length === 0 ? (
                    <div className="text-center text-gray-400 text-xs py-4">
                      Mavjud emas
                    </div>
                  ) : (
                    daySlots.slice(0, 4).map((slot) => (
                      <Button
                        key={slot.id}
                        variant={
                          selectedSlotId === slot.id ? "default" : "outline"
                        }
                        size="sm"
                        className={cn(
                          "w-full text-xs h-8",
                          !slot.isAvailable && "opacity-50 cursor-not-allowed",
                          selectedSlotId === slot.id && "ring-2 ring-primary",
                        )}
                        onClick={() => handleSlotClick(slot)}
                        disabled={!slot.isAvailable}
                      >
                        {formatTime(slot.startAt)}
                      </Button>
                    ))
                  )}
                  {daySlots.length > 4 && (
                    <div className="text-xs text-center text-gray-500">
                      +{daySlots.length - 4} ko'proq
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Month view
    return (
      <div className="space-y-4">
        {/* Month Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const daySlots = getDaySlots(date);
            const isAvailable = hasSlots(date) && !isPast(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={!isAvailable}
                className={cn(
                  "aspect-square p-2 text-sm rounded-lg transition-colors relative",
                  !isCurrentMonth(date) && "text-gray-300",
                  isPast(date) && "text-gray-300 cursor-not-allowed",
                  isAvailable && "hover:bg-primary/10 cursor-pointer",
                  isToday(date) && "ring-2 ring-primary",
                  selectedDate?.toDateString() === date.toDateString() &&
                    "bg-primary text-white",
                  isAvailable &&
                    !selectedDate &&
                    "bg-green-50 text-green-700 font-medium",
                )}
              >
                {date.getDate()}
                {daySlots.length > 0 && !isPast(date) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectedDateSlots = () => {
    if (!selectedDate) return null;

    const daySlots = getDaySlots(selectedDate);

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate.toLocaleDateString("uz-UZ")} - Mavjud vaqtlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {daySlots.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Bu kunda mavjud vaqtlar yo'q
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {daySlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlotId === slot.id ? "default" : "outline"}
                  className={cn(
                    "flex flex-col h-auto p-3",
                    !slot.isAvailable && "opacity-50 cursor-not-allowed",
                    selectedSlotId === slot.id && "ring-2 ring-primary",
                  )}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!slot.isAvailable}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">
                      {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                    </span>
                  </div>
                  <div className="text-xs mt-1">
                    <Badge
                      className={getSlotTypeColor(slot.type)}
                      variant="secondary"
                    >
                      {getSlotTypeLabel(slot.type)}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium mt-1">
                    {formatUZS(slot.price)}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {teacherAvatar ? (
                  <img
                    src={teacherAvatar}
                    alt={teacherName}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div>
                <div className="text-lg">{teacherName}</div>
                <div className="text-sm text-gray-600 font-normal">
                  Mavjud vaqtlarni tanlang
                </div>
              </div>
            </CardTitle>

            <div className="flex gap-2">
              <Select
                value={duration.toString()}
                onValueChange={(v) => setDuration(parseInt(v))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 daqiqa</SelectItem>
                  <SelectItem value="45">45 daqiqa</SelectItem>
                  <SelectItem value="60">60 daqiqa</SelectItem>
                  <SelectItem value="90">90 daqiqa</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={viewMode}
                onValueChange={(v: "month" | "week") => setViewMode(v)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Hafta</SelectItem>
                  <SelectItem value="month">Oy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {viewMode === "month"
                ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : `${startDate.getDate()}-${endDate.getDate()} ${MONTHS[startDate.getMonth()]} ${startDate.getFullYear()}`}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Yuklanmoqda...</span>
            </div>
          ) : slotsError ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Xatolik yuz berdi
            </div>
          ) : (
            renderCalendarGrid()
          )}
        </CardContent>
      </Card>

      {/* Selected Date Slots */}
      {selectedDate && renderSelectedDateSlots()}

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span>Mavjud kunlar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Tanlangan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Mavjud emas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Sinov darsi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
