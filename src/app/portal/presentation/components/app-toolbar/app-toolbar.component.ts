import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  imports: [MenubarModule],
  template: `
    <p-menubar [model]="items" class="sticky top-0 z-50 ">
      <ng-template #start>
        <img src="images/icons/app.png" class="w-8 h-8" alt="Icon logo" />
      </ng-template>
    </p-menubar>
  `,
  styles: `
    /* In your component's CSS or a global stylesheet */
.p-menubar .p-menuitem-link.p-menuitem-link-active {
    background-color: var(--primary-color); /* Example: Highlight with primary color */
    color: var(--primary-color-text); /* Example: Change text color */
}
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
