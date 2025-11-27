import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
 FormBuilder,
 FormGroup,
 FormsModule,
 ReactiveFormsModule,
 Validators,
 AbstractControl,
 ValidationErrors,
} from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker'; 
import { SelectModule } from 'primeng/select';
import { FieldsetModule } from 'primeng/fieldset';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ColorPickerModule } from 'primeng/colorpicker';
import { RippleModule } from 'primeng/ripple';
import { environment } from '../../../../../environments/environment';

interface CalendarEvent {
 id?: string;
 title: string;
 start: Date | string | null;
 end?: Date | string | null;
 allDay?: boolean;
 rrule?: string;
 backgroundColor?: string;
 textColor?: string;
}

@Component({
 selector: 'app-calendar-dialog',
 imports: [
  ReactiveFormsModule,
  FormsModule,
  CommonModule,
  ButtonModule,
  DatePickerModule,
  CheckboxModule,
  SelectModule,
  FieldsetModule,
  MultiSelectModule,
  InputTextModule,
  InputNumberModule,
  ColorPickerModule,
  RippleModule,
 ],
 templateUrl: './calendar-dialog.component.html',
 changeDetection: ChangeDetectionStrategy.OnPush,
 standalone: true,
})
export class CalendarDialogComponent {
 private formBuilder = inject(FormBuilder);
 private diagloRef = inject(DynamicDialogRef);
 private dialogConfig = inject(DynamicDialogConfig);
 private http = inject(HttpClient);

 isEditMode = false;
 eventId: string | null = null;
 eventForm: FormGroup;
 minDate: Date | null = new Date();

 freqOptions = [
  { label: 'Sin recurrencia', value: null },
  { label: 'Diario', value: 'DAILY' },
  { label: 'Semanal', value: 'WEEKLY' },
  { label: 'Mensual', value: 'MONTHLY' },
  { label: 'Anual', value: 'YEARLY' },
 ];

 weekdays = [
  { label: 'Lunes', value: 'MO' },
  { label: 'Martes', value: 'TU' },
  { label: 'Miércoles', value: 'WE' },
  { label: 'Jueves', value: 'TH' },
  { label: 'Viernes', value: 'FR' },
  { label: 'Sábado', value: 'SA' },
  { label: 'Domingo', value: 'SU' },
 ];

 months = [
  { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 },
 ];

 constructor() {
  this.eventForm = this.formBuilder.group(
   {
    title: ['', Validators.required],
    // 🚨 'description' eliminado del FormGroup
    start: [null, [this.dateNotPastValidator]],
    end: [null, this.dateNotPastValidator],
    allDay: [false],
    backgroundColor: ['#3788d8'],
    textColor: ['#ffffff'],
    recurrence: this.formBuilder.group({
     freq: [null],
     interval: [1],
     byDay: [[]],
     byMonth: [null],
     byMonthDay: [null],
     until: [null],
     count: [null],
    }),
   },
   {
    validators: [this.endAfterStartValidator, this.recurrenceStartValidator],
   }
  );

  this.eventForm.get('recurrence.byMonth')?.valueChanges.subscribe((month) => {
   if (!month) return;
   const max = this.daysInMonth(month);
   const dayCtrl = this.eventForm.get('recurrence.byMonthDay');
   const currentDay = dayCtrl?.value;
   if (currentDay && currentDay > max) {
    dayCtrl?.setValue(null);
   }
  });

  this.eventForm.get('recurrence.freq')?.valueChanges.subscribe(freq => {
   const startCtrl = this.eventForm.get('start');
   const endCtrl = this.eventForm.get('end');
   const rec = this.eventForm.get('recurrence');

   if (freq === 'YEARLY') {
    startCtrl?.clearValidators();
    startCtrl?.setValue(null);
    startCtrl?.disable({ emitEvent: false });
        
    endCtrl?.setValue(null);
    endCtrl?.disable({ emitEvent: false });
        
    rec?.get('until')?.disable({ emitEvent: false });
    rec?.get('count')?.disable({ emitEvent: false });
   } else {
    startCtrl?.enable({ emitEvent: false });
    startCtrl?.setValidators([Validators.required, this.dateNotPastValidator]);
        
    endCtrl?.enable({ emitEvent: false });
        
    rec?.get('until')?.enable({ emitEvent: false });
    rec?.get('count')?.enable({ emitEvent: false });
   }
   startCtrl?.updateValueAndValidity();
   endCtrl?.updateValueAndValidity();
   rec?.updateValueAndValidity();
  });

  if (this.dialogConfig.data?.event) {
   const event: CalendarEvent = this.dialogConfig.data.event;
   this.isEditMode = true;
   this.eventId = event.id || null;
   this.minDate = null;

   this.eventForm.patchValue({
    title: event.title,
    backgroundColor: event.backgroundColor ?? '#3788d8',
    textColor: event.textColor ?? '#ffffff',
    start: event.start ? new Date(event.start) : null,
    end: event.end ? new Date(event.end) : null,
    allDay: !!event.allDay,
   });

   if (event.rrule) this.parseRrule(event.rrule);
  }
 }

