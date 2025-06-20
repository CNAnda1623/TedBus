import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromDrawer } from './from-drawer';

describe('FromDrawer', () => {
  let component: FromDrawer;
  let fixture: ComponentFixture<FromDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FromDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
