'use strict';
describe.only('controller: Onboarding', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  var $rootScope, $controller, $scope, $loading, $interval, onboardingFactory,
    companyAssetsFactory, editorFactory, userState;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('$loading', function() {
        return {
          start: sinon.spy(),
          stop: sinon.spy()
        };
      });
      $provide.service('onboardingFactory', function() {
        return {
          isCurrentStep: sinon.stub()
        };
      });
      $provide.service('companyAssetsFactory', function() {
        return {
          hasDisplays: sinon.spy()
        };
      });
      $provide.service('editorFactory', function() {
        return {
          addFromProduct: sinon.spy()
        };
      });
      $provide.service('userState', function() {
        return {
          isEducationCustomer: sinon.stub().returns(true)
        };
      });
    })
    inject(function($injector) {
      onboardingFactory = $injector.get('onboardingFactory');
      companyAssetsFactory = $injector.get('companyAssetsFactory');
      editorFactory = $injector.get('editorFactory');
      userState = $injector.get('userState');
      $loading = $injector.get('$loading');
      $interval = $injector.get('$interval');
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');

      $scope = $rootScope.$new();
      $controller('OnboardingCtrl', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.editorFactory).to.be.ok;
    expect($scope.featureBlankPresentation).to.be.false;
    expect($scope.featuredTemplates).to.be.an('array');
    expect($scope.featuredTemplates).to.have.length(3);

    expect($scope.select).to.be.a('function');
  });

  it('should initilize non-ed featured templates if user is not from Education', function() {
    userState.isEducationCustomer.returns(false);
    $scope = $rootScope.$new();
    $controller('OnboardingCtrl', {
      $scope: $scope
    });
    $scope.$digest();

    expect($scope.featureBlankPresentation).to.be.true;    
    expect($scope.featuredTemplates).to.be.an('array');
    expect($scope.featuredTemplates).to.have.length(2);
  });

  it('select:', function() {
    $scope.select('product');

    editorFactory.addFromProduct.should.have.been.calledWith('product');
  });

  describe('spinner:', function() {
    it("should hide spinner",function(){
      $loading.stop.should.have.been.calledWith('onboarding-loader');
    });

    it("should show spinner when loading",function(){
      onboardingFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith('onboarding-loader');
    });

    it("should hide spinner when load is complete",function(){
      onboardingFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
      $loading.stop.should.have.been.calledWith('onboarding-loader');
    });    
  });

  describe('activateDisplay', function() {
    var clock;

    beforeEach(function(){
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should watch current step', function() {
      onboardingFactory.isCurrentStep.reset();
      $scope.$digest();

      onboardingFactory.isCurrentStep.should.have.been.calledOnce;
      onboardingFactory.isCurrentStep.should.have.been.calledWith('activateDisplay');
    });

    it('should poll every 30 seconds', function() {
      onboardingFactory.isCurrentStep.returns(true);
      $scope.$digest();

      companyAssetsFactory.hasDisplays.should.not.have.been.called;

      $interval.flush(30 * 1000);

      companyAssetsFactory.hasDisplays.should.have.been.calledWith(true);

      $interval.flush(30 * 1000);

      companyAssetsFactory.hasDisplays.should.have.been.calledTwice;
    });

    it('should cancel polling if step changes', function() {
      onboardingFactory.isCurrentStep.returns(true);
      $scope.$digest();

      companyAssetsFactory.hasDisplays.should.not.have.been.called;

      $interval.flush(30 * 1000);

      companyAssetsFactory.hasDisplays.should.have.been.calledWith(true);

      onboardingFactory.isCurrentStep.returns(false);
      $scope.$digest();

      $interval.flush(60 * 1000);

      companyAssetsFactory.hasDisplays.should.have.been.calledOnce;
    });

    it('should cancel polling if controller is destroyed', function() {
      onboardingFactory.isCurrentStep.returns(true);
      $scope.$digest();

      companyAssetsFactory.hasDisplays.should.not.have.been.called;

      $interval.flush(30 * 1000);

      companyAssetsFactory.hasDisplays.should.have.been.calledWith(true);

      $scope.$destroy();
      $scope.$digest();

      $interval.flush(60 * 1000);

      companyAssetsFactory.hasDisplays.should.have.been.calledOnce;
    });    

  });
});
