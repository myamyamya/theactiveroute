"use client";

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={() => switchLocale('en')}
        className={`text-2xl transition-transform hover:scale-110 ${locale === 'en' ? 'opacity-100 ring-2 ring-blue-500 rounded-full' : 'opacity-60 hover:opacity-100'}`}
        title="English"
      >
        🇬🇧
      </button>
      <button 
        onClick={() => switchLocale('tr')}
        className={`text-2xl transition-transform hover:scale-110 ${locale === 'tr' ? 'opacity-100 ring-2 ring-red-500 rounded-full' : 'opacity-60 hover:opacity-100'}`}
        title="Türkçe"
      >
        🇹🇷
      </button>
    </div>
  );
}
