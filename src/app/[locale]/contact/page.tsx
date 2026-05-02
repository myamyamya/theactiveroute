import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{t('description')}</p>

      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <strong>{t('emailLabel')}:</strong>{' '}
          <a href={`mailto:${t('email')}`} className="text-blue-600 hover:underline">{t('email')}</a>
        </div>

        <div>
          <strong>{t('submitLabel')}:</strong>
          <p className="mt-2">{t('submitNote')}</p>
        </div>

        <div className="pt-4 text-gray-500 text-xs">{t('privacyNote')}</div>
      </div>
    </div>
  );
}
