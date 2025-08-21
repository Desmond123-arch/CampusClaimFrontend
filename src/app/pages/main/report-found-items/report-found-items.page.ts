import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ItemsService } from 'src/app/service/items.service';
import { presentToast } from 'src/app/utils/toast';
import { IonicModule, LoadingController } from '@ionic/angular';
import { closeLoading, showLoading } from 'src/app/utils/loading';


@Component({
  selector: 'app-report-found-items',
  templateUrl: './report-found-items.page.html',
  styleUrls: ['./report-found-items.page.scss'],
  standalone: false
})
export class ReportFoundItemsPage implements OnInit {
  reportType: string = "Lost"
  formSubmitSuccess: boolean = false;
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private itemService: ItemsService,
    private loadingCtrl: LoadingController
  ) { }


  ngOnInit() {
  }

  async onReportSubmit(formData: any) {

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
    await showLoading(this.loadingCtrl)
    this.itemService.postItem(postData).subscribe({
      next: (async response => {
        await closeLoading(this.loadingCtrl)
        this.formSubmitSuccess = true;
        await this.router.navigate(['/main/home']);
        setTimeout(async () => {
          await this.router.navigate(['/main/home']);
        }, 1500);
        console.log(response)
      }),
      error: (async error => {
        await closeLoading(this.loadingCtrl)
        await presentToast(this.toastCtrl, "Error occured while adding item", 'danger', 3000)
        console.log(error)
      })
    })
  }
  changeReportType(type: string) {
    this.reportType = type;
  }
}
