import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-center mt-6">
          <Image
            src="/logo.png"
            alt={t('imageAlt')}
            width={640}
            height={480}
            loading="eager"
            className="w-full max-w-3xl h-auto rounded-md shadow"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{t('mission')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('note')}</p>
          <p className="text-base text-gray-700 dark:text-gray-300">{t('vision')}</p>
          <p className="text-base text-gray-700 dark:text-gray-300">{t('howWeHelp')}</p>
        </div>

        {/* Image placed at the end */}
        <div className="flex items-center justify-center mt-6">
          <Image
            src="/about2.png"
            alt={t('aboutImageAlt')}
            width={640}
            height={480}
            loading="eager"
            className="w-full max-w-3xl h-auto rounded-md shadow"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      </div>
    </div>
  );
}
