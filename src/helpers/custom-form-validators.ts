import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomFormValidators {
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return !isWhitespace ? null : { whitespace: true };
  }
}
