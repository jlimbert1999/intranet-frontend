import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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

import { DocumentsToManageResponse } from '../../../infrastructure';
import { DocumentDialogComponent } from '../../dialogs';
import { DocumentService } from '../../services';
import { rxResource } from '@angular/core/rxjs-interop';
import { SearchInputComponent } from '../../../../shared';

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
  selector: 'app-document-management',
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
  ],
  templateUrl: './document-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export default class DocumentManagement {
  currentPath: DocumentSection[] = [];
  currentSection: DocumentSection | null = null;
  subSections: DocumentSection[] = [];
  documents: Document[] = [];

  test: { label: string }[] = [];
  home = { icon: 'pi pi-home', routerLink: '/' };

  isSectionDialogOpen = signal(false);

  sectionName = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private documentService = inject(DocumentService);
  private dialogService = inject(DialogService);

  dataSize = this.documentService.dataSize;
  dataSource = this.documentService.dataSource;

  constructor() {}

  ngOnInit() {}

  openCreateDialog() {
    this.dialogService.open(DocumentDialogComponent, {
      header: 'Crear documentacion',
      modal: true,
      width: '40vw',
    });
  }

  openUpdateDialog(item: any) {
    this.dialogService.open(DocumentDialogComponent, {
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
