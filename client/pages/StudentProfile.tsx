import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Save, Edit3, MapPin, Phone, Mail, Calendar, BookOpen, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+998901234567",
    dateOfBirth: "2000-01-15",
    grade: "University",
    bio: "I'm passionate about learning and always eager to improve my skills. Currently focusing on mathematics and programming.",
    location: "Tashkent, Uzbekistan",
    interests: ["Mathematics", "Programming", "English", "Physics"],
    emergencyContact: "+998909876543",
    learningGoals: "Master advanced mathematics and programming concepts for my university studies."
  });

  const subjects = [
    'Mathematics', 'English', 'Programming', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geography', 'Literature', 'Music', 'Art',
    'Russian', 'Arabic', 'German', 'French', 'Economics'
  ];

  const gradeOptions = [
    'Elementary School', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
    'Grade 10', 'Grade 11', 'Grade 12', 'University', 'Adult Learning'
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

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsEditing(false);
  };

  const toggleInterest = (subject: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(subject)
        ? prev.interests.filter(s => s !== subject)
        : [...prev.interests, subject]
    }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/student-dashboard" className="text-primary hover:text-primary/80">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your personal information and preferences</p>
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

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
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
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData(prev => ({...prev, dateOfBirth: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData(prev => ({...prev, emergencyContact: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                          placeholder="Emergency contact number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Academic Information Tab */}
            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Current Grade/Level</Label>
                    <Select
                      value={profileData.grade}
                      onValueChange={(value) => setProfileData(prev => ({...prev, grade: value}))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself, your interests, and what you're studying..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningGoals">Learning Goals</Label>
                    <Textarea
                      id="learningGoals"
                      value={profileData.learningGoals}
                      onChange={(e) => setProfileData(prev => ({...prev, learningGoals: e.target.value}))}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="What are your learning objectives and goals?"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Subjects of Interest</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant={profileData.interests.includes(subject) ? "default" : "outline"}
                          className={`cursor-pointer ${!isEditing ? 'pointer-events-none' : ''}`}
                          onClick={() => isEditing && toggleInterest(subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Select subjects you're interested in learning to get personalized teacher recommendations
                    </p>
                  </div>

                  {profileData.interests.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                        Your Learning Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Success Message */}
          {!isEditing && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Profile is up to date</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
