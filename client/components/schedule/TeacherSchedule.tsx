import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Plus,
  Minus,
  Save,
  RotateCcw,
  AlertCircle,
  Check,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Ban,
  Edit3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailabilityRules, useCreateAvailabilityRule, useUpdateAvailabilityRule, useDeleteAvailabilityRule } from "@/hooks/useApi";
import { toast } from "sonner";

interface TimeSlot {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

interface Break {
  id: string;
  start: string;
  end: string;
  title: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
  breaks: Break[];
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface ScheduleException {
  id: string;
  date: string;
  type: 'open' | 'closed';
  slots?: TimeSlot[];
  reason?: string;
}

interface TeacherScheduleProps {
  className?: string;
}

const WEEKDAYS = [
  { key: 'monday', label: 'Dushanba', short: 'Du' },
  { key: 'tuesday', label: 'Seshanba', short: 'Se' },
  { key: 'wednesday', label: 'Chorshanba', short: 'Ch' },
  { key: 'thursday', label: 'Payshanba', short: 'Pa' },
  { key: 'friday', label: 'Juma', short: 'Ju' },
  { key: 'saturday', label: 'Shanba', short: 'Sh' },
  { key: 'sunday', label: 'Yakshanba', short: 'Ya' },
] as const;

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }], breaks: [] },
  tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }], breaks: [] },
  wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }], breaks: [] },
  thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }], breaks: [] },
  friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }], breaks: [] },
  saturday: { enabled: false, slots: [], breaks: [] },
  sunday: { enabled: false, slots: [], breaks: [] },
};

