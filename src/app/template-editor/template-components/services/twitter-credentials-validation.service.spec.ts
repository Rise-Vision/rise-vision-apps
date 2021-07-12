import { TestBed } from '@angular/core/testing';

import { TwitterCredentialsValidationService } from './twitter-credentials-validation.service';

describe('TwitterCredentialsValidationService', () => {
  let service: TwitterCredentialsValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitterCredentialsValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
