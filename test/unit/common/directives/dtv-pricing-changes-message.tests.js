'use strict';
describe('directive: pricingChangesMessage', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      selectedCompany,
      localStorageService;
  beforeEach(module('risevision.apps.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('userState', function() {
      return {
        getCopyOfSelectedCompany: function() {
          return selectedCompany;
        }
      };
    });
    $provide.service('localStorageService', function() {
      return localStorageService;
    });   
    
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    selectedCompany = {};
    localStorageService = {
        get: sinon.stub().returns('false'),
        set: sinon.stub()
    };

    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache.put('partials/common/pricing-changes-message.html', '<p>mock</p>');
  }));

  function compileDirective() {
    element = $compile('<pricing-changes-message></pricing-changes-message>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }

  describe('initialization', function() {
    beforeEach(compileDirective);

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<pricing-changes-message class="ng-scope ng-isolate-scope"><p>mock</p></pricing-changes-message>');
    });

    it('should initialize scope', function() {
      expect($scope.alertVisible).to.be.a('function');
      expect($scope.dismissAlert).to.be.a('function');
    });

    it('should check localStorage value', function() {
      localStorageService.get.should.have.been.calledWith('pricingChangesAlert.dismissed');
    });
  });

  describe('alertVisible:', function() {
    it('should not show alert if company is missing',function() {
      compileDirective();

      expect($scope.alertVisible()).to.be.false;
    });

    it('should not show notice if company creationDate is after Jun 25', function() {
      selectedCompany.creationDate = 'Jun 26, 2019';
      compileDirective();

      expect($scope.alertVisible()).to.be.false;      
    });

    it('should show notice if company creationDate is before Jun 25',function() {
      selectedCompany.creationDate = 'Jun 24, 2019';
      compileDirective();

      expect($scope.alertVisible()).to.be.true;
    });    

    it('should update value when the Selected Company Changes', function() {
      selectedCompany.creationDate = 'Jun 26, 2019';
      compileDirective();

      expect($scope.alertVisible()).to.be.false;      

      selectedCompany.creationDate = 'Jun 24, 2019';

      $scope.$broadcast('risevision.company.selectedCompanyChanged');
      $scope.$digest();

      expect($scope.alertVisible()).to.be.true;      
    });
  });

  describe('dismissAlert:',function() {
    beforeEach(compileDirective);

    it('should update local storage value', function() {
      $scope.dismissAlert();

      localStorageService.set.should.have.been.calledWith('pricingChangesAlert.dismissed', 'true');
    });

    it('should no longer show the alert', function() {
      $scope.dismissAlert();

      expect($scope.alertVisible()).to.be.false;
    });
  });

});
