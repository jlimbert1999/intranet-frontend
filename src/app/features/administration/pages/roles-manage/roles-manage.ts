import {
  ChangeDetectionStrategy,
  linkedSignal,
  Component,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

import { RoleDataSource } from '../../datasources';
import { RoleResponse } from '../../interfaces';
import { RoleDialog } from '../../dialogs';
import { SearchInputComponent } from '../../../../shared';

@Component({
  selector: 'app-roles-manage',
  imports: [ButtonModule, TableModule, SearchInputComponent],
  templateUrl: './roles-manage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RolesManage {
  private dialogService = inject(DialogService);
  private roleDataSource = inject(RoleDataSource);

  limit = signal(10);
  offset = signal(0);
  searchTerm = signal('');
  roleResource = rxResource({
    params: () => ({
      offset: this.offset(),
      limit: this.limit(),
      term: this.searchTerm(),
    }),
    stream: ({ params }) =>
      this.roleDataSource.findAll({
        limit: params.limit,
        offset: params.offset,
        term: params.term,
      }),
  });

  dataSource = linkedSignal(() => {
    if (!this.roleResource.hasValue()) return [];
    return this.roleResource.value().roles;
  });

  dataSize = linkedSignal(() => {
    if (!this.roleResource.hasValue()) return 0;
    return this.roleResource.value().total;
  });

  openCreateDialog() {
    const dialogRef = this.dialogService.open(RoleDialog, {
      header: 'Crear rol',
      modal: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    dialogRef?.onClose.subscribe((result?: RoleResponse) => {
      if (!result) return;
      this.insreNewItemDataSource(result);
    });
  }

  openUpdateDialog(item: RoleResponse) {
    const dialogRef = this.dialogService.open(RoleDialog, {
      header: 'Editar rol',
      modal: true,
      width: '30vw',
      data: item,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    dialogRef?.onClose.subscribe((result?: RoleResponse) => {
      if (!result) return;
      this.updateItemDataSource(result);
    });
  }

  searchRoles(term: string) {
    this.offset.set(0);
    this.searchTerm.set(term);
  }

  changePage(event: TablePageEvent) {
    this.limit.set(event.rows);
    this.offset.set(event.first);
  }

  private insreNewItemDataSource(item: RoleResponse): void {
    this.dataSource.update((values) => [item, ...values]);
    this.dataSize.update((value) => (value += 1));
  }

  private updateItemDataSource(item: RoleResponse): void {
    const index = this.dataSource().findIndex(({ id }) => item.id === id);
    if (index == -1) return;
    this.dataSource.update((values) => {
      values[index] = item;
      return [...values];
    });
  }
}
