import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { ComponentUtilsService } from './component-utils.service';

describe('ComponentUtilsService', () => {
  let service: ComponentUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentUtilsService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });

  describe('isValidUrl', () => {
    it('reports valid urls', () => {
      expect(service.isValidUrl('www.risevision.com')).to.be.true;
      expect(service.isValidUrl('https://www.risevision.com')).to.be.true;
      expect(service.isValidUrl('risevision.com')).to.be.true;
    });

    it('flags invalid urls', () => {
      expect(service.isValidUrl('.risevision.com')).to.be.false;
      expect(service.isValidUrl('https://')).to.be.false;
      expect(service.isValidUrl('risevision')).to.be.false;
    });
  })
});
