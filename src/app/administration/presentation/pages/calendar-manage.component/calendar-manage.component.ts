import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { CalendarDialogComponent } from '../../dialogs';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar-manage.component',
  imports: [ButtonModule, TableModule, FullCalendarModule],
  templateUrl: './calendar-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalendarManageComponent {
  private dialogService = inject(DialogService);

  openCreateDialog() {
    const dialogRef = this.dialogService.open(CalendarDialogComponent, {
      header: 'Crear evento',
      modal: true,
      width: '45vw',
      breakpoints: {
        '640px': '90vw',
      },
    });
    dialogRef.onClose.subscribe((result) => {
      if (!result) return;
      // this.dataSize.update((values) => (values += 1));
      // this.dataSource.update((values) => [result, ...values]);
    });
  }
}
