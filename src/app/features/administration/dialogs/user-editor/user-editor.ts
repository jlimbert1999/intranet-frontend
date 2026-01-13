import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

import { UserDataSource } from '../../services';
import { UserResponse } from '../../interfaces';

@Component({
  selector: 'app-user-editor',
  imports: [CommonModule, ReactiveFormsModule, ListboxModule, ButtonModule],
  templateUrl: './user-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditor {
  private userDataSource = inject(UserDataSource);
  private dialogRef = inject(DynamicDialogRef);

  readonly data: UserResponse = inject(DynamicDialogConfig).data;
  userForm: FormGroup = inject(FormBuilder).nonNullable.group({
    roleIds: [[], [Validators.required, Validators.minLength(1)]],
  });

  roles = this.userDataSource.roles;

  ngOnInit() {
    this.loadForm();
  }

  save() {
    const { roleIds } = this.userForm.value;
    this.userDataSource.update(this.data.id, roleIds).subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  close() {
    this.dialogRef.close();
  }

  private loadForm() {
    this.userForm.patchValue({
      roleIds: this.data.roles.map(({ id }) => id),
    });
  }
}
