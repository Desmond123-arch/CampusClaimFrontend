import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FoundItemFormComponent } from './found-item-form.component';

describe('FoundItemFormComponent', () => {
  let component: FoundItemFormComponent;
  let fixture: ComponentFixture<FoundItemFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FoundItemFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FoundItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
