import { TestBed } from '@angular/core/testing';

import { ComponentUtilsService } from './component-utils.service';

describe('ComponentUtilsService', () => {
  let service: ComponentUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
