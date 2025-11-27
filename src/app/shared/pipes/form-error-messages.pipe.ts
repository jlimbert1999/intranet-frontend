import { Pipe, type PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export type FieldValidationErrorMessages =
  | {
      [field: string]: ValidationErrorMessages;
    }
  | undefined;

export type ValidationErrorMessages = {
  [error: string]: string;
};

@Pipe({
  name: 'formErrorMessages',
  standalone: true,
})
export class FormErrorMessagesPipe implements PipeTransform {
  transform(
    errors: ValidationErrors | null | undefined,
    customMessages?: ValidationErrorMessages
  ): string {
    if (!errors) return '';

    const firstErrorKey = this.getPrioritizedErrorKey(errors);

    if (customMessages?.[firstErrorKey]) {
      return customMessages[firstErrorKey];
    }

    return this.handleGenericErrorMessages(errors, firstErrorKey);
  }

  private getPrioritizedErrorKey(errors: ValidationErrors): string {
    if (errors['unique']) {
      return 'unique';
    }

    return Object.keys(errors)[0];
  }

  private handleGenericErrorMessages(errors: ValidationErrors, key: string): string {
    switch (key) {
      case 'required':
        return 'Este campo es obligatorio.';

      case 'minlength':
        return `Ingrese al menos ${errors['minlength'].requiredLength} caracteres.`;

      case 'maxlength':
        return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;

      case 'unique':
        return 'Este nombre ya está registrado. Por favor, use uno diferente.';

      case 'pattern':
        if (errors['pattern'].actualValue !== errors['pattern'].requiredPattern) {
          return 'Formato de teléfono no válido (3 a 8 dígitos).';
        }
        return 'El formato es incorrecto.';

      case 'atLeastOnePhoneRequired':
        return 'Debe ingresar al menos un número de contacto (Jefe, Soporte, Secretaria o Fijo).';

      default:
        return 'Error de validación: El campo no es válido.';
    }
  }
}
