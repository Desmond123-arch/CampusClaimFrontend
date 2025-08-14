import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule, ModalController } from "@ionic/angular";
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-succesful-claim',
  templateUrl: './succesful-claim.component.html',
  imports: [IonicModule],
  styleUrls: ['./succesful-claim.component.scss'],
  standalone: true,
})
export class SuccesfulClaimComponent  implements OnInit {
  @Output() dismiss = new EventEmitter<void>();
  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  onCloseModal() {
   this.modalController.dismiss()
  }

}
