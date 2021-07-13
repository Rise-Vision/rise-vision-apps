import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { InstrumentSearchService } from './instrument-search.service';

describe('InstrumentSearchService', () => {
  let service: InstrumentSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrumentSearchService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
