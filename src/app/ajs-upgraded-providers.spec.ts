import {expect} from 'chai';

import { 
  AddressService, addressServiceProvider,
  AnalyticsFactory, analyticsFactoryProvider, 
  CanvaTypePicker, canvaTypePickerProvider, 
  StoreService, storeServiceProvider,
  TemplateEditorFactory, templateEditorFactoryProvider,
  TemplateEditorUtils, templateEditorUtilsProvider,
  UserAuthFactory, userAuthFactoryProvider,
  UserState, userStateProvider
} from './ajs-upgraded-providers';

describe('ajs-upgraded-providers', () => {

  var testRegisterProvider = function(provider, provided) {
    expect(provider.provide).to.equal(provided);
    expect(provider.deps).to.deep.equal(['$injector']);
    expect(provider.useFactory).to.be.a('function');
  };

  var testAngularJsService = function(provider, angularJsService) {
    const $injector = {
      get: sinon.stub().returns('service')
    }
    expect(provider.useFactory($injector)).to.equal('service');
    $injector.get.should.have.been.calledWith(angularJsService);
  };

  it('canvaTypePicker:', () => {
    testRegisterProvider(canvaTypePickerProvider, CanvaTypePicker);
    testAngularJsService(canvaTypePickerProvider, 'canvaTypePicker');
  });

  it('analyticsFactory:', () => {
    testRegisterProvider(analyticsFactoryProvider, AnalyticsFactory);
    testAngularJsService(analyticsFactoryProvider, 'analyticsFactory');
  });

  it('templateEditorFactory:', () => {
    testRegisterProvider(templateEditorFactoryProvider, TemplateEditorFactory);
    testAngularJsService(templateEditorFactoryProvider, 'templateEditorFactory');
  });

  it('templateEditorUtils:', () => {
    testRegisterProvider(templateEditorUtilsProvider, TemplateEditorUtils);
    testAngularJsService(templateEditorUtilsProvider, 'templateEditorUtils');
  });

  it('userState:', () => {
    testRegisterProvider(userStateProvider, UserState);
    testAngularJsService(userStateProvider, 'userState');
  });

  it('storeService:', () => {
    testRegisterProvider(storeServiceProvider, StoreService);
    testAngularJsService(storeServiceProvider, 'storeService');
  });

  it('addressService:', () => {
    testRegisterProvider(addressServiceProvider, AddressService);
    testAngularJsService(addressServiceProvider, 'addressService');
  });

  it('userAuthFactory:', () => {
    testRegisterProvider(userAuthFactoryProvider, UserAuthFactory);
    testAngularJsService(userAuthFactoryProvider, 'userAuthFactory');
  });

});
