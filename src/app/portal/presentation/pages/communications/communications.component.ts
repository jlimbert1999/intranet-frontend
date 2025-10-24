import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { PortalCommunicationService } from '../../services';
@Component({
  selector: 'app-communications',
  imports: [TableModule, MenuModule, ButtonModule],
  templateUrl: './communications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommunicationsComponent {
  private portalCommunucationService = inject(PortalCommunicationService);

  selectedItem: any | null = null;

  readonly menuOptions: MenuItem[] = [
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
        },
        {
          label: 'Export',
          icon: 'pi pi-upload',
          command: (event) => {
            console.log(this.selectedItem);
          },
        },
      ],
    },
  ];

  communications = toSignal(
    this.portalCommunucationService.getAll({ limit: 10, offset: 0 }),
    { initialValue: [] }
  );

  openOptions() {
    if (!this.selectedItem) return;
  }
}
