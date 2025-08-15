import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, BookOpen, MessageCircle, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth, useRole } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useApi";

const navigation = [
  { name: "Bosh sahifa", href: "/" },
  { name: "O'qituvchilar", href: "/teachers" },
  { name: "Fanlar", href: "/subjects" },
  { name: "Qanday ishlaydi", href: "/how-it-works" },
  { name: "Narxlar", href: "/pricing" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isStudent, isTeacher, isAdmin } = useRole();

  // Get unread notifications count
  const { data: notificationsData } = useNotifications(
    { isRead: false, limit: 1 },
    { enabled: isAuthenticated }
  );
  const unreadCount = notificationsData?.unreadCount || 0;

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    // This would need to be enhanced to get the actual profile data
    return user.email.split('@')[0];
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getDashboardLink = () => {
    if (isTeacher) return '/teacher-dashboard';
    if (isStudent) return '/student-dashboard';
    if (isAdmin) return '/admin-dashboard';
    return '/';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TutorUZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Language switcher and Auth buttons or user menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel>Bildirishnomalar</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      {unreadCount === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Yangi bildirishnomalar yo'q
                        </p>
                      ) : (
                        <Link to="/notifications" className="block">
                          <Button variant="ghost" className="w-full justify-start">
                            Barcha bildirishnomalarni ko'rish ({unreadCount})
                          </Button>
                        </Link>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={getUserDisplayName()} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Bosh sahifa</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    {(isTeacher || isStudent) && (
                      <DropdownMenuItem asChild>
                        <Link to={isTeacher ? "/teacher/lessons" : "/student/lessons"}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Darslarim</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/messages">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>Xabarlar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Sozlamalar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Chiqish</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Kirish</Button>
                </Link>
                <Link to="/register">
                  <Button>Ro'yxatdan o'tish</Button>
                </Link>
                <Link to="/teacher-signup">
                  <Button variant="outline">O'qituvchi bo'ling</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-gray-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    {/* User info */}
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-md">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={getUserDisplayName()} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </div>

                    {/* Menu items */}
                    <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Bosh sahifa
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Button>
                    </Link>
                    {(isTeacher || isStudent) && (
                      <Link to={isTeacher ? "/teacher/lessons" : "/student/lessons"} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Darslarim
                        </Button>
                      </Link>
                    )}
                    <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Xabarlar
                      </Button>
                    </Link>
                    <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Bell className="mr-2 h-4 w-4" />
                        Bildirishnomalar
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 w-5 text-xs p-0 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Sozlamalar
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Chiqish
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Kirish
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Ro'yxatdan o'tish</Button>
                    </Link>
                    <Link to="/teacher-signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        O'qituvchi bo'ling
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
