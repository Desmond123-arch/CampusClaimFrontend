import { AbstractControl, ValidationErrors } from "@angular/forms";

export function otpRequiredLength(length: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.toString().length !== length) {
      return { otpLength: true };
    }
    return null;
  };
}