'use strict';
describe('directive: prioritySupportBanner', function() {
  var $compile,
      $rootScope,
      localStorageGetSpy,
      localStorageSetSpy,
      subscriptionCheckSpy,
      prioritySupportSpy,
      dismissedInLocalstorage,
      productStatus;

  beforeEach(module('risevision.apps.launcher.controllers'));
  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.value('SUPPORT_PRODUCT_CODE', 'supportProductCode');
    $provide.service('subscriptionStatusFactory', function() {
      return {
        checkProductCode: function() {
          return Q.resolve({status: productStatus});
        }
      };
    });
    $provide.service('localStorageService', function() {
      return {
        get: function() {
          return dismissedInLocalstorage? 'false' : 'true';
        },
        set: function(){}
      };
    });
    $provide.service('supportFactory', function() {
      return {
        handlePrioritySupportAction: function(){}
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache,localStorageService,
    subscriptionStatusFactory, supportFactory){
    dismissedInLocalstorage = false;
    productStatus = 'On Trial';
    $templateCache.put('partials/launcher/priority-support-banner.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    localStorageGetSpy = sinon.spy(localStorageService,'get');
    localStorageSetSpy = sinon.spy(localStorageService,'set');
    subscriptionCheckSpy = sinon.spy(subscriptionStatusFactory,'checkProductCode');
    prioritySupportSpy = sinon.spy(supportFactory,'handlePrioritySupportAction');
  }));

  function compileElement() {
    var $scope = $rootScope.$new();
    var element = angular.element("<priority-support-banner></priority-support-banner>");
    $compile(element)($scope);
    $scope.$apply();
    return element;
  }

  it('Replaces the element with the appropriate content', function() {
    dismissedInLocalstorage = true;
    var element = compileElement();
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should check localStorage to see if banner was dismissed',function(){
    dismissedInLocalstorage = true;
    
    var element = compileElement();

    localStorageGetSpy.should.have.been.calledWith('prioritySupportBanner.show');
    subscriptionCheckSpy.should.not.have.been.called;
    expect(element.scope().showBanner).to.be.false;
  });

  it('should check subscription status if not dismissed',function(done){
    var element = compileElement();

    subscriptionCheckSpy.should.have.been.calledWith('supportProductCode');

    setTimeout(function() {
      expect(element.scope().showBanner).to.be.false;
      done();  
    }, 10);
  });

  it('should show banner if Trial is available', function(done){
    productStatus = 'Not Subscribed';
    
    var element = compileElement();

    setTimeout(function() {
      expect(element.scope().showBanner).to.be.true;
      done();  
    }, 10);    
  });

  it('should close banner and update localstorage',function(){
    var element = compileElement();
    element.scope().showBanner = true;

    element.scope().closeBanner();

    localStorageSetSpy.should.have.been.calledWith('prioritySupportBanner.show',false);
    expect(element.scope().showBanner).to.be.false;
  });

  it('should opne Priority Support modal and close banner',function(){
    var element = compileElement();
    element.scope().showBanner = true;

    element.scope().openPrioritySupport();

    prioritySupportSpy.should.have.been.called;
    expect(element.scope().showBanner).to.be.false;
  });
});
