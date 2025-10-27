import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
  LOCALE_ID,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { definePreset, palette } from '@primeuix/themes';
import localeBo from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';

import { providePrimeNG } from 'primeng/config';
import theme from '@primeuix/themes/aura';

import { routes } from './app.routes';

const primaryColor = palette('{sky}');

const AuraSky = definePreset(theme, {
  semantic: {
    primary: primaryColor,
  },
});
registerLocaleData(localeBo, 'es');
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideHttpClient(),
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
  ],
};
