import { TestBed } from '@angular/core/testing';

import { CabCustomerService } from './cab-customer.service';

describe('CabCustomerService', () => {
  let service: CabCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CabCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
