
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ghanaianPhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const phoneNumber = String(value).replace(/[\s-()]/g, '')
    const ghanaPhoneRegex =
      /^(?:\+233|233|0)(?:20|23|24|26|27|50|53|54|55|56|57|59)\d{7}$/;

    const isValid = ghanaPhoneRegex.test(phoneNumber);

    return isValid ? null : { invalidGhanaianPhoneNumber: true };
  };
}

export function UmatEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@st\.umat\.edu\.gh$/i;
    const isValid = emailRegex.test(value);
    return isValid ? null : { invalidSchoolEmail: true };
  }
}


export interface PasswordStrengthOptions {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
}


export function passwordStrengthValidator(options: Partial<PasswordStrengthOptions> = {}): ValidatorFn {
  const defaults: PasswordStrengthOptions = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true,
    requireSpecialChar: true,
  };
  const finalOptions = { ...defaults, ...options };
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value)
      return null;
    const errors: ValidationErrors = {};
    if (value.length < finalOptions.minLength) {
      errors["minLength"] = { requiredLength: finalOptions.minLength, actualLength: value.length };
    }
    if (finalOptions.requireUppercase && !/[A-Z]/.test(value)) {
      errors["requiredUppercase"] = true;
    }
    if (finalOptions.requireLowercase && !/[a-z]/.test(value)) {
      errors["requireLowercase"] = true;
    }
    if (finalOptions.requireDigit && !/[0-9]/.test(value)) {
      errors["requireDigit"] = true;
    }
    if (finalOptions.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors["requireSpecialChar"] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}

export function passwordsMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingcontrol = formGroup.get(matchingControlName);

    if (!control || !matchingcontrol) {
      return null;
    }
    if (matchingcontrol.errors && !matchingcontrol.errors["passwordsMatch"]) {
      return null;
    }
    if (control.value !== matchingcontrol.value) {
      matchingcontrol.setErrors({ passwordsMatch: true });
    } else {
      matchingcontrol.setErrors(null);
    }
    return null;
  }
}