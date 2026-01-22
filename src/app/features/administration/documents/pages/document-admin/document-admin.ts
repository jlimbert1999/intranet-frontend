import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule, TablePageEvent } from 'primeng/table';
import { SearchInputComponent } from '../../../../../shared';
import { DocumentDataSource } from '../../services';
import { DocumentEditor } from '../../dialogs';
import { rxResource } from '@angular/core/rxjs-interop';
import { FileSizePipe } from '../../pipes';

interface Document {
  id: number;
  name: string;
  category: string;
}

interface DocumentSection {
  id: number;
  name: string;
  parentId?: number;
  children?: DocumentSection[];
  documents?: Document[];
}

@Component({
  selector: 'app-document-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    TableModule,
    SearchInputComponent,
    FileSizePipe,
  ],
  templateUrl: './document-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export default class DocumentAdmin {
  currentPath: DocumentSection[] = [];
  currentSection: DocumentSection | null = null;
  subSections: DocumentSection[] = [];
  documents: Document[] = [];

  private documentService = inject(DocumentDataSource);
  private dialogService = inject(DialogService);

  limit = signal(10);
  offset = signal(0);
  searchTerm = signal('');
  roleResource = rxResource({
    params: () => ({
      offset: this.offset(),
      limit: this.limit(),
      term: this.searchTerm(),
    }),
    stream: ({ params }) => this.documentService.findAll(),
  });

  dataSource = linkedSignal(() => {
    if (!this.roleResource.hasValue()) return [];
    return this.roleResource.value().documents;
  });

  dataSize = linkedSignal(() => {
    if (!this.roleResource.hasValue()) return 0;
    return this.roleResource.value().total;
  });

  constructor() {}

  ngOnInit() {}

  openCreateDialog() {
    this.dialogService.open(DocumentEditor, {
      header: 'Crear documentacion',
      modal: true,
      focusOnShow: false,
      width: '50vw',
    });
  }

  openUpdateDialog(item: any) {
    this.dialogService.open(DocumentEditor, {
      header: 'Editar documentacion',
      modal: true,
      width: '40vw',
      data: item,
    });
  }

  onPageChange($event: TablePageEvent) {
    this.documentService.setPage({
      index: $event.first,
    });
  }

  testss($event: string) {
    console.log($event);
  }
}
