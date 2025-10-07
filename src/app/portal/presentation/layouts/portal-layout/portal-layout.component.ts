import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppToolbarComponent } from '../../components';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterModule, AppToolbarComponent],
  templateUrl: './portal-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PortalLayoutComponent {}
