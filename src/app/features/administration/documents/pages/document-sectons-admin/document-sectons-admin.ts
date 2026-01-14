import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

import { DocumentSectionEditor } from '../../../dialogs';
import { SearchInputComponent } from '../../../../../shared';
import { DocumentSectionDataSource } from '../../services/document-section-data-source';
import { DocSectionWithCategoriesResponse } from '../../../interfaces';

@Component({
  selector: 'app-document-sectons-admin',
  imports: [ButtonModule, TableModule, SearchInputComponent],
  templateUrl: './document-sectons-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export default class DocumentSectonsAdmin {
  private dialogService = inject(DialogService);
  private sectionService = inject(DocumentSectionDataSource);
  dataSource = this.sectionService.dataSource;
  dataSize = this.sectionService.dataSize;

  openCreateDialog() {
    this.dialogService.open(DocumentSectionEditor, {
      header: 'Crear seccion',
      modal: true,
      width: '30vw',
    });
  }

  openUpdateDialog(item: DocSectionWithCategoriesResponse) {
    this.dialogService.open(DocumentSectionEditor, {
      header: 'Crear seccion',
      modal: true,
      data: item,
      width: '30vw',
    });
  }

  onPageChange($event: TablePageEvent) {
    this.sectionService.setPage({
      index: $event.first,
    });
  }

  onSearch(term: string) {
    this.sectionService.setPage({ index: 0 });
    this.sectionService.term.set(term);
  }
}
