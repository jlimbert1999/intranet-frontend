import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

import { CustomFormValidators } from '../../../../../helpers';
import { TutorialData } from '../../services';

@Component({
  selector: 'app-tutorial-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './tutorial-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialDialog {
  private dialogRef = inject(DynamicDialogRef);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private tutorialData = inject(TutorialData);

  tutorialForm: FormGroup = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    videos: this.formBuilder.array([], CustomFormValidators.minLengthArray(1)),
  });
  videos = signal<{ file: File; previewUrl: string }[]>([]);

  readonly data: any | undefined = inject(DynamicDialogConfig).data;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.videos().forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
    });
  }

  save() {
    const { videos, ...rest } = this.tutorialForm.value;
    const body = {
      ...rest,
      videos: videos.map((video: { title: string }, index: number) => ({
        ...video,
        file: this.videos()[index].file,
      })),
    };
    const subscription = this.data
      ? this.tutorialData.update(this.data.id, body)
      : this.tutorialData.create(body);

    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const files = this.extractFileFromEvent(event);
    files.forEach((file: File) => {
      this.addVideo(file);
    });
  }

  removeVideo(index: number) {
    this.videos.update((values) => {
      const item = values[index];
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      values.splice(index, 1);
      return [...values];
    });
    this.videosFormArray.removeAt(index);
  }

  get videosFormArray(): FormArray {
    return this.tutorialForm.get('videos') as FormArray;
  }

  private addVideo(file: File) {
    if (file.type !== 'video/mp4') return;
    this.videosFormArray.push(this.createVideoFormGroup());
    this.videos.update((values) => [
      ...values,
      { file, previewUrl: URL.createObjectURL(file) },
    ]);
  }

  private createVideoFormGroup() {
    return this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  private extractFileFromEvent(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement?.files || inputElement.files?.length === 0) return [];
    const files = Array.from(inputElement.files).filter((file) => {
      return !this.videos().some(
        (v) =>
          v.file.name === file.name &&
          v.file.size === file.size &&
          v.file.lastModified === file.lastModified
      );
    });
    inputElement.value = ''; // * Empty file input;
    return files;
  }
}
