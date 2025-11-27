import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CalendarDialogComponent } from '../../dialogs';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { environment } from '../../../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SearchInputComponent } from '../../../../shared/components/inputs/search-input/search-input.component';

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
  createdAt?: string; 
}

@Component({
  selector: 'app-calendar-manage.component',
  imports: [CommonModule, ButtonModule, TableModule, ToastModule, SearchInputComponent, ConfirmDialogModule,],
  templateUrl: './calendar-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, ConfirmationService, MessageService],
  standalone: true
})
export default class CalendarManageComponent implements OnInit {
  private dialogService = inject(DialogService);
  private http = inject(HttpClient);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  eventsList = signal<CalendarEvent[]>([]);

  searchTerm = signal<string>('');

  filteredEventsList = computed(() => {
    const term = this.searchTerm().toUpperCase();
    if (!term) return this.eventsList();
    return this.eventsList().filter(event =>
      event.title.toUpperCase().includes(term) ||
      (event.description?.toUpperCase().includes(term) ?? false)
    );
  });

  months = [
    { label: 'Enero', value: 1 }, { label: 'Febrero', value: 2 }, { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 }, { label: 'Mayo', value: 5 }, { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 }, { label: 'Noviembre', value: 11 }, { label: 'Diciembre', value: 12 },
  ];

  ngOnInit(): void {
    this.loadEvents();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  loadEvents() {
    this.http.get<CalendarEvent[]>(`${environment.baseUrl}/calendar`).subscribe({
      next: (events) => {
        this.eventsList.set(events.map(e => ({
          ...e,
          rrule: e.rrule || null
        })));
      },
      error: (err) => {
        console.error('Error cargando eventos para la tabla:', err);
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'NO SE PUDIERON CARGAR LOS EVENTOS.' });
      }
    });
  }

  formatDate(dateStr?: string) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return dateStr;
    }
  }

  formatRecurrence(event: CalendarEvent): string {
    if (!event.rrule) return '-';
    const rrule = event.rrule.toUpperCase();

    if (rrule.includes('FREQ=DAILY')) return 'DIARIO';
    if (rrule.includes('FREQ=WEEKLY')) {
      const byDayMatch = rrule.match(/BYDAY=([A-Z,]+)/);
      return byDayMatch ? `SEMANAL: ${byDayMatch[1].split(',').join(', ')}` : 'SEMANAL';
    }
    if (rrule.includes('FREQ=MONTHLY')) {
      const byMonthDayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
      return byMonthDayMatch ? `MENSUAL: DÍA ${byMonthDayMatch[1]}` : 'MENSUAL';
    }
    if (rrule.includes('FREQ=YEARLY')) {
      const byMonthMatch = rrule.match(/BYMONTH=(\d+)/);
      const byMonthDayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
      let text = 'ANUAL';
      if (byMonthMatch && byMonthDayMatch) {
        const monthIndex = +byMonthMatch[1] - 1;
        const monthLabel = this.months[monthIndex]?.label.toUpperCase() ?? `MES ${byMonthMatch[1]}`;
        text += `: ${byMonthDayMatch[1]} DE ${monthLabel}`;
      }
      return text;
    }
    return 'RECURRENTE';
  }

  openCreateDialog() {
    const dialogRef = this.dialogService.open(CalendarDialogComponent, {
      header: 'CREAR NUEVO EVENTO',
      modal: true,
      width: '45vw',
      breakpoints: { '640px': '90vw' }
    });

    dialogRef?.onClose.subscribe((result: any) => {
      if (result?.success) {
        this.messageService.add({ severity: 'success', summary: 'CREADO', detail: 'EVENTO REGISTRADO CORRECTAMENTE.' });
        this.loadEvents(); 
      }
    });
  }

  openEditDialog(event: CalendarEvent) {
    const dialogRef = this.dialogService.open(CalendarDialogComponent, {
      header: 'EDITAR EVENTO',
      data: { event },
      modal: true,
      width: '45vw',
      breakpoints: { '640px': '90vw' }
    });

    dialogRef?.onClose.subscribe((result: any) => {
      if (result?.success) {
        const action = result.action ?? 'update';
        if (action === 'delete') {
          this.messageService.add({ severity: 'success', summary: 'ELIMINADO', detail: 'EVENTO ELIMINADO.' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'ACTUALIZADO', detail: 'EVENTO ACTUALIZADO CORRECTAMENTE.' });
        }
        this.loadEvents();
      }
    });
  }

  confirmDelete(event: CalendarEvent) {
    this.confirmationService.confirm({
      message: `¿ELIMINAR EL EVENTO "${event.title}"?`,
      header: 'CONFIRMAR ELIMINACIÓN',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ELIMINAR',
      rejectLabel: 'CANCELAR',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.http.delete(`${environment.baseUrl}/calendar/${event.id}`).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'ELIMINADO', detail: 'EVENTO ELIMINADO CON ÉXITO.' });
            this.loadEvents();
          },
          error: (err) => {
            console.error('Error al eliminar evento:', err);
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'NO SE PUDO ELIMINAR EL EVENTO.' });
          }
        });
      }
    });
  }
}