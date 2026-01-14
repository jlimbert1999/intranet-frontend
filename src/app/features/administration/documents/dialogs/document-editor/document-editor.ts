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

import { DocumentsToManage } from '../../../domain';
import { DocumentDataSource } from '../../services/document-data-source';
import { DocumentFileUploaderComponent } from '../../../components';
import { CategoriesWithSectionsResponse, SectionCategoriesResponse } from '../../../interfaces';

interface UploadedDocument {
  id: string;
  fileName: string;
  originalName: string;
  fiscalYear: Date;
}

@Component({
  selector: 'app-document-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    DocumentFileUploaderComponent,
  ],
  templateUrl: './document-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditor {
  private formBuilder = inject(FormBuilder);
  private docService = inject(DocumentDataSource);
  private diagloRef = inject(DynamicDialogRef);

  readonly data: DocumentsToManage = inject(DynamicDialogConfig).data;

  documentForm: FormGroup = this.formBuilder.nonNullable.group({
    relationId: ['', Validators.required],
  });

  categories = toSignal(this.docService.getCategoriesWithSections(), {
    initialValue: [],
  });

  sections = signal<SectionCategoriesResponse[]>([]);
  uploadedDocuments = signal<UploadedDocument[]>([]);
  documentsToUpload = signal<{ file: File; fiscalYear: Date }[]>([]);

  ngOnInit() {
    console.log(this.data);
    this.loadForm();
  }

  onSelectFiles(files: { file: File; fiscalYear: Date }[]) {
    this.documentsToUpload.set(files);
  }

  save() {
    if (this.documentForm.invalid) return;
    const relationId = this.data
      ? this.data.id
      : this.documentForm.value['relationId'];
    this.docService
      .syncDocuments(
        relationId,
        this.documentsToUpload(),
        this.uploadedDocuments()
      )
      .subscribe((resp) => {
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
