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
            <div class="flex items-center justify-center h-16 px-4 ">
              <span class="text-xl font-semibold">Dashboard</span>
            </div>
          </ng-template>
          <ng-template #submenuheader let-item>
            <span class="text-primary font-bold">{{ item.label }}</span>
          </ng-template>
          <ng-template #item let-item>
            <a
              pRipple
              class="flex items-center p-menu-item-link ml-2"
              [routerLink]="item.routerLink"
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
  ];
}
