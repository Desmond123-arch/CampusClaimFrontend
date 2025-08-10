import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ItemsService } from 'src/app/service/items.service';
import { presentToast } from 'src/app/utils/toast';

@Component({
  selector: 'app-report-found-items',
  templateUrl: './report-found-items.page.html',
  styleUrls: ['./report-found-items.page.scss'],
  standalone: false
})
export class ReportFoundItemsPage implements OnInit {

  reportType: string = "Lost"
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private itemService: ItemsService
  ) { }


  ngOnInit() {
  }

  onReportSubmit(formData: any) {

    const postData = new FormData();

    // Object.keys(formData).forEach(key => {
    //   if (key !== 'images') {
    //     postData.append(key, formData[key]);
    //   }
    // });

    postData.append('title', formData["itemName"])
    postData.append('bounty', formData["bounty"])
    postData.append('category', formData["category"])
    postData.append('status', this.reportType)
    postData.append('found_at', formData['foundLocation'])
    postData.append('description', formData['visibleFeature'])

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file: any, index: any) => {
        postData.append('images', file.file, file.name);
      });
    }
    this.itemService.postItem(postData).subscribe({
      next: (response => {
        console.log(response)
      }),
      error: (error => {
        console.log(error)
      })
    })
    presentToast(this.toastCtrl, "Item reported successfully", 'success', 3000)
    // this.router.navigate(['/main/home']);

  }
  changeReportType(type: string) {
    this.reportType = type;
  }
}
