import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { IonIcon } from "@ionic/angular/standalone";
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { SearchService } from 'src/app/service/search.service';
import { closeLoading, showLoading } from 'src/app/utils/loading';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { presentToast } from 'src/app/utils/toast';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class SearchBarComponent implements OnInit {
  @Output() searchStarted = new EventEmitter<void>();
  @Output() Results = new EventEmitter<any>();

  public searchForm: FormGroup = new FormGroup({});
  constructor(
    private searchService: SearchService,
    private loadingCtrl: LoadingController,
    private toastContrl: ToastController,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      text: ['']
    })
  }

  onSearchByText() {
    const text = this.searchForm.get('text')!.value;

    if (!text.trim()) {
      return;
    }
    this.searchStarted.emit(); 
    showLoading(this.loadingCtrl);
    this.searchService.searchByText(text).subscribe(
      {
        next: async (response) => {
          await closeLoading(this.loadingCtrl);
          console.log(response)
          await this.searchService.storeSearchResults(response);
          if (this.router.url !== '/main/search') {
            this.router.navigateByUrl('/main/search');
          }

        },
        error: async (err) => {
          await closeLoading(this.loadingCtrl);
          presentToast(this.toastContrl, "An error occured while searching", 'danger', 3000)
          console.log(err);
        }
      }
    )
  }

  public async getNewPhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
    const response = await fetch(capturedPhoto.webPath!);
    const blob = await response.blob();
    this.searchStarted.emit(); 
    await showLoading(this.loadingCtrl);
    this.searchService.searchByImage(blob).subscribe(
      {
        next: async (response) => {
          await closeLoading(this.loadingCtrl);
          console.log(response)
          await this.searchService.storeSearchResults(response);
          if (this.router.url !== '/main/search') {
            this.router.navigateByUrl('/main/search');
          }

        },
        error: async (err) => {
          await closeLoading(this.loadingCtrl);
          presentToast(this.toastContrl,"An error occured while searching. Please try again",'danger', 200)
          console.log(err);
        }
      }
    )
  }

  b64toBlob(b64Data: string, contentType: string, sliceSize: number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
