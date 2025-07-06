import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabBook } from './cab-book';

describe('CabBook', () => {
  let component: CabBook;
  let fixture: ComponentFixture<CabBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CabBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
