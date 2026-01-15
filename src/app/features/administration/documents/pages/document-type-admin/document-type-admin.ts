import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { SearchInputComponent } from '../../../../../shared';
import { DocumentCategoryDataSource } from '../../services';
import { DocumentTypeEditor } from '../../dialogs';

@Component({
  selector: 'app-document-type-admin',
  imports: [
    TableModule,
    ButtonModule,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    SearchInputComponent,
  ],
  templateUrl: './document-type-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentTypeAdmin {
  private sectionService = inject(DocumentCategoryDataSource);
  private dialogService = inject(DialogService);

  dataSource = this.sectionService.dataSource;

  openCreateDialog() {
    this.dialogService.open(DocumentTypeEditor, {
      header: 'Crear tipo de documento',
      modal: true,
      width: '30vw',
    });
  }

  openUpdateDialog(item: any) {
    this.dialogService.open(DocumentTypeEditor, {
      header: 'Editar tipo de documento',
      modal: true,
      data: item,
      width: '30vw',
    });
  }
}
