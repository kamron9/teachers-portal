import { LogOut, MessageCircle, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('searchTeachers'), href: '/teachers' },
    { name: t('subjects'), href: '/subjects' },
  ]

  const isAuthenticated = false // This will be replaced with actual auth state

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const handleButtonClick = (action?: () => void) => {
    setIsOpen(false)
    if (action) action()
  }
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col space-y-4 mt-4 mb-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
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
              <Link to="/login" onClick={handleLinkClick}>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleButtonClick(() => navigate('/login'))}
                >
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register" onClick={handleLinkClick}>
                <Button
                  className="w-full"
                  onClick={() =>
                    handleButtonClick(() => navigate('/teacher-signup'))
                  }
                >
                  {t('becomeTeacher')}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/messages" onClick={handleLinkClick}>
                <Button variant="ghost" className="justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t('messages')}
                </Button>
              </Link>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                data-testid="link-mobile-profile"
              >
                <Button variant="ghost" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  {t('profile')}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleButtonClick()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileMenu
