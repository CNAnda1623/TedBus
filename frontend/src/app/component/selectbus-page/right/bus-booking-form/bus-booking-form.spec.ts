import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusBookingForm } from './bus-booking-form';

describe('BusBookingForm', () => {
  let component: BusBookingForm;
  let fixture: ComponentFixture<BusBookingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusBookingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusBookingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
