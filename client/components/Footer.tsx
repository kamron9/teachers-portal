import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'


const Footer = () => {
	const { t } = useTranslation()
	return (
		<footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TutorUZ</span>
              </div>
              <p className="text-gray-400">{t('footerDescription')}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footerHelp')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white">
                    {t('footerSupport')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footerCompany')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white">
                    {t('footerAboutUs')}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white">
                    {t('footerCareers')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footerContact')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+998 90 123 45 67</li>
                <li>info@tutoruz.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footerCopyright')}</p>
          </div>
        </div>
      </footer>
	)
}

export default Footer