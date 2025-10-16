import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-toolbar',
  imports: [MenubarModule, CommonModule, RouterModule],
  template: `
    <p-menubar [model]="items" class="sticky top-0 z-50 ">
      <ng-template #start>
        <img src="images/icons/app.png" class="w-8 h-8" alt="Icon logo" />
      </ng-template>
     
    </p-menubar>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent {
  items: MenuItem[] = [
    {
      label: 'Inicio',
      // icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Documentos',
      // icon: 'pi pi-file ',
      routerLink: 'repository',
    },
  ];
}
