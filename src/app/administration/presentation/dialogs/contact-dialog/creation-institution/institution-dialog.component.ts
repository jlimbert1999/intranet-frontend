import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
 FormBuilder,
 ReactiveFormsModule,
 NonNullableFormBuilder,
 Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog'; 
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { FormErrorMessagesPipe } from '../../../../../shared/pipes/form-error-messages.pipe'; 

import { InstanceTypeService } from '../../../../infrastructure/services/instance-type.service'; 


interface CreateInstanceFormValues {
  name: string;
}


@Component({
 selector: 'app-create-instance-dialog',
 standalone: true,
 imports: [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  MessageModule,
  ButtonModule,
  FormErrorMessagesPipe, 
 ],
 templateUrl: './institution-dialog.component.html', 
 changeDetection: ChangeDetectionStrategy.OnPush, 
 providers: [DialogService] 
})
export class CreateInstanceDialogComponent {
 private formBuilder: NonNullableFormBuilder = inject(FormBuilder) as NonNullableFormBuilder;
 private instanceTypeService = inject(InstanceTypeService); 
 private dialogRef = inject(DynamicDialogRef); 

 createInstanceForm = this.formBuilder.group({
  name: [
   '',
   [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
  ],
 });

 save() {
  if (this.createInstanceForm.invalid) {
    this.createInstanceForm.markAllAsTouched();
    return;
  }
  
  const { name } = this.createInstanceForm.getRawValue();

  this.instanceTypeService.create(name).subscribe({
    next: () => {
      this.close(true); 
    },
    error: (err) => {
      console.error('Error al crear el tipo de instancia:', err);
    },
  });
 }

 close(result: boolean | null) {
  this.dialogRef.close(result); 
 }

 isInvalid(controlName: keyof CreateInstanceFormValues): boolean {
  const control = this.createInstanceForm.get(controlName);
  return !!control && control.invalid && (control.touched || control.dirty);
 }
}