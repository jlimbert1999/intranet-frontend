import {
  LOCALE_ID,
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withComponentInputBinding,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeBo from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { definePreset, palette } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import theme from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { handleTransitionCreated } from './core/view-transition.config';
import { HttpErrorInterceptor } from './core/interceptors/http-error-interceptor';

registerLocaleData(localeBo, 'es');

const primaryColor = palette('{sky}');
const AuraSky = definePreset(theme, {
  semantic: {
    primary: primaryColor,
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions({ onViewTransitionCreated: handleTransitionCreated }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptors([HttpErrorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AuraSky,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    { provide: LOCALE_ID, useValue: 'es-BO' },
    MessageService,
  ],
};
