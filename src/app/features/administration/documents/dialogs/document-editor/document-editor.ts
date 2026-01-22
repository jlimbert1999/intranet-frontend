import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { DocumentsToManage } from '../../../domain';
import { DocumentDataSource } from '../../services';
import {
  DocumentTypeResponse,
  DocumentSubtypeResponse,
} from '../../interfaces';
import { FileIcon } from '../../components';
import { FileSizePipe } from '../../pipes';
import { CustomFormValidator, FormUtils } from '../../../../../helpers';

@Component({
  selector: 'app-document-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    MessageModule,
    InputTextModule,
    DatePickerModule,
    FloatLabelModule,
    FileSizePipe,
    FileIcon,
  ],
  templateUrl: './document-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentEditor {
  private formBuilder = inject(FormBuilder);
  private documentDataSource = inject(DocumentDataSource);
  private diagloRef = inject(DynamicDialogRef);

  readonly data: DocumentsToManage = inject(DynamicDialogConfig).data;

  readonly currentDate = new Date();
  readonly minDateValue: Date = new Date(2000, 0, 1);
  readonly maxDateValue = new Date(this.currentDate.getFullYear() + 1, 11, 31);

  form: FormGroup = this.formBuilder.nonNullable.group({
    sectionId: ['', Validators.required],
    typeId: ['', Validators.required],
    subtypeId: [''],
    documents: this.formBuilder.array([]),
    date: [this.currentDate, Validators.required],
  });

  readonly sections = toSignal(this.documentDataSource.getSections(), {
    initialValue: [],
  });
  types = signal<DocumentTypeResponse[]>([]);
  subtypes = signal<DocumentSubtypeResponse[]>([]);
  
  files = signal<File[]>([]);
  readonly formUtils = FormUtils;

  ngOnInit() {}

  save() {
    this.documentDataSource
      .create({ ...this.form.value, files: this.files() })
      .subscribe((resp) => {
        this.diagloRef.close(resp);
      });
  }

  close() {
    this.diagloRef.close();
  }

  onSelectSection(id: number) {
    this.documentDataSource.getTypesBySection(id).subscribe((items) => {
      this.types.set(items);
      this.subtypes.set([]);
    });
  }

  onSelectType(id: number) {
    this.documentDataSource.getSubtypesByType(id).subscribe((items) => {
      this.subtypes.set(items);
    });
  }

  onFileSelect(event: Event): void {
    const files = this.getFilesFormEvent(event);
    for (let file of files) {
      this.addAttachment(file);
    }
  }

  removeFile(index: number) {
    this.files.update((files) => {
      files.splice(index, 1);
      return [...files];
    });
    this.documentsFormArray.removeAt(index);
  }

  get documentsFormArray() {
    return this.form.get('documents') as FormArray;
  }

  private addAttachment(file: File) {
    this.files.update((files) => [...files, file]);
    this.documentsFormArray.push(this.createDocumentForm(file));
  }

  private createDocumentForm(file: File) {
    return this.formBuilder.group({
      displayName: [
        this.removeExtension(file.name),
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          Validators.pattern(/^[\p{L}\p{N} .,'()\-–—]+$/u),
          CustomFormValidator.notOnlyWhitespace,
        ],
      ],
    });
  }

  private getFilesFormEvent(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) return [];
    const selectedFiles = Array.from(inputElement.files);
    return selectedFiles.filter((file) => !this.isFileDuplicate(file));
  }

  private isFileDuplicate(selectedFile: File): boolean {
    return this.files().some(
      (item) =>
        item.name === selectedFile.name &&
        item.size === selectedFile.size &&
        item.lastModified === selectedFile.lastModified,
    );
  }

  private removeExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? fileName : fileName.substring(0, lastDot);
  }
}
