'use strict';

describe('directive: password input', function() {
  var sandbox = sinon.sandbox.create();
  var $scope,
      element,
      $compile,
      $ocLazyLoad,
      $window,
      result;

  beforeEach(module('risevision.common.components.password-input'));
  beforeEach(module(function ($provide) {
    $provide.service('$ocLazyLoad', function() {
      return {
        load: sandbox.stub().returns(Q.resolve())
      };
    });
    $provide.service('$window', function () {
      return {
        zxcvbn: sandbox.stub().returns(result)
      };
    });
  }));

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(inject(function($rootScope, $templateCache,$injector){
    result = {
      feedback: {
        warning: "warning message"
      },
      score: 2
    };
    $compile = $injector.get('$compile');
    $ocLazyLoad = $injector.get('$ocLazyLoad');
    $window = $injector.get('$window');
    $templateCache.put('partials/components/password-input/password-input.html', '<p>mock</p>');
    $scope = $rootScope.$new();
    $scope.password = "password";
    $scope.showPasswordMeter = true;
    element = $compile('<password-input ng-model="password" show-password-meter="showPasswordMeter" label="label-text" placeholder="placehodler-text"></password-input>')($scope);
    $scope = element.isolateScope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.ngModel).to.be.ok;
    expect($scope.showPasswordMeter).to.be.true;
    expect($scope.label).to.be.ok;
    expect($scope.placeholder).to.be.ok;
  });

  it('should init', function() {
    expect($scope.ngModel).to.equal('password');
    expect($scope.showPasswordMeter).to.be.true;
    expect($scope.label).to.equal('label-text');
    expect($scope.placeholder).to.equal('placehodler-text');
    expect($scope.minlength).to.equal(0);
  });

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('$dirty',function() {
    it('should set controller to dirty on model changed', function() {
      $scope.ngModel = 'newPassword';
      $scope.$digest();
      expect(element.controller('ngModel').$dirty).to.be.true;
    });

    it('should not set controller to dirty if model changed to same value', function() {
      $scope.ngModel = 'password';
      $scope.$digest();
      expect(element.controller('ngModel').$dirty).to.be.false;
    });
  });

  describe('showPasswordMeter',function(){
    it('should load zxcvbn library when field is defining a new password', function() {
      expect($ocLazyLoad.load).to.have.been.calledWith('vendor/zxcvbn/zxcvbn.js');
    });

    it('should not load zxcvbn library if not creating a new password', function() {
      $ocLazyLoad.load.resetHistory();
      element = $compile('<password-input ng-model="password" is-creating="false"></password-input>')($scope);
      $scope = element.isolateScope();
      $scope.$digest();

      expect($ocLazyLoad.load).to.not.have.been.called;
    });
  });

  describe('zxcvbn validation',function() {
    it('should call zxcvbn and set results to scope variables', function(done) {
      setTimeout(function(){
        expect($window.zxcvbn).to.have.been.calledWith('password');
        expect($scope.feedback).to.equal('warning message');
        expect($scope.scorePercentage).to.equal(50);
        expect($scope.strength).to.equal('Ok');
        expect($scope.strengthClass).to.equal('warning');
        done();
      },10);
    });

    it('should validate again on model changed', function(done) {
      result.feedback.warning = "new warning";
      result.score = 4;

      $scope.ngModel = 'newPassword';
      $scope.$digest();
      setTimeout(function(){
        expect($window.zxcvbn).to.have.been.calledTwice;
        expect($window.zxcvbn).to.have.been.calledWith('newPassword');
        expect($scope.feedback).to.equal('new warning');
        expect($scope.scorePercentage).to.equal(100);
        expect($scope.strength).to.equal('Great');
        expect($scope.strengthClass).to.equal('success');
        done();
      },10);
    });

    it('should set score percentage to minimum (25%) if score is 0', function(done) {
      result.score = 0;

      $scope.ngModel = 'newPassword';
      $scope.$digest();
      setTimeout(function(){
        expect($scope.feedback).to.equal('warning message');
        expect($scope.scorePercentage).to.equal(25);
        expect($scope.strength).to.equal('Weak');
        expect($scope.strengthClass).to.equal('danger');
        done();
      },10);
    });

    it('should handle weak score', function(done) {
      result.score = 1;

      $scope.ngModel = 'newPassword';
      $scope.$digest();
      setTimeout(function(){
        expect($scope.feedback).to.equal('warning message');
        expect($scope.scorePercentage).to.equal(25);
        expect($scope.strength).to.equal('Weak');
        expect($scope.strengthClass).to.equal('danger');
        done();
      },10);
    });

    it('should handle average score', function(done) {
      result.score = 2;

      $scope.ngModel = 'newPassword';
      $scope.$digest();
      setTimeout(function(){
        expect($scope.feedback).to.equal('warning message');
        expect($scope.scorePercentage).to.equal(50);
        expect($scope.strength).to.equal('Ok');
        expect($scope.strengthClass).to.equal('warning');
        done();
      },10);
    });

    it('should handle good score', function(done) {
      result.score = 4;

      $scope.ngModel = 'newPassword';
      $scope.$digest();
      setTimeout(function(){
        expect($scope.feedback).to.equal('warning message');
        expect($scope.scorePercentage).to.equal(100);
        expect($scope.strength).to.equal('Great');
        expect($scope.strengthClass).to.equal('success');
        done();
      },10);
    });

    it('should set score to minimum (25%) if model is $invalid', function(done) {
      var controller = element.controller('ngModel');
      controller.$invalid = true;

      $scope.ngModel = 'newPassword';
      $scope.$digest();
      setTimeout(function(){
        expect($scope.feedback).to.equal('warning message');
        expect($scope.scorePercentage).to.equal(25);
        expect($scope.strength).to.equal('Weak');
        expect($scope.strengthClass).to.equal('danger');
        done();
      },10);
    });
  });
});
