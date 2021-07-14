import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { StorageManagerService } from './storage-manager.service';

describe('StorageManagerService', () => {
  let service: StorageManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageManagerService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
