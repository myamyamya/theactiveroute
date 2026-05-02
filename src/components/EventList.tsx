"use client";

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useTranslations, useLocale } from 'next-intl';
import { tr, enUS } from 'date-fns/locale';
import { SportEvent } from '@/types/event';
import EventCard from './EventCard';

export default function EventList({ events }: { events: SportEvent[] }) {
  const t = useTranslations('EventFilter');
  const tCard = useTranslations('EventCard');
  const tTypes = useTranslations('EventTypes');
  const curLocale = useLocale();
  const dateLocale = curLocale === 'tr' ? tr : enUS;
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTimespan, setSelectedTimespan] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract unique event types, filtering out falsy/Unknown values
  const eventTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach(event => {
      if (event.eventType && event.eventType !== "Unknown") {
        types.add(event.eventType);
      }
    });
    return Array.from(types).sort();
  }, [events]);

  // Build unique status list from events using same logic as filtering
  const eventStatuses = useMemo(() => {
    const parseDate = (dateStr: string) => {
      if (!dateStr) return new Date(NaN);
      try {
        const datePart = dateStr.split('T')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        return new Date(year, month - 1, day);
      } catch {
        return new Date(NaN);
      }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statuses = new Set<string>();
    events.forEach(ev => {
      const start = parseDate(ev.startDate);
      const end = parseDate(ev.endDate);
      const validStart = start instanceof Date && !isNaN(start.getTime());
      const validEnd = end instanceof Date && !isNaN(end.getTime());

      const isOngoing = validStart && validEnd && ((today >= start) && (today <= end));
      const isUpcoming = validStart && (today < start);

      let s = 'past';
      if (isOngoing) s = 'ongoing';
      else if (isUpcoming) s = 'upcoming';
      else if (!validStart) s = 'tba';

      statuses.add(s);
    });

    return Array.from(statuses);
  }, [events]);

  // Timespan options
  const timespanOptions = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const nextMonthDate = new Date(year, month + 1, 1);
    const secondNextMonthDate = new Date(year, month + 2, 1);
    const thirdNextMonthDate = new Date(year, month + 3, 1);

    return [
      { id: 'nextWeek', label: t('nextWeek') },
      { id: 'next2Weeks', label: t('next2Weeks') },
      { id: 'thisMonth', label: t('thisMonth') },
      { id: 'nextMonth', label: format(nextMonthDate, 'MMMM', { locale: dateLocale }) },
      { id: 'secondNextMonth', label: format(secondNextMonthDate, 'MMMM', { locale: dateLocale }) },
      { id: 'thirdNextMonth', label: format(thirdNextMonthDate, 'MMMM', { locale: dateLocale }) },
      { id: 'thisQuarter', label: t('thisQuarter') },
      { id: 'thisYear', label: t('thisYear') }
    ];
  }, []);

  const filteredEvents = useMemo(() => {
    // Helper: compute status for an event using dates
    const parseDate = (dateStr: string) => {
      if (!dateStr) return new Date(NaN);
      try {
        const datePart = dateStr.split('T')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        return new Date(year, month - 1, day);
      } catch {
        return new Date(NaN);
      }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function eventStatusLabel(ev: SportEvent) {
      const start = parseDate(ev.startDate);
      const end = parseDate(ev.endDate);
      const validStart = start instanceof Date && !isNaN(start.getTime());
      const validEnd = end instanceof Date && !isNaN(end.getTime());

      const isOngoing = validStart && validEnd && ((today >= start) && (today <= end));
      const isUpcoming = validStart && (today < start);

      if (isOngoing) return 'ongoing';
      if (isUpcoming) return 'upcoming';
      if (!validStart) return 'tba';
      return 'past';
    }

    return events.filter(ev => {
      // Type filter
      if (selectedTypes && selectedTypes.length > 0) {
        if (!ev.eventType || !selectedTypes.includes(ev.eventType)) return false;
      }

      // Status filter
      if (selectedStatuses && selectedStatuses.length > 0) {
        const s = eventStatusLabel(ev);
        if (!selectedStatuses.includes(s)) return false;
      }

      // Timespan filter (single-select)
      if (selectedTimespan) {
        const start = parseDate(ev.startDate);
        const end = parseDate(ev.endDate);
        const today = new Date();
        today.setHours(0,0,0,0);

        // invalid start -> exclude
        if (!(start instanceof Date) || isNaN(start.getTime())) return false;

        const isOngoing = (end instanceof Date && !isNaN(end.getTime())) && start <= today && end >= today;

        const matches = (() => {
          const ts = selectedTimespan;
          if (!ts) return true;

          if (ts === 'nextWeek') {
            const endRange = new Date(today);
            endRange.setDate(endRange.getDate() + 7);
            return isOngoing || (start >= today && start <= endRange);
          }

          if (ts === 'next2Weeks') {
            const endRange = new Date(today);
            endRange.setDate(endRange.getDate() + 14);
            return isOngoing || (start >= today && start <= endRange);
          }

          if (ts === 'thisMonth') {
            return start.getFullYear() === today.getFullYear() && start.getMonth() === today.getMonth();
          }

          if (ts === 'nextMonth') {
            const nm = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            return start.getFullYear() === nm.getFullYear() && start.getMonth() === nm.getMonth();
          }

          if (ts === 'secondNextMonth') {
            const nm = new Date(today.getFullYear(), today.getMonth() + 2, 1);
            return start.getFullYear() === nm.getFullYear() && start.getMonth() === nm.getMonth();
          }

          if (ts === 'thirdNextMonth') {
            const nm = new Date(today.getFullYear(), today.getMonth() + 3, 1);
            return start.getFullYear() === nm.getFullYear() && start.getMonth() === nm.getMonth();
          }

          if (ts === 'thisQuarter') {
            const q = Math.floor(today.getMonth() / 3);
            const qStart = new Date(today.getFullYear(), q * 3, 1);
            const qEnd = new Date(today.getFullYear(), q * 3 + 3, 0);
            // Include events that are ongoing OR that start later this quarter (exclude past-started-and-ended events)
            return isOngoing || (start >= today && start <= qEnd);
          }

          if (ts === 'thisYear') {
            const yEnd = new Date(today.getFullYear(), 11, 31);
            return isOngoing || (start >= today && start <= yEnd);
          }

          return false;
        })();

        if (!matches) return false;
      }

      return true;
    });
  }, [events, selectedTypes, selectedStatuses, selectedTimespan]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 pb-4">
        {/* Toggle button */}
        <div className="mb-3">
          <button
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(v => !v)}
            className={`inline-flex items-center justify-center rounded-full font-semibold text-sm transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              filtersOpen ? 'px-5 py-3 scale-105 bg-blue-600 text-white shadow-md' : 'px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {filtersOpen ? t('hideFilters') || 'Hide Filters' : t('showFilters') || 'Show Filters'}
          </button>
        </div>

        <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${filtersOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>

          {/* Event Type group */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {/* We'll compute stagger delays so buttons fade/slide in sequence */}
              {(() => {
                const typeBase = 0;
                const statusBase = typeBase + 1 + eventTypes.length;
                const timespanBase = statusBase + 1 + eventStatuses.length;
                const totalButtons = 1 + eventTypes.length + 1 + eventStatuses.length + 1 + timespanOptions.length;

                const delayFor = (pos: number) => filtersOpen ? `${pos * 40}ms` : `${(totalButtons - pos) * 25}ms`;

                return (
                  <>
                    <button
                      onClick={() => setSelectedTypes([])}
                      aria-pressed={selectedTypes.length === 0}
                      style={{ transitionDelay: delayFor(typeBase) }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity transition-transform duration-300 whitespace-nowrap truncate max-w-[160px] ${
                        selectedTypes.length === 0
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-gray-700"
                      } ${filtersOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                    >
                      {t('all')}
                    </button>

                    {eventTypes.map((type, i) => {
                      const pos = typeBase + 1 + i;
                      const isSelected = selectedTypes.includes(type);
                      const translated = (() => {
                        try {
                          const v = tTypes(type as any);
                          return v || type;
                        } catch {
                          return type;
                        }
                      })();

                      return (
                        <button
                          key={type}
                          onClick={() => {
                            setSelectedTypes(prev =>
                              prev.includes(type) ? prev.filter(p => p !== type) : [...prev, type]
                            );
                          }}
                          aria-pressed={isSelected}
                          style={{ transitionDelay: delayFor(pos) }}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity transition-transform duration-300 whitespace-nowrap truncate max-w-[160px] ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-md scale-105"
                              : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-gray-700"
                          } ${filtersOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                        >
                          {translated}
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>

          {/* separator */}
          <hr className="border-t border-gray-200 my-3" />

          {/* Status group */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {(() => {
                const typeBase = 0;
                const statusBase = typeBase + 1 + eventTypes.length;
                const timespanBase = statusBase + 1 + eventStatuses.length;
                const totalButtons = 1 + eventTypes.length + 1 + eventStatuses.length + 1 + timespanOptions.length;
                const delayFor = (pos: number) => filtersOpen ? `${pos * 40}ms` : `${(totalButtons - pos) * 25}ms`;

                const statusAllPos = statusBase;

                return (
                  <>
                    <button
                      onClick={() => setSelectedStatuses([])}
                      aria-pressed={selectedStatuses.length === 0}
                      style={{ transitionDelay: delayFor(statusAllPos) }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity transition-transform duration-300 whitespace-nowrap truncate max-w-[160px] ${
                        selectedStatuses.length === 0
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-gray-700"
                      } ${filtersOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                    >
                      {t('all')}
                    </button>

                    {eventStatuses.map((status, i) => {
                      const pos = statusBase + 1 + i;
                      const isSelected = selectedStatuses.includes(status);
                      const label = tCard(status as 'past' | 'ongoing' | 'upcoming' | 'tba');
                      return (
                        <button
                          key={status}
                          onClick={() => setSelectedStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                          aria-pressed={isSelected}
                          style={{ transitionDelay: delayFor(pos) }}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity transition-transform duration-300 whitespace-nowrap truncate max-w-[160px] ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-md scale-105"
                              : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-gray-700"
                          } ${filtersOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>

          {/* separator */}
          <hr className="border-t border-gray-200 my-3" />

          {/* Timespan group */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {(() => {
                const typeBase = 0;
                const statusBase = typeBase + 1 + eventTypes.length;
                const timespanBase = statusBase + 1 + eventStatuses.length;
                const totalButtons = 1 + eventTypes.length + 1 + eventStatuses.length + 1 + timespanOptions.length;
                const delayFor = (pos: number) => filtersOpen ? `${pos * 40}ms` : `${(totalButtons - pos) * 25}ms`;

                const timespanAllPos = timespanBase;

                return (
                  <>
                    <button
                      onClick={() => setSelectedTimespan(null)}
                      aria-pressed={selectedTimespan === null}
                      style={{ transitionDelay: delayFor(timespanAllPos) }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity transition-transform duration-300 whitespace-nowrap truncate max-w-[160px] ${
                        selectedTimespan === null
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-gray-700"
                      } ${filtersOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                    >
                      {t('all')}
                    </button>

                    {timespanOptions.map((opt, i) => {
                      const pos = timespanBase + 1 + i;
                      const isSelected = selectedTimespan === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedTimespan(prev => prev === opt.id ? null : opt.id)}
                          aria-pressed={isSelected}
                          style={{ transitionDelay: delayFor(pos) }}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-opacity transition-transform duration-300 whitespace-nowrap truncate max-w-[160px] ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-md scale-105"
                              : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-gray-700"
                          } ${filtersOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </div>

        </div>
      </div>

      <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          {filteredEvents.length} {filteredEvents.length === 1 ? t('countSingle') + ' ' + t('found') : t('countPlural') + ' ' + t('found')}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredEvents.map((event) => (
          <EventCard key={event["@id"] || event.name} event={event} />
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No events found for this category.
        </div>
      )}
    </div>
  );
}
