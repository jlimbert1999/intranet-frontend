import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { SelectItemGroup } from 'primeng/api';

import { RoleDataSource } from '../../../datasources';

@Component({
  selector: 'app-role-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ListboxModule,
    ButtonModule,
  ],
  template: `
    <form [formGroup]="roleForm" (ngSubmit)="save()">
      <div class=" space-y-2 pt-2">
        <p-floatlabel variant="on">
          <input
            id="name"
            [fluid]="true"
            pInputText
            autocomplete="off"
            formControlName="name"
          />
          <label for="name">Nombre</label>
        </p-floatlabel>
        <p-listbox
          [options]="permissions()"
          [group]="true"
          [checkbox]="true"
          [multiple]="true"
          scrollHeight="400px"
          [showToggleAll]="false"
          formControlName="permissionIds"
        >
          <ng-template let-permission #group>
            <div class="font-bold mt-2 border-b">
              {{ permission.label | uppercase }}
            </div>
          </ng-template>
          <ng-template let-action #item>
            <div class="ml-2">
              {{ action.label }}
            </div>
          </ng-template>
        </p-listbox>
      </div>
      <div class="p-dialog-footer">
        <p-button
          label="Cancelar"
          type="button"
          severity="secondary"
          (onClick)="close()"
        />
        <p-button label="Guardar" type="submit" [disabled]="roleForm.invalid" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDialog {
  private roleDataSource = inject(RoleDataSource);
  private _formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);

  permissions = computed<SelectItemGroup[]>(() =>
    this.roleDataSource.permissions().map(({ resource, actions }) => ({
      value: resource,
      label: resource,
      items: actions.map((item) => ({
        label: item.action,
        value: item.id,
      })),
    }))
  );

  roleForm: FormGroup = this._formBuilder.nonNullable.group({
    name: ['', Validators.required],
    permissionIds: ['', [Validators.required, Validators.minLength(1)]],
  });

  save() {
    console.log(this.roleForm.value);
    this.roleDataSource.create(this.roleForm.value).subscribe((data) => {
      console.log(data);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
