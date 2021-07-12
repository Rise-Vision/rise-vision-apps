import { TestBed } from '@angular/core/testing';

import { RssFeedValidationService } from './rss-feed-validation.service';

describe('RssFeedValidationService', () => {
  let service: RssFeedValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RssFeedValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
