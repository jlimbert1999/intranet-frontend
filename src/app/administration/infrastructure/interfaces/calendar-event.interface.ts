export interface RRULE {
    FREQ?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    INTERVAL?: number;
    BYDAY?: string[];
    UNTIL?: string;
    COUNT?: number;
}

export interface CalendarEvent {
    id: string; 
    title: string; 
    start: string; 
    end?: string;
    allDay?: boolean; 
    rrule?: string;
    backgroundColor?: string;
    textColor?: string;
    eventType: 'SINGLE_OCCURRENCE' | 'ALL_DAY' | 'RECURRING';
}

