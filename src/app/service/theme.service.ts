import { DOCUMENT, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  render: Renderer2
  constructor(private renderFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.render = this.renderFactory.createRenderer(null, null)
  }
  private isDarkSubject = new BehaviorSubject<boolean>(

    localStorage.getItem('CapacitorStorage.theme') === 'dark'

  );
  isDark$ = this.isDarkSubject.asObservable();


  async enableDark() {
    localStorage.setItem('theme', 'dark');
    this.render.addClass(this.document.body, 'dark');
    this.isDarkSubject.next(true);
  }

  async enableLight(){
    localStorage.setItem('theme', 'light');
    this.render.removeClass(this.document.body, 'dark');
    this.isDarkSubject.next(false);
  }
  getCurrentTheme(): boolean {
    return this.isDarkSubject.value;
  }
}
