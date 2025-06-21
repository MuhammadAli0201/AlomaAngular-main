import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strictDecimalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === '') return null;

    const pattern = /^-?\d*(\.\d+)?$/;

    return pattern.test(value) ? null : { invalidDecimal: true };
  };
}
