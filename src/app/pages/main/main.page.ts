import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
  standalone: false,
})
export class MainPage implements OnInit, AfterViewInit {
  private routerSubscription: Subscription = new Subscription();
  selectedTab: string = 'home';

  constructor(
    private router: Router,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    // console.log('MainPage constructor - Current URL:', this.router.url);
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }
  ionViewDidEnter() {

    setTimeout(() => {
      this.forceTabBarRedraw();
    }, 300);
  }

  forceTabBarRedraw() {
    const tabBar = this.elementRef.nativeElement.querySelector('ion-tab-bar');

    if (tabBar) {
      this.renderer.addClass(tabBar, 'force-repaint');
      setTimeout(() => {
        this.renderer.removeClass(tabBar, 'force-repaint');
      }, 10);
    }
  }
}
