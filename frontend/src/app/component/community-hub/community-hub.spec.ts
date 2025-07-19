import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityHub } from './community-hub';

describe('CommunityHub', () => {
  let component: CommunityHub;
  let fixture: ComponentFixture<CommunityHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
