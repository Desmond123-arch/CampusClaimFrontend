import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonDatetime, IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { IonButton } from "@ionic/angular/standalone";
import { Item } from 'src/types/item';
import { format } from 'date-fns'
import { ClaimsService } from 'src/app/service/claims.service';
import { presentToast } from 'src/app/utils/toast';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { SuccesfulClaimComponent } from '../succesful-claim/succesful-claim.component';
import { Router } from '@angular/router';
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
  formattedDateString = '';

  constructor(private fb: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private claimService: ClaimsService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.claimForm = this.fb.group({});
  }



  ngOnInit() {
    this.claimForm = this.fb.group({
      uniqueFeature: ['', [Validators.required, Validators.minLength(5)]],
      lostLocation: ['', [Validators.required, Validators.minLength(3)]],
      lostDateTime: ['', Validators.required],
      deliveryPhone: [''],

      agreedToTerms: [false, Validators.requiredTrue]
    });


    this.claimForm.get('lostDateTime')?.valueChanges.subscribe(value => {
      // console.log(value)
      this.formattedDateString = format(new Date(value), 'MMM d, y, h:mm a') || '';
    });
  }

  async submitClaim() {
    if (this.claimForm.valid) {
      await showLoading(this.loadingCtrl)
      console.log(this.claimForm.value)
      this.modalController.dismiss(this.claimForm.value, 'claim-submitted');
      this.claimService.submitClaim(this.claimForm.value, this.item.item_uuid).subscribe({
        next: async (response) => {
          console.log(response)
          await closeLoading(this.loadingCtrl)
          // await presentToast(this.toastCtrl, "Claimed submitted to the poster", 'success', 2000)
          await this.showSuccessModal();
        },
        error: async (err) => {
          await closeLoading(this.loadingCtrl)
          await presentToast(this.toastCtrl, err.error.error, 'warning', 3000)
        }
      })
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

  async showSuccessModal() {
    const successModal = await this.modalController.create({
      component: SuccesfulClaimComponent,
      backdropDismiss: false,
      cssClass: 'success-modal'
    });
    await successModal.present();

    await successModal.onDidDismiss();
    this.router.navigateByUrl("/main/home");
  }

}
