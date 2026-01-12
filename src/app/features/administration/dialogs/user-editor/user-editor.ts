import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';

import { UserDataSource } from '../../services';

@Component({
  selector: 'app-user-editor',
  imports: [ListboxModule],
  templateUrl: './user-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditor {
  private userDataSource = inject(UserDataSource);

  roles = this.userDataSource.roles;
}
