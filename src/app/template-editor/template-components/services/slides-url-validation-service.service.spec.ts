import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { SlidesUrlValidationServiceService } from './slides-url-validation-service.service';

describe('SlidesUrlValidationServiceService', () => {
  let service: SlidesUrlValidationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidesUrlValidationServiceService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
