import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { BaseImageService } from './base-image.service';

describe('BaseImageFactoryService', () => {
  let service: BaseImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseImageService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
