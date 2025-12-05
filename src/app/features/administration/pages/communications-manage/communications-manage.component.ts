import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { CommunicationDialogComponent } from '../../dialogs';
import { SearchInputComponent } from '../../../../shared';
import { CommunicationManageService } from '../../datasources/communication-manage.service';

@Component({
  selector: 'app-communications-manage',
  imports: [CommonModule, ButtonModule, TableModule, SearchInputComponent],
  templateUrl: './communications-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommunicationsManageComponent {
  private dialogService = inject(DialogService);
  private communicationServce = inject(CommunicationManageService);

  limit = signal(10);
  index = signal(0);
  term = signal('');
  offset = computed(() => this.index() * this.limit());
  communicationResource = rxResource({
    params: () => ({
      offset: this.offset(),
      limit: this.limit(),
      term: this.term(),
    }),
    stream: ({ params }) => this.communicationServce.findAll(params),
  });

  dataSource = linkedSignal(() => {
    if (!this.communicationResource.hasValue()) return [];
    return this.communicationResource.value().communications;
  });

  dataSize = linkedSignal(() => {
    if (!this.communicationResource.hasValue()) return 0;
    return this.communicationResource.value().total;
  });

  onSearch(term: string) {
    this.term.set(term);
  }

  openCreateDialog() {
    const dialogRef = this.dialogService.open(CommunicationDialogComponent, {
      header: 'Crear comunicado',
      modal: true,
      width: '45vw',
      breakpoints: {
        '640px': '90vw',
      },
    });
    dialogRef?.onClose.subscribe((result) => {
      if (!result) return;
      this.dataSize.update((values) => (values += 1));
      this.dataSource.update((values) => [result, ...values]);
    });
  }

  openUpdateDialog(item: any) {
    const dialogRef = this.dialogService.open(CommunicationDialogComponent, {
      header: 'Editar comunicado',
      modal: true,
      width: '45vw',
      data: item,
      breakpoints: {
        '640px': '90vw',
      },
    });
    dialogRef?.onClose.subscribe((result) => {
      if (!result) return;
      const index = this.dataSource().findIndex(({ id }) => result.id === id);
      if (index !== -1) {
        this.dataSource.update((values) => {
          values[index] = result;
          return [...values];
        });
      }
    });
  }
}
