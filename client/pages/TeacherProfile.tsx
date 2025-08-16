import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Save, Edit3, Upload, Video, Star, Award, BookOpen, Globe, DollarSign, Loader2, CheckCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiClient, TeacherProfile as TeacherProfileType } from "@/lib/api";

export default function TeacherProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState<TeacherProfileType | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<Partial<TeacherProfileType>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const languages = ['Uzbek', 'English', 'Russian', 'Arabic', 'Turkish', 'Korean', 'Chinese', 'French', 'German', 'Spanish'];
  const subjects = [
    'Mathematics', 'English', 'Programming', 'Physics', 'Chemistry', 'Biology', 
    'History', 'Geography', 'Literature', 'Music', 'Art', 'Economics', 'Psychology'
  ];

  // Load teacher profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await apiClient.getTeacherProfile();
        setProfileData(profile);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  const handleInputChange = (field: keyof TeacherProfileType, value: any) => {
    setUnsavedChanges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a file storage service
      // For now, we'll just create a blob URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = e.target?.result as string;
        handleInputChange('avatar', avatar);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a file storage service
      const url = URL.createObjectURL(file);
      handleInputChange('videoIntroUrl', url);
    }
  };

  const handleSave = async () => {
    if (!profileData || Object.keys(unsavedChanges).length === 0) return;

    setIsLoading(true);
    try {
      const updatedProfile = await apiClient.updateTeacherProfile(unsavedChanges);
      setProfileData(updatedProfile);
      setUnsavedChanges({});
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUnsavedChanges({});
    setIsEditing(false);
  };

  const toggleLanguage = (language: string) => {
    if (!profileData || !isEditing) return;
    
    const currentLanguages = unsavedChanges.languagesTaught ?? profileData.languagesTaught;
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    
    handleInputChange('languagesTaught', newLanguages);
  };

  const addEducation = () => {
    const currentEducation = unsavedChanges.education ?? profileData?.education ?? [];
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      description: ""
    };
    handleInputChange('education', [...currentEducation, newEducation]);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const currentEducation = unsavedChanges.education ?? profileData?.education ?? [];
    const updatedEducation = [...currentEducation];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    handleInputChange('education', updatedEducation);
  };

  const removeEducation = (index: number) => {
    const currentEducation = unsavedChanges.education ?? profileData?.education ?? [];
    const updatedEducation = currentEducation.filter((_, i) => i !== index);
    handleInputChange('education', updatedEducation);
  };

  // Get current value for a field (unsaved changes take precedence)
  const getCurrentValue = (field: keyof TeacherProfileType) => {
    return unsavedChanges[field] ?? profileData?.[field];
  };

  if (isInitialLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
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
                <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>
                <p className="text-gray-600">Manage your teaching profile and preferences</p>
                {profileData.profileCompletion && (
                  <p className="text-sm text-gray-500">
                    Profile completion: {profileData.profileCompletion}%
                  </p>
                )}
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading || Object.keys(unsavedChanges).length === 0}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="teaching">Teaching</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="relative mx-auto w-32 h-32">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={getCurrentValue('avatar') || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="text-2xl">
                          {getCurrentValue('firstName')?.[0]}{getCurrentValue('lastName')?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={getCurrentValue('firstName') || ""}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={getCurrentValue('lastName') || ""}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bioEn">Professional Bio (English)</Label>
                      <Textarea
                        id="bioEn"
                        value={getCurrentValue('bioEn') || ""}
                        onChange={(e) => handleInputChange('bioEn', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Tell students about your teaching experience and methodology..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bioUz">Professional Bio (Uzbek)</Label>
                      <Textarea
                        id="bioUz"
                        value={getCurrentValue('bioUz') || ""}
                        onChange={(e) => handleInputChange('bioUz', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="O'qituvchilik tajribangiz va metodologiyangiz haqida gapirib bering..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bioRu">Professional Bio (Russian)</Label>
                      <Textarea
                        id="bioRu"
                        value={getCurrentValue('bioRu') || ""}
                        onChange={(e) => handleInputChange('bioRu', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Расскажите студентам о своем опыте преподавания и методологии..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        min="0"
                        max="50"
                        value={getCurrentValue('experienceYears') || 0}
                        onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={getCurrentValue('timezone') || "Asia/Tashkent"}
                        onValueChange={(value) => handleInputChange('timezone', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Tashkent">Tashkent (UTC+5)</SelectItem>
                          <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                          <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Teaching Information Tab */}
            <TabsContent value="teaching">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Languages & Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Languages You Teach In</Label>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((language) => {
                          const currentLanguages = getCurrentValue('languagesTaught') || [];
                          const isSelected = currentLanguages.includes(language);
                          return (
                            <Badge
                              key={language}
                              variant={isSelected ? "default" : "outline"}
                              className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                              onClick={() => isEditing && toggleLanguage(language)}
                            >
                              {language}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                      <Textarea
                        id="cancellationPolicy"
                        value={getCurrentValue('cancellationPolicy') || ""}
                        onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Describe your cancellation policy..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minNoticeHours">Min Notice Hours</Label>
                        <Input
                          id="minNoticeHours"
                          type="number"
                          min="1"
                          max="168"
                          value={getCurrentValue('minNoticeHours') || 12}
                          onChange={(e) => handleInputChange('minNoticeHours', parseInt(e.target.value) || 12)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxAdvanceDays">Max Advance Days</Label>
                        <Input
                          id="maxAdvanceDays"
                          type="number"
                          min="1"
                          max="365"
                          value={getCurrentValue('maxAdvanceDays') || 30}
                          onChange={(e) => handleInputChange('maxAdvanceDays', parseInt(e.target.value) || 30)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Education & Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {(getCurrentValue('education') || []).map((edu: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">Education #{index + 1}</h4>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Institution"
                              value={edu.institution || ""}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              disabled={!isEditing}
                            />
                            <Input
                              placeholder="Degree"
                              value={edu.degree || ""}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          <Input
                            placeholder="Field of Study"
                            value={edu.field || ""}
                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            disabled={!isEditing}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="number"
                              placeholder="Start Year"
                              value={edu.startYear || ""}
                              onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value))}
                              disabled={!isEditing}
                            />
                            <Input
                              type="number"
                              placeholder="End Year"
                              value={edu.endYear || ""}
                              onChange={(e) => updateEducation(index, 'endYear', parseInt(e.target.value))}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <Button onClick={addEducation} variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Lesson Pricing
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Pricing is managed through your subject offerings. You can add and edit subjects in the Subjects section.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Trial lessons help students get to know your teaching style</li>
                      <li>• Package deals encourage long-term commitment</li>
                      <li>• Platform fee is automatically deducted from your earnings</li>
                      <li>• You can adjust prices anytime, but existing bookings keep original rates</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Video Introduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {getCurrentValue('videoIntroUrl') ? (
                      <div className="relative">
                        <video
                          src={getCurrentValue('videoIntroUrl')}
                          controls
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => videoInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No video introduction uploaded</p>
                          {isEditing && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => videoInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Video
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />

                    <div className="text-xs text-gray-500">
                      <p>• Max file size: 50MB</p>
                      <p>• Recommended length: 1-3 minutes</p>
                      <p>• Formats: MP4, MOV, AVI</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Verification Status</p>
                        <p className="text-sm text-gray-600">
                          {profileData.verificationStatus === 'APPROVED' ? 'Your profile is verified' :
                           profileData.verificationStatus === 'PENDING' ? 'Verification pending' :
                           'Verification rejected'}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          profileData.verificationStatus === 'APPROVED' ? 'default' :
                          profileData.verificationStatus === 'PENDING' ? 'secondary' : 'destructive'
                        }
                      >
                        {profileData.verificationStatus}
                      </Badge>
                    </div>

                    {profileData.verificationReason && (
                      <div className="p-3 border rounded bg-yellow-50">
                        <p className="text-sm font-medium">Admin Notes:</p>
                        <p className="text-sm text-gray-600">{profileData.verificationReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Profile Visibility</Label>
                      <p className="text-sm text-gray-600">Make your profile visible to students</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('isActive') || false}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Status */}
          {!isEditing && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Profile is up to date and visible to students</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
