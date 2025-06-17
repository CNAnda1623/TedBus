import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusBox } from './bus-box';

describe('BusBox', () => {
  let component: BusBox;
  let fixture: ComponentFixture<BusBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
