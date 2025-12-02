import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import {
  DocumentCategoryDialogComponent,
  DocumentSectionDialogComponent,
} from '../../dialogs';
import { DocumentCategoryService } from '../../services';
import { SearchInputComponent } from '../../../../../shared';

@Component({
  selector: 'app-document-categories',
  imports: [
    TableModule,
    ButtonModule,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    SearchInputComponent,
  ],
  templateUrl: './document-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentCategoriesComponent {
  private sectionService = inject(DocumentCategoryService);
  private dialogService = inject(DialogService);

  dataSource = this.sectionService.dataSource;

  openCreateDialog() {
    this.dialogService.open(DocumentCategoryDialogComponent, {
      header: 'Crear categoria',
      modal: true,
      width: '30vw',
    });
  }

  openUpdateDialog(item: any) {
    this.dialogService.open(DocumentCategoryDialogComponent, {
      header: 'Editar categoria',
      modal: true,
      data: item,
      width: '30vw',
    });
  }
}
