import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabBookingForm } from './cab-booking-form';

describe('CabBookingForm', () => {
  let component: CabBookingForm;
  let fixture: ComponentFixture<CabBookingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabBookingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabBookingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
