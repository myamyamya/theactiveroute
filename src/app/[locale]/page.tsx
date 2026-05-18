import { useTranslations } from 'next-intl';
import fs from 'fs';
import path from 'path';
import { SportEvent } from '@/types/event';
import EventList from '@/components/EventList';

export default function Home() {
  const t = useTranslations('HomePage');
  // Load and parse CSV of events at build/runtime (server component)
  const csvPath = path.join(process.cwd(), 'src', 'calendar', 'events.csv');
  let events: SportEvent[] = [];
  try {
    const raw = fs.readFileSync(csvPath, 'utf8');

    // Basic CSV parser that handles quoted fields with commas
    const parseCSV = (text: string) => {
      const rows: string[][] = [];
      let cur: string[] = [];
      let field = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
          if (inQuotes && text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }
        if (ch === ',' && !inQuotes) {
          cur.push(field);
          field = '';
          continue;
        }
        if ((ch === '\n' || ch === '\r') && !inQuotes) {
          if (field !== '' || cur.length > 0) {
            cur.push(field);
            rows.push(cur);
            cur = [];
            field = '';
          }
          // skip possible \r\n sequence
          if (ch === '\r' && text[i + 1] === '\n') i++;
          continue;
        }
        field += ch;
      }
      // push last
      if (field !== '' || cur.length > 0) {
        cur.push(field);
        rows.push(cur);
      }
      return rows;
    };

    const rows = parseCSV(raw).filter(r => r.length > 0);
    if (rows.length > 0) {
      const headers = rows[0].map(h => h.trim());
      const data = rows.slice(1).map(r => {
        const obj: Record<string, string> = {};
        for (let i = 0; i < headers.length; i++) {
          obj[headers[i]] = (r[i] ?? '').trim();
        }
        return obj;
      });

      const fmtDate = (s: string) => {
        if (!s) return '';
        // accept dd.MM.yyyy or dd.MM.yyyy with possible time
        const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (m) {
          const [_, d, mo, y] = m;
          const dd = d.padStart(2, '0');
          const mm = mo.padStart(2, '0');
          return `${y}-${mm}-${dd}`;
        }
        // fallback to raw
        return s;
      };

      events = data.map(row => {
        const start = fmtDate(row['start-date'] || row['start_date'] || row['startDate'] || '');
        const end = fmtDate(row['end-date'] || row['end_date'] || row['endDate'] || '');
        const descriptionParts = [row['location']].filter(Boolean);
        const rawSub = (row['sub-races'] || row['sub_races'] || row['subraces'] || '').trim();
        const subRaces = rawSub ? rawSub.split(',').map(s => s.trim()).filter(Boolean) : [];

        return {
          eventAttendanceMode: '',
          eventStatus: '',
          name: row['name'] || '',
          url: row['url'] || '',
          startDate: start || '',
          endDate: end || start || '',
          image: '',
          location: row['location'] || '',
          description: descriptionParts.join(' | '),
          eventType: row['event-type'] || row['event_type'] || '',
          subRaces
        } as SportEvent;
      });
    }
  } catch (e) {
    // if reading fails, leave events empty
    // eslint-disable-next-line no-console
    console.error('Failed to load events.csv', e);
    events = [];
  }

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
