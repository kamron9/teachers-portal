import { LogOut, MessageCircle, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  const navigation = [
    { name: 'Asosiy', href: '/' },
    { name: "O'qtuvchi qidirish", href: '/teachers' },
    { name: 'Fanlar', href: '/subjects' },
  ]
  const isAuthenticated = false // This will be replaced with actual auth state
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col space-y-4 mt-4 mb-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-md font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {!isAuthenticated ? (
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/login">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => (window.location.href = '/api/login')}
                >
                  Kirish
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = '/api/login')}
                >
                  O'qtuvchi bo'lish
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/messages" data-testid="link-mobile-messages">
                <Button variant="ghost" className="justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
                </Button>
              </Link>
              <Link to="/profile" data-testid="link-mobile-profile">
                <Button variant="ghost" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => (window.location.href = '/api/logout')}
                data-testid="button-mobile-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileMenu
