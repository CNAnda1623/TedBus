import { TestBed } from '@angular/core/testing';

import { CustomerModel } from './customer.service';

describe('Customer', () => {
  let service: CustomerModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerModel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
