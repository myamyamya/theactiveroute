"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">{t('copyright', { year })}</div>
        <div className="flex items-center space-x-4">
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">{t('privacy')}</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">{t('terms')}</Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">{t('contact')}</Link>
        </div>
      </div>
    </footer>
  );
}
