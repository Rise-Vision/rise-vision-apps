import { TestBed } from '@angular/core/testing';

import { LogoImageService } from './logo-image.service';

describe('LogoImageService', () => {
  let service: LogoImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
