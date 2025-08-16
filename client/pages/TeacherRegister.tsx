import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Shield, CheckCircle, Loader2, User, BookOpen, Star, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type RegistrationStep = 'method' | 'verify' | 'basic' | 'qualifications' | 'complete';
type VerificationMethod = 'sms' | 'email';

export default function TeacherRegister() {
  const [step, setStep] = useState<RegistrationStep>('method');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('sms');
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    experience: '',
    languages: [] as string[],
    subjects: [] as string[],
    hourlyRate: ''
  });

  const [qualifications, setQualifications] = useState({
    education: '',
    certifications: [] as string[],
    teachingExperience: '',
    specializations: [] as string[],
    references: '',
    hasOnlineExperience: false
  });

  const languages = ['Uzbek', 'English', 'Russian', 'Arabic', 'Turkish', 'Korean', 'Chinese', 'French', 'German', 'Spanish'];
  const subjects = [
    'Mathematics', 'English', 'Programming', 'Physics', 'Chemistry', 'Biology', 
    'History', 'Geography', 'Literature', 'Music', 'Art', 'Economics', 'Psychology'
  ];

  const certificationOptions = [
    'TESOL/TEFL Certification', 'IELTS Teaching Certificate', 'University Degree',
    'Teaching License', 'Professional Certification', 'Industry Experience'
  ];

  const handleSendVerification = async () => {
    if (verificationMethod === 'sms' && !contact.match(/^\+998\d{9}$/)) {
      toast.error('To\'g\'ri O\'zbekiston telefon raqamini kiriting (+998XXXXXXXXX)');
      return;
    }
    if (verificationMethod === 'email' && !contact.includes('@')) {
      toast.error('To\'g\'ri email manzilini kiriting');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to send verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('verify');
    setResendTimer(60);
    
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('6 xonali kodni to\'liq kiriting');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to verify code
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('basic');
  };

  const handleBasicInfoSubmit = async () => {
    if (!basicInfo.firstName || !basicInfo.lastName || !basicInfo.bio || !basicInfo.hourlyRate) {
      toast.error('Barcha majburiy maydonlarni to\'ldiring');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('qualifications');
  };

  const handleCompleteRegistration = async () => {
    if (!qualifications.education || !qualifications.teachingExperience) {
      toast.error('Ta\'lim va o\'qitish tajribangizni kiriting');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to complete registration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('complete');
  };

  const toggleLanguage = (language: string) => {
    setBasicInfo(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleSubject = (subject: string) => {
    setBasicInfo(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleCertification = (cert: string) => {
    setQualifications(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Teacher</h1>
            <p className="text-gray-600">Join our community of expert educators and start teaching students worldwide</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {(['method', 'verify', 'basic', 'qualifications', 'complete'] as const).map((s, index) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? 'bg-primary text-white' :
                    (['method', 'verify', 'basic', 'qualifications'].indexOf(step) > index) ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {(['method', 'verify', 'basic', 'qualifications'].indexOf(step) > index) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      (['method', 'verify', 'basic', 'qualifications'].indexOf(step) > index) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Method</span>
              <span>Verify</span>
              <span>Basic Info</span>
              <span>Qualifications</span>
              <span>Done</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {step === 'method' && 'Tasdiqlash usulini tanlang'}
                {step === 'verify' && 'Ma\'lumotlaringizni tasdiqlang'}
                {step === 'basic' && 'Asosiy ma\'lumotlar'}
                {step === 'qualifications' && 'O\'qitish malakasi'}
                {step === 'complete' && 'TutorUZ ga xush kelibsiz!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Verification Method Selection */}
              {step === 'method' && (
                <div className="space-y-6">
                  <div className="text-center text-sm text-gray-600 mb-6">
                    Hisobingizni tasdiqlash usulini tanlang
                  </div>
                  
                  <RadioGroup value={verificationMethod} onValueChange={(value: VerificationMethod) => setVerificationMethod(value)}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sms" id="sms" />
                        <label htmlFor="sms" className="flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">SMS tasdiqlash</div>
                              <div className="text-sm text-gray-600">Telefon raqamingiz orqali tasdiqlang</div>
                            </div>
                          </div>
                          <Badge variant="secondary">Tavsiya etiladi</Badge>
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <label htmlFor="email" className="flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Email tasdiqlash</div>
                              <div className="text-sm text-gray-600">Email manzilingiz orqali tasdiqlang</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="contact">
                      {verificationMethod === 'sms' ? 'Telefon raqami' : 'Email manzili'}
                    </Label>
                    <div className="relative">
                      {verificationMethod === 'sms' ? (
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      )}
                      <Input
                        id="contact"
                        type={verificationMethod === 'sms' ? 'tel' : 'email'}
                        placeholder={verificationMethod === 'sms' ? '+998901234567' : 'sizning.email@example.com'}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSendVerification}
                    disabled={isLoading || !contact}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Kod yuborilmoqda...
                      </>
                    ) : (
                      'Tasdiqlash kodini yuborish'
                    )}
                  </Button>
                </div>
              )}

              {/* Verification Code */}
              {step === 'verify' && (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Quyidagi manzilga yuborilgan 6 xonali kodni kiriting:<br />
                    <span className="font-medium">{contact}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        value={verificationCode}
                        onChange={setVerificationCode}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <div className="text-center">
                      {resendTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend code in {resendTimer}s
                        </p>
                      ) : (
                        <Button variant="link" onClick={handleSendVerification} disabled={isLoading}>
                          Tasdiqlash kodini qayta yuborish
                        </Button>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </div>
              )}

              {/* Basic Information */}
              {step === 'basic' && (
                <div className="space-y-6">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    <Shield className="h-5 w-5 text-green-500 inline mr-1" />
                    Contact verified! Now tell us about your teaching background
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ism *</Label>
                      <Input
                        id="firstName"
                        value={basicInfo.firstName}
                        onChange={(e) => setBasicInfo(prev => ({...prev, firstName: e.target.value}))}
                        placeholder="Ali"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Familiya *</Label>
                      <Input
                        id="lastName"
                        value={basicInfo.lastName}
                        onChange={(e) => setBasicInfo(prev => ({...prev, lastName: e.target.value}))}
                        placeholder="Karimov"
                      />
                    </div>
                  </div>

                  {verificationMethod === 'sms' && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email manzili</Label>
                      <Input
                        id="email"
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => setBasicInfo(prev => ({...prev, email: e.target.value}))}
                        placeholder="ali@example.com"
                      />
                    </div>
                  )}

                  {verificationMethod === 'email' && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon raqami</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo(prev => ({...prev, phone: e.target.value}))}
                        placeholder="+998901234567"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={basicInfo.bio}
                      onChange={(e) => setBasicInfo(prev => ({...prev, bio: e.target.value}))}
                      placeholder="Tell students about your teaching experience, methodology, and what makes you a great teacher..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">O'qitish tajribasi (yillar) *</Label>
                    <Select value={basicInfo.experience} onValueChange={(value) => setBasicInfo(prev => ({...prev, experience: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tajriba darajangizni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">1 yildan kam</SelectItem>
                        <SelectItem value="1-2">1-2 yil</SelectItem>
                        <SelectItem value="3-5">3-5 yil</SelectItem>
                        <SelectItem value="6-10">6-10 yil</SelectItem>
                        <SelectItem value="10+">10+ yil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>O'qitish tillari *</Label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge
                          key={language}
                          variant={basicInfo.languages.includes(language) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleLanguage(language)}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Subjects You Teach *</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant={basicInfo.subjects.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSubject(subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (UZS) *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={basicInfo.hourlyRate}
                      onChange={(e) => setBasicInfo(prev => ({...prev, hourlyRate: e.target.value}))}
                      placeholder="50000"
                    />
                    <p className="text-xs text-gray-500">
                      Set your base hourly rate. You can adjust this later or offer package deals.
                    </p>
                  </div>

                  <Button 
                    onClick={handleBasicInfoSubmit}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              )}

              {/* Qualifications */}
              {step === 'qualifications' && (
                <div className="space-y-6">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Help students understand your qualifications and expertise
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education Background *</Label>
                    <Textarea
                      id="education"
                      value={qualifications.education}
                      onChange={(e) => setQualifications(prev => ({...prev, education: e.target.value}))}
                      placeholder="e.g., Bachelor's in English Literature from Tashkent State University, Master's in Education..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Certifications & Qualifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {certificationOptions.map((cert) => (
                        <Badge
                          key={cert}
                          variant={qualifications.certifications.includes(cert) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleCertification(cert)}
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingExperience">Teaching Experience Details *</Label>
                    <Textarea
                      id="teachingExperience"
                      value={qualifications.teachingExperience}
                      onChange={(e) => setQualifications(prev => ({...prev, teachingExperience: e.target.value}))}
                      placeholder="Describe your teaching experience, institutions you've worked with, student success stories..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references">Professional References (Optional)</Label>
                    <Textarea
                      id="references"
                      value={qualifications.references}
                      onChange={(e) => setQualifications(prev => ({...prev, references: e.target.value}))}
                      placeholder="Contact information for professional references or LinkedIn profile..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="onlineExperience"
                      checked={qualifications.hasOnlineExperience}
                      onCheckedChange={(checked) => setQualifications(prev => ({...prev, hasOnlineExperience: !!checked}))}
                    />
                    <Label htmlFor="onlineExperience" className="text-sm">
                      I have experience with online teaching
                    </Label>
                  </div>

                  <Button 
                    onClick={handleCompleteRegistration}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              )}

              {/* Complete Step */}
              {step === 'complete' && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Registration Submitted Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Welcome to TutorUZ, {basicInfo.firstName}! Your application is under review. 
                      We'll notify you within 24-48 hours once approved.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <h4 className="font-medium mb-2">What's Next?</h4>
                    <ul className="text-left space-y-1">
                      <li>• Our team will review your qualifications</li>
                      <li>• We may contact you for additional verification</li>
                      <li>• Once approved, you can complete your profile</li>
                      <li>• Start receiving booking requests from students</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link to="/teacher-dashboard">
                      <Button className="w-full" size="lg">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Login Link */}
          {step !== 'complete' && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have a teacher account?{' '}
                <Link to="/teacher-login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
