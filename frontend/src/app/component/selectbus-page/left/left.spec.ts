import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftComponent } from './left';

describe('Left', () => {
  let component: LeftComponent;
  let fixture: ComponentFixture<LeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
