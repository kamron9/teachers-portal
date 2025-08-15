import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Eye, EyeOff, Phone, Mail, Loader2, Shield, CheckCircle, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type LoginMethod = 'email' | 'phone';
type UserType = 'student' | 'teacher';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [userType, setUserType] = useState<UserType>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    phone: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (loginMethod === 'email') {
      if (!credentials.email) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!credentials.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+998\d{9}$/.test(credentials.phone)) {
        newErrors.phone = 'Please enter a valid Uzbekistan phone number (+998XXXXXXXXX)';
      }
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const loginData = {
        identifier: loginMethod === 'email' ? credentials.email : credentials.phone,
        password: credentials.password,
        loginType: loginMethod,
        rememberMe
      };

      const result = await login(loginData);

      if (result.success) {
        // Redirect based on user role from the actual user data
        const user = result.user;
        if (user?.role === 'STUDENT') {
          navigate('/student-dashboard');
        } else if (user?.role === 'TEACHER') {
          navigate('/teacher-dashboard');
        } else if (user?.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrors({ general: result.message || 'Noto\'g\'ri ma\'lumotlar kiritildi.' });
      }
    } catch (error: any) {
      setErrors({
        general: error?.message || 'Tizimga kirishda xatolik yuz berdi. Qayta urinib ko\'ring.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to access your lessons and connect with teachers</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">I am a:</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value: UserType) => setUserType(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="student" id="student" />
                    <label 
                      htmlFor="student" 
                      className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Student</div>
                        <div className="text-sm text-gray-600">Learn from experts</div>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <label 
                      htmlFor="teacher" 
                      className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Teacher</div>
                        <div className="text-sm text-gray-600">Share your knowledge</div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Login Method Toggle */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Sign in with:</Label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <Button
                    type="button"
                    variant={loginMethod === 'email' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLoginMethod('email')}
                    className="flex-1"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'phone' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLoginMethod('phone')}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </Button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Email/Phone Input */}
                <div className="space-y-2">
                  <Label htmlFor={loginMethod}>
                    {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                  </Label>
                  <div className="relative">
                    {loginMethod === 'email' ? (
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      id={loginMethod}
                      type={loginMethod === 'email' ? 'email' : 'tel'}
                      placeholder={
                        loginMethod === 'email' 
                          ? 'Enter your email address' 
                          : '+998901234567'
                      }
                      value={loginMethod === 'email' ? credentials.email : credentials.phone}
                      onChange={(e) => handleInputChange(loginMethod, e.target.value)}
                      className={`pl-10 ${errors[loginMethod] ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors[loginMethod] && (
                    <p className="text-red-500 text-sm">{errors[loginMethod]}</p>
                  )}
                  {loginMethod === 'phone' && (
                    <p className="text-xs text-gray-500">
                      SMS verification will be sent to your phone
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-700">
                      Remember me
                    </Label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Kirilmoqda...
                    </>
                  ) : (
                    'Kirish'
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-blue-800 text-sm">
                    <div className="font-medium mb-1">Demo Login:</div>
                    <div>Use any valid email/phone + password: <code className="bg-blue-100 px-1 rounded">demo123</code></div>
                  </div>
                </div>
              </div>

              {/* Registration Section */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Don't have an account yet?
                </p>
                <div className="flex gap-2">
                  <Link to="/student-register" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Sign up as Student
                    </Button>
                  </Link>
                  <Link to="/teacher-register" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Join as Teacher
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Trust Indicators */}
          <div className="mt-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>256-bit Encryption</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Additional Navigation */}
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-4 text-sm">
              <Link to="/teachers" className="text-gray-600 hover:text-primary">
                Browse Teachers
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
                How It Works
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/contact" className="text-gray-600 hover:text-primary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
