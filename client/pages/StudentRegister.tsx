import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Phone, Mail, MapPin, Calendar, ArrowLeft,
  CheckCircle, AlertCircle, Eye, EyeOff, Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
}

export default function StudentRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    location: "",
    learningGoals: "",
    preferredSubjects: [] as string[],
    experience: "beginner",
    agreeToTerms: false
  });

  const registrationSteps: RegistrationStep[] = [
    {
      id: 1,
      title: "Basic Information",
      description: "Tell us about yourself"
    },
    {
      id: 2,
      title: "Contact Details",
      description: "How can we reach you?"
    },
    {
      id: 3,
      title: "SMS Verification",
      description: "Verify your phone number"
    },
    {
      id: 4,
      title: "Learning Profile",
      description: "What do you want to learn?"
    },
    {
      id: 5,
      title: "Complete",
      description: "Welcome to TutorUZ!"
    }
  ];

  const subjects = [
    "English", "Mathematics", "Physics", "Chemistry", "Biology",
    "IELTS", "TOEFL", "Business English", "Programming", "History",
    "Geography", "Literature", "Music", "Art", "Economics"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSubjects: prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter(s => s !== subject)
        : [...prev.preferredSubjects, subject]
    }));
  };

  const sendOTP = async () => {
    setIsVerifying(true);
    // Simulate OTP sending
    setTimeout(() => {
      setCurrentStep(3);
      setIsVerifying(false);
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  const verifyOTP = async () => {
    if (otpCode === "123456") { // Demo OTP
      setCurrentStep(4);
    } else {
      toast.error("Noto'g'ri kod. Demo uchun 123456 ishlatilng.");
    }
  };

  const completeRegistration = () => {
    // Save user data to localStorage for demo
    localStorage.setItem("userAuth", JSON.stringify({
      type: "student",
      user: formData,
      token: "demo-token"
    }));
    setCurrentStep(5);
    setTimeout(() => {
      navigate("/student-dashboard");
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Location *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Select your location</option>
              <option value="tashkent">Tashkent</option>
              <option value="samarkand">Samarkand</option>
              <option value="bukhara">Bukhara</option>
              <option value="fergana">Fergana</option>
              <option value="namangan">Namangan</option>
              <option value="andijan">Andijan</option>
              <option value="nukus">Nukus</option>
              <option value="termez">Termez</option>
            </select>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => setCurrentStep(2)}
        className="w-full"
        disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.location}
      >
        Continue
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Details</h2>
        <p className="text-gray-600">How can teachers and support reach you?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="+998 90 123 45 67"
              required
            />
          </div>
          <p className="text-xs text-gray-500">We'll send an SMS verification code to this number</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Confirm your password"
            required
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={sendOTP}
          className="flex-1"
          disabled={isVerifying || !formData.email || !formData.phone || !formData.password || 
                   formData.password !== formData.confirmPassword || !formData.agreeToTerms}
        >
          {isVerifying ? "Sending OTP..." : "Send Verification Code"}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SMS Verification</h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium">{formData.phone}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Enter Verification Code</label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-lg tracking-widest"
            placeholder="123456"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 text-center">
            For demo purposes, use code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            {resendTimer > 0 ? (
              <span className="text-gray-500">Resend in {resendTimer}s</span>
            ) : (
              <button 
                onClick={sendOTP}
                className="text-primary hover:underline"
              >
                Resend Code
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={verifyOTP}
          className="flex-1"
          disabled={otpCode.length !== 6}
        >
          Verify Code
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Profile</h2>
        <p className="text-gray-600">Help us personalize your learning experience</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Learning Goals</label>
          <textarea
            value={formData.learningGoals}
            onChange={(e) => handleInputChange("learningGoals", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
            placeholder="What do you want to achieve? (e.g., IELTS 7.0, fluent business English, university preparation)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Current Experience Level</label>
          <select
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="beginner">Beginner - Just starting out</option>
            <option value="elementary">Elementary - Basic knowledge</option>
            <option value="intermediate">Intermediate - Can communicate</option>
            <option value="advanced">Advanced - Fluent with minor gaps</option>
            <option value="expert">Expert - Near-native level</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Subjects You're Interested In</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={formData.preferredSubjects.includes(subject) ? "default" : "outline"}
                className="cursor-pointer py-2 px-3 justify-center"
                onClick={() => handleSubjectToggle(subject)}
              >
                {subject}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500">Select all subjects that interest you</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={completeRegistration}
          className="flex-1"
        >
          Complete Registration
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TutorUZ!</h2>
        <p className="text-gray-600 text-lg">
          Your account has been created successfully.<br />
          You'll be redirected to your dashboard shortly.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What's next?</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Explore our featured teachers</li>
            <li>• Book your first lesson</li>
            <li>• Complete your profile for better matches</li>
            <li>• Start your learning journey!</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const progressPercentage = (currentStep / registrationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Student Account</h1>
            <p className="text-gray-600">Join thousands of students learning with expert teachers</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {registrationSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center hidden md:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-gray-500">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
