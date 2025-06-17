import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectbusPage } from './selectbus-page';

describe('SelectbusPage', () => {
  let component: SelectbusPage;
  let fixture: ComponentFixture<SelectbusPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectbusPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectbusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
