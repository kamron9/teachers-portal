import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Plus, Edit3, Trash2, Copy, Save, ChevronLeft, ChevronRight, CalendarDays, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isBreak?: boolean;
  note?: string;
}

interface DaySchedule {
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

export default function TeacherSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("weekly");
  const [isEditing, setIsEditing] = useState(false);
  
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: {
      isAvailable: true,
      timeSlots: [
        { id: '1', start: '09:00', end: '12:00' },
        { id: '2', start: '13:00', end: '17:00' }
      ]
    },
    tuesday: {
      isAvailable: true,
      timeSlots: [
        { id: '3', start: '09:00', end: '12:00' },
        { id: '4', start: '14:00', end: '18:00' }
      ]
    },
    wednesday: {
      isAvailable: true,
      timeSlots: [
        { id: '5', start: '10:00', end: '13:00' },
        { id: '6', start: '15:00', end: '18:00' }
      ]
    },
    thursday: {
      isAvailable: true,
      timeSlots: [
        { id: '7', start: '09:00', end: '12:00' },
        { id: '8', start: '13:00', end: '17:00' }
      ]
    },
    friday: {
      isAvailable: true,
      timeSlots: [
        { id: '9', start: '09:00', end: '15:00' }
      ]
    },
    saturday: {
      isAvailable: true,
      timeSlots: [
        { id: '10', start: '10:00', end: '14:00' }
      ]
    },
    sunday: {
      isAvailable: false,
      timeSlots: []
    }
  });

  // Mock booked lessons
  const bookedLessons = [
    {
      id: '1',
      student: 'John Doe',
      date: '2024-01-22',
      time: '14:00',
      duration: 60,
      type: 'IELTS Preparation'
    },
    {
      id: '2',
      student: 'Sarah Smith',
      date: '2024-01-23',
      time: '10:00',
      duration: 30,
      type: 'Trial Lesson'
    },
    {
      id: '3',
      student: 'Ahmad Hassan',
      date: '2024-01-24',
      time: '15:00',
      duration: 60,
      type: 'Business English'
    }
  ];

  // Vacation/break periods
  const [vacationPeriods, setVacationPeriods] = useState([
    {
      id: '1',
      start: '2024-02-15',
      end: '2024-02-22',
      reason: 'Winter vacation',
      type: 'vacation'
    },
    {
      id: '2',
      start: '2024-01-25',
      end: '2024-01-25',
      reason: 'Medical appointment',
      type: 'break'
    }
  ]);

  const [newVacation, setNewVacation] = useState({
    start: '',
    end: '',
    reason: '',
    type: 'vacation'
  });

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: '09:00',
      end: '10:00'
    };
    
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, newSlot]
      }
    }));
  };

  const updateTimeSlot = (day: string, slotId: string, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter(slot => slot.id !== slotId)
      }
    }));
  };

  const toggleDayAvailability = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable
      }
    }));
  };

  const copySchedule = (fromDay: string, toDay: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [toDay]: {
        ...prev[toDay],
        timeSlots: prev[fromDay].timeSlots.map(slot => ({
          ...slot,
          id: Date.now().toString() + Math.random().toString()
        }))
      }
    }));
  };

  const saveSchedule = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
  };

  const addVacationPeriod = () => {
    if (newVacation.start && newVacation.end && newVacation.reason) {
      setVacationPeriods(prev => [...prev, {
        ...newVacation,
        id: Date.now().toString()
      }]);
      setNewVacation({ start: '', end: '', reason: '', type: 'vacation' });
    }
  };

  const removeVacationPeriod = (id: string) => {
    setVacationPeriods(prev => prev.filter(period => period.id !== id));
  };

  const generateTimeSlots = (start: string, end: string, duration: number = 60) => {
    const slots = [];
    const startTime = new Date(`2024-01-01T${start}:00`);
    const endTime = new Date(`2024-01-01T${end}:00`);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + duration * 60000);
      if (nextTime <= endTime) {
        slots.push({
          start: currentTime.toTimeString().slice(0, 5),
          end: nextTime.toTimeString().slice(0, 5)
        });
      }
      currentTime = nextTime;
    }
    
    return slots;
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/teacher-dashboard" className="text-primary hover:text-primary/80">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
                <p className="text-gray-600">Set your availability and manage your teaching schedule</p>
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Schedule
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={saveSchedule}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="breaks">Breaks & Vacation</TabsTrigger>
            </TabsList>

            {/* Weekly Schedule Tab */}
            <TabsContent value="weekly" className="space-y-6">
              <div className="grid gap-4">
                {daysOfWeek.map((day, index) => (
                  <Card key={day}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={weeklySchedule[day].isAvailable}
                            onCheckedChange={() => toggleDayAvailability(day)}
                            disabled={!isEditing}
                          />
                          <span className="capitalize">{day}</span>
                          <span className="text-sm text-gray-500">
                            {weekDates[index].toLocaleDateString()}
                          </span>
                        </div>
                        {isEditing && weeklySchedule[day].isAvailable && (
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(fromDay) => copySchedule(fromDay, day)}
                            >
                              <SelectTrigger className="w-40">
                                <Copy className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Copy from..." />
                              </SelectTrigger>
                              <SelectContent>
                                {daysOfWeek.filter(d => d !== day && weeklySchedule[d].isAvailable).map(d => (
                                  <SelectItem key={d} value={d} className="capitalize">
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addTimeSlot(day)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    {weeklySchedule[day].isAvailable && (
                      <CardContent className="space-y-3">
                        {weeklySchedule[day].timeSlots.map((slot) => (
                          <div key={slot.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(day, slot.id, 'start', e.target.value)}
                                disabled={!isEditing}
                                className="w-24"
                              />
                              <span>to</span>
                              <Input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(day, slot.id, 'end', e.target.value)}
                                disabled={!isEditing}
                                className="w-24"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-gray-600">
                                {generateTimeSlots(slot.start, slot.end).length} available slots
                              </div>
                            </div>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(day, slot.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        {weeklySchedule[day].timeSlots.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>No time slots set for this day</p>
                            {isEditing && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addTimeSlot(day)}
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Time Slot
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Calendar View Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const prevWeek = new Date(currentWeek);
                          prevWeek.setDate(currentWeek.getDate() - 7);
                          setCurrentWeek(prevWeek);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const nextWeek = new Date(currentWeek);
                          nextWeek.setDate(currentWeek.getDate() + 7);
                          setCurrentWeek(nextWeek);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {daysOfWeek.map((day, index) => (
                      <div key={day} className="space-y-2">
                        <div className="text-center">
                          <div className="font-medium capitalize">{dayLabels[index]}</div>
                          <div className="text-sm text-gray-500">
                            {weekDates[index].getDate()}
                          </div>
                        </div>
                        
                        <div className="min-h-40 border rounded-lg p-2 space-y-1">
                          {weeklySchedule[day].isAvailable ? (
                            <>
                              {weeklySchedule[day].timeSlots.map((slot) => (
                                <div key={slot.id} className="bg-green-100 text-green-800 text-xs p-2 rounded">
                                  {slot.start} - {slot.end}
                                </div>
                              ))}
                              
                              {bookedLessons
                                .filter(lesson => {
                                  const lessonDate = new Date(lesson.date);
                                  return lessonDate.toDateString() === weekDates[index].toDateString();
                                })
                                .map(lesson => (
                                  <div key={lesson.id} className="bg-blue-100 text-blue-800 text-xs p-2 rounded">
                                    <div className="font-medium">{lesson.time}</div>
                                    <div>{lesson.student}</div>
                                    <div>{lesson.type}</div>
                                  </div>
                                ))
                              }
                            </>
                          ) : (
                            <div className="text-center text-gray-400 text-xs py-4">
                              Not available
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                      <span>Break</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Breaks & Vacation Tab */}
            <TabsContent value="breaks" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="h-5 w-5" />
                      Add Break/Vacation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select 
                        value={newVacation.type} 
                        onValueChange={(value) => setNewVacation(prev => ({...prev, type: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="break">Break/Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newVacation.start}
                          onChange={(e) => setNewVacation(prev => ({...prev, start: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newVacation.end}
                          onChange={(e) => setNewVacation(prev => ({...prev, end: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason (Optional)</Label>
                      <Textarea
                        id="reason"
                        placeholder="e.g., Family vacation, Medical appointment..."
                        value={newVacation.reason}
                        onChange={(e) => setNewVacation(prev => ({...prev, reason: e.target.value}))}
                        rows={2}
                      />
                    </div>

                    <Button onClick={addVacationPeriod} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add {newVacation.type === 'vacation' ? 'Vacation' : 'Break'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Breaks & Vacations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vacationPeriods.map((period) => (
                        <div key={period.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={period.type === 'vacation' ? 'default' : 'secondary'}>
                                {period.type}
                              </Badge>
                              <span className="font-medium">{period.reason}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVacationPeriod(period.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {vacationPeriods.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Coffee className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No breaks or vacations scheduled</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
