import { TestBed } from '@angular/core/testing';

import { PgatourService } from './pgatour.service';

describe('PgatourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PgatourService = TestBed.get(PgatourService);
    expect(service).toBeTruthy();
  });
});
