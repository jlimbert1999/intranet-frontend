import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TableModule, TablePageEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

import { DocSectionWithCategoriesResponse } from '../../../infrastructure';
import { DocumentSectionDialogComponent } from '../../dialogs';
import { DocumentSectionService } from '../../services';
import { SearchInputComponent } from '../../../../../shared';

@Component({
  selector: 'app-document-sectons-manage',
  imports: [ButtonModule, TableModule, SearchInputComponent],
  templateUrl: './document-sectons-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export default class DocumentSectonsManageComponent {
  private dialogService = inject(DialogService);
  private sectionService = inject(DocumentSectionService);
  dataSource = this.sectionService.dataSource;
  dataSize = this.sectionService.dataSize;

  openCreateDialog() {
    this.dialogService.open(DocumentSectionDialogComponent, {
      header: 'Crear seccion',
      modal: true,
      width: '30vw',
    });
  }

  openUpdateDialog(item: DocSectionWithCategoriesResponse) {
    this.dialogService.open(DocumentSectionDialogComponent, {
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
