import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

import {
  HeroSlideConfigDialogComponent,
  QuickAccessConfigDialogComponent,
} from '../../dialogs';

@Component({
  selector: 'app-content-settings',
  templateUrl: './content-settings.html',
  imports: [CommonModule, ButtonModule, ChipModule, DynamicDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContentSettings {
  private dialogService = inject(DialogService);

  showHeroSectionDialog() {
    this.dialogService.open(HeroSlideConfigDialogComponent, {
      header: 'Configuración banner',
      modal: true,
      width: '60vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }

  showQuickAccessDialog() {
    this.dialogService.open(QuickAccessConfigDialogComponent, {
      header: 'Configuración accesos directos',
      modal: true,
      width: '35vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }
}
