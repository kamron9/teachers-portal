import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Plus, Edit3, Trash2, Save, ChevronLeft, ChevronRight, CalendarDays, Settings, Globe, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  useAvailability, 
  useCreateAvailabilityRule, 
  useUpdateAvailabilityRule, 
  useDeleteAvailabilityRule,
  useAvailableSlots 
} from "@/hooks/useApi";
import { format, addDays, startOfWeek, addWeeks, subWeeks, parseISO, isToday } from "date-fns";

interface AvailabilityRule {
  id: string;
  type: 'recurring' | 'one_off';
  weekday?: number;
  date?: string;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

interface CalendarIntegration {
  google: boolean;
  outlook: boolean;
  apple: boolean;
}

export default function TeacherAvailability() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [isEditing, setIsEditing] = useState(false);
  const [calendarSync, setCalendarSync] = useState<CalendarIntegration>({
    google: false,
    outlook: false,
    apple: false
  });

  // Date range for API queries
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endDate = addDays(startDate, 6);

  // API hooks
  const { data: availabilityData, isLoading, refetch } = useAvailability(
    user?.id || "",
    format(startDate, 'yyyy-MM-dd'),
    format(endDate, 'yyyy-MM-dd')
  );

  const { data: availableSlots } = useAvailableSlots(user?.id || "", {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(addDays(endDate, 7), 'yyyy-MM-dd'),
    duration: 60
  });

  const createRuleMutation = useCreateAvailabilityRule();
  const updateRuleMutation = useUpdateAvailabilityRule();
  const deleteRuleMutation = useDeleteAvailabilityRule();

  // Form states
  const [newRecurringRule, setNewRecurringRule] = useState({
    weekday: 1,
    startTime: '09:00',
    endTime: '17:00',
    isOpen: true
  });

