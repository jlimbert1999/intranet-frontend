import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { DocumentSectionDataSource } from '../../services/document-section-data-source';
import { DocSectionWithCategoriesResponse } from '../../../interfaces';

@Component({
  selector: 'app-document-section-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './document-section-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentSectionEditor {
  private diagloRef = inject(DynamicDialogRef);
  private formBuilder = inject(FormBuilder);
  private sectionService = inject(DocumentSectionDataSource);

  readonly data: DocSectionWithCategoriesResponse | undefined =
    inject(DynamicDialogConfig).data;

  categories = toSignal(this.sectionService.getCategories(), {
    initialValue: [],
  });

  sectionForm: FormGroup = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    categoriesIds: ['', Validators.required],
  });

  ngOnInit() {
    this.loadForm();
  }

  close() {
    this.diagloRef.close();
  }

  save() {
    const { name, categoriesIds } = this.sectionForm.value;
    const subscription = this.data
      ? this.sectionService.update(this.data.id, name, categoriesIds)
      : this.sectionService.create(name, categoriesIds);
    subscription.subscribe((resp) => {
      this.diagloRef.close(resp);
    });
  }

  private loadForm(): void {
    if (!this.data) return;
    const { name, categories } = this.data;
    const categoriesIds = categories.map(({ id }) => id);
    this.sectionForm.patchValue({ name, categoriesIds });
  }
}
