import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportFoundItemsPage } from './report-found-items.page';

describe('ReportFoundItemsPage', () => {
  let component: ReportFoundItemsPage;
  let fixture: ComponentFixture<ReportFoundItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFoundItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
