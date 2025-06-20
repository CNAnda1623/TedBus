import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallSeats } from './small-seats';

describe('SmallSeats', () => {
  let component: SmallSeats;
  let fixture: ComponentFixture<SmallSeats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallSeats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallSeats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
