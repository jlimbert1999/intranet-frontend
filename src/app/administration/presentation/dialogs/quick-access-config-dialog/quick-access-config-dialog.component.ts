import { CommonModule } from '@angular/common';
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

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuickAccessService } from '../../services';
import { CustomFormValidators } from '../../../../../helpers';

interface QuickAccessItem {
  file?: File;
  image: string;
  order: number;
}

@Component({
  selector: 'app-quick-access-config-dialog',
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
  ],
  templateUrl: './quick-access-config-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickAccessConfigDialogComponent {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private quickAccessService = inject(QuickAccessService);

  quickAccessItems = signal<QuickAccessItem[]>([]);
  form: FormGroup = this.formBuilder.nonNullable.group({
    items: this.formBuilder.array([], CustomFormValidators.minLengthArray(1)),
  });

  ngOnInit() {
    this.loadQuickAccessItems();
  }

  save() {
    const { items = [] } = this.form.value;
    const itemsToUpload = this.quickAccessItems().map((props, index) => ({
      ...props,
      // * Joing form values array with selected files arrray
      ...items[index],
    }));

    this.quickAccessService
      .syncQuickAccessItems(itemsToUpload)
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const files = this.extractFileFromEvent(event);
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = URL.createObjectURL(file);
        this.addItem(file, preview);
      };
      reader.readAsDataURL(file);
    });
  }

  drop(event: CdkDragDrop<QuickAccessItem[]>) {
    moveItemInArray(
      this.quickAccessItems(),
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.itemsFormArray.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.itemsFormArray.updateValueAndValidity();

    this.quickAccessItems.update((values) => {
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
  }

  removeSlide(index: number) {
    this.quickAccessItems.update((values) => {
      values.splice(index, 1);
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
    this.itemsFormArray.removeAt(index);
  }

  get itemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private extractFileFromEvent(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement?.files || inputElement.files?.length === 0) return [];
    const files = Array.from(inputElement.files).filter((file) => {
      return (
        file?.name === file.name &&
        file.size === file.size &&
        file.lastModified === file.lastModified
      );
    });
    return files;
  }

  private addItem(file: File, preview: string) {
    this.itemsFormArray.push(this.createNewItem());
    this.quickAccessItems.update((values) => [
      ...values,
      { file, image: preview, order: values.length + 1 },
    ]);
  }
  private createNewItem() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      url: ['', Validators.required],
    });
  }

  private loadQuickAccessItems(): void {
    this.quickAccessService.findAll().subscribe((data) => {
      this.quickAccessItems.set(data);
      data.forEach(() => {
        this.itemsFormArray.push(this.createNewItem());
      });
      this.itemsFormArray.patchValue(data);
    });
  }
}
