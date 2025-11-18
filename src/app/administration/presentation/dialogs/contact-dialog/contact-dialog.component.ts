import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api'; 

import { ContactService } from '../../../infrastructure/services/contact.service';
import { InstanceTypeService } from '../../../infrastructure/services/instance-type.service';
import { Contacto, InstanceType } from '../../../domain/models/contact.model';
import { FormErrorMessagesPipe } from '../../../../shared/pipes/form-error-messages.pipe';
import { CreateInstanceDialogComponent } from '../../../presentation/dialogs/contact-dialog/creation-institution/institution-dialog.component';
import { Observable, first } from 'rxjs';

interface ContactFormValues {
  instancia: string;
  jefe: number | null;
  soporte: number | null;
  secretaria: number | null;
  telefonoFijo: number | null;
  direccion: string;
  instanceType: string | null;
}

interface DialogResult {
    success: boolean;
    instancia: string;
}

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    MessageModule,
    ButtonModule,
    SelectModule,
    FormErrorMessagesPipe,
  ],
  templateUrl: './contact-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, MessageService] 
})
export class ContactDialogComponent implements OnInit {
  private formBuilder: NonNullableFormBuilder = inject(FormBuilder) as NonNullableFormBuilder;
  private dialogRef = inject(DynamicDialogRef<DialogResult>); 
  private contactService = inject(ContactService);
  private dialogConfig = inject(DynamicDialogConfig);
  private dialogService = inject(DialogService);
  private instanceTypeService = inject(InstanceTypeService);
  private messageService = inject(MessageService); 

  readonly data: (Contacto & { isEdit?: boolean }) | undefined = this.dialogConfig.data;
  instanceTypes$!: Observable<InstanceType[]>;

  private readonly phoneValidator = [
    Validators.pattern(/^\d{3,8}$/),
  ];

  private readonly atLeastOnePhoneValidator = (control: AbstractControl): ValidationErrors | null => {
    const jefe = control.get('jefe')?.value;
    const soporte = control.get('soporte')?.value;
    const secretaria = control.get('secretaria')?.value;
    const telefonoFijo = control.get('telefonoFijo')?.value;

    if (jefe || soporte || secretaria || telefonoFijo) return null;
    return { atLeastOnePhoneRequired: true };
  };

  contactForm = this.formBuilder.group({
    instancia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    instanceType: [null as string | null, [Validators.required]], 
    jefe: [null as number | null, this.phoneValidator],
    soporte: [null as number | null, this.phoneValidator],
    secretaria: [null as number | null, this.phoneValidator],
    telefonoFijo: [null as number | null, this.phoneValidator],
  }, {
    validators: this.atLeastOnePhoneValidator
  });

  ngOnInit() {
    this.instanceTypes$ = this.instanceTypeService.getAll();
    if (this.data) {
      this.loadForm();
    }
  }

  openCreateInstanceDialog() {
    const ref = this.dialogService.open(CreateInstanceDialogComponent, {
      header: 'Crear Institución',
      width: '400px',
      modal: true
    });

    if (ref) {
      ref.onClose.subscribe((result) => {
        if (result === true) {
          this.instanceTypeService.reload();
        }
      });
    }
  }

  save() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.markPhoneControlsAsDirtyAndTouched();
      return;
    }

    const formValues = this.contactForm.getRawValue();

    const contactData: Partial<Contacto> = {
      instancia: formValues.instancia,
      direccion: formValues.direccion,
      jefe: formValues.jefe ?? undefined,
      soporte: formValues.soporte ?? undefined,
      secretaria: formValues.secretaria ?? undefined,
      telefonoFijo: formValues.telefonoFijo ?? undefined,
      instanceTypeId: formValues.instanceType ?? undefined, 
    };

    const subscription = this.data && this.data.id
      ? this.contactService.update(this.data.id, contactData)
      : this.contactService.create(contactData);

    subscription.subscribe({
      next: () => {
        const action = this.data && this.data.id ? 'Edición' : 'Creación';
        this.close({ success: true, instancia: formValues.instancia }); 
        this.messageService.add({ 
            severity: 'success', 
            summary: `${action} Exitosa`, 
            detail: `El contacto "${formValues.instancia}" fue guardado correctamente.` 
        });
      },
      error: (err) => {
        console.error('Error al guardar el contacto', err);
        
        const errorMessage = err?.error?.message || JSON.stringify(err);
        let isDuplicateError = false;
        
        if (!this.data?.isEdit && (errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('ya existe'))) {
            this.contactForm.get('instancia')?.setErrors({ unique: true });
            isDuplicateError = true;
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Advertencia', 
                detail: `La instancia "${formValues.instancia}" ya está registrada. Por favor, use un nombre diferente.` 
            });
        } else {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: `No se pudo guardar el contacto "${formValues.instancia}".` 
            });
        }
        if (!isDuplicateError) {
            this.close({ success: false, instancia: formValues.instancia }); 
        }
      },
    });
  }

  private markPhoneControlsAsDirtyAndTouched(): void {
    const phoneControls = ['jefe', 'soporte', 'secretaria', 'telefonoFijo'];
    phoneControls.forEach(name => {
      const control = this.contactForm.get(name);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }

  close(result: boolean | DialogResult = false) { 
    if (typeof result === 'boolean') {
        this.dialogRef.close(result ? { success: true, instancia: this.contactForm.get('instancia')?.value } : null);
    } else {
        this.dialogRef.close(result);
    }
  }

  isInvalid(controlName: keyof ContactFormValues): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private loadForm() {
    if (!this.data) return;

    this.instanceTypes$.pipe(first()).subscribe(instanceTypes => {
      let selectedInstanceType: string | null = null;

      if (this.data!.instanceType) {
        selectedInstanceType = this.data!.instanceType.id; 
      }

      this.contactForm.patchValue({
        instancia: this.data!.instancia ?? '',
        direccion: this.data!.direccion ?? '',
        jefe: this.data!.jefe ?? null,
        soporte: this.data!.soporte ?? null,
        secretaria: this.data!.secretaria ?? null,
        telefonoFijo: this.data!.telefonoFijo ?? null,
        instanceType: selectedInstanceType,
      });
    });
  }
}