 public daysInMonth(month: number, year: number = new Date().getFullYear()): number {
  return new Date(year, month, 0).getDate();
 }

 dateNotPastValidator = (control: AbstractControl): ValidationErrors | null => {
  if (this.isEditMode) return null;
  if (!control.value) return null;
  const valueDate = new Date(control.value);
  const now = new Date();
  return valueDate < now ? { datePast: true } : null;
 };

 endAfterStartValidator = (form: AbstractControl): ValidationErrors | null => {
  const startVal = form.get('start')?.value;
  const endVal = form.get('end')?.value;

  if (!startVal || !endVal) return null;

  const start = new Date(startVal);
  const end = new Date(endVal);
  const allDay = !!form.get('allDay')?.value;

  if (end < start) return { endBeforeStart: true };

  if (!allDay) {
   const sameDay = start.getFullYear() === end.getFullYear() &&
           start.getMonth() === end.getMonth() &&
           start.getDate() === end.getDate();
   if (!sameDay) return { endNotSameDay: true };
  }
  return null;
 };

 private pad(n: number) {
  return n < 10 ? '0' + n : '' + n;
 }

 private toRRuleDateUTCString(d: Date) {
  return d.getUTCFullYear().toString() +
     this.pad(d.getUTCMonth() + 1) +
     this.pad(d.getUTCDate()) + 'T' +
     this.pad(d.getUTCHours()) +
     this.pad(d.getUTCMinutes()) +
     this.pad(d.getUTCSeconds()) + 'Z';
 }

 private buildRrule(formValue: any): string | undefined {
  const recurrence = formValue.recurrence;
  if (!recurrence || !recurrence.freq) return undefined;

  const freq = recurrence.freq as string;
  const rruleParts: string[] = [`FREQ=${freq}`];

  if (this.showInterval() && recurrence.interval > 1) {
   rruleParts.push(`INTERVAL=${recurrence.interval}`);
  }

  if (freq === 'WEEKLY' && recurrence.byDay?.length > 0) {
   rruleParts.push(`BYDAY=${recurrence.byDay.join(',')}`);
  }

  if (freq === 'YEARLY') {
   if (recurrence.byMonth) {
    rruleParts.push(`BYMONTH=${recurrence.byMonth}`);
   }
   if (recurrence.byMonthDay) {
    rruleParts.push(`BYMONTHDAY=${recurrence.byMonthDay}`);
   }
  }

  if (recurrence.until) {
    const untilLocal = recurrence.until instanceof Date ? recurrence.until : new Date(recurrence.until);
    
    const y = untilLocal.getFullYear();
    const m = this.pad(untilLocal.getMonth() + 1);
    const d = this.pad(untilLocal.getDate());
    
    const untilStr = `${y}${m}${d}T235959Z`; 
    
    rruleParts.push(`UNTIL=${untilStr}`);
  } else if (this.showCount() && recurrence.count) {
   rruleParts.push(`COUNT=${recurrence.count}`);
  }

  if (freq !== 'YEARLY') {
   const startDate = formValue.start instanceof Date ? formValue.start : new Date(formValue.start);
   const dtStartUTC = new Date(Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    startDate.getHours() || 0,
    startDate.getMinutes() || 0,
    startDate.getSeconds() || 0
   ));
   const dtStartStr = this.toRRuleDateUTCString(dtStartUTC);
   rruleParts.unshift(`DTSTART=${dtStartStr}`);
  }

