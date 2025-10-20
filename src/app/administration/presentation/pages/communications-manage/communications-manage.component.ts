import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { SearchInputComponent } from '../../../../shared';
import { CommunicationDialogComponent } from '../../dialogs';

@Component({
  selector: 'app-communications-manage',
  imports: [ButtonModule, TableModule, SearchInputComponent],
  templateUrl: './communications-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommunicationsManageComponent {
  private dialogService = inject(DialogService);

  dataSource = [];

  openCreateDialog() {
    this.dialogService.open(CommunicationDialogComponent, {
      header: 'Crear comunicado',
      modal: true,
      width: '40vw',
    });
  }

  openUpdateDialog(item: any) {}
}
