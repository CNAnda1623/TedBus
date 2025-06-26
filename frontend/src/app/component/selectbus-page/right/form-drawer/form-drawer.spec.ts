import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDrawer } from './form-drawer';

describe('FromDrawer', () => {
  let component: FormDrawer;
  let fixture: ComponentFixture<FormDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
