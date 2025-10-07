import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

import { HeroSlideConfigDialogComponent } from '../../dialogs';

@Component({
  selector: 'app-content-settings',
  imports: [CommonModule, ButtonModule, ChipModule, DynamicDialogModule],
  templateUrl: './content-settings.html',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContentSettings {
  private dialogService = inject(DialogService);

  showHeroSectionImageDialog() {
    this.dialogService.open(HeroSlideConfigDialogComponent, {
      header: 'Configuración banner',
      modal: true,
      width: '40vw',
    });
  }
}
