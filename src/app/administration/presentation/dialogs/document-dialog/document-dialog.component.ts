import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import {
  SectionCategoriesResponse,
  DocumentsToManageResponse,
  CategoriesWithSectionsResponse,
} from '../../../infrastructure';
import { FileUploaderComponent } from '../../../../shared';
import { DocumentService } from '../../services';

interface UploadedDocument {
  id: string;
  fileName: string;
  originalName: string;
}

@Component({
  selector: 'app-document-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    FileUploaderComponent,
  ],
  templateUrl: './document-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentDialogComponent {
  private formBuilder = inject(FormBuilder);
  private docService = inject(DocumentService);
  private diagloRef = inject(DynamicDialogRef);

  readonly data: DocumentsToManageResponse = inject(DynamicDialogConfig).data;

  documentForm: FormGroup = this.formBuilder.nonNullable.group({
    relationId: ['', Validators.required],
  });

  categories = toSignal(this.docService.getCategoriesWithSections(), {
    initialValue: [],
  });

  sections = signal<SectionCategoriesResponse[]>([]);
  uploadedDocuments = signal<UploadedDocument[]>([]);
  files: File[] = [];

  ngOnInit() {
    this.loadForm();
  }

  onSelectFiles(files: File[]) {
    this.files = files;
  }

  save() {
    if (this.documentForm.invalid) return;
    const relationId = this.data
      ? this.data.id
      : this.documentForm.value['relationId'];
    this.docService.syncDocuments(relationId, this.files, this.uploadedDocuments()).subscribe((resp) => {
      this.diagloRef.close(resp);
    });
  }

  close() {
    this.diagloRef.close();
  }

  onSelectCategory(item: CategoriesWithSectionsResponse) {
    this.sections.set(item.sectionCategories);
  }

  private loadForm() {
    if (!this.data) return;
    this.documentForm.removeControl('relationId');
    this.uploadedDocuments.set(this.data.documents);
  }
}
