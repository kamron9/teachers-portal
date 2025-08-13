import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Shield, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";

type RegistrationStep = 'phone' | 'otp' | 'details' | 'complete';

export default function StudentRegister() {
  const [step, setStep] = useState<RegistrationStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    interests: [] as string[],
  });

  const handleSendOTP = async () => {
    if (!phoneNumber.match(/^\+998\d{9}$/)) {
      alert('Please enter a valid Uzbekistan phone number (+998XXXXXXXXX)');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('otp');
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

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      alert('Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('details');
  };

  const handleCompleteRegistration = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to complete registration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('complete');
  };

  const subjects = [
    'Mathematics', 'English', 'Programming', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geography', 'Literature', 'Music', 'Art'
  ];

  const toggleInterest = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(subject)
        ? prev.interests.filter(s => s !== subject)
        : [...prev.interests, subject]
    }));
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join TutorUZ</h1>
            <p className="text-gray-600">Create your student account to start learning</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {(['phone', 'otp', 'details', 'complete'] as const).map((s, index) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? 'bg-primary text-white' :
                    (['phone', 'otp', 'details'].indexOf(step) > index) ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {(['phone', 'otp', 'details'].indexOf(step) > index) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      (['phone', 'otp', 'details'].indexOf(step) > index) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Phone</span>
              <span>Verify</span>
              <span>Details</span>
              <span>Done</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {step === 'phone' && 'Enter Your Phone Number'}
                {step === 'otp' && 'Verify Your Phone'}
                {step === 'details' && 'Complete Your Profile'}
                {step === 'complete' && 'Welcome to TutorUZ!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Number Step */}
              {step === 'phone' && (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    We'll send you a verification code via SMS
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+998901234567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter your Uzbekistan phone number with country code
                    </p>
                  </div>

                  <Button 
                    onClick={handleSendOTP}
                    disabled={isLoading || !phoneNumber}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </Button>
                </div>
              )}

              {/* OTP Verification Step */}
              {step === 'otp' && (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Enter the 6-digit code sent to<br />
                    <span className="font-medium">{phoneNumber}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        value={otpCode}
                        onChange={setOtpCode}
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
                        <Button variant="link" onClick={handleSendOTP} disabled={isLoading}>
                          Resend verification code
                        </Button>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otpCode.length !== 6}
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

                  <Button 
                    variant="outline" 
                    onClick={() => setStep('phone')}
                    className="w-full"
                  >
                    Change Phone Number
                  </Button>
                </div>
              )}

              {/* Profile Details Step */}
              {step === 'details' && (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    <Shield className="h-5 w-5 text-green-500 inline mr-1" />
                    Phone verified! Now tell us about yourself
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Level (Optional)</Label>
                    <Input
                      id="grade"
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({...prev, grade: e.target.value}))}
                      placeholder="e.g., Grade 10, University, Adult"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Subjects You're Interested In (Optional)</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant={formData.interests.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleInterest(subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Select subjects to help us recommend the best teachers for you
                    </p>
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
                      Account Created Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Welcome to TutorUZ, {formData.firstName}! You can now start browsing teachers and booking lessons.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link to="/teachers">
                      <Button className="w-full" size="lg">
                        Browse Teachers
                      </Button>
                    </Link>
                    <Link to="/student-profile">
                      <Button variant="outline" className="w-full">
                        Complete My Profile
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
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
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
