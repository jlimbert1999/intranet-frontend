import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { DocumentCategoryService } from '../../services';
import { DocumentCategoryResponse } from '../../../infrastructure';
import { FormErrorMessagesPipe } from '../../../../../shared';

@Component({
  selector: 'app-document-category-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
    FormErrorMessagesPipe,
  ],
  templateUrl: './document-category-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCategoryDialogComponent {
  private formBuilder = inject(FormBuilder);
  private diagloRef = inject(DynamicDialogRef);
  private sectionService = inject(DocumentCategoryService);

  readonly data: DocumentCategoryResponse | undefined =
    inject(DynamicDialogConfig).data;

  categoryForm: FormGroup = this.formBuilder.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
  });

  ngOnInit() {
    this.loadForm();
  }

  save() {
    const { name } = this.categoryForm.value;

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
    const control = this.categoryForm.get(controlName);
    return control?.invalid && (control.touched || control.dirty);
  }

  private loadForm() {
    if (!this.data) return;
    this.categoryForm.patchValue({
      name: this.data.name,
    });
  }
}
