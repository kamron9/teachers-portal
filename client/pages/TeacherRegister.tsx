import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Loader2, Mail, Phone, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

type RegistrationStep =
  | 'method'
  | 'verify'
  | 'basic'
  | 'qualifications'
  | 'complete'
type VerificationMethod = 'sms' | 'email'

export default function TeacherRegister() {
  const { t } = useTranslation()
  const [step, setStep] = useState<RegistrationStep>('method')
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>('sms')
  const [isLoading, setIsLoading] = useState(false)
  const [contact, setContact] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // Format phone number function
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')

    // If it starts with 998, add +
    if (digits.startsWith('998')) {
      const phoneDigits = digits.slice(3)
      if (phoneDigits.length === 0) return '+998 '
      if (phoneDigits.length <= 2) return `+998 ${phoneDigits}`
      if (phoneDigits.length <= 5)
        return `+998 ${phoneDigits.slice(0, 2)} ${phoneDigits.slice(2)}`
      if (phoneDigits.length <= 7)
        return `+998 ${phoneDigits.slice(0, 2)} ${phoneDigits.slice(2, 5)} ${phoneDigits.slice(5)}`
      return `+998 ${phoneDigits.slice(0, 2)} ${phoneDigits.slice(2, 5)} ${phoneDigits.slice(5, 7)} ${phoneDigits.slice(7, 9)}`
    }

    // If it doesn't start with 998, add +998 prefix
    if (digits.length === 0) return '+998 '
    if (digits.length <= 2) return `+998 ${digits}`
    if (digits.length <= 5)
      return `+998 ${digits.slice(0, 2)} ${digits.slice(2)}`
    if (digits.length <= 7)
      return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
  }

  const handlePhoneChange = (value: string) => {
    if (verificationMethod === 'sms') {
      // If user deletes everything, reset to +998
      if (value === '' || value === '+') {
        setContact('+998 ')
        return
      }

      // Don't allow deleting +998 prefix
      if (!value.startsWith('+998')) {
        return
      }

      // Format the phone number
      const formatted = formatPhoneNumber(value)
      setContact(formatted)
    } else {
      setContact(value)
    }
  }

  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    experience: '',
    languages: [] as string[],
    subjects: [] as string[],
    hourlyRate: '',
  })

  const [qualifications, setQualifications] = useState({
    education: '',
    certifications: [] as string[],
    teachingExperience: '',
    specializations: [] as string[],
    references: '',
    hasOnlineExperience: false,
  })

  const languages = [
    t('uzbek'),
    t('englishLanguage'),
    t('russian'),
    t('subjectArabic'),
    t('teacherLangTurkish'),
    t('teacherLangKorean'),
    t('teacherLangChinese'),
    t('teacherLangFrench'),
    t('teacherLangGerman'),
    t('teacherLangSpanish'),
  ]
  const subjects = [
    t('subjectMathematics'),
    t('subjectEnglish'),
    t('subjectProgramming'),
    t('subjectPhysics'),
    t('subjectChemistry'),
    t('subjectBiology'),
    t('subjectHistory'),
    t('teacherSubjectGeography'),
    t('teacherSubjectLiterature'),
    t('teacherSubjectMusic'),
    t('teacherSubjectArt'),
    t('teacherSubjectEconomics'),
    t('subjectPsychology'),
  ]

  const certificationOptions = [
    t('teacherCertTesol'),
    t('teacherCertIelts'),
    t('teacherCertUniversity'),
    t('teacherCertTeaching'),
    t('teacherCertProfessional'),
    t('teacherCertIndustry'),
  ]

  // Initialize phone number with +998 when SMS verification is selected
  useEffect(() => {
    if (verificationMethod === 'sms' && !contact) {
      setContact('+998 ')
    }
  }, [verificationMethod])

  const handleSendVerification = async () => {
    if (verificationMethod === 'sms') {
      // Check if phone number is complete (should be +998 XX XXX XX XX format)
      const phoneRegex = /^\+998 \d{2} \d{3} \d{2} \d{2}$/
      if (!phoneRegex.test(contact)) {
        toast.error(t('validPhoneRequired'))
        return
      }
    }

    if (verificationMethod === 'email' && !contact.includes('@')) {
      toast.error(t('validEmailRequired'))
      return
    }

    setIsLoading(true)
    // Simulate API call to send verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep('verify')
    setResendTimer(60)

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error(t('teacherEnterFullCode'))
      return
    }

    setIsLoading(true)
    // Simulate API call to verify code
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep('basic')
  }

  const handleBasicInfoSubmit = async () => {
    if (
      !basicInfo.firstName ||
      !basicInfo.lastName ||
      !basicInfo.bio ||
      !basicInfo.hourlyRate
    ) {
      toast.error(t('teacherFillAllRequired'))
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setStep('qualifications')
  }

  const handleCompleteRegistration = async () => {
    if (!qualifications.education || !qualifications.teachingExperience) {
      toast.error(t('teacherEnterEducationExperience'))
      return
    }

    setIsLoading(true)
    // Simulate API call to complete registration
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep('complete')
  }

  const toggleLanguage = (language: string) => {
    setBasicInfo((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const toggleSubject = (subject: string) => {
    setBasicInfo((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const toggleCertification = (cert: string) => {
    setQualifications((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }))
  }

  return (
    <div className="pt-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('teacherBecomeTeacher')}
            </h1>
            <p className="text-gray-600">{t('teacherJoinCommunity')}</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="relative">
              {/* Background line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200"></div>

              {/* Progress line */}
              <div
                className="absolute top-4 left-4 h-0.5 bg-green-500 transition-all duration-300"
                style={{
                  width: `${Math.max(0, ['method', 'verify', 'basic', 'qualifications'].indexOf(step) * 25)}%`,
                }}
              ></div>

              {/* Step circles */}
              <div className="relative flex justify-between">
                {(
                  [
                    'method',
                    'verify',
                    'basic',
                    'qualifications',
                    'complete',
                  ] as const
                ).map((s, index) => {
                  const currentStepIndex = [
                    'method',
                    'verify',
                    'basic',
                    'qualifications',
                    'complete',
                  ].indexOf(step)
                  const isCompleted = currentStepIndex > index
                  const isCurrent = currentStepIndex === index

                  const stepLabels = [
                    t('teacherMethod'),
                    t('teacherVerify'),
                    t('teacherBasicInfoLabel'),
                    t('teacherQualificationsLabel'),
                    t('teacherDone'),
                  ]

                  return (
                    <div key={s} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white transition-all duration-300 ${
                          isCurrent
                            ? 'border-primary bg-primary text-primary'
                            : isCompleted
                              ? 'border-green-500 bg-green-500 text-green-500'
                              : 'border-gray-300 bg-white text-gray-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`text-xs  mt-2 text-center ${isCompleted ? 'text-green-500' : 'text-gray-500'}`}
                      >
                        {stepLabels[index]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {step === 'method' && t('teacherVerificationMethod')}
                {step === 'verify' && t('teacherConfirmInformation')}
                {step === 'basic' && t('teacherBasicInfo')}
                {step === 'qualifications' && t('teacherTeachingQualification')}
                {step === 'complete' && t('teacherWelcomeToTutorUZ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Verification Method Selection */}
              {step === 'method' && (
                <div className="space-y-6">
                  <div className="text-center text-sm text-gray-600 mb-6">
                    {t('teacherChooseAccountVerification')}
                  </div>

                  <RadioGroup
                    value={verificationMethod}
                    onValueChange={(value: VerificationMethod) =>
                      setVerificationMethod(value)
                    }
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="sms" id="sms" />
                        <label
                          htmlFor="sms"
                          className="flex-1 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">
                                {t('teacherSmsVerification')}
                              </div>
                              <div className="text-sm text-gray-600">
                                {t('teacherConfirmViaPhone')}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {t('teacherRecommended')}
                          </Badge>
                        </label>
                      </div>

                      {/* <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <label
                          htmlFor="email"
                          className="flex-1 flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">
                                Email tasdiqlash
                              </div>
                              <div className="text-sm text-gray-600">
                                Email manzilingiz orqali tasdiqlang
                              </div>
                            </div>
                          </div>
                        </label>
                      </div> */}
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="contact">
                      {verificationMethod === 'sms'
                        ? t('teacherPhoneNumber')
                        : t('teacherEmailAddress')}
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
                        value={
                          contact ||
                          (verificationMethod === 'sms' ? '+998 ' : '')
                        }
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="pl-10"
                        maxLength={
                          verificationMethod === 'sms' ? 17 : undefined
                        }
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
                        {t('teacherSendingCode')}
                      </>
                    ) : (
                      t('teacherSendVerificationCode')
                    )}
                  </Button>
                </div>
              )}

              {/* Verification Code */}
              {step === 'verify' && (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    {t('teacherEnterSixDigitCode')}
                    <br />
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
                          {t('teacherResendCodeIn')} {resendTimer}s
                        </p>
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleSendVerification}
                          disabled={isLoading}
                        >
                          {t('teacherResendVerificationCode')}
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
                        {t('teacherVerifying')}
                      </>
                    ) : (
                      t('teacherVerifyCode')
                    )}
                  </Button>
                </div>
              )}

              {/* Basic Information */}
              {step === 'basic' && (
                <div className="space-y-6">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    <Shield className="h-5 w-5 text-green-500 inline mr-1" />
                    {t('teacherContactVerified')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {t('teacherFirstName')} *
                      </Label>
                      <Input
                        id="firstName"
                        value={basicInfo.firstName}
                        onChange={(e) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder={t('teacherFirstNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('teacherLastName')} *</Label>
                      <Input
                        id="lastName"
                        value={basicInfo.lastName}
                        onChange={(e) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder={t('teacherLastNamePlaceholder')}
                      />
                    </div>
                  </div>

                  {verificationMethod === 'sms' && (
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('teacherEmailAddress')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder={t('teacherEmailPlaceholder')}
                      />
                    </div>
                  )}

                  {verificationMethod === 'email' && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('teacherPhoneNumber')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={basicInfo.phone}
                        onChange={(e) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+998901234567"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('teacherProfessionalBio')} *</Label>
                    <Textarea
                      id="bio"
                      value={basicInfo.bio}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder={t('teacherBioPlaceholder')}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      {t('teachingExperienceYears')} *
                    </Label>
                    <Select
                      value={basicInfo.experience}
                      onValueChange={(value) =>
                        setBasicInfo((prev) => ({ ...prev, experience: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('teacherSelectExperienceLevel')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">
                          {t('teacherLessThanYear')}
                        </SelectItem>
                        <SelectItem value="1-2">
                          {t('teacher1to2Years')}
                        </SelectItem>
                        <SelectItem value="3-5">
                          {t('teacher3to5Years')}
                        </SelectItem>
                        <SelectItem value="6-10">
                          {t('teacher6to10Years')}
                        </SelectItem>
                        <SelectItem value="10+">
                          {t('teacher10PlusYears')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>{t('teacherTeachingLanguages')} *</Label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge
                          key={language}
                          variant={
                            basicInfo.languages.includes(language)
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => toggleLanguage(language)}
                        >
                          {t(language)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>{t('teacherSubjectsYouTeach')} *</Label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant={
                            basicInfo.subjects.includes(subject)
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => toggleSubject(subject)}
                        >
                          {t(subject)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">
                      {t('teacherHourlyRate')} *
                    </Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={basicInfo.hourlyRate}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          hourlyRate: e.target.value,
                        }))
                      }
                      placeholder="50000"
                    />
                    <p className="text-xs text-gray-500">
                      {t('teacherHourlyRateDescription')}
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
                        {t('teacherSaving')}
                      </>
                    ) : (
                      t('teacherContinue')
                    )}
                  </Button>
                </div>
              )}

              {/* Qualifications */}
              {step === 'qualifications' && (
                <div className="space-y-6">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    {t('teacherHelpStudentsUnderstand')}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">
                      {t('teacherEducationBackground')} *
                    </Label>
                    <Textarea
                      id="education"
                      value={qualifications.education}
                      onChange={(e) =>
                        setQualifications((prev) => ({
                          ...prev,
                          education: e.target.value,
                        }))
                      }
                      placeholder={t('teacherEducationPlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{t('teacherCertificationsQualifications')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {certificationOptions.map((cert) => (
                        <Badge
                          key={cert}
                          variant={
                            qualifications.certifications.includes(cert)
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => toggleCertification(cert)}
                        >
                          {t(cert)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingExperience">
                      {t('teacherTeachingExperienceDetails')} *
                    </Label>
                    <Textarea
                      id="teachingExperience"
                      value={qualifications.teachingExperience}
                      onChange={(e) =>
                        setQualifications((prev) => ({
                          ...prev,
                          teachingExperience: e.target.value,
                        }))
                      }
                      placeholder={t('teacherTeachingExperiencePlaceholder')}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references">
                      {t('teacherProfessionalReferences')}
                    </Label>
                    <Textarea
                      id="references"
                      value={qualifications.references}
                      onChange={(e) =>
                        setQualifications((prev) => ({
                          ...prev,
                          references: e.target.value,
                        }))
                      }
                      placeholder={t('teacherReferencesPlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="onlineExperience"
                      checked={qualifications.hasOnlineExperience}
                      onCheckedChange={(checked) =>
                        setQualifications((prev) => ({
                          ...prev,
                          hasOnlineExperience: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="onlineExperience" className="text-sm">
                      {t('teacherHaveOnlineExperience')}
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
                        {t('teacherCreatingAccount')}
                      </>
                    ) : (
                      t('teacherCompleteRegistration')
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
                      {t('teacherRegistrationSubmitted')}
                    </h3>
                    <p className="text-gray-600">
                      {t('teacherWelcomeMessage', {
                        firstName: basicInfo.firstName,
                      })}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <h4 className="font-medium mb-2">
                      {t('teacherWhatsNext')}
                    </h4>
                    <ul className="text-left space-y-1">
                      <li>• {t('teacherTeamReview')}</li>
                      <li>• {t('teacherMayContact')}</li>
                      <li>• {t('teacherOnceApproved')}</li>
                      <li>• {t('teacherStartReceiving')}</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Link to="/teacher-dashboard">
                      <Button className="w-full" size="lg">
                        {t('teacherGoToDashboard')}
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
                {t('teacherAlreadyHaveAccount')}{' '}
                <Link
                  to="/teacher-login"
                  className="text-primary hover:underline font-medium"
                >
                  {t('teacherSignInHere')}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
