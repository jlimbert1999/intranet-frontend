import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { definePreset, palette } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import theme from '@primeuix/themes/aura';

import { routes } from './app.routes';

const primaryColor = palette('{sky}');

const AuraSky = definePreset(theme, {
  semantic: {
    primary: primaryColor ,
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
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
  ],
};
