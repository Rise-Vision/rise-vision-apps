import {expect} from 'chai';

import { AnalyticsFactory, analyticsFactoryProvider, CanvaTypePicker, canvaTypePickerProvider } from './ajs-upgraded-providers';

describe('ajs-upgraded-providers', () => {

  describe('canvaTypePicker:', () => {    
    it('should register provider', () => {
      expect(canvaTypePickerProvider.provide).to.equal(CanvaTypePicker);
      expect(canvaTypePickerProvider.deps).to.deep.equal(['$injector']);
      expect(canvaTypePickerProvider.useFactory).to.be.a('function');
    });

    it('should get AngularJS service', () => {
      const $injector = {
        get: sinon.stub().returns('service')
      }
      expect(canvaTypePickerProvider.useFactory($injector)).to.equal('service');
      $injector.get.should.have.been.calledWith('canvaTypePicker');
    });
  });

  describe('analyticsFactory:', () => {    
    it('should register provider', () => {
      expect(analyticsFactoryProvider.provide).to.equal(AnalyticsFactory);
      expect(analyticsFactoryProvider.deps).to.deep.equal(['$injector']);
      expect(analyticsFactoryProvider.useFactory).to.be.a('function');
    });

    it('should get AngularJS service', () => {
      const $injector = {
        get: sinon.stub().returns('service')
      }
      expect(analyticsFactoryProvider.useFactory($injector)).to.equal('service');
      $injector.get.should.have.been.calledWith('analyticsFactory');
    });
  });
});
