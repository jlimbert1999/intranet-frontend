import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { SearchInputComponent } from '../../../../../shared';
import { DocumentCategoryDataSource } from '../../services';
import { DocumentCategoryEditor } from '../../dialogs';

@Component({
  selector: 'app-document-categories-admin',
  imports: [
    TableModule,
    ButtonModule,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    SearchInputComponent,
  ],
  templateUrl: './document-categories-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentCategoriesAdmin {
  private sectionService = inject(DocumentCategoryDataSource);
  private dialogService = inject(DialogService);

  dataSource = this.sectionService.dataSource;

  openCreateDialog() {
    this.dialogService.open(DocumentCategoryEditor, {
      header: 'Crear categoria',
      modal: true,
      width: '30vw',
    });
  }

  openUpdateDialog(item: any) {
    this.dialogService.open(DocumentCategoryEditor, {
      header: 'Editar categoria',
      modal: true,
      data: item,
      width: '30vw',
    });
  }
}
