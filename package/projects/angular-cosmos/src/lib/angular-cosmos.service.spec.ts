import { TestBed } from '@angular/core/testing';

import { AngularCosmosService } from './angular-cosmos.service';

describe('AngularCosmosService', () => {
  let service: AngularCosmosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularCosmosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
