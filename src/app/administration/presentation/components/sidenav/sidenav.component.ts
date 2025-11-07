import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, MenuModule, RouterModule],
  template: `
    <aside
      [ngClass]="{
        'translate-x-0': isOpen(),
        '-translate-x-full': !isOpen()
      }"
      class="fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0"
    >
      <div class="h-full overflow-y-auto">
        <p-menu [model]="items" styleClass="p-2 h-full">
          <ng-template #start>
            <div class="flex items-center p-2 mb-2">
              <img src="images/icons/app.png" class="h-8 w-8" alt="Icon app" />
              <span class="text-lg ml-3 font-semibold">Intranet</span>
            </div>
          </ng-template>
          <ng-template #submenuheader let-item>
            <span class="text-primary font-bold">{{ item.label }}</span>
          </ng-template>
          <ng-template #item let-item>
            <a
              pRipple
              [routerLink]="item.routerLink"
              routerLinkActive="bg-primary-100 rounded-xl"
              class="flex items-center p-menu-item-link"
            >
              <span [class]="item.icon"></span>
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </ng-template>
        </p-menu>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  isOpen = model.required<boolean>();
  items: MenuItem[] = [
    {
      label: 'Configuraciones',
      items: [
        {
          label: 'Contenido',
          icon: 'pi pi-objects-column',
          routerLink: 'content-settings',
        },
      ],
    },
    {
      label: 'Repositorio',
      items: [
        {
          label: 'Categorias',
          icon: 'pi pi-objects-column',
          routerLink: 'document-categories',
        },
        {
          label: 'Secciones',
          icon: 'pi pi-objects-column',
          routerLink: 'document-sections',
        },
        {
          label: 'Archivos',
          icon: 'pi pi-file',
          routerLink: 'file-explorer',
        },
      ],
    },
    {
      label: 'Institucional',
      items: [
        {
          label: 'Comunicados',
          icon: 'pi pi-objects-column',
          routerLink: 'communications-manage',
        },
        {
          label: 'Calendario',
          icon: 'pi pi-objects-column',
          routerLink: 'calendar-manage',
        },
        {
          label: 'Tutoriales',
          icon: 'pi pi-video',
          routerLink: 'tutorials-manage',
        },
      ],
    },
  ];
}
