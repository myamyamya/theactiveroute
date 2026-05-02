import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('PrivacyPage');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('introductionTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('introduction')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('infoTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('info')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('useTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('use')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('cookiesTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('cookies')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('thirdPartyTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('thirdParty')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('rightsTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('rights')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{t('contactTitle')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('contact')}</p>
      </section>

    </div>
  );
}
