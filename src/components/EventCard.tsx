import { SportEvent } from "@/types/event";
import { format, isBefore, isAfter, isSameDay } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

export default function EventCard({ event }: { event: SportEvent }) {
  const t = useTranslations('EventCard');
  const locale = useLocale();
  const dateLocale = locale === 'tr' ? tr : enUS;
  const tTypes = useTranslations('EventTypes');

  // Robust date parsing: trims time and handles non-padded YYYY-M-D
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

  const startDate = parseDate(event.startDate);
  const endDate = parseDate(event.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate comparison
  
  const isValidDate = (d: Date) => d instanceof Date && !isNaN(d.getTime());
  const validStart = isValidDate(startDate);
  const validEnd = isValidDate(endDate);

  // Determine event status color
  let bgGradient = "from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900"; // Past
  let statusLabel = t("past");

  const isOngoing = validStart && validEnd && (isSameDay(today, startDate) || isAfter(today, startDate)) && (isSameDay(today, endDate) || isBefore(today, endDate));
  const isUpcoming = validStart && isBefore(today, startDate);

  if (isOngoing) {
    bgGradient = "from-emerald-100 to-green-200 dark:from-emerald-900/60 dark:to-green-800/60";
    statusLabel = t("ongoing");
  } else if (isUpcoming) {
    bgGradient = "from-blue-100 to-indigo-200 dark:from-blue-900/60 dark:to-indigo-800/60";
    statusLabel = t("upcoming");
  } else if (!validStart) {
    bgGradient = "from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900";
    statusLabel = t("tba");
  }

  return (
    <a 
      href={event.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <div className={`h-full flex flex-col rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] bg-gradient-to-br ${bgGradient} backdrop-blur-md relative`}>
        
        <div className="p-6 flex flex-col h-full z-10">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
            {event.name}
          </h3>
          {/* Sub-race badges below title, above date */}
          {((event as any).subRaces as string[] | undefined)?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {((event as any).subRaces as string[]).map((sr: string) => (
                <div key={sr} className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/80 dark:bg-black/40 text-gray-800 dark:text-gray-200 shadow-sm">
                  {sr}
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4 flex items-end justify-between gap-4">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 font-medium shrink-0">
              <span className="mr-2 opacity-75">🗓</span>
              <div className="flex flex-col">
                <span>{validStart ? format(startDate, "MMM d, yyyy", { locale: dateLocale }) : t("dateTbd")}</span>
                {validStart && validEnd && startDate.getTime() !== endDate.getTime() && (
                  <span className="text-xs opacity-80 mt-0.5">- {format(endDate, "MMM d, yyyy", { locale: dateLocale })}</span>
                )}
              </div>
            </div>

            {/* Right column: location (above) then type/status (bottom-right) */}
            <div className="flex flex-col items-end gap-2">
              {event.location && (
                <div className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-black/40 text-gray-800 dark:text-gray-200 shadow-sm">
                  {event.location}
                </div>
              )}

              <div className="flex items-center gap-2">
                {event.eventType && event.eventType !== "Unknown" && (
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-blue-900/60 backdrop-blur-sm text-blue-800 dark:text-blue-200 shadow-sm text-center">
                    {(() => {
                      try {
                        const v = tTypes(event.eventType as any);
                        return v || event.eventType;
                      } catch {
                        return event.eventType;
                      }
                    })()}
                  </div>
                )}

                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-black/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 shadow-sm text-center">
                  {statusLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
      </div>
    </a>
  );
}
