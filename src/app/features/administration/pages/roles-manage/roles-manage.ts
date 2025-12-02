import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

import { RoleDialog } from '../../dialogs';

@Component({
  selector: 'app-roles-manage',
  imports: [ButtonModule],
  templateUrl: './roles-manage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RolesManage {
  private dialogService = inject(DialogService);

  openCreateDialog() {
    this.dialogService.open(RoleDialog, {
      header: 'Crear rol',
      modal: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }
}
