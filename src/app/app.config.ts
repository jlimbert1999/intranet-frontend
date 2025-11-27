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
const esTranslation = {
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
};

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
      translation: esTranslation,
  }),
  { provide: LOCALE_ID, useValue: 'es-BO' },
 ],
};