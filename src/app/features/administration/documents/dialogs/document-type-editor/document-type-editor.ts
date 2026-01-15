import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { DocumentCategoryDataSource } from '../../services/document-category-data-source';
import { FormErrorMessagesPipe } from '../../../../../shared';
import { DocumentCategoryResponse } from '../../../interfaces';

@Component({
  selector: 'app-document-type-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
    FloatLabelModule,
    FormErrorMessagesPipe,
  ],
  templateUrl: './document-type-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTypeEditor {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);
  private sectionService = inject(DocumentCategoryDataSource);

  readonly data: DocumentCategoryResponse | undefined =
    inject(DynamicDialogConfig).data;

  documentTypeForm: FormGroup = this.formBuilder.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    subTypes: this.formBuilder.array([]),
  });

  ngOnInit() {
    this.loadForm();
  }

  save() {
    const { name } = this.documentTypeForm.value;

    const subscription = this.data
      ? this.sectionService.update(this.data.id, name)
      : this.sectionService.create(name);

    subscription.subscribe(() => {
      this.close();
    });
  }

  close() {
    this.diagloRef.close();
  }

  isInvalid(controlName: string) {
    const control = this.documentTypeForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }

  addSubType() {
    this.subTypes.push(
      this.formBuilder.group({ name: ['', Validators.required] })
    );
  }

  removeSubType(index: number) {
    this.subTypes.removeAt(index);
  }

  get subTypes() {
    return this.documentTypeForm.get('subTypes') as FormArray;
  }

  private loadForm() {
    if (!this.data) return;
    this.documentTypeForm.patchValue({
      name: this.data.name,
    });
  }
}
