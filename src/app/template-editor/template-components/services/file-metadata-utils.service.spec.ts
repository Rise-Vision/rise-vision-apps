import { TestBed } from '@angular/core/testing';

import { FileMetadataUtilsService } from './file-metadata-utils.service';

describe('FileMetadataUtilsService', () => {
  let service: FileMetadataUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileMetadataUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
