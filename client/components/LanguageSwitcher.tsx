import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'uz', flag: '🇺🇿' },
  { code: 'ru', flag: 'ру' },
  { code: 'en', flag: 'en' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === i18n.language) || languages[0]
  }

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="px-0">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 outline-none focus:outline-none"
        >
          <Globe className="h-4 w-4" />
          <span>{getCurrentLanguage().flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[50px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer  flex justify-center ${
              i18n.language === language.code ? 'bg-gray-100' : ''
            }`}
          >
            {language.flag}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
