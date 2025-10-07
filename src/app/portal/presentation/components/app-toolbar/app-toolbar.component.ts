import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-toolbar',
  imports: [MenubarModule],
  template: `
    <div class="card">
      <p-menubar [model]="items" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
    },
    {
      label: 'Documentos',
      icon: 'pi pi-file ',
      routerLink:"repository"
    },
  ];
}
