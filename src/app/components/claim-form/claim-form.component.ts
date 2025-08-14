import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonButton } from "@ionic/angular/standalone";
import { Item } from 'src/types/item';
import { format } from 'date-fns'
@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ClaimFormComponent implements OnInit {
  @Input() item!: Item

  // @Output() claimSubmitted = new EventEmitter<any>();
  // @Output() claimCancelled = new EventEmitter<void>();

  claimForm: FormGroup;
  currentStep = 1;
  formattedDateString = '';

  constructor(private fb: FormBuilder, private modalController: ModalController) {
    this.claimForm = this.fb.group({});
  }



  ngOnInit() {
    this.claimForm = this.fb.group({
      uniqueFeature: ['', [Validators.required, Validators.minLength(5)]],
      lostLocation: ['', [Validators.required, Validators.minLength(3)]],
      lostDateTime: ['', Validators.required],

      returnMethod: ['pick-up', Validators.required],
      deliveryAddress: [''],
      deliveryPhone: [''],

      agreedToTerms: [false, Validators.requiredTrue]
    });

    this.claimForm.get('returnMethod')?.valueChanges.subscribe(method => {
      const deliveryAddressControl = this.claimForm.get('deliveryAddress');
      const deliveryPhoneControl = this.claimForm.get('deliveryPhone');

      if (method === 'delivery') {
        deliveryAddressControl?.setValidators([Validators.required, Validators.minLength(10)]);
        deliveryPhoneControl?.setValidators([Validators.required, Validators.pattern(/^\+[1-9]\d{1,14}$/)]);
      } else {
        deliveryAddressControl?.clearValidators();
        deliveryPhoneControl?.clearValidators();
      }
      deliveryAddressControl?.updateValueAndValidity();
      deliveryPhoneControl?.updateValueAndValidity();
    });

    this.claimForm.get('lostDateTime')?.valueChanges.subscribe(value => {
      // console.log(value)
      this.formattedDateString = format(new Date(value), 'MMM d, y, h:mm a') || '';
    });
  }

  isStep1Valid(): boolean {
    const feature = this.claimForm.get('uniqueFeature');
    const location = this.claimForm.get('lostLocation');
    const dateTime = this.claimForm.get('lostDateTime');
    const terms = this.claimForm.get('agreedToTerms');
    return !!(feature?.valid && location?.valid && dateTime?.valid && terms?.valid);
  }

  nextStep() {
    if (this.isStep1Valid()) {
      this.currentStep = 2;
    }
  }

  previousStep() {
    this.currentStep = 1;
  }

  submitClaim() {
    if (this.claimForm.valid) {
      this.modalController.dismiss(this.claimForm.value, 'claim-submitted');
    } else {
      this.claimForm.markAllAsTouched();
    }
  }
  cancel() {
    this.modalController.dismiss(null, 'claim-cancelled');
  }

  get returnMethod() {
    return this.claimForm.get('returnMethod');
  }

}
