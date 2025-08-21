import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

type LoginMethod = 'email' | 'phone'
type UserType = 'student' | 'teacher'

export default function Login() {
  const { t } = useTranslation()
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone')
  const [userType, setUserType] = useState<UserType>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const navigate = useNavigate()
  const { login } = useAuth()

  const [credentials, setCredentials] = useState({
    email: '',
    phone: '',
    password: '',
  })

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (loginMethod === 'email') {
      if (!credentials.email) {
        newErrors.email = t('emailRequired')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        newErrors.email = t('validEmailRequired')
      }
    } else {
      if (!credentials.phone) {
        newErrors.phone = t('phoneRequired')
      } else if (!/^\+998\d{9}$/.test(credentials.phone)) {
        newErrors.phone = t('validPhoneRequired')
      }
    }

    if (!credentials.password) {
      newErrors.password = t('passwordRequired')
    } else if (credentials.password.length < 6) {
      newErrors.password = t('passwordMinLength')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const loginData = {
        identifier:
          loginMethod === 'email' ? credentials.email : credentials.phone,
        password: credentials.password,
        loginType: loginMethod,
        rememberMe,
      }

      const result = await login(loginData.identifier, loginData.password)

      if (result.success) {
        // Redirect based on user role from the actual user data
        const user = result.user
        if (user?.role === 'STUDENT') {
          navigate('/student-dashboard')
        } else if (user?.role === 'TEACHER') {
          navigate('/teacher-dashboard')
        } else if (user?.role === 'ADMIN') {
          navigate('/admin-dashboard')
        } else {
          navigate('/')
        }
      } else {
        setErrors({
          general: result.message || t('incorrectCredentials'),
        })
      }
    } catch (error: any) {
      setErrors({
        general: error?.message || t('loginError'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-center">{t('signInTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Type Selection */}
              {/* <div className="space-y-3">
                <RadioGroup
                  value={userType}
                  onValueChange={(value: UserType) => setUserType(value)}
                  className="flex gap-4 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <label
                      htmlFor="student"
                      className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value="student" id="student" />

                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{t('student')}</div>
                        <div className="text-sm text-gray-600">
                          {t('learnFromExperts')}
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <label
                      htmlFor="teacher"
                      className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value="teacher" id="teacher" />

                      <GraduationCap className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{t('teacher')}</div>
                        <div className="text-sm text-gray-600">
                          {t('shareYourKnowledge')}
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div> */}

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
                    {loginMethod === 'email'
                      ? t('emailAddress')
                      : t('phoneNumber')}
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
                          ? t('enterEmail')
                          : t('enterPhonePlaceholder')
                      }
                      value={
                        loginMethod === 'email'
                          ? credentials.email
                          : credentials.phone
                      }
                      onChange={(e) =>
                        handleInputChange(loginMethod, e.target.value)
                      }
                      className={`pl-10 ${errors[loginMethod] ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors[loginMethod] && (
                    <p className="text-red-500 text-sm">
                      {errors[loginMethod]}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('enterPassword')}
                      value={credentials.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
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
                      {t('rememberMe')}
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    {t('forgotPassword')}
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
                      {t('signingIn')}
                    </>
                  ) : (
                    t('signIn')
                  )}
                </Button>
              </form>

              {/* Registration Section */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  {t('dontHaveAccountYet')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/register" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      {t('signUpAsStudent')}
                    </Button>
                  </Link>
                  <Link to="/teacher-register" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {t('joinAsTeacher')}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
