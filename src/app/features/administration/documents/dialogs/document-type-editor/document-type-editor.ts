import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { DocumentTypeDataSource } from '../../services';
import { DocumentTypeResponse, SubtypeResponse } from '../../interfaces';
import { FormUtils } from '../../../../../helpers';

@Component({
  selector: 'app-document-type-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    CheckboxModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
  ],
  templateUrl: './document-type-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTypeEditor {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);
  private sectionService = inject(DocumentTypeDataSource);

  readonly data?: DocumentTypeResponse = inject(DynamicDialogConfig).data;

  form: FormGroup = this.formBuilder.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    subtypes: this.formBuilder.array([]),
    isActive: [true, Validators.required],
  });

  subtypesIds: number[] = [];

  formUtils = FormUtils;

  ngOnInit() {
    this.loadForm();
  }

  save() {
    if (this.form.invalid) return;
    const subscription = this.buildSavedMethod();

    subscription.subscribe(() => {
      this.diagloRef.close();
    });
  }

  close() {
    this.diagloRef.close();
  }

  addSubType() {
    this.subTypes.push(
      this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        isActive: [true, Validators.required],
      })
    );
  }

  removeSubType(index: number) {
    this.subTypes.removeAt(index);
    this.subtypesIds.splice(index, 1);
  }

  get subTypes() {
    return this.form.get('subtypes') as FormArray;
  }

  private buildSavedMethod() {
    if (!this.data) return this.sectionService.create(this.form.value);
    const { subtypes, ...rest } = this.form.value;
    return this.sectionService.update(this.data.id, {
      ...rest,
      subtypes: this.subtypesIds.map((id, index) => ({
        id,
        ...subtypes[index],
      })),
    });
  }

  private loadForm() {
    if (!this.data) return;
    this.data.subtypes.forEach((item) => {
      this.addSubType();
      this.subtypesIds.push(item.id);
    });
    this.form.patchValue(this.data);
  }
}
