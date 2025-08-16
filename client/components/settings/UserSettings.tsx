import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  User,
  Bell,
  Shield,
  Eye,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Download,
  Upload,
  Camera,
  Save,
  AlertTriangle,
  CheckCircle,
  Key,
  CreditCard,
  Clock,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UserSettingsProps {
  className?: string;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ className }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+998901234567",
    bio: "",
    timezone: "Asia/Tashkent",
    language: "uz",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      bookingUpdates: true,
      paymentConfirmations: true,
      lessonReminders: true,
      messageNotifications: true,
      marketingEmails: false,
      weeklyReports: true,
    },
    sms: {
      urgentNotifications: true,
      lessonReminders: true,
      paymentUpdates: false,
    },
    push: {
      enabled: true,
      bookingUpdates: true,
      messages: true,
      lessonReminders: true,
      soundEnabled: true,
      quietHoursEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
    },
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public" as "public" | "private" | "students_only",
    showOnlineStatus: true,
    showLastSeen: true,
    allowDirectMessages: true,
    showReviews: true,
    showEarnings: false,
    dataCollection: true,
    analyticsOptOut: false,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: false,
    sessionTimeout: 30, // days
    loginNotifications: true,
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: "light" as "light" | "dark" | "system",
    fontSize: "medium" as "small" | "medium" | "large",
    compactMode: false,
    animationsEnabled: true,
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success("Profil ma'lumotlari saqlandi");
    } catch (error) {
      toast.error("Profil saqlanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // API call to update notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success("Bildirishnoma sozlamalari saqlandi");
    } catch (error) {
      toast.error("Sozlamalar saqlanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // API call to delete account
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
      toast.success("Hisob o'chirildi");
    } catch (error) {
      toast.error("Hisob o'chirilmadi");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleExportData = async () => {
    try {
      // API call to export user data
      toast.success("Ma'lumotlar export qilindi");
    } catch (error) {
      toast.error("Export qilinmadi");
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profil rasmi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Rasm yuklash
              </Button>
              <p className="text-sm text-gray-500">
                JPG, PNG yoki GIF. Maksimal o'lcham 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Asosiy ma'lumotlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Ism</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="lastName">Familiya</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon raqam</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="O'zingiz haqingizda qisqacha..."
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Sozlamalar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="timezone">Vaqt mintaqasi</Label>
            <Select
              value={profileData.timezone}
              onValueChange={(value) =>
                setProfileData((prev) => ({ ...prev, timezone: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Tashkent">Toshkent (UTC+5)</SelectItem>
                <SelectItem value="Asia/Almaty">Almaty (UTC+6)</SelectItem>
                <SelectItem value="Europe/Moscow">Moskva (UTC+3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Til</Label>
            <Select
              value={profileData.language}
              onValueChange={(value) =>
                setProfileData((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">O'zbek</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveProfile} disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email bildirishnomalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notificationSettings.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`email-${key}`} className="text-sm">
                {key === "bookingUpdates" && "Dars yangilanishlari"}
                {key === "paymentConfirmations" && "To'lov tasdiqlamalari"}
                {key === "lessonReminders" && "Dars eslatmalari"}
                {key === "messageNotifications" && "Yangi xabarlar"}
                {key === "marketingEmails" && "Marketing xabarlari"}
                {key === "weeklyReports" && "Haftalik hisobotlar"}
              </Label>
              <Switch
                id={`email-${key}`}
                checked={value}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    email: { ...prev.email, [key]: checked },
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS bildirishnomalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notificationSettings.sms).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`sms-${key}`} className="text-sm">
                {key === "urgentNotifications" &&
                  "Shoshilinch bildirishnomalar"}
                {key === "lessonReminders" && "Dars eslatmalari"}
                {key === "paymentUpdates" && "To'lov yangilanishlari"}
              </Label>
              <Switch
                id={`sms-${key}`}
                checked={value}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    sms: { ...prev.sms, [key]: checked },
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push bildirishnomalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-enabled" className="text-sm font-medium">
              Push bildirishnomalarni yoqish
            </Label>
            <Switch
              id="push-enabled"
              checked={notificationSettings.push.enabled}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  push: { ...prev.push, enabled: checked },
                }))
              }
            />
          </div>

          {notificationSettings.push.enabled && (
            <>
              {[
                "bookingUpdates",
                "messages",
                "lessonReminders",
                "soundEnabled",
              ].map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`push-${key}`} className="text-sm">
                    {key === "bookingUpdates" && "Dars yangilanishlari"}
                    {key === "messages" && "Yangi xabarlar"}
                    {key === "lessonReminders" && "Dars eslatmalari"}
                    {key === "soundEnabled" && "Ovozli bildirishnomalar"}
                  </Label>
                  <Switch
                    id={`push-${key}`}
                    checked={
                      notificationSettings.push[
                        key as keyof typeof notificationSettings.push
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: { ...prev.push, [key]: checked },
                      }))
                    }
                  />
                </div>
              ))}

              {/* Quiet Hours */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiet-hours" className="text-sm font-medium">
                    Tinch soatlar
                  </Label>
                  <Switch
                    id="quiet-hours"
                    checked={notificationSettings.push.quietHoursEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        push: { ...prev.push, quietHoursEnabled: checked },
                      }))
                    }
                  />
                </div>

                {notificationSettings.push.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet-start" className="text-xs">
                        Boshlanishi
                      </Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={notificationSettings.push.quietHoursStart}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            push: {
                              ...prev.push,
                              quietHoursStart: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end" className="text-xs">
                        Tugashi
                      </Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={notificationSettings.push.quietHoursEnd}
                        onChange={(e) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            push: {
                              ...prev.push,
                              quietHoursEnd: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSaveNotifications} disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profil ko'rinishi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profile-visibility">Profil ko'rinishi</Label>
            <Select
              value={privacySettings.profileVisibility}
              onValueChange={(value: any) =>
                setPrivacySettings((prev) => ({
                  ...prev,
                  profileVisibility: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Hammaga ochiq</SelectItem>
                <SelectItem value="students_only">
                  Faqat o'quvchilarga
                </SelectItem>
                <SelectItem value="private">Shaxsiy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {[
            { key: "showOnlineStatus", label: "Onlayn holatni ko'rsatish" },
            {
              key: "showLastSeen",
              label: "Oxirgi ko'rilgan vaqtni ko'rsatish",
            },
            {
              key: "allowDirectMessages",
              label: "To'g'ridan-to'g'ri xabarlarga ruxsat berish",
            },
            { key: "showReviews", label: "Sharhlarni ko'rsatish" },
            { key: "showEarnings", label: "Daromadni ko'rsatish" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm">
                {label}
              </Label>
              <Switch
                id={key}
                checked={
                  privacySettings[
                    key as keyof typeof privacySettings
                  ] as boolean
                }
                onCheckedChange={(checked) =>
                  setPrivacySettings((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ma'lumotlar va analitika</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-collection" className="text-sm">
              Ma'lumotlar to'plashga ruxsat berish
            </Label>
            <Switch
              id="data-collection"
              checked={privacySettings.dataCollection}
              onCheckedChange={(checked) =>
                setPrivacySettings((prev) => ({
                  ...prev,
                  dataCollection: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="analytics-opt-out" className="text-sm">
              Analitikadan chiqish
            </Label>
            <Switch
              id="analytics-opt-out"
              checked={privacySettings.analyticsOptOut}
              onCheckedChange={(checked) =>
                setPrivacySettings((prev) => ({
                  ...prev,
                  analyticsOptOut: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Hisobni himoyalash
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Ikki faktorli autentifikatsiya
              </Label>
              <p className="text-xs text-gray-500">
                Qo'shimcha xavfsizlik qatlami
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  twoFactorEnabled: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Email tasdiqlangan</Label>
              {securitySettings.emailVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            {!securitySettings.emailVerified && (
              <Button variant="outline" size="sm">
                Tasdiqlash
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Telefon tasdiqlangan</Label>
              {securitySettings.phoneVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            {!securitySettings.phoneVerified && (
              <Button variant="outline" size="sm">
                Tasdiqlash
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessiya sozlamalari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="session-timeout">Sessiya vaqti tugashi (kun)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value) || 30,
                }))
              }
              min="1"
              max="365"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="login-notifications" className="text-sm">
              Kirish bildirishnomalar
            </Label>
            <Switch
              id="login-notifications"
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  loginNotifications: checked,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parolni o'zgartirish</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" placeholder="Hozirgi parol" />
          <Input type="password" placeholder="Yangi parol" />
          <Input type="password" placeholder="Yangi parolni takrorlang" />
          <Button>
            <Key className="h-4 w-4 mr-2" />
            Parolni o'zgartirish
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ma'lumotlarni export qilish</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Barcha shaxsiy ma'lumotlaringizni JSON formatida yuklab oling
          </p>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Ma'lumotlarni export qilish
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Hisobni o'chirish</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Bu amalni bekor qilib bo'lmaydi. Barcha ma'lumotlaringiz butunlay
              o'chiriladi.
            </AlertDescription>
          </Alert>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Hisobni o'chirish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hisobni o'chirishni tasdiqlang</DialogTitle>
                <DialogDescription>
                  Bu amalni bekor qilib bo'lmaydi. Barcha ma'lumotlaringiz,
                  darslaringiz va to'lovlaringiz butunlay o'chiriladi.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Input placeholder="Tasdiqlash uchun 'DELETE' deb yozing" />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    className="flex-1"
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "O'chirilmoqda..." : "O'chirish"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    {
      id: "profile",
      label: "Profil",
      icon: User,
      content: renderProfileSettings,
    },
    {
      id: "notifications",
      label: "Bildirishnomalar",
      icon: Bell,
      content: renderNotificationSettings,
    },
    {
      id: "privacy",
      label: "Maxfiylik",
      icon: Eye,
      content: renderPrivacySettings,
    },
    {
      id: "security",
      label: "Xavfsizlik",
      icon: Shield,
      content: renderSecuritySettings,
    },
    {
      id: "data",
      label: "Ma'lumotlar",
      icon: Download,
      content: renderDataSettings,
    },
  ];

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
          <p className="text-gray-600">
            Hisobingizni va sozlamalaringizni boshqaring
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(({ id, content }) => (
            <TabsContent key={id} value={id} className="mt-6">
              {content()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
