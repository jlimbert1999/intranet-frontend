import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

import { SearchInputComponent } from '../../../../../shared';
import { DocumentTypeDataSource } from '../../services';
import { DocumentTypeEditor } from '../../dialogs';

@Component({
  selector: 'app-document-type-admin',
  imports: [TableModule, ButtonModule, SearchInputComponent],
  templateUrl: './document-type-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentTypeAdmin {
  private sectionService = inject(DocumentTypeDataSource);
  private dialogService = inject(DialogService);

  dataSource = this.sectionService.dataSource;

  // private dialogService = inject(DialogService);
  // private clientDataSource = inject(UserDataSource);

  // roleResource = rxResource({
  //   params: () => ({
  //     offset: this.offset(),
  //     limit: this.limit(),
  //     term: this.searchTerm(),
  //   }),
  //   stream: ({ params }) =>
  //     this.clientDataSource.findAll(params.limit, params.offset, params.term),
  // });

  // dataSource = linkedSignal(() => {
  //   if (!this.roleResource.hasValue()) return [];
  //   return this.roleResource.value().users;
  // });

  // dataSize = linkedSignal(() => {
  //   if (!this.roleResource.hasValue()) return 0;
  //   return this.roleResource.value().total;
  // });

  openDocumentTypeDialog(item?: any) {
    const dialogRef = this.dialogService.open(DocumentTypeEditor, {
      header: item ? 'Editar tipo documento' : 'Crear tipo documento',
      modal: true,
      draggable: false,
      closeOnEscape: true,
      closable: true,
      width: '40vw',
      data: item,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
    dialogRef?.onClose.subscribe((result?: any) => {
      if (!result) return;
      this.updateItemDataSource(result);
    });
  }

  private updateItemDataSource(item: any): void {
    // const index = this.dataSource().findIndex(({ id }) => item.id === id);
    // if (index === -1) {
    //   this.dataSource.update((values) => [item, ...values]);
    //   this.dataSize.update((value) => (value += 1));
    // } else {
    //   this.dataSource.update((values) => {
    //     values[index] = item;
    //     return [...values];
    //   });
    // }
  }
}
