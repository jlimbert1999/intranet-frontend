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

import { HeroSlideResponse } from '../../interfaces';
import { HeroSlideDataSource } from '../../services';

interface SlideProperties {
  imageUrl?: string;
  localImage?: LocalImage;
  order: number;
}

interface LocalImage {
  file: File;
  preview: string;
}

@Component({
  selector: 'hero-slide-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DragDropModule,
    ButtonModule,
    TagModule,
    FloatLabel,
  ],
  templateUrl: './hero-slide-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSlideEditor {
  private heroSectionService = inject(HeroSlideDataSource);
  private dialogRef = inject(DynamicDialogRef);
  private formBuilder = inject(FormBuilder);

  // * array of uploaded items and current selected files to upload
  slidesProperties = signal<SlideProperties[]>([]);

  form: FormGroup = this.formBuilder.nonNullable.group({
    slides: this.formBuilder.array([]),
  });

  ngOnInit() {
    this.loadSlides();
  }

  save() {
    const { slides = [] } = this.form.value;
    this.heroSectionService
      .replaceSlides(
        this.slidesProperties().map((item, index) => ({
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
        const preview = reader.result as string;
        this.addSlide(file, preview);
      };
      reader.readAsDataURL(file);
    });
  }

  addSlide(file: File, preview: string) {
    this.slides.push(this.createSlideControl());
    this.slidesProperties.update((values) => [
      ...values,
      { localImage: { file, preview }, order: values.length + 1 },
    ]);
  }

  removeSlide(index: number) {
    this.slides.removeAt(index);
    this.slidesProperties.update((values) => {
      values.splice(index, 1);
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
  }

  drop(event: CdkDragDrop<HeroSlideResponse[]>) {
    moveItemInArray(
      this.slides.controls,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.slidesProperties(),
      event.previousIndex,
      event.currentIndex
    );

    this.slides.updateValueAndValidity();

    this.slidesProperties.update((values) => {
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
  }

  get slides(): FormArray {
    return this.form.get('slides') as FormArray;
  }

  private loadSlides(): void {
    this.heroSectionService.findAll().subscribe((data) => {
      this.slidesProperties.set(data);
      data.forEach((slide) => {
        this.slides.push(this.createSlideControl(slide));
      });
    });
  }

  private createSlideControl(slide?: HeroSlideResponse) {
    const control = this.formBuilder.group({
      title: [''],
      description: [''],
      redirectUrl: [''],
    });
    if (slide) {
      control.patchValue(slide);
    }
    return control;
  }

  private extractFileFromEvent(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement?.files || inputElement.files?.length === 0) return [];
    return Array.from(inputElement.files);
  }
}
