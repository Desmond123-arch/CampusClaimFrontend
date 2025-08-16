import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { isFuture } from 'date-fns';
import { filter } from 'rxjs';

interface Category {
  name: string;
  icon: string;
}

interface ImagePreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-found-item-form',
  templateUrl: './found-item-form.component.html',
  styleUrls: ['./found-item-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  providers: [DatePipe],
})
export class FoundItemFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() ReportType = new EventEmitter<any>();

  foundItemForm!: FormGroup;
  formattedDateString = '';
  selectedImages: { url: string, name: string, file: File }[] = [];
  reportOptions = ["Lost", "Found"]
  _reportType: string = this.reportOptions[0];
  categories: Category[] = [
    { name: 'Electronics', icon: 'laptop-outline' },
    { name: 'Clothing', icon: 'shirt-outline' },
    { name: 'Books', icon: 'book-outline' },
    { name: 'Accessories', icon: 'watch-outline' },
    { name: 'School Supplies', icon: 'school-outline' },
    { name: 'Documents', icon: 'document-text-outline' },
    { name: 'Keys', icon: 'key-outline' },
    { name: 'Wallets', icon: 'wallet-outline' }
  ];


  constructor(private fb: FormBuilder, private datePipe: DatePipe) { }

  correctDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { invalidDate: true };
      }

      if (isFuture(date)) {
        return { futureDate: true };
      }

      return null;
    };
  }

  ngOnInit() {
    this.foundItemForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      foundDateTime: ['', [Validators.required, this.correctDate()]],
      foundLocation: ['', [Validators.required, Validators.minLength(3)]],
      visibleFeature: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]{7,}$/)]],
      // verificationQuestion: ['', [Validators.required, Validators.minLength(10)]],
      bounty: [0, [Validators.min(0), Validators.pattern(/^\d+$/)]],
      images: [],
    });
    const dateControl = this.foundItemForm.get('foundDateTime')
    if (dateControl) {
      dateControl.valueChanges.pipe(filter(value => !!value))
        .subscribe((value) => {
          this.formattedDateString = this.datePipe.transform(value, 'MMM d, y, h:mm a') || '';
        });
    }
  }

  public set reportType(v: string) {
    this.ReportType.emit(v);
    this._reportType = v;
  }

  public get reportType(): string {
    return this._reportType;
  }


  getErrorMessage(controlName: string): string {
    const control = this.foundItemForm.get(controlName);

    if (control?.hasError('required')) {
      switch (controlName) {
        case 'itemName': return 'Item name is required';
        case 'category': return 'Category is required';
        case 'foundDateTime': return 'Date and time are required';
        case 'foundLocation': return 'Location is required';
        case 'visibleFeature': return 'Visible feature is required';
        case 'contactNumber': return 'Contact number is required';
        // case 'verificationQuestion': return 'Verification question is required';
        default: return 'This field is required';
      }
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Minimum length is ${requiredLength} characters`;
    }

    if (control?.hasError('pattern')) {
      if (controlName === 'contactNumber') {
        return 'Enter a valid phone number';
      }
      if (controlName === 'bounty') {
        return 'Bounty must be a whole number';
      }
    }

    if (control?.hasError('min')) {
      return 'Value must be zero or more';
    }

    if (control?.hasError('futureDate')) {
      return 'Date cannot be in the future';
    }

    if (control?.hasError('invalidDate')) {
      return 'Invalid date format';
    }

    return '';
  }


  onFileSelected(event: any): void {
    const files = event.target.files;
    // console.log(files)
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImages.push({
            name: file.name,
            url: reader.result as string,
            file: file
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {

    this.selectedImages.splice(index, 1);
    this.updateImagesFormControl();
  }

  private updateImagesFormControl() {
    const imageFiles = this.selectedImages.map(img => img.file);
    this.foundItemForm.get('images')?.setValue(imageFiles);
  }

  submitForm() {
    if (this.foundItemForm.valid && this.selectedImages.length !== 0) {
      console.log('Form is valid. Emitting data:', this.foundItemForm.value);
      this.foundItemForm.value["images"] = this.selectedImages;
      this.formSubmitted.emit(this.foundItemForm.value);
    } else {
      // console.error('Form is invalid.');
      // console.log(this.foundItemForm)
      this.foundItemForm.markAllAsTouched();
    }
  }
}