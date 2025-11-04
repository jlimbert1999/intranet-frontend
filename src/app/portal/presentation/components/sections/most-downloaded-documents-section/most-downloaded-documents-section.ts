import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FileSizePipe, PrimengFileIconPipe } from '../../../../../shared';

@Component({
  selector: 'most-downloaded-documents-section',
  imports: [CommonModule, PrimengFileIconPipe, FileSizePipe],
  template: `
    <section class="py-20 bg-gradient-to-b from-surface-50 via-white to-surface-100">
      <div
        pAnimateOnScroll
        enterClass="fade-in-10 slide-in-from-b-20 animate-duration-1000"
        threshold="0.1"
        class="max-w-7xl mx-auto px-6 text-center"
      >
        <h2 class="text-3xl font-semibold text-primary-800 mb-2 tracking-tight">
          Documentos más descargados
        </h2>
        <p class="text-surface-500 mb-10">
          Accede rápidamente a los documentos más consultados del portal
        </p>

        <!-- Contenedor de tarjetas -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          @for (doc of documents(); track $index) {
          <div
            class="w-full max-w-sm bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between border border-surface-200 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div class="flex items-center gap-4 mb-4">
              <i
                [ngClass]="doc.originalName | primengFileIcon"
                style="font-size: 1.5rem;"
              ></i>
              <div class="text-left">
                <h3
                  class="text-lg font-medium text-surface-800 line-clamp-2 leading-tight"
                >
                  {{ doc.originalName }}
                </h3>
                <p class="text-sm text-surface-500 mt-1">
                  {{ doc.category || 'Documento público' }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-between text-sm text-surface-500 mb-4"
            >
              <span
                class="flex items-center gap-2 text-surface-600 font-medium"
              >
                <i class="pi pi-download text-primary-500"></i>
                {{ doc.downloadCount }} descargas
              </span>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full bg-surface-100 text-surface-700"
              >
                {{ doc.sizeBytes | fileSize }}
              </span>
            </div>

            <a
              [href]="doc.downloadUrl"
              target="_blank"
              class="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 py-2.5 rounded-lg transition-all"
            >
              <i class="pi pi-arrow-down"></i>
              Descargar
            </a>
          </div>
          }
        </div>

        <!-- Botón Ver todos -->
        <div class="mt-12">
          <a
            routerLink="/documentos"
            class="inline-flex items-center justify-center gap-2 text-primary-700 hover:text-primary-800 font-medium border border-primary-200 hover:border-primary-400 px-5 py-2.5 rounded-lg transition-all"
          >
            <i class="pi pi-list"></i>
            Ver todos los documentos
          </a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MostDownloadedDocumentsSection {
  documents = input.required<any[]>();
}
