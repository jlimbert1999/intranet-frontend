import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [MenubarModule, CommonModule, RouterModule],
  template: `
    <p-menubar [model]="items" class="sticky top-0 z-50">
      <ng-template #start>
        <img src="images/icons/app.png" class="w-8 h-8" alt="Icon logo" />
      </ng-template>
      <ng-template #item let-item let-root="root">
        <a
          pRipple
          class="flex items-center p-menubar-item-link font-bold rounded"
          [routerLink]="item.routerLink"
        >
          <span class="text-primary-900">{{ item.label }}</span>
          <p-badge
            *ngIf="item.badge"
            [ngClass]="{ 'ml-auto': !root, 'ml-2': root }"
          />
          <span
            *ngIf="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            *ngIf="item.items"
            [ngClass]="[
              'ml-auto pi',
              root ? 'pi-angle-down' : 'pi-angle-right'
            ]"
          ></i>
        </a>
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
    {
      label: 'Comunicados',
      // icon: 'pi pi-file ',
      routerLink: 'repository',
    },
    {
      label: 'Directorio telefonico',
      // icon: 'pi pi-file ',
      routerLink: 'repository',
    },
    {
      label: 'Calendario institucional',
      // icon: 'pi pi-file ',
      routerLink: 'repository',
    },
    {
      label: 'Sobre nosotros',
      // icon: 'pi pi-file ',
      routerLink: 'repository',
    },
  ];
}
