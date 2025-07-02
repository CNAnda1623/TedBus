import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBus } from './custom-bus';

describe('CustomBus', () => {
  let component: CustomBus;
  let fixture: ComponentFixture<CustomBus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomBus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomBus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
