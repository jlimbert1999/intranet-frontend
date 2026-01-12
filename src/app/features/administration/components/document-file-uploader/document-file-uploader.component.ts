import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { PrimengFileIconPipe } from '../../../../shared';

interface UploadedFile {
  id: string;
  originalName: string;
  fiscalYear: Date;
}

interface DocumentItem {
  file: File;
  fiscalYear: Date;
}

@Component({
  selector: 'document-file-uploader',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    PrimengFileIconPipe,
  ],
  template: `
    <div class="p-4 rounded-lg border border-gray-300">
      <div class="flex mb-4">
        <p-button
          label="Seleccionar"
          variant="outlined"
          icon="pi pi-plus"
          size="small"
          (onClick)="fileInput.click()"
        />
        <input
          #fileInput
          type="file"
          [hidden]="true"
          [multiple]="true"
          (change)="selectFiles($event)"
        />
      </div>
      @if(!isSelectorEmpty()){
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y-2 divide-gray-200">
          <thead class="ltr:text-left rtl:text-right">
            <tr class="*:font-medium *:text-gray-900">
              <th class="px-3 py-2">Archivo</th>
              <th class="px-3 py-2 w-60">Gestión</th>
              <th class="px-3 py-2 w-[50px]"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            @for (doc of documentsToUpload(); track $index) {
            <tr class="*:text-gray-900 *:first:font-medium">
              <td class="p-2">
                <div
                  class="flex items-center space-x-2 px-2 py-1 rounded-lg border border-gray-300"
                >
                  <i
                    [ngClass]="doc.file.name | primengFileIcon"
                    style="font-size: 1.5rem;"
                  ></i>
                  <div>
                    <p class="text-sm font-medium">
                      {{ doc.file.name }}
                    </p>
                    <p class="text-xs text-orange-500">Pendiente</p>
                  </div>
                </div>
              </td>
              <td class="p-2">
                <p-datepicker
                  placeholder="Gestion"
                  view="year"
                  dateFormat="yy"
                  appendTo="body"
                  [(ngModel)]="doc.fiscalYear"
                />
              </td>
              <td class="p-2">
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [rounded]="true"
                  [text]="true"
                  (onClick)="removeDocToUpload($index)"
                />
              </td>
            </tr>
            } @for (file of uploadedDocuments(); track $index) {
            <tr class="*:text-gray-900 *:first:font-medium">
              <td class="p-2">
                <div
                  class="flex items-center space-x-2 px-2 py-1 rounded-lg border border-gray-300"
                >
                  <i
                    [ngClass]="file.originalName | primengFileIcon"
                    style="font-size: 1.5rem;"
                  ></i>
                  <div>
                    <p class="text-sm font-medium">
                      {{ file.originalName }}
                    </p>
                    <p class="text-xs text-green-500">Completado</p>
                  </div>
                </div>
              </td>
              <td class="p-2">
                <p-datepicker
                  placeholder="Gestion"
                  view="year"
                  dateFormat="yy"
                  appendTo="body"
                  [(ngModel)]="file.fiscalYear"
                />
              </td>
              <td class="p-2">
                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [rounded]="true"
                  [text]="true"
                  (onClick)="onRemoveUploadedFile($index)"
                />
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
      } @else {
      <div class="flex items-center justify-center flex-col h-[80px]">
        <p>No se ha seleccionado ningun archivo</p>
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFileUploaderComponent {
  documentsToUpload = model<DocumentItem[]>([]);

  uploadedDocuments = model<UploadedFile[]>([]);

  isSelectorEmpty = computed(
    () =>
      this.documentsToUpload().length === 0 &&
      this.uploadedDocuments().length === 0
  );

  readonly currentYear = new Date();

  selectFiles(event: Event): void {
    const selectedFiles = this.onInputFileSelect(event);
    const newFiles = selectedFiles.filter((file) => !this.isDuplicate(file));
    if (newFiles.length === 0) return;
    this.documentsToUpload.update((values) => [
      ...newFiles.map((file) => ({
        file,
        fiscalYear: this.currentYear,
      })),
      ...values,
    ]);
  }

  onRemoveFile(event: Event, removeFileCallback: Function, index: number) {
    removeFileCallback(event, index);
  }

  removeDocToUpload(index: number) {
    this.documentsToUpload.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
  }

  onRemoveUploadedFile(index: number) {
    this.uploadedDocuments.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
  }

  private onInputFileSelect(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) return [];
    return Array.from(inputElement.files);
  }

  private isDuplicate(file: File): boolean {
    return this.documentsToUpload().some(
      (doc) =>
        doc.file.name === file.name &&
        doc.file.size === file.size &&
        doc.file.lastModified === file.lastModified
    );
  }
}
