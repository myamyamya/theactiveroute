import { useTranslations } from 'next-intl';

export default function TermsPage(){
  const t = useTranslations('TermsPage');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose dark:prose-invert">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>
        <p><strong>{t('lastUpdatedLabel')}</strong> {t('lastUpdated')}</p>
        <span></span>{"\u00a0"}

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. {t('agreementTitle')}</h2>
        <p>{t('agreementText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. {t('natureTitle')}</h2>
        <p>{t('natureText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. {t('accuracyTitle')}</h2>
        <p>{t('accuracyText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. {t('liabilityTitle')}</h2>
        <p>{t('liabilityText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. {t('ipTitle')}</h2>
        <p>{t('ipText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">6. {t('externalTitle')}</h2>
        <p>{t('externalText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">7. {t('changesTitle')}</h2>
        <p>{t('changesText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">8. {t('governingTitle')}</h2>
        <p>{t('governingText')}</p>
        </section>

        <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">9. {t('contactTitle')}</h2>
        <p>{t('contactText')}</p>
        </section>
      </article>
    </div>
  );
}
