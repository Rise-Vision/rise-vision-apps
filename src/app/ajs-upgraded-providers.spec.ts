import {expect} from 'chai';

import { 
  $stateProvider, AjsState,
  $transitionsProvider, AjsTransitions,
  AddressService, addressServiceProvider,  
  AnalyticsFactory, analyticsFactoryProvider, 
  Billing, billingProvider, 
  CanvaTypePicker, canvaTypePickerProvider, 
  ConfirmModal, confirmModalProvider, 
  PlansService, plansServiceProvider, 
  ProcessErrorCode, processErrorCodeProvider, 
  StoreService, storeServiceProvider,
  SubscriptionFactory, subscriptionFactoryProvider,
  PresentationUtils, presentationUtilsProvider,
  UserAuthFactory, userAuthFactoryProvider,
  CompanySettingsFactory, companySettingsFactoryProvider,
  UserState, userStateProvider, purchaseFlowTrackerProvider, PurchaseFlowTracker, contactServiceProvider, ContactService, PresentationService, presentationServiceProvider, createFirstScheduleServiceProvider, CreateFirstScheduleService, brandingFactoryProvider, BrandingFactory, storageManagerFactoryProvider, StorageManagerFactory, scheduleFactoryProvider, ScheduleFactory, PresentationTracker, presentationTrackerProvider, ScheduleSelectorFactory, scheduleSelectorFactoryProvider, StorageUtils, storageUtilsProvider
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

  it('presentationUtils:', () => {
    testRegisterProvider(presentationUtilsProvider, PresentationUtils);
    testAngularJsService(presentationUtilsProvider, 'presentationUtils');
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

  it('confirmModal:', () => {
    testRegisterProvider(confirmModalProvider, ConfirmModal);
    testAngularJsService(confirmModalProvider, 'confirmModal');
  });

  it('billing:', () => {
    testRegisterProvider(billingProvider, Billing);
    testAngularJsService(billingProvider, 'billing');
  });

  it('processErrorCode:', () => {
    testRegisterProvider(processErrorCodeProvider, ProcessErrorCode);
    testAngularJsService(processErrorCodeProvider, 'processErrorCode');
  });

  it('$state:', () => {
    testRegisterProvider($stateProvider, AjsState);
    testAngularJsService($stateProvider, '$state');
  });

  it('$transitions:', () => {
    testRegisterProvider($transitionsProvider, AjsTransitions);
    testAngularJsService($transitionsProvider, '$transitions');
  });

  it('subscriptionFactory:', () => {
    testRegisterProvider(subscriptionFactoryProvider, SubscriptionFactory);
    testAngularJsService(subscriptionFactoryProvider, 'subscriptionFactory');
  });

  it('plansService:', () => {
    testRegisterProvider(plansServiceProvider, PlansService);
    testAngularJsService(plansServiceProvider, 'plansService');
  });

  it('purchaseFlowTracker:', () => {
    testRegisterProvider(purchaseFlowTrackerProvider, PurchaseFlowTracker);
    testAngularJsService(purchaseFlowTrackerProvider, 'purchaseFlowTracker');
  });

  it('contactService:', () => {
    testRegisterProvider(contactServiceProvider, ContactService);
    testAngularJsService(contactServiceProvider, 'contactService');
  });

  it('companySettingsFactory:', () => {
    testRegisterProvider(companySettingsFactoryProvider, CompanySettingsFactory);
    testAngularJsService(companySettingsFactoryProvider, 'companySettingsFactory');
  });

  it('presentation:', () => {
    testRegisterProvider(presentationServiceProvider, PresentationService);
    testAngularJsService(presentationServiceProvider, 'presentation');
  });

  it('createFirstSchedule:', () => {
    testRegisterProvider(createFirstScheduleServiceProvider, CreateFirstScheduleService);
    testAngularJsService(createFirstScheduleServiceProvider, 'createFirstSchedule');
  });

  it('brandingFactory:', () => {
    testRegisterProvider(brandingFactoryProvider, BrandingFactory);
    testAngularJsService(brandingFactoryProvider, 'brandingFactory');
  });

  it('storageManagerFactory:', () => {
    testRegisterProvider(storageManagerFactoryProvider, StorageManagerFactory);
    testAngularJsService(storageManagerFactoryProvider, 'storageManagerFactory');
  });

  it('scheduleFactory:', () => {
    testRegisterProvider(scheduleFactoryProvider, ScheduleFactory);
    testAngularJsService(scheduleFactoryProvider, 'scheduleFactory');
  });

  it('presentationTracker:', () => {
    testRegisterProvider(presentationTrackerProvider, PresentationTracker);
    testAngularJsService(presentationTrackerProvider, 'presentationTracker');
  });

  it('scheduleSelectorFactory:', () => {
    testRegisterProvider(scheduleSelectorFactoryProvider, ScheduleSelectorFactory);
    testAngularJsService(scheduleSelectorFactoryProvider, 'scheduleSelectorFactory');
  });  

  it('storageUtils:', () => {
    testRegisterProvider(storageUtilsProvider, StorageUtils);
    testAngularJsService(storageUtilsProvider, 'storageUtils');
  });
});
