import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  BookOpen,
  BarChart3,
  MessageCircle,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  Globe,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  apiClient, 
  SubjectOffering, 
  TeacherChips,
  formatPriceShort,
  parsePrice,
  getLevelDisplayName,
  getDeliveryDisplayName
} from "@/lib/api";

export default function TeacherSubjects() {
  const { toast } = useToast();
  const [offerings, setOfferings] = useState<SubjectOffering[]>([]);
  const [chips, setChips] = useState<TeacherChips | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOffering, setEditingOffering] = useState<SubjectOffering | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newOffering, setNewOffering] = useState({
    subjectName: "",
    subjectNameUz: "",
    subjectNameRu: "",
    subjectNameEn: "",
    level: "ALL_LEVELS" as const,
    pricePerHour: "",
    delivery: "ONLINE" as const,
    icon: "BOOK" as const,
    status: "DRAFT" as const,
  });

  const levelOptions = [
    { value: "ALL_LEVELS", label: "All Levels" },
    { value: "BEGINNER", label: "Beginner" },
    { value: "ELEMENTARY", label: "Elementary" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "UPPER_INTERMEDIATE", label: "Upper Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "INTERMEDIATE_PLUS", label: "Intermediate Plus" },
  ];

  const deliveryOptions = [
    { value: "ONLINE", label: "Online", icon: Globe },
    { value: "OFFLINE", label: "In Person", icon: MapPin },
    { value: "HYBRID", label: "Online & In Person", icon: Globe },
  ];

  const iconOptions = [
    { value: "BOOK", label: "📚 Book", component: BookOpen },
    { value: "BAR_CHART", label: "📊 Chart", component: BarChart3 },
    { value: "BRIEFCASE", label: "💼 Briefcase" },
    { value: "SPEECH_BUBBLE", label: "💬 Speech", component: MessageCircle },
  ];

  // Load subject offerings
  useEffect(() => {
    const loadOfferings = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getTeacherSubjectOfferings();
        setOfferings(response.offerings || []);
        setChips(response.chips || null);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load subject offerings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOfferings();
  }, [toast]);

  const handleCreateOffering = async () => {
    if (!newOffering.subjectName.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    if (!newOffering.pricePerHour || parseFloat(newOffering.pricePerHour) < 1000) {
      toast({
        title: "Error",
        description: "Price must be at least 1,000 UZS",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const offering = await apiClient.createSubjectOffering({
        ...newOffering,
        pricePerHour: parseFloat(newOffering.pricePerHour),
      });

      setOfferings(prev => [...prev, offering]);
      setShowAddDialog(false);
      setNewOffering({
        subjectName: "",
        subjectNameUz: "",
        subjectNameRu: "",
        subjectNameEn: "",
        level: "ALL_LEVELS",
        pricePerHour: "",
        delivery: "ONLINE",
        icon: "BOOK",
        status: "DRAFT",
      });

      toast({
        title: "Success",
        description: "Subject offering created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subject offering",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOffering = async (id: string, updates: Partial<SubjectOffering>) => {
    try {
      const updated = await apiClient.updateSubjectOffering(id, updates);
      setOfferings(prev => prev.map(o => o.id === id ? updated : o));
      setEditingOffering(null);

      toast({
        title: "Success",
        description: "Subject offering updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subject offering",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOffering = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject offering?")) return;

    try {
      await apiClient.deleteSubjectOffering(id);
      setOfferings(prev => prev.filter(o => o.id !== id));

      toast({
        title: "Success",
        description: "Subject offering deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subject offering",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (offering: SubjectOffering) => {
    const newStatus = offering.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await handleUpdateOffering(offering.id, { status: newStatus });
  };

  const getIconDisplay = (iconValue: string) => {
    const option = iconOptions.find(opt => opt.value === iconValue);
    return option?.label.split(' ')[0] || "📚";
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/teacher-dashboard" className="text-primary hover:text-primary/80">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
                <p className="text-gray-600">Manage your subject offerings and pricing</p>
              </div>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input
                      id="subjectName"
                      value={newOffering.subjectName}
                      onChange={(e) => setNewOffering(prev => ({ ...prev, subjectName: e.target.value }))}
                      placeholder="e.g., English, Mathematics, Programming"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select 
                        value={newOffering.level} 
                        onValueChange={(value: any) => setNewOffering(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Hour (UZS)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1000"
                        value={newOffering.pricePerHour}
                        onChange={(e) => setNewOffering(prev => ({ ...prev, pricePerHour: e.target.value }))}
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="delivery">Delivery Method</Label>
                      <Select 
                        value={newOffering.delivery} 
                        onValueChange={(value: any) => setNewOffering(prev => ({ ...prev, delivery: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Select 
                        value={newOffering.icon} 
                        onValueChange={(value: any) => setNewOffering(prev => ({ ...prev, icon: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjectNameEn">Subject Name (English)</Label>
                    <Input
                      id="subjectNameEn"
                      value={newOffering.subjectNameEn}
                      onChange={(e) => setNewOffering(prev => ({ ...prev, subjectNameEn: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateOffering} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Subject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Subject Offerings List */}
          <div className="space-y-4">
            {offerings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No subjects added yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add your first subject to start receiving bookings from students
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Subject
                  </Button>
                </CardContent>
              </Card>
            ) : (
              offerings.map((offering) => (
                <Card key={offering.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getIconDisplay(offering.icon)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{offering.subjectName}</h3>
                          <Badge 
                            variant={offering.status === "PUBLISHED" ? "default" : "secondary"}
                          >
                            {offering.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{getLevelDisplayName(offering.level)}</span>
                          <span>•</span>
                          <span>{getDeliveryDisplayName(offering.delivery)}</span>
                          <span>•</span>
                          <span className="font-medium">
                            {formatPriceShort(offering.pricePerHour)} UZS/hour
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(offering)}
                      >
                        {offering.status === "PUBLISHED" ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingOffering(offering)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOffering(offering.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Statistics */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Subjects</p>
                    <p className="text-2xl font-bold">{offerings.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold">
                      {offerings.filter(o => o.status === "PUBLISHED").length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Price</p>
                    <p className="text-2xl font-bold">
                      {offerings.length > 0 
                        ? formatPriceShort(
                            Math.round(
                              offerings.reduce((sum, o) => sum + o.pricePerHour, 0) / offerings.length
                            )
                          )
                        : "0"
                      }
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Pricing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Research competitor prices in your subject area</li>
                  <li>• Consider your experience level and qualifications</li>
                  <li>• Offer trial lessons at a lower rate to attract new students</li>
                  <li>• Package deals encourage long-term commitment</li>
                  <li>• Platform fee is automatically deducted from your earnings</li>
                  <li>• You can adjust prices anytime, but existing bookings keep original rates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
