import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { HeroSlideResponse } from '../../../infrastructure';
import { HeroSlideService } from '../../services';

interface HeroSlideItem {
  id?: number;
  file?: File;
  image: string;
  order: number;
}

@Component({
  selector: 'hero-slide-config-dialog',
  imports: [CommonModule, ButtonModule, DragDropModule],
  template: `
    <div class="border border-slate-300 rounded-xl px-3 py-2">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xl font-medium">Total: {{ slides().length }}</div>

        <p-button
          icon="pi pi-plus"
          size="small"
          label="Seleccionar"
          (click)="imageInput.click()"
        />

        <input
          #imageInput
          type="file"
          [hidden]="true"
          [multiple]="true"
          accept="image/png, image/jpeg, image/jpg"
          (change)="onFileSelected($event)"
        />
      </div>

      <div
        cdkDropList
        (cdkDropListDropped)="drop($event)"
        class="grid grid-cols-3 gap-4 max-h-[600px] p-2 overflow-y-auto"
      >
        @for (item of slides(); track $index) {
        <div class="relative h-36 border" cdkDrag>
          <div class="absolute top-0 left-0 text-white p-1 rounded-br-xl" [ngClass]="item.id ? 'bg-green-600' : 'bg-orange-500'">
            @if (item.id) {
              <span># {{ $index + 1 }} (Subida)</span>
              }
            @else {
              <span># {{ $index + 1 }} (Nueva)</span>
            }
          </div>
          <div class="absolute top-1 right-1">
            <p-button
              icon="pi pi-times"
              size="small"
              [rounded]="true"
              severity="danger"
              (onClick)="removeFle($index)"
            />
          </div>
          <img [src]="item.image" class="w-full h-full object-cover" />
        </div>
        } @empty {
        <span>Seleccione las imagenes a subir.</span>
        }
      </div>
    </div>
    <div class="p-dialog-footer">
      <p-button label="Cancelar" severity="secondary" (onClick)="close()" />
      <p-button label="Guardar" (onClick)="save()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSlideConfigDialogComponent {
  private heroSectionService = inject(HeroSlideService);
  private dialogRef = inject(DynamicDialogRef);

  file = model<File | null>();
  slides = signal<HeroSlideItem[]>([]);

  ngOnInit(){
    this.loadSlides()
  }

  save() {
    this.heroSectionService.syncDocuments(this.slides()).subscribe(() => {
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
        this.slides.update((values) => [
          ...values,
          { file, image: preview, order: values.length + 1 },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFle(index: number) {
    this.slides.update((images) => images.filter((_, i) => i !== index));
  }

  drop(event: CdkDragDrop<HeroSlideResponse[]>) {
    moveItemInArray(this.slides(), event.previousIndex, event.currentIndex);

    this.slides.update((values) => {
      values.forEach((img, i) => (img.order = i + 1));
      return [...values];
    });
  }

  private extractFileFromEvent(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement | null;
    if (!inputElement?.files || inputElement.files?.length === 0) return [];
    const files = Array.from(inputElement.files).filter(
      (file) => !this.isDuplicate(file)
    );
    return files;
  }

  private isDuplicate(file: File): boolean {
    return this.slides().some(
      (item) =>
        item.file?.name === file.name &&
        item.file.size === file.size &&
        item.file.lastModified === file.lastModified
    );
  }

  private loadSlides() {
    this.heroSectionService.findAll().subscribe((data) => {
      this.slides.set(data);
    });
  }
}
