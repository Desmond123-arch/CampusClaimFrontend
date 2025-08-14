import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemDetailModalComponent } from './item-detail-modal.component';

describe('ItemDetailModalComponent', () => {
  let component: ItemDetailModalComponent;
  let fixture: ComponentFixture<ItemDetailModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ItemDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
