import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-report-found-items',
  templateUrl: './report-found-items.page.html',
  styleUrls: ['./report-found-items.page.scss'],
  standalone: false
})
export class ReportFoundItemsPage implements OnInit {

  constructor(
    private router: Router,
    private toastCtrl: ToastController
  ) { }


  ngOnInit() {
  }

  onReportSubmit(formData: any) {
    console.log('Received data in page:', formData);

    const postData = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        postData.append(key, formData[key]);
      }
    });

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file: File) => {
        postData.append('images', file, file.name);
      });
    }


    console.log('Sending this FormData to the backend:', postData);

    this.presentToast('Item reported successfully!');
    this.router.navigate(['/home']);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }
}
