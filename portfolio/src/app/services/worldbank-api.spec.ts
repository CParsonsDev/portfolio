import { TestBed } from '@angular/core/testing';

import { WorldbankApi } from './worldbank-api';

describe('WorldbankApi', () => {
  let service: WorldbankApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldbankApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
