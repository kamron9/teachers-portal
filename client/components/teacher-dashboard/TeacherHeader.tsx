import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SidebarItem } from '../../pages/TeacherDashboard'

interface TeacherHeaderProps {
  activeSection: string
  sidebarItems: SidebarItem[]
  unreadMessages: number
}

export function TeacherHeader({
  activeSection,
  sidebarItems,
  unreadMessages,
}: TeacherHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {sidebarItems.find((item) => item.id === activeSection)?.label ||
              t('dashboard')}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadMessages > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                {unreadMessages}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Link to="/">
            <Button variant="outline" size="sm">
              {t('backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
