import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, Users, Globe } from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";

interface AvailabilityStats {
  totalHours: number;
  bookedHours: number;
  availableHours: number;
  utilizationRate: number;
  weeklyBookings: number;
  nextAvailableSlot: string | null;
  busyPeriods: Array<{
    start: string;
    end: string;
    type: 'booked' | 'blocked' | 'break';
  }>;
}

interface AvailabilityDashboardProps {
  teacherId: string;
  timezone: string;
  stats: AvailabilityStats;
  onTimezoneChange: (timezone: string) => void;
}

export default function AvailabilityDashboard({
  teacherId,
  timezone,
  stats,
  onTimezoneChange
}: AvailabilityDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const timezones = [
    { value: "Asia/Tashkent", label: "Tashkent (UTC+5)" },
    { value: "Asia/Almaty", label: "Almaty (UTC+6)" },
    { value: "Asia/Dubai", label: "Dubai (UTC+4)" },
    { value: "Europe/Moscow", label: "Moscow (UTC+3)" },
    { value: "Europe/London", label: "London (UTC+0)" },
    { value: "America/New_York", label: "New York (UTC-5)" },
    { value: "America/Los_Angeles", label: "Los Angeles (UTC-8)" },
    { value: "Asia/Tokyo", label: "Tokyo (UTC+9)" },
    { value: "Australia/Sydney", label: "Sydney (UTC+10)" },
  ];

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return "text-red-600";
    if (rate >= 60) return "text-yellow-600";
    if (rate >= 40) return "text-blue-600";
    return "text-green-600";
  };

  const getUtilizationLabel = (rate: number) => {
    if (rate >= 80) return "Very High";
    if (rate >= 60) return "High";
    if (rate >= 40) return "Moderate";
    return "Low";
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeStr = hour.toString().padStart(2, '0') + ':00';
      const isBusy = stats.busyPeriods.some(period => {
        const periodStart = new Date(period.start).getHours();
        const periodEnd = new Date(period.end).getHours();
        return hour >= periodStart && hour < periodEnd;
      });
      
      slots.push({
        time: timeStr,
        hour,
        isBusy,
        type: isBusy ? 'busy' : 'available'
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Availability Overview</h2>
          <p className="text-sm text-gray-600">
            {format(currentDate, 'EEEE, MMMM d, yyyy')} • {timezone}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="w-48">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{stats.totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Booked Hours</p>
                <p className="text-2xl font-bold text-green-600">{stats.bookedHours}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Hours</p>
                <p className="text-2xl font-bold text-blue-600">{stats.availableHours}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${getUtilizationColor(stats.utilizationRate)}`}>
                    {stats.utilizationRate}%
                  </p>
                  <Badge 
                    variant={stats.utilizationRate >= 60 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {getUtilizationLabel(stats.utilizationRate)}
                  </Badge>
                </div>
              </div>
              <TrendingUp className={`h-8 w-8 ${getUtilizationColor(stats.utilizationRate)}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Daily Time Blocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Time Grid */}
            <div className="grid grid-cols-12 gap-1">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={`
                    h-8 rounded text-xs flex items-center justify-center font-medium
                    ${slot.isBusy 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                    }
                  `}
                  title={`${slot.time} - ${slot.type}`}
                >
                  {slot.hour}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span>Busy/Booked</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Next Available Slot</p>
                  <p className="text-sm text-blue-700">
                    {stats.nextAvailableSlot 
                      ? format(new Date(stats.nextAvailableSlot), 'MMM d, h:mm a')
                      : 'No upcoming slots'
                    }
                  </p>
                </div>
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">This Week</p>
                  <p className="text-sm text-green-700">
                    {stats.weeklyBookings} bookings scheduled
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              
              {stats.utilizationRate > 80 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-900">High Utilization</p>
                    <p className="text-sm text-yellow-700">
                      Consider adding more availability
                    </p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Add Weekly Schedule
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Block Time Period
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Globe className="h-4 w-4 mr-2" />
              Calendar Sync
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
