import {
  ChangeDetectionStrategy,
  linkedSignal,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CommunicationManageDataSource } from '../../services/communication-manage-data-source';


@Component({
  selector: 'app-communication-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './communication-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationDialogComponent {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);
  readonly data?: any = inject(DynamicDialogConfig).data;

  private communicationService = inject(CommunicationManageDataSource);

  types = this.communicationService.types;

  communicationForm: FormGroup = this.formBuilder.nonNullable.group({
    reference: ['', Validators.required],
    code: ['', Validators.required],
    typeId: ['', Validators.required],
  });

  file = signal<File | null>(null);
  selectedFileName = linkedSignal(() => this.file()?.name);

  ngOnInit() {
    this.loadFormData();
  }

  save() {
    if (!this.isFormValid) return;
    const subscription = this.data
      ? this.communicationService.update(
          this.data.id,
          this.communicationForm.value,
          this.file()
        )
      : this.communicationService.create(
          this.communicationForm.value,
          this.file()!
        );

    subscription.subscribe((resp) => {
      this.diagloRef.close(resp);
    });
  }

  close() {
    this.diagloRef.close();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const [file] = input.files ?? [];
    if (!file || file.type !== 'application/pdf') return;
    this.file.set(file);
  }

  get isFormValid() {
    return this.communicationForm.valid && (this.data || this.file() !== null);
  }

  private loadFormData() {
    if (!this.data) return;
    this.selectedFileName.set(this.data.originalName);
    const { type, ...proos } = this.data;
    this.communicationForm.patchValue({ ...proos, typeId: type.id });
  }
}
