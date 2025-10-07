import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { SearchInputComponent } from '../../../../shared';
import { DocumentCategoryService } from '../../services';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-document-categories',
  imports: [
    TableModule,
    ButtonModule,
    SearchInputComponent,
    InputIconModule,
    InputTextModule,

    IconFieldModule,
  ],
  templateUrl: './document-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentCategoriesComponent {
  private sectionService = inject(DocumentCategoryService);

  dataSource = this.sectionService.dataSource;

  openCreateDialog() {}

  openUpdateDialog(item: any) {}
}
