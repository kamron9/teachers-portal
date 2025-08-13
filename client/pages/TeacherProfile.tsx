import { useState, useRef } from "react";
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

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [videoIntro, setVideoIntro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: "Aziza",
    lastName: "Karimova",
    title: "English Language Expert & IELTS Specialist",
    bio: "Certified English teacher with extensive experience in IELTS preparation and business communication. I help students achieve their language goals through personalized lessons and proven methodologies.",
    education: "Masters in English Literature - National University of Uzbekistan\nTESOL Certification - British Council\nIELTS Teacher Training Certificate",
    experience: "5+ years",
    languages: ["Uzbek", "English", "Russian"],
    subjects: ["English", "IELTS", "Business English", "Conversation Practice"],
    specializations: ["IELTS Preparation", "Business English", "Academic Writing"],
    hourlyRate: "50000",
    trialRate: "25000",
    packageRates: {
      package5: "225000",
      package10: "425000"
    },
    timezone: "Asia/Tashkent",
    isAvailable: true,
    responseTime: "2 hours",
    achievements: [
      "95% student satisfaction rate",
      "IELTS success rate: 87% band 6.5+",
      "Featured teacher of the month - March 2024"
    ],
    teachingStyle: "I believe in interactive and communicative approach to language learning. My lessons are structured yet flexible, focusing on practical usage and real-world application.",
    portfolioFiles: [
      { name: "Teaching_Certificate.pdf", type: "pdf" },
      { name: "Student_Success_Stories.docx", type: "doc" },
      { name: "Lesson_Plan_Sample.pdf", type: "pdf" }
    ]
  });

  const [newAchievement, setNewAchievement] = useState("");
  const [newPortfolioFile, setNewPortfolioFile] = useState<File | null>(null);

  const languages = ['Uzbek', 'English', 'Russian', 'Arabic', 'Turkish', 'Korean', 'Chinese', 'French', 'German', 'Spanish'];
  const subjects = [
    'Mathematics', 'English', 'Programming', 'Physics', 'Chemistry', 'Biology', 
    'History', 'Geography', 'Literature', 'Music', 'Art', 'Economics', 'Psychology'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoIntro(url);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsEditing(false);
  };

  const toggleLanguage = (language: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleSubject = (subject: string) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfileData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handlePortfolioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPortfolioFile(file);
      // In real app, upload to server and add to portfolioFiles
      const fileType = file.name.split('.').pop();
      setProfileData(prev => ({
        ...prev,
        portfolioFiles: [...prev.portfolioFiles, { name: file.name, type: fileType || 'unknown' }]
      }));
      setNewPortfolioFile(null);
    }
  };

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
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
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
                        <AvatarImage src={profileImage} alt="Profile" />
                        <AvatarFallback className="text-2xl">
                          {profileData.firstName[0]}{profileData.lastName[0]}
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
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={profileData.title}
                        onChange={(e) => setProfileData(prev => ({...prev, title: e.target.value}))}
                        disabled={!isEditing}
                        placeholder="e.g., English Language Expert & IELTS Specialist"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Tell students about your teaching experience and methodology..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education & Certifications</Label>
                      <Textarea
                        id="education"
                        value={profileData.education}
                        onChange={(e) => setProfileData(prev => ({...prev, education: e.target.value}))}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="List your education background and certifications..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select
                        value={profileData.experience}
                        onValueChange={(value) => setProfileData(prev => ({...prev, experience: value}))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
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
                    <CardTitle>Languages & Subjects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label>Languages You Teach In</Label>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((language) => (
                          <Badge
                            key={language}
                            variant={profileData.languages.includes(language) ? "default" : "outline"}
                            className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                            onClick={() => isEditing && toggleLanguage(language)}
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Subjects You Teach</Label>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant={profileData.subjects.includes(subject) ? "default" : "outline"}
                            className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                            onClick={() => isEditing && toggleSubject(subject)}
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teachingStyle">Teaching Style & Methodology</Label>
                      <Textarea
                        id="teachingStyle"
                        value={profileData.teachingStyle}
                        onChange={(e) => setProfileData(prev => ({...prev, teachingStyle: e.target.value}))}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Describe your teaching approach and methodology..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {profileData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{achievement}</span>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new achievement..."
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                          />
                          <Button onClick={addAchievement} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trialRate">Trial Lesson (30 min)</Label>
                      <div className="relative">
                        <Input
                          id="trialRate"
                          type="number"
                          value={profileData.trialRate}
                          onChange={(e) => setProfileData(prev => ({...prev, trialRate: e.target.value}))}
                          disabled={!isEditing}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-3 text-sm text-gray-500">UZS</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Single Lesson (60 min)</Label>
                      <div className="relative">
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={profileData.hourlyRate}
                          onChange={(e) => setProfileData(prev => ({...prev, hourlyRate: e.target.value}))}
                          disabled={!isEditing}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-3 text-sm text-gray-500">UZS</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="package5">5 Lessons Package</Label>
                      <div className="relative">
                        <Input
                          id="package5"
                          type="number"
                          value={profileData.packageRates.package5}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev, 
                            packageRates: {...prev.packageRates, package5: e.target.value}
                          }))}
                          disabled={!isEditing}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-3 text-sm text-gray-500">UZS</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="package10">10 Lessons Package</Label>
                      <div className="relative">
                        <Input
                          id="package10"
                          type="number"
                          value={profileData.packageRates.package10}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev, 
                            packageRates: {...prev.packageRates, package10: e.target.value}
                          }))}
                          disabled={!isEditing}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-3 text-sm text-gray-500">UZS</span>
                      </div>
                    </div>
                  </div>

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
                    {videoIntro ? (
                      <div className="relative">
                        <video
                          src={videoIntro}
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
                      Portfolio & Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {profileData.portfolioFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setProfileData(prev => ({
                                  ...prev,
                                  portfolioFiles: prev.portfolioFiles.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handlePortfolioUpload}
                          className="hidden"
                          id="portfolio-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('portfolio-upload')?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <p>• Certificates, diplomas, lesson samples</p>
                      <p>• Max file size: 10MB each</p>
                      <p>• Formats: PDF, DOC, DOCX, JPG, PNG</p>
                    </div>
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
                      checked={profileData.isAvailable}
                      onCheckedChange={(checked) => setProfileData(prev => ({...prev, isAvailable: checked}))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => setProfileData(prev => ({...prev, timezone: value}))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Tashkent">Tashkent (UTC+5)</SelectItem>
                        <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Typical Response Time</Label>
                    <Select
                      value={profileData.responseTime}
                      onValueChange={(value) => setProfileData(prev => ({...prev, responseTime: value}))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 hour">Within 1 hour</SelectItem>
                        <SelectItem value="2 hours">Within 2 hours</SelectItem>
                        <SelectItem value="4 hours">Within 4 hours</SelectItem>
                        <SelectItem value="24 hours">Within 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
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
