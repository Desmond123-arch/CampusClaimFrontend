import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,],
})
export class PageHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
