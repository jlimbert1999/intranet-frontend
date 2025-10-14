import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { HeroSlideResponse } from '../../../infrastructure';
import { HeroSlideService } from '../../services';

interface SlideItem {
  id?: number;
  file?: File;
  image: string;
  order: number;
}

@Component({
  selector: 'hero-slide-config-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TagModule,
    ButtonModule,
    TextareaModule,
    DragDropModule,
    InputTextModule,
    FloatLabel,
  ],
  templateUrl: './hero-slide-config-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSlideConfigDialogComponent {
  private heroSectionService = inject(HeroSlideService);
  private dialogRef = inject(DynamicDialogRef);
  private formBuilder = inject(FormBuilder);

  // * array of uploaded items and current selected files to upload
  slides = signal<SlideItem[]>([]);

  form: FormGroup = this.formBuilder.nonNullable.group({
    slides: this.formBuilder.array([]),
  });

  ngOnInit() {
    this.loadSlides();
  }

  save() {
    const { slides = [] } = this.form.value;
    this.heroSectionService
      .syncDocuments(
        this.slides().map((item, index) => ({
          ...item,
          ...slides[index],
        }))
      )
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
        this.addSlide(file, preview);
      };
      reader.readAsDataURL(file);
    });
  }

  removeSlide(index: number) {
    this.slides.update((values) => {
      values.splice(index, 1);
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
    this.slidesFormArray.removeAt(index);
  }

  drop(event: CdkDragDrop<HeroSlideResponse[]>) {
    moveItemInArray(this.slides(), event.previousIndex, event.currentIndex);
    moveItemInArray(
      this.slidesFormArray.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.slidesFormArray.updateValueAndValidity();

    this.slides.update((values) => {
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
  }

  get slidesFormArray(): FormArray {
    return this.form.get('slides') as FormArray;
  }

  private loadSlides(): void {
    this.heroSectionService.findAll().subscribe((data) => {
      this.slides.set(data);
      data.forEach(() => {
        this.slidesFormArray.push(this.createNewSlide());
      });
      this.slidesFormArray.patchValue(data);
    });
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

  private addSlide(file: File, preview: string) {
    this.slidesFormArray.push(this.createNewSlide());
    this.slides.update((values) => [
      ...values,
      { file, image: preview, order: values.length + 1 },
    ]);
  }

  private createNewSlide() {
    return this.formBuilder.group({
      title: [''],
      description: [''],
      redirectUrl: [''],
    });
  }
}
