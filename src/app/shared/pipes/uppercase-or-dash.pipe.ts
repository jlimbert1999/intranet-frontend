import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseOrDash',
  standalone: true
})
export class UppercaseOrDashPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value).toUpperCase();
  }
}
