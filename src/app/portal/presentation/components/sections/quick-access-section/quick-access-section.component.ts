import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AnimateOnScroll } from 'primeng/animateonscroll';

import { QuickAccessResponse } from '../../../../../administration/infrastructure';

@Component({
  selector: 'quick-access-section',
  imports: [CommonModule, AnimateOnScroll],
  template: `
    <section
      class="py-20 bg-gradient-to-b from-primary-50 via-white to-surface-50 animate-quick-section"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold text-surface-900 mb-3">
          Accesos Directos
        </h2>
        <p class="text-surface-600 mb-12 max-w-2xl mx-auto text-lg">
          Accede fácilmente a los principales sistemas y servicios
          institucionales
        </p>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center"
        >
          @for (access of quickAccess(); track $index) {
          <a
            [href]="access.url"
            target="_blank"
            rel="noopener noreferrer"
            pAnimateOnScroll
            threshold="0.2"
            [once]="true"
            enterClass="fade-in-10 slide-in-from-b-15 animate-duration-800"
            [attr.data-index]="$index"
            [attr.style]="'animation-delay:' + $index * 100 + 'ms'"
            class="group relative bg-surface-50 rounded-2xl shadow-md
              p-4 sm:p-6 flex flex-col items-center justify-between
              transition-all duration-300 hover:shadow-lg
              hover:-translate-y-1 border border-surface-300
              hover:border-primary-400 h-36 sm:h-44 w-full"
          >
            <div
              class="w-18 h-18 rounded-xl bg-surface-100 flex items-center justify-center mb-2 group-hover:bg-primary-50"
            >
              <img
                [src]="access.icon"
                [alt]="access.name"
                class="w-12 h-12 object-contain"
                loading="lazy"
              />
            </div>
            <span
              class="font-semibold text-surface-700 group-hover:text-primary-700 
                 transition-colors text-center text-sm sm:text-base md:text-lg 
                 leading-snug line-clamp-2 break-words"
              [title]="access.name"
            >
              {{ access.name }} texto extra
            </span>
          </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
   @keyframes quick-section-enter {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-quick-section {
      animation: quick-section-enter 0.8s ease-out both;
    }

    /* Tarjetas */
    @keyframes slide-in-from-b-15 {
      0% {
        opacity: 0;
        transform: translateY(15px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .slide-in-from-b-15 {
      animation-name: slide-in-from-b-15;
      animation-timing-function: ease-out;
    }

    .fade-in-10 {
      animation-fill-mode: both;
    }

    [pAnimateOnScroll] {
      opacity: 1 !important; /* visible si el observer no dispara */
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickAccessSectionComponent {
  quickAccess = input<QuickAccessResponse[]>();
}
