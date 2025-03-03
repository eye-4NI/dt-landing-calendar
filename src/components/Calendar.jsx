import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CustomCalendar({ events }) {
  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="month"
        defaultDate={new Date(2025, 2, 1)}
        toolbar={false}
      />
    </div>
  );
}
