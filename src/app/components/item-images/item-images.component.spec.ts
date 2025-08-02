import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemImagesComponent } from './item-images.component';

describe('ItemImagesComponent', () => {
  let component: ItemImagesComponent;
  let fixture: ComponentFixture<ItemImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ItemImagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
