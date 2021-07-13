import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { BaseImageFactoryService } from './base-image-factory.service';

describe('BaseImageFactoryService', () => {
  let service: BaseImageFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseImageFactoryService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
