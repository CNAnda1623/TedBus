import { TestBed } from '@angular/core/testing';
import { CommunityHubService } from './community-hub.service';

describe('CommunityHubService', () => {
  let service: CommunityHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
