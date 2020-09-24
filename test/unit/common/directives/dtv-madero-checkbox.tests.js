'use strict';

describe('directive: madero checkbox', function() {
  var element, $rootScope, $scope, compileDirective;

  beforeEach(module('risevision.apps.directives'));

  beforeEach(inject(function($injector, $compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;

    $templateCache.put('partials/common/madero-checkbox.html', '<div class="madero-checkbox u_clickable" ng-click="; onClick && onClick()"><input type="checkbox" id="{{checkboxId}}" name="{{checkboxId}}" ng-checked="ngModel || ngValue" tabindex="1"></div>');

    $rootScope.inputValue = true;
    $rootScope.changeHandler = function() {
      $rootScope.inputValue = !$rootScope.inputValue;
    };

    compileDirective = function(htmlString) {
      htmlString = htmlString || '<madero-checkbox ng-click="changeHandler()" ng-value="inputValue" checkbox-id="checkboxId"></madero-checkbox>';

      element = $compile(htmlString)($rootScope.$new());
      $rootScope.$digest();
      $scope = element.isolateScope();      
    };
  }));

  it('should render content', function() {
    compileDirective();

    expect(element.html()).to.equal('<input type="checkbox" id="checkboxId" name="checkboxId" ng-checked="ngModel || ngValue" tabindex="1" checked="checked">');
  });

  describe('ngValue', function() {
    beforeEach(function() {
      compileDirective();
    });

    it('should compile with ng-value', function() {
      expect($scope).to.be.ok;

      expect($scope.ngModel).to.not.be.ok;
      expect($scope.ngValue).to.be.true;

      expect($scope.onClick).to.not.be.ok;
    });    

    it('should update checkbox', function() {
      $rootScope.inputValue = false;

      $rootScope.$digest();
      
      expect($scope.ngValue).to.be.false;
      expect(element.html()).to.equal('<input type="checkbox" id="checkboxId" name="checkboxId" ng-checked="ngModel || ngValue" tabindex="1">');
    });

    it('should update checkbox on click', function() {
      element.click();

      expect($scope.ngValue).to.be.false;
      expect(element.html()).to.equal('<input type="checkbox" id="checkboxId" name="checkboxId" ng-checked="ngModel || ngValue" tabindex="1">');
    });

  });

  describe('ngValue', function() {
    beforeEach(function() {
      compileDirective('<madero-checkbox ng-model="inputValue" checkbox-id="checkboxId"></madero-checkbox>');
    });

    it('should compile with ng-model', function() {
      expect($scope).to.be.ok;

      expect($scope.ngModel).to.be.true;
      expect($scope.ngValue).to.not.be.ok;

      expect($scope.onClick).to.be.a('function');
    });

    it('should update model', function() {
      sinon.spy($scope, 'onClick');

      element.click();

      expect($scope.ngModel).to.be.false;
      expect(element.html()).to.equal('<input type="checkbox" id="checkboxId" name="checkboxId" ng-checked="ngModel || ngValue" tabindex="1">');

      $scope.onClick.should.have.been.called;
    });

  });

});
