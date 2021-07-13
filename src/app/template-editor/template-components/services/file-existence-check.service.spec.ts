import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { FileExistenceCheckService } from './file-existence-check.service';

describe('FileExistenceCheckService', () => {
  let service: FileExistenceCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileExistenceCheckService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
