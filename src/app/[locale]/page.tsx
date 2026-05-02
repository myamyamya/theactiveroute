import { useTranslations } from 'next-intl';
import eventsData from '@/calendar/events_2.json';
import { SportEvent } from '@/types/event';
import EventList from '@/components/EventList';

export default function Home() {
  const t = useTranslations('HomePage');
  const events = eventsData as SportEvent[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          {t.rich('description', {
            templateLink: (chunks) => <span className="font-semibold text-blue-600 dark:text-blue-400">{chunks}</span>,
            learningLink: (chunks) => <span className="font-semibold text-blue-600 dark:text-blue-400">{chunks}</span>
          })}
        </p>
      </div>

      <EventList events={events} />
    </div>
  );
}
