'use strict';

describe('directive: url field', function() {
  var sandbox = sinon.sandbox.create();
  var $scope,
      element,
      $rootScope;

  beforeEach(module('risevision.widget.common.url-field'));
  
  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(inject(function($compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;
    $templateCache.put('partials/components/url-field/url-field.html', '<p>mock</p>');
    $scope = $rootScope.$new();
    $scope.url = "myURL";
    element = $compile('<url-field ng-model="url" label="myLabel" hide-label="false" hide-storage="false" company-id="123" storage-type="single"></url-field>')($scope);
    $scope = element.isolateScope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.ngModel).to.be.ok;
    expect($scope.label).to.be.ok;
    expect($scope.hideLabel).to.be.ok;
    expect($scope.hideStorage).to.be.ok;
    expect($scope.companyId).to.be.ok;
    expect($scope.storageType).to.be.ok;
    expect($scope.ngModelCtrl).to.be.ok;
    expect($scope.doValidation).to.be.true;
    expect($scope.showSkipValidation).to.be.ok;
    expect($scope.forcedValid).to.be.false;
  });

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should set ngModel on picked', function(){
    $rootScope.$broadcast('picked',['newValue']);
    $scope.$digest();
    expect($scope.ngModel).to.equal('newValue');
  });

  it('should emit urlFieldBlur on blur', function(){
    sandbox.stub($scope,'$emit');
    $scope.blur();
    $scope.$emit.should.have.been.calledWith('urlFieldBlur');
  });

  it('should set crtl to dirty on model changed', function(){
    $scope.ngModel = 'newValue';
    $scope.$digest();
    expect(element.controller('ngModel').$dirty).to.be.true;
  });

  describe('showSkipValidation:', function() {
    it('should not show by default', function() {
      var controller = element.controller('ngModel');

      expect($scope.showSkipValidation()).to.be.false;
    });

    it('should show if forcedValid', function() {
      $scope.forcedValid = true;
      var controller = element.controller('ngModel');

      expect($scope.showSkipValidation()).to.be.true;
    });

    it('should show if invalid & dirty', function() {
      var controller = element.controller('ngModel');
      controller.$setDirty(true);
      controller.$setValidity('', false);    

      expect($scope.showSkipValidation()).to.be.true;
    });

    describe('unskippable errors (hide checkbox):', function() {
      beforeEach(function() {
        $scope.forcedValid = true;
      });

      it('should allow skipping validation for other errors', function(){
        var controller = element.controller('ngModel');
        controller.$error = {'myError':true};    

        expect($scope.showSkipValidation()).to.be.true;
      });

      it('should not allow skipping validation for required errors', function(){
        var controller = element.controller('ngModel');
        controller.$error = {'required':true};    

        expect($scope.showSkipValidation()).to.be.false;
      });

      it('should not allow skipping validation for noPreviewUrl errors', function(){
        var controller = element.controller('ngModel');
        controller.$error = {'noPreviewUrl':true};    

        expect($scope.showSkipValidation()).to.be.false;
      });
    });

  });

  it('should toggle forcedValid and clear forms on doValidation change', function(){
    var controller = element.controller('ngModel');
    sandbox.stub(controller,'$setValidity');
    controller.$error = {'myError':true};    
    $scope.doValidation = false;
    $scope.$digest();

    expect($scope.forcedValid).to.be.true;
    controller.$setValidity.should.have.been.calledWith('myError',null);
  });

});