  const [newOneOffRule, setNewOneOffRule] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    isOpen: true
  });

  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const createRecurringRule = async () => {
    try {
      await createRuleMutation.mutateAsync({
        type: 'recurring',
        weekday: newRecurringRule.weekday,
        startTime: newRecurringRule.startTime,
        endTime: newRecurringRule.endTime,
        isOpen: newRecurringRule.isOpen
      });
      
      setNewRecurringRule({
        weekday: 1,
        startTime: '09:00',
        endTime: '17:00',
        isOpen: true
      });
      
      refetch();
      toast({
        title: "Success",
        description: "Recurring availability rule created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create availability rule",
        variant: "destructive"
      });
    }
  };

  const createOneOffRule = async () => {
    try {
      await createRuleMutation.mutateAsync({
        type: 'one_off',
        date: newOneOffRule.date,
        startTime: newOneOffRule.startTime,
        endTime: newOneOffRule.endTime,
        isOpen: newOneOffRule.isOpen
      });
      
      setNewOneOffRule({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '17:00',
        isOpen: true
      });
      
      refetch();
      toast({
        title: "Success",
        description: "One-off availability rule created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create availability rule",
        variant: "destructive"
      });
    }
  };

  const updateRule = async (rule: AvailabilityRule) => {
    try {
      await updateRuleMutation.mutateAsync({
        id: rule.id,
        data: rule
      });
      
      setEditingRule(null);
      refetch();
      toast({
        title: "Success",
        description: "Availability rule updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update availability rule",
        variant: "destructive"
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      await deleteRuleMutation.mutateAsync(ruleId);
      refetch();
      toast({
        title: "Success",
        description: "Availability rule deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete availability rule", 
        variant: "destructive"
      });
    }
  };

  const toggleCalendarSync = async (provider: keyof CalendarIntegration) => {
    setCalendarSync(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
    
    // Here you would implement actual calendar sync
    toast({
      title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar`,
      description: calendarSync[provider] ? "Disconnected" : "Connected"
    });
  };

  const getRulesForDay = (dayIndex: number) => {
    if (!availabilityData?.rules) return [];
    
    return availabilityData.rules.filter(rule => {
      if (rule.type === 'recurring') {
        return rule.weekday === dayIndex;
      } else if (rule.type === 'one_off') {
        const ruleDate = parseISO(rule.date || '');
        const targetDate = weekDays[dayIndex];
        return format(ruleDate, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
      }
      return false;
    });
  };

  const getBookingsForDay = (dayIndex: number) => {
    if (!availabilityData?.bookings) return [];
    
    return availabilityData.bookings.filter(booking => {
      const bookingDate = parseISO(booking.startAt);
      const targetDate = weekDays[dayIndex];
      return format(bookingDate, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
    });
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Availability & Schedule</h1>
                <p className="text-gray-600">Manage your teaching schedule and calendar integration</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                <Clock className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="rules">Manage Rules</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            {/* Schedule Management Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Week of {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {weekDays.map((date, dayIndex) => (
                      <div key={dayIndex} className="space-y-2">
                        <div className="text-center">
                          <div className={`font-medium ${isToday(date) ? 'text-primary' : ''}`}>
                            {daysOfWeek[dayIndex]}
                          </div>
                          <div className={`text-sm ${isToday(date) ? 'text-primary' : 'text-gray-500'}`}>
                            {format(date, 'MMM d')}
                          </div>
                        </div>
                        
                        <div className="min-h-40 border rounded-lg p-2 space-y-1">
                          {/* Availability Rules */}
                          {getRulesForDay(dayIndex).map((rule) => (
                            <div 
                              key={rule.id} 
                              className={`text-xs p-2 rounded ${
                                rule.isOpen 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              <div className="font-medium">
                                {rule.startTime} - {rule.endTime}
                              </div>
                              <div className="text-xs opacity-75">
                                {rule.isOpen ? 'Available' : 'Blocked'}
                              </div>
                            </div>
                          ))}
                          
                          {/* Bookings */}
                          {getBookingsForDay(dayIndex).map((booking, idx) => (
                            <div key={idx} className="bg-blue-100 text-blue-800 text-xs p-2 rounded border border-blue-200">
                              <div className="font-medium">
                                {format(parseISO(booking.startAt), 'HH:mm')} - {format(parseISO(booking.endAt), 'HH:mm')}
                              </div>
                              <div className="text-xs opacity-75">
                                {booking.status}
                              </div>
                            </div>
                          ))}
                          
                          {getRulesForDay(dayIndex).length === 0 && getBookingsForDay(dayIndex).length === 0 && (
                            <div className="text-center text-gray-400 text-xs py-4">
                              No schedule
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
                      <span>Blocked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calendar View Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Time Slots</CardTitle>
                </CardHeader>
                <CardContent>
                  {availableSlots?.slots ? (
                    <div className="grid gap-4">
                      {availableSlots.slots.slice(0, 20).map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {format(parseISO(slot.startAt), 'EEEE, MMM d')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(parseISO(slot.startAt), 'HH:mm')} - {format(parseISO(slot.endAt), 'HH:mm')}
                            </div>
                          </div>
                          <Badge variant="secondary">{slot.duration} min</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No available slots found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manage Rules Tab */}
            <TabsContent value="rules" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create Recurring Rule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Recurring Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Day of Week</Label>
                      <Select 
                        value={newRecurringRule.weekday.toString()} 
                        onValueChange={(value) => setNewRecurringRule(prev => ({...prev, weekday: parseInt(value)}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day, index) => (
                            <SelectItem key={index} value={(index + 1).toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={newRecurringRule.startTime}
                          onChange={(e) => setNewRecurringRule(prev => ({...prev, startTime: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={newRecurringRule.endTime}
                          onChange={(e) => setNewRecurringRule(prev => ({...prev, endTime: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newRecurringRule.isOpen}
                        onCheckedChange={(checked) => setNewRecurringRule(prev => ({...prev, isOpen: checked}))}
                      />
                      <Label>Available for booking</Label>
                    </div>

                    <Button 
                      onClick={createRecurringRule} 
                      className="w-full"
                      disabled={createRuleMutation.isPending}
                    >
                      {createRuleMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add Recurring Rule
                    </Button>
                  </CardContent>
                </Card>

                {/* Create One-off Rule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add One-off Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newOneOffRule.date}
                        onChange={(e) => setNewOneOffRule(prev => ({...prev, date: e.target.value}))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={newOneOffRule.startTime}
                          onChange={(e) => setNewOneOffRule(prev => ({...prev, startTime: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={newOneOffRule.endTime}
                          onChange={(e) => setNewOneOffRule(prev => ({...prev, endTime: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newOneOffRule.isOpen}
                        onCheckedChange={(checked) => setNewOneOffRule(prev => ({...prev, isOpen: checked}))}
                      />
                      <Label>Available for booking</Label>
                    </div>

                    <Button 
                      onClick={createOneOffRule} 
                      className="w-full"
                      disabled={createRuleMutation.isPending}
                    >
                      {createRuleMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Add One-off Rule
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Existing Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Availability Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availabilityData?.rules?.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={rule.type === 'recurring' ? 'default' : 'secondary'}>
                              {rule.type}
                            </Badge>
                            <span className="font-medium">
                              {rule.type === 'recurring' 
                                ? daysOfWeek[rule.weekday! - 1] 
                                : format(parseISO(rule.date!), 'MMM d, yyyy')
                              }
                            </span>
                            <span className={`text-sm ${rule.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                              {rule.isOpen ? 'Available' : 'Blocked'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {rule.startTime} - {rule.endTime}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRule(rule)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRule(rule.id)}
                            disabled={deleteRuleMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {(!availabilityData?.rules || availabilityData.rules.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No availability rules set</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calendar Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Calendar Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    google: { name: "Google Calendar", icon: Globe },
                    outlook: { name: "Outlook Calendar", icon: Globe },
                    apple: { name: "Apple Calendar", icon: Globe },
                  }).map(([key, calendar]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <calendar.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{calendar.name}</div>
                          <div className="text-sm text-gray-600">
                            {calendarSync[key as keyof CalendarIntegration]
                              ? "Connected and syncing"
                              : "Not connected"
                            }
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={
                          calendarSync[key as keyof CalendarIntegration]
                            ? "outline"
                            : "default"
                        }
                        onClick={() => toggleCalendarSync(key as keyof CalendarIntegration)}
                      >
                        {calendarSync[key as keyof CalendarIntegration] ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Disconnect
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sync Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-sync availability</div>
                      <div className="text-sm text-gray-600">
                        Automatically sync your availability with connected calendars
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Block calendar events</div>
                      <div className="text-sm text-gray-600">
                        Automatically block availability during existing calendar events
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Create calendar events</div>
                      <div className="text-sm text-gray-600">
                        Automatically create calendar events for confirmed bookings
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Availability Rule</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingRule(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={editingRule.startTime}
                    onChange={(e) => setEditingRule(prev => prev ? {...prev, startTime: e.target.value} : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editingRule.endTime}
                    onChange={(e) => setEditingRule(prev => prev ? {...prev, endTime: e.target.value} : null)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingRule.isOpen}
                  onCheckedChange={(checked) => setEditingRule(prev => prev ? {...prev, isOpen: checked} : null)}
                />
                <Label>Available for booking</Label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingRule(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => editingRule && updateRule(editingRule)}
                disabled={updateRuleMutation.isPending}
              >
                {updateRuleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
