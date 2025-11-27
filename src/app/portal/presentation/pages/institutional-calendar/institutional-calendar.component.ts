import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import rrulePlugin from '@fullcalendar/rrule';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { RRule } from 'rrule';

interface CalendarEvent {
  id: string;
  title: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  rrule?: string | null;
  backgroundColor?: string;
  textColor?: string;
  description?: string;
}

interface EventTypeColor {
  label: string;
  color: string;
}

@Component({
  selector: 'app--institutional-calendar.component',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './institutional-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export default class InstitutionalCalendarComponent implements OnInit {
  private http = inject(HttpClient);

  eventTypeColors: EventTypeColor[] = [
    { label: 'Actividades por Horas', color: '#3B82F6' },
    { label: 'Feriados o Fechas Cívicas Fijas', color: '#EF4444' },
    { label: 'Eventos de Jornada Completa', color: '#10B981' },
  ];

  eventsList = signal<CalendarEvent[]>([]);
  calendarReady = signal(false);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, rrulePlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,

    // Mostrar horas completas (14:00)
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
      hour12: false
    },

    eventClick: (info) => this.onEventClick(info),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },
    timeZone: 'local',
    events: []
  };

  ngOnInit() {
    this.loadEvents();
  }

  private parseRrule(rruleStr: string, start?: string) {
    try {
      const ruleObj: any = {};
      const parts = rruleStr.split(';');

      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (!key || !value) return;

        switch (key) {
          case 'FREQ':
            ruleObj.freq = RRule[value as keyof typeof RRule];
            break;
          case 'INTERVAL':
            ruleObj.interval = +value;
            break;
          case 'BYDAY':
            ruleObj.byweekday = value.split(',').map(v => RRule[v as keyof typeof RRule]);
            break;
          case 'BYMONTH':
            ruleObj.bymonth = +value;
            break;
          case 'BYMONTHDAY':
            ruleObj.bymonthday = +value;
            break;
          case 'COUNT':
            ruleObj.count = +value;
            break;
          case 'UNTIL':
            const y = +value.substr(0, 4);
            const m = +value.substr(4, 2);
            const d = +value.substr(6, 2);
            ruleObj.until = new Date(y, m - 1, d);
            break;
        }
      });

      if (start) {
        if (start.includes('T')) {
          ruleObj.dtstart = start;
        } else {
          ruleObj.dtstart = start + 'T00:00:00';
        }
      }

      return ruleObj;

    } catch (err) {
      console.warn('parseRrule ERROR', err);
      return null;
    }
  }

  loadEvents() {
    this.http.get<CalendarEvent[]>(`${environment.baseUrl}/calendar`).subscribe({
      next: (events) => {
        this.eventsList.set(events.map(e => ({
          ...e,
          title: e.title.toUpperCase(),
          rrule: e.rrule || null,
          start: e.start,
          end: e.end
        })));

        const fcEvents = this.eventsList().map(e => {
          let color: string;
          let eventDisplay: 'auto' | 'block' | 'list-item' = 'auto';
          let useStart = e.start;
          let isAllDay = e.allDay ?? false;

          if (e.rrule) {
            eventDisplay = 'block';

            const freq = e.rrule.split(';').find(p => p.startsWith('FREQ='));
            const freqValue = freq ? freq.replace('FREQ=', '') : '';

            if (freqValue === 'YEARLY') {
              color = this.eventTypeColors[1].color; 
            } else {
              color = this.eventTypeColors[0].color;
            }

            const hasTime =
              e.start &&
              (e.start.includes('T') || (e.start.includes(':') && e.start.length > 10));

            if (!hasTime) {
              useStart = e.start ? e.start.split('T')[0] : e.start;
              isAllDay = true;
            } else {
              isAllDay = false;
            }

          } else if (e.allDay) {
            color = this.eventTypeColors[2].color;
            eventDisplay = 'block';

          } else {
            color = this.eventTypeColors[0].color;
            eventDisplay = 'list-item';
          }

          color = e.backgroundColor ?? color;

          const fcEvent: any = {
            id: e.id,
            title: e.title,
            allDay: isAllDay,
            color: color,
            textColor: e.textColor ?? '#FFFFFF',
            extendedProps: { description: e.description },
            start: useStart,
            end: e.end,
            display: eventDisplay
          };

          if (e.rrule) {
            const rruleObj = this.parseRrule(e.rrule, useStart);
            if (rruleObj) fcEvent.rrule = rruleObj;
            fcEvent.start = undefined;
            fcEvent.end = undefined;
          }

          return fcEvent;
        });

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...fcEvents]
        };

        if (!this.calendarReady()) {
          this.calendarReady.set(true);
        }
      },
      error: (err) => {
        console.error('Error cargando eventos institucionales:', err);
        this.calendarReady.set(true);
      }
    });
  }

  onEventClick(info: any) {
    console.log('Evento Clicked:', info.event.title, info.event.extendedProps.description);
    if (info.event.url) window.open(info.event.url, '_blank');
  }
}