  return rruleParts.join(';');
 }

 private parseRrule(rrule: string) {
  try {
   const partsArr = rrule
    .toUpperCase()
    .split(';')
    .map(p => p.trim())
    .filter(Boolean);

   const parts: Record<string, string> = {};
   partsArr.forEach(p => {
    const [k, v] = p.split('=');
    if (k && v !== undefined) parts[k] = v;
   });

   const rec = this.eventForm.get('recurrence');
   if (!rec) return;

   if (parts['FREQ']) rec.get('freq')?.setValue(parts['FREQ']);
   if (parts['INTERVAL']) rec.get('interval')?.setValue(+parts['INTERVAL']);
   if (parts['BYDAY']) rec.get('byDay')?.setValue(parts['BYDAY'].split(','));
   if (parts['BYMONTH']) rec.get('byMonth')?.setValue(+parts['BYMONTH']);
   if (parts['BYMONTHDAY']) rec.get('byMonthDay')?.setValue(+parts['BYMONTHDAY']);

   if (parts['UNTIL']) {
    const raw = parts['UNTIL'];
    const y = +raw.substring(0, 4);
    const mo = +raw.substring(4, 6) - 1;
    const da = +raw.substring(6, 8);
    
    const untilDate = new Date(y, mo, da);
    rec.get('until')?.setValue(untilDate);
   }

   if (parts['COUNT']) rec.get('count')?.setValue(+parts['COUNT']);

  } catch (err) {
   console.warn('parseRrule ERROR', err);
  }
 }

 showInterval(): boolean {
  const freq = this.eventForm.get('recurrence.freq')?.value;
  if (!freq) return true;
  return freq !== 'DAILY' && freq !== 'WEEKLY' && freq !== 'YEARLY';
 }

 showCount(): boolean {
  const freq = this.eventForm.get('recurrence.freq')?.value;
  return !freq;
 }

 recurrenceStartValidator = (form: AbstractControl): ValidationErrors | null => {
  const freq = form.get('recurrence.freq')?.value;
  const start = form.get('start')?.value;

  if (!freq && !start) {
   return { startRequired: true };
  }
  if (freq === 'YEARLY') {
   return null;
  }
  if (freq && !start) {
   return { startRequired: true };
  }
  return null;
 };

 save() {
  if (this.eventForm.invalid) {
   this.eventForm.markAllAsTouched();
   return;
  }

  const formValue = this.eventForm.value;
  const rruleString = this.buildRrule(formValue);

  const createDto: CalendarEvent = {
   title: formValue.title,
   start: formValue.start instanceof Date ? formValue.start.toISOString() :
      formValue.start ? new Date(formValue.start).toISOString() : null,
   end: formValue.end ? (formValue.end instanceof Date ? formValue.end.toISOString() : new Date(formValue.end).toISOString()) : undefined,
   allDay: formValue.allDay,
   rrule: rruleString || undefined,
   backgroundColor: formValue.backgroundColor,
   textColor: formValue.textColor,
  };

  if (createDto.backgroundColor) delete createDto.backgroundColor;
  if (createDto.textColor) delete createDto.textColor;

  const apiUrlBase = `${environment.baseUrl}/calendar`;
  let apiCall;

  if (this.isEditMode && this.eventId) {
   apiCall = this.http.patch(`${apiUrlBase}/${this.eventId}`, createDto);
  } else {
   apiCall = this.http.post(apiUrlBase, createDto);
  }

  apiCall.subscribe({
   next: (response) => {
    this.diagloRef.close({
     success: true,
     action: this.isEditMode ? 'update' : 'create',
     event: response,
    });
   },
   error: (err) => console.error('Error al guardar evento:', err),
  });
 }

 delete() {
  if (!this.eventId || !this.isEditMode) return;
  this.http.delete(`${environment.baseUrl}/calendar/${this.eventId}`).subscribe({
   next: () => {
    this.diagloRef.close({
     success: true,
     action: 'delete',
     eventId: this.eventId,
    });
   },
   error: (err) => console.error(err),
  });
 }

 close() {
  this.diagloRef.close({ success: false });
 }
}