export const TeacherSchedule: React.FC<TeacherScheduleProps> = ({ className }) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);
  const [exceptions, setExceptions] = useState<ScheduleException[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showExceptionDialog, setShowExceptionDialog] = useState(false);
  const [newException, setNewException] = useState<Partial<ScheduleException>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Settings
  const [minNoticeHours, setMinNoticeHours] = useState(24);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(30);
  const [bufferTime, setBufferTime] = useState(15);
  const [lessonDuration, setLessonDuration] = useState(60);

  // API hooks
  const { data: availabilityData, refetch: refetchAvailability } = useAvailabilityRules();
  const createRuleMutation = useCreateAvailabilityRule();
  const updateRuleMutation = useUpdateAvailabilityRule();
  const deleteRuleMutation = useDeleteAvailabilityRule();

  // Load existing schedule from API
  useEffect(() => {
    if (availabilityData) {
      // Convert API data to local schedule format
      // TODO: Implement conversion logic
    }
  }, [availabilityData]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const updateDaySchedule = (day: keyof WeeklySchedule, field: keyof DaySchedule, value: any) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    const daySchedule = schedule[day];
    const lastSlot = daySchedule.slots[daySchedule.slots.length - 1];
    const newStart = lastSlot ? lastSlot.end : '09:00';
    const newEnd = lastSlot ? 
      `${(parseInt(lastSlot.end.split(':')[0]) + 2).toString().padStart(2, '0')}:00` 
      : '11:00';

    updateDaySchedule(day, 'slots', [
      ...daySchedule.slots,
      { start: newStart, end: newEnd }
    ]);
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    const daySchedule = schedule[day];
    updateDaySchedule(day, 'slots', daySchedule.slots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (day: keyof WeeklySchedule, index: number, field: 'start' | 'end', value: string) => {
    const daySchedule = schedule[day];
    const updatedSlots = [...daySchedule.slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    updateDaySchedule(day, 'slots', updatedSlots);
  };

  const addBreak = (day: keyof WeeklySchedule) => {
    const daySchedule = schedule[day];
    const newBreak: Break = {
      id: Date.now().toString(),
      start: '12:00',
      end: '13:00',
      title: 'Tushlik tanaffusi',
    };
    updateDaySchedule(day, 'breaks', [...daySchedule.breaks, newBreak]);
  };

  const removeBreak = (day: keyof WeeklySchedule, breakId: string) => {
    const daySchedule = schedule[day];
    updateDaySchedule(day, 'breaks', daySchedule.breaks.filter(b => b.id !== breakId));
  };

  const updateBreak = (day: keyof WeeklySchedule, breakId: string, field: keyof Break, value: string) => {
    const daySchedule = schedule[day];
    const updatedBreaks = daySchedule.breaks.map(b => 
      b.id === breakId ? { ...b, [field]: value } : b
    );
    updateDaySchedule(day, 'breaks', updatedBreaks);
  };

  const saveSchedule = async () => {
    setIsLoading(true);
    try {
      // Convert schedule to API format and save
      for (const [dayKey, dayData] of Object.entries(schedule)) {
        const weekday = WEEKDAYS.findIndex(w => w.key === dayKey);
        
        for (const slot of dayData.slots) {
          await createRuleMutation.mutateAsync({
            type: 'recurring',
            weekday,
            startTime: slot.start,
            endTime: slot.end,
            isOpen: dayData.enabled,
          });
        }
      }

      setHasChanges(false);
      toast.success('Jadval saqlandi');
      refetchAvailability();
    } catch (error: any) {
      toast.error(error.message || 'Jadval saqlanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSchedule = () => {
    setSchedule(DEFAULT_SCHEDULE);
    setHasChanges(false);
  };

  const addException = () => {
    if (!newException.date || !newException.type) {
      toast.error('Sana va turni tanlang');
      return;
    }

    const exception: ScheduleException = {
      id: Date.now().toString(),
      date: newException.date!,
      type: newException.type!,
      slots: newException.slots || [],
      reason: newException.reason,
    };

    setExceptions(prev => [...prev, exception]);
    setNewException({});
    setShowExceptionDialog(false);
    setHasChanges(true);
  };

  const removeException = (exceptionId: string) => {
    setExceptions(prev => prev.filter(e => e.id !== exceptionId));
    setHasChanges(true);
  };

  const isTimeValid = (start: string, end: string) => {
    return start < end;
  };

  const hasTimeConflict = (day: keyof WeeklySchedule, newSlot: TimeSlot, currentIndex?: number) => {
    const daySchedule = schedule[day];
    return daySchedule.slots.some((slot, index) => {
      if (index === currentIndex) return false;
      return (
        (newSlot.start >= slot.start && newSlot.start < slot.end) ||
        (newSlot.end > slot.start && newSlot.end <= slot.end) ||
        (newSlot.start <= slot.start && newSlot.end >= slot.end)
      );
    });
  };

  const renderDaySchedule = (day: keyof WeeklySchedule) => {
    const dayData = schedule[day];
    const dayInfo = WEEKDAYS.find(w => w.key === day)!;

    return (
      <Card key={day} className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{dayInfo.label}</CardTitle>
            <div className="flex items-center gap-2">
              <Switch
                checked={dayData.enabled}
                onCheckedChange={(checked) => updateDaySchedule(day, 'enabled', checked)}
              />
              <Label className="text-sm">Faol</Label>
            </div>
          </div>
        </CardHeader>
        
        {dayData.enabled && (
          <CardContent className="space-y-4">
            {/* Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Vaqt oralig'i</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot(day)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Qo'shish
                </Button>
              </div>
              
              <div className="space-y-2">
                {dayData.slots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={slot.start}
                      onValueChange={(value) => updateTimeSlot(day, index, 'start', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span className="text-sm text-gray-500">dan</span>
                    
                    <Select
                      value={slot.end}
                      onValueChange={(value) => updateTimeSlot(day, index, 'end', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span className="text-sm text-gray-500">gacha</span>
                    
                    {!isTimeValid(slot.start, slot.end) && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    
                    {hasTimeConflict(day, slot, index) && (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    
                    {dayData.slots.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimeSlot(day, index)}
                        className="text-red-600"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Breaks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Tanaffuslar</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addBreak(day)}
                >
                  <Coffee className="h-3 w-3 mr-1" />
                  Tanaffus
                </Button>
              </div>
              
              {dayData.breaks.length > 0 && (
                <div className="space-y-2">
                  {dayData.breaks.map((breakItem) => (
                    <div key={breakItem.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Input
                        placeholder="Tanaffus nomi"
                        value={breakItem.title}
                        onChange={(e) => updateBreak(day, breakItem.id, 'title', e.target.value)}
                        className="flex-1"
                      />
                      
                      <Select
                        value={breakItem.start}
                        onValueChange={(value) => updateBreak(day, breakItem.id, 'start', value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select
                        value={breakItem.end}
                        onValueChange={(value) => updateBreak(day, breakItem.id, 'end', value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBreak(day, breakItem.id)}
                        className="text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Jadval va mavjudlik</h2>
          <p className="text-gray-600">Haftalik jadvalingizni boshqaring</p>
        </div>
        
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={resetSchedule}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Bekor qilish
            </Button>
          )}
          <Button 
            onClick={saveSchedule} 
            disabled={!hasChanges || isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </div>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Umumiy sozlamalar
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Minimal oldindan xabar berish (soat)</Label>
            <Input
              type="number"
              value={minNoticeHours}
              onChange={(e) => setMinNoticeHours(parseInt(e.target.value) || 0)}
              min="1"
              max="168"
            />
          </div>
          <div>
            <Label>Maksimal oldindan band qilish (kun)</Label>
            <Input
              type="number"
              value={maxAdvanceDays}
              onChange={(e) => setMaxAdvanceDays(parseInt(e.target.value) || 0)}
              min="1"
              max="365"
            />
          </div>
          <div>
            <Label>Darslar orasidagi tanaffus (daqiqa)</Label>
            <Input
              type="number"
              value={bufferTime}
              onChange={(e) => setBufferTime(parseInt(e.target.value) || 0)}
              min="0"
              max="60"
            />
          </div>
          <div>
            <Label>Standart dars davomiyligi (daqiqa)</Label>
            <Select value={lessonDuration.toString()} onValueChange={(value) => setLessonDuration(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 daqiqa</SelectItem>
                <SelectItem value="45">45 daqiqa</SelectItem>
                <SelectItem value="60">60 daqiqa</SelectItem>
                <SelectItem value="90">90 daqiqa</SelectItem>
                <SelectItem value="120">120 daqiqa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Haftalik jadval</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {WEEKDAYS.map(({ key }) => renderDaySchedule(key as keyof WeeklySchedule))}
        </div>
      </div>

      {/* Exceptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Maxsus kunlar
            </CardTitle>
            
            <Dialog open={showExceptionDialog} onOpenChange={setShowExceptionDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Maxsus kun qo'shish</DialogTitle>
                  <DialogDescription>
                    Aniq bir kun uchun maxsus jadval yoki yopilish belgilang
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label>Sana</Label>
                    <Input
                      type="date"
                      value={newException.date || ''}
                      onChange={(e) => setNewException(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label>Tur</Label>
                    <Select
                      value={newException.type || ''}
                      onValueChange={(value: 'open' | 'closed') => setNewException(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Maxsus ochiq kun</SelectItem>
                        <SelectItem value="closed">Yopiq kun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Sabab (ixtiyoriy)</Label>
                    <Textarea
                      placeholder="Masalan: Dam olish kuni, bayram, va hokazo"
                      value={newException.reason || ''}
                      onChange={(e) => setNewException(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowExceptionDialog(false)}>
                      Bekor qilish
                    </Button>
                    <Button onClick={addException}>
                      Qo'shish
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {exceptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Maxsus kunlar yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exceptions.map((exception) => (
                <div key={exception.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {exception.type === 'closed' ? (
                      <Ban className="h-5 w-5 text-red-500" />
                    ) : (
                      <Calendar className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        {new Date(exception.date).toLocaleDateString('uz-UZ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {exception.type === 'closed' ? 'Yopiq kun' : 'Maxsus ochiq kun'}
                        {exception.reason && ` • ${exception.reason}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewException(exception);
                        setShowExceptionDialog(true);
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeException(exception.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Changes Warning */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="text-amber-800">Sizda saqlash uchun o'zgarishlar bor</span>
                <Button 
                  size="sm" 
                  onClick={saveSchedule}
                  disabled={isLoading}
                >
                  Saqlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
