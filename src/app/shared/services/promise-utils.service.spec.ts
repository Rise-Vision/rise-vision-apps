import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { PromiseUtilsService } from './promise-utils.service';

describe('PromiseUtilsService', () => {
  let service: PromiseUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromiseUtilsService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });

  describe('generateDeferredPromise', () => {
    it('generate a deferred promise', () => {
      let deferred = service.generateDeferredPromise();
      expect(deferred.reject).to.be.a('function');
      expect(deferred.resolve).to.be.a('function');
      expect(deferred.promise).to.be.instanceOf(Promise);
    });
  })
});
