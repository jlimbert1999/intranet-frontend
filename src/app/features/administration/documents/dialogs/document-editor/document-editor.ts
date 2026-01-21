import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { DocumentsToManage } from '../../../domain';
import { DocumentFileUploaderComponent } from '../../../components';

import { DatePickerModule } from 'primeng/datepicker';
import { DocumentDataSource } from '../../services';
import {
  DocumentSubtypeResponse,
  DocumentTypeResponse,
} from '../../interfaces';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';

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
    DatePickerModule,
    StepperModule,
    FloatLabelModule,
    FileUploadModule,
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
    attachments: this.formBuilder.array([]),
  });

  sections = toSignal(this.docService.getSections(), { initialValue: [] });
  types = signal<DocumentTypeResponse[]>([]);
  subtypes = signal<DocumentSubtypeResponse[]>([]);

  uploadedDocuments = signal<UploadedDocument[]>([]);
  documentsToUpload = signal<{ file: File }[]>([]);

  files = signal<File[]>([]);

  ngOnInit() {
    console.log(this.data);
    this.loadForm();
  }

  onSelectFiles(files: { file: File; fiscalYear: Date }[]) {
    this.documentsToUpload.set(files);
  }

  save() {
    // if (this.documentForm.invalid) return;
    // const relationId = this.data
    //   ? this.data.id
    //   : this.documentForm.value['relationId'];
    // this.docService
    //   .syncDocuments(
    //     relationId,
    //     this.documentsToUpload(),
    //     this.uploadedDocuments(),
    //   )
    //   .subscribe((resp) => {
    //     this.diagloRef.close(resp);
    //   });
  }

  close() {
    this.diagloRef.close();
  }

  onSelectSection(id: number) {
    this.docService.getTypesBySection(id).subscribe((items) => {
      this.types.set(items);
      this.subtypes.set([]);
    });
  }

  onSelectType(id: number) {
    this.docService.getSubtypesByType(id).subscribe((items) => {
      this.subtypes.set(items);
    });
  }

  onFileSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) return;
    const selectedFiles = Array.from(inputElement.files);
    const files = selectedFiles.filter((file) => !this.isFileDuplicate(file));
    if (files.length === 0) return;
    for (let file of files) {
      this.addAttachment(file);
    }
  }

  removeFile(index: number) {
    this.files.update((files) => {
      files.splice(index, 1);
      return [...files];
    });
    this.fileMetadata.removeAt(index);
  }

  addAttachment(file: File) {
    this.files.update((files) => [...files, file]);
    this.fileMetadata.push(
      this.formBuilder.group({
        displayName: [file.name, Validators.required],
      }),
    );
  }

  getFileIcon(extension: string): string {
    const icons: any = {
      pdf: 'pi-file-pdf text-red-500',
      doc: 'pi-file-word text-blue-500',
      docx: 'pi-file-word text-blue-500',
      jpg: 'pi-image text-green-500',
      png: 'pi-image text-green-500',
      zip: 'pi-box text-yellow-600',
      default: 'pi-file text-gray-500',
    };
    return `pi ${icons[extension.toLowerCase()] || icons['default']} text-2xl`;
  }

  get fileMetadata() {
    return this.documentForm.get('attachments') as FormArray;
  }

  private isFileDuplicate(selectedFile: File): boolean {
    return this.files().some(
      (item) =>
        item.name === selectedFile.name &&
        item.size === selectedFile.size &&
        item.lastModified === selectedFile.lastModified,
    );
  }

  private loadForm() {
    if (!this.data) return;
    this.documentForm.removeControl('relationId');
    this.uploadedDocuments.set(this.data.documents);
  }
}
