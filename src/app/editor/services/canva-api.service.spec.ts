import { TestBed } from '@angular/core/testing';

import { CanvaApiService } from './canva-api.service';

describe('CanvaApiService', () => {
  let service: CanvaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
