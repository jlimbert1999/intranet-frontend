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
import { MessageService } from 'primeng/api'; 

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
providers: [DialogService, MessageService] 
})
export class CreateInstanceDialogComponent {
private formBuilder: NonNullableFormBuilder = inject(FormBuilder) as NonNullableFormBuilder;
private instanceTypeService = inject(InstanceTypeService); 
private dialogRef = inject(DynamicDialogRef); 
  private messageService = inject(MessageService); 

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
        this.messageService.add({ 
            severity: 'success', 
            summary: 'Creación Exitosa', 
            detail: `Tipo de institución "${name}" creado correctamente.` 
        });
   this.close(true); 
  },
  error: (err) => {
   console.error('Error al crear el tipo de instancia:', err);

      const errorMessage = err?.error?.message || JSON.stringify(err);
      
      let isDuplicateError = false;
      if (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('ya existe')) {
          this.createInstanceForm.get('name')?.setErrors({ unique: true });
          isDuplicateError = true;
          this.messageService.add({ 
              severity: 'warn', 
              summary: 'Advertencia', 
              detail: `El nombre "${name}" ya existe. Por favor, elija uno diferente.` 
          });
      } else {
          this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: `No se pudo crear el tipo de institución "${name}".` 
          });
      }
      if (!isDuplicateError) {
          this.close(false);
      }
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