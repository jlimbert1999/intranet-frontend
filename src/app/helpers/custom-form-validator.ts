import { AbstractControl } from '@angular/forms';

export class CustomFormValidator {
  static notOnlyWhitespace(control: AbstractControl) {
    const value = control.value as string;
    if (value && value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }
}
