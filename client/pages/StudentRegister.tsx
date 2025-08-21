import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface RegistrationStep {
  id: number
  title: string
  description: string
}

export default function StudentRegister() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [resendTimer, setResendTimer] = useState(60)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: undefined as Date | undefined,
    location: '',
    learningGoals: '',
    preferredSubjects: [] as string[],
    experience: 'beginner',
    agreeToTerms: false,
  })

  const registrationSteps: RegistrationStep[] = [
    {
      id: 1,
      title: t('basicInformation'),
      description: t('tellUsAboutYourself'),
    },
    {
      id: 2,
      title: t('contactDetails'),
      description: t('howCanWeReachYou'),
    },
    {
      id: 3,
      title: t('smsVerification'),
      description: t('verifyYourPhoneNumber'),
    },
    {
      id: 4,
      title: t('learningProfile'),
      description: t('whatDoYouWantToLearn'),
    },
    {
      id: 5,
      title: t('complete'),
      description: t('welcomeToTutorUZ'),
    },
  ]

  const subjects = [
    'English',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'IELTS',
    'TOEFL',
    'Business English',
    'Programming',
    'History',
    'Geography',
    'Literature',
    'Music',
    'Art',
    'Economics',
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredSubjects: prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter((s) => s !== subject)
        : [...prev.preferredSubjects, subject],
    }))
  }

  const sendOTP = async () => {
    setIsVerifying(true)
    // Simulate OTP sending
    setTimeout(() => {
      setCurrentStep(3)
      setIsVerifying(false)
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 60
          }
          return prev - 1
        })
      }, 1000)
    }, 2000)
  }

  const verifyOTP = async () => {
    if (otpCode === '123456') {
      // Demo OTP
      setCurrentStep(4)
    } else {
      toast.error("Noto'g'ri kod. Demo uchun 123456 ishlatilng.")
    }
  }

  const completeRegistration = () => {
    // Save user data to localStorage for demo
    localStorage.setItem(
      'userAuth',
      JSON.stringify({
        type: 'student',
        user: formData,
        token: 'demo-token',
      })
    )
    setCurrentStep(5)
    setTimeout(() => {
      navigate('/student-dashboard')
    }, 2000)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('basicInformation')}
        </h2>
        <p className="text-gray-600">{t('tellUsAboutYourself')}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('firstNameLabel')} *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('enterYourFirstName')}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('lastNameLabel')} *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('enterYourLastName')}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('dateOfBirth')} *
          </label>
          <DatePicker
            date={formData.dateOfBirth}
            onSelect={(date) => handleInputChange('dateOfBirth', date)}
            placeholder={t('selectYourBirthDate')}
            maxDate={new Date()} // Can't select future dates
            minDate={new Date(1950, 0, 1)} // Can't select dates before 1950
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('locationLabel')} *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select
              value={formData.location}
              onValueChange={(value) => handleInputChange('location', value)}
            >
              <SelectTrigger className="w-full pl-10">
                <SelectValue placeholder={t('selectYourLocation')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tashkent">Tashkent</SelectItem>
                <SelectItem value="samarkand">Samarkand</SelectItem>
                <SelectItem value="bukhara">Bukhara</SelectItem>
                <SelectItem value="fergana">Fergana</SelectItem>
                <SelectItem value="namangan">Namangan</SelectItem>
                <SelectItem value="andijan">Andijan</SelectItem>
                <SelectItem value="nukus">Nukus</SelectItem>
                <SelectItem value="termez">Termez</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep(2)}
        className="w-full"
        disabled={
          !formData.firstName ||
          !formData.lastName ||
          !formData.dateOfBirth ||
          !formData.location
        }
      >
        {t('continue')}
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('contactDetails')}
        </h2>
        <p className="text-gray-600">{t('howCanWeReachYou')}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('emailAddressLabel')} *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('phoneNumberLabel')} *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="+998 90 123 45 67"
              required
            />
          </div>
          <p className="text-xs text-gray-500">{t('weSendSmsToThisNumber')}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('password')} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={t('createAStrongPassword')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('confirmPassword')} *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange('confirmPassword', e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={t('confirmYourPassword')}
            required
          />
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500">{t('passwordsDoNotMatch')}</p>
            )}
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeToTerms}
            onChange={(e) =>
              handleInputChange('agreeToTerms', e.target.checked)
            }
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            {t('iAgreeToThe')}{' '}
            <Link to="/terms" className="text-primary hover:underline">
              {t('termsOfService')}
            </Link>{' '}
            {t('and')}{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              {t('privacyPolicy')}
            </Link>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="flex-1"
        >
          {t('back')}
        </Button>
        <Button
          onClick={sendOTP}
          className="flex-1"
          disabled={
            isVerifying ||
            !formData.email ||
            !formData.phone ||
            !formData.password ||
            formData.password !== formData.confirmPassword ||
            !formData.agreeToTerms
          }
        >
          {isVerifying ? t('sendingOTP') : t('sendVerificationCode')}
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('smsVerification')}
        </h2>
        <p className="text-gray-600">
          {t('weSentVerificationCode')}
          <br />
          <span className="font-medium">{formData.phone}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('enterVerificationCode')}
          </label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-lg tracking-widest"
            placeholder="123456"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 text-center">
            {t('forDemoPurposes')}{' '}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              123456
            </span>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('didntReceiveCode')}{' '}
            {resendTimer > 0 ? (
              <span className="text-gray-500">
                {t('resendIn')} {resendTimer}s
              </span>
            ) : (
              <button
                onClick={sendOTP}
                className="text-primary hover:underline"
              >
                {t('resendCode')}
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="flex-1"
        >
          {t('back')}
        </Button>
        <Button
          onClick={verifyOTP}
          className="flex-1"
          disabled={otpCode.length !== 6}
        >
          {t('verifyCode')}
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('learningProfile')}
        </h2>
        <p className="text-gray-600">{t('helpUsPersonalize')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('learningGoals')}
          </label>
          <textarea
            value={formData.learningGoals}
            onChange={(e) => handleInputChange('learningGoals', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
            placeholder={t('whatDoYouWantToAchieve')}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('currentExperienceLevel')}
          </label>
          <Select
            value={formData.experience}
            onValueChange={(value) => handleInputChange('experience', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                {t('beginnerLevel')} - {t('justStartingOut')}
              </SelectItem>
              <SelectItem value="elementary">
                {t('elementaryLevel')} - {t('basicKnowledge')}
              </SelectItem>
              <SelectItem value="intermediate">
                {t('intermediateLevel')} - {t('canCommunicate')}
              </SelectItem>
              <SelectItem value="advanced">
                {t('advancedLevel')} - {t('fluentWithMinorGaps')}
              </SelectItem>
              <SelectItem value="expert">
                {t('expertLevel')} - {t('nearNativeLevel')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            {t('subjectsInterestedIn')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject}
                variant={
                  formData.preferredSubjects.includes(subject)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer py-2 px-3 justify-center"
                onClick={() => handleSubjectToggle(subject)}
              >
                {subject}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500">{t('selectAllSubjects')}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(3)}
          className="flex-1"
        >
          {t('back')}
        </Button>
        <Button onClick={completeRegistration} className="flex-1">
          {t('completeRegistration')}
        </Button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcomeToTutorUZ')}
        </h2>
        <p className="text-gray-600 text-lg">
          {t('accountCreatedSuccessfully')}
          <br />
          {t('redirectedShortly')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">{t('whatsNext')}</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• {t('exploreFeaturedTeachers')}</li>
            <li>• {t('bookYourFirstLesson')}</li>
            <li>• {t('completeYourProfile')}</li>
            <li>• {t('startYourLearningJourney')}</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const progressPercentage = (currentStep / registrationSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('createStudentAccount')}
            </h1>
            <p className="text-gray-600">
              Join thousands of students learning with expert teachers
            </p>
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
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
