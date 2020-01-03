'use strict';
describe('directive: if-onboarding', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      onboardingFactory;
  
  beforeEach(module('risevision.apps.launcher.directives'));
  
  beforeEach(module(function ($provide) {
    $provide.service('onboardingFactory', function() {
      return {
        isOnboarding: sinon.stub().returns(false)
      }
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    onboardingFactory = $injector.get('onboardingFactory');
    $scope = $rootScope.$new();
    element = $compile('<button if-onboarding></button>')($scope);
    $scope.$digest();
  }));

  it('should hide element by default',function() {
    expect(element.css('display')).to.equal('none');
  });

  describe('on selectedCompanyChanged:',function() {
    it('should show element if onboarding', function() {
      onboardingFactory.isOnboarding.returns(true);
      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();      
      expect(element.css('display')).to.equal('');
    });

    it('should hide element if not onboarding',function(){
      onboardingFactory.isOnboarding.returns(false);
      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();
      expect(element.css('display')).to.equal('none');
    });
  });

  describe('on risevision.user.updated:',function() {
    it('should show element if onboarding', function() {
      onboardingFactory.isOnboarding.returns(true);
      $rootScope.$emit('risevision.user.updated');
      $rootScope.$digest();      
      expect(element.css('display')).to.equal('');
    });

    it('should hide element if not onboarding',function(){
      onboardingFactory.isOnboarding.returns(false);
      $rootScope.$emit('risevision.user.updated');
      $rootScope.$digest();
      expect(element.css('display')).to.equal('none');
    });
  });

  describe('on risevision.company.updated:',function() {
    it('should show element if onboarding', function() {
      onboardingFactory.isOnboarding.returns(true);
      $rootScope.$emit('risevision.company.updated');
      $rootScope.$digest();      
      expect(element.css('display')).to.equal('');
    });

    it('should hide element if not onboarding',function(){
      onboardingFactory.isOnboarding.returns(false);
      $rootScope.$emit('risevision.company.updated');
      $rootScope.$digest();
      expect(element.css('display')).to.equal('none');
    });
  });

});
