import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className="container mt-5 text-center">
      <h1>{t('notFound.title')}</h1>
      <Link to="/">{t('notFound.link')}</Link>
    </div>
  )
}

export default NotFoundPage
