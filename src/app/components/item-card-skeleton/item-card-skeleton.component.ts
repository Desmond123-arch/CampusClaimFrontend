import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-item-card-skeleton',
  templateUrl: './item-card-skeleton.component.html',
  imports: [IonicModule, CommonModule],
  styleUrls: ['./item-card-skeleton.component.scss'],
  standalone: true
})
export class ItemCardSkeletonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
