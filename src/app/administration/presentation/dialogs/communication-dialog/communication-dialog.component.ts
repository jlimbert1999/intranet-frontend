import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { CommunicationService } from '../../services';
import { PdfDisplayComponent } from '../../../../shared';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communication-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    PdfViewerModule,
    PdfDisplayComponent,
  ],
  templateUrl: './communication-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationDialogComponent {
  private formBuilder = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private diagloRef = inject(DynamicDialogRef);

  private communicationService = inject(CommunicationService);

  types = this.communicationService.types;

  communicationForm: FormGroup = this.formBuilder.nonNullable.group({
    reference: ['', Validators.required],
    code: ['', Validators.required],
    typeCommunicationId: ['', Validators.required],
  });

  pdfUrl = signal<SafeResourceUrl | null>(null);

  selectedFile = signal<File | null>(null);

  objectUrl = signal<string | null>(null);

  pdfPreviewUrl = computed(() =>
    this.objectUrl()
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl()!)
      : null
  );

  save() {
    console.log('save');
    if (!this.isFormValid) return;

    this.communicationService
      .crate(this.communicationForm.value, this.selectedFile()!)
      .subscribe((item) => {
        this.diagloRef.close(item);
      });
  }

  close() {
    this.diagloRef.close();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    const [file] = input.files ?? [];

    if (!file || file.type !== 'application/pdf') return;

    this.selectedFile.set(file);

    if (this.objectUrl() && this.objectUrl()?.toString().startsWith('blob:')) {
      URL.revokeObjectURL(this.objectUrl()!);
    }
    const fileUrl = URL.createObjectURL(file);

    this.objectUrl.set(fileUrl);
  }

  get isFormValid() {
    return this.communicationForm.valid && this.selectedFile() !== null;
  }
}
