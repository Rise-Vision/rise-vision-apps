'use strict';

describe('directive: time-picker', function() {
  var element, $scope;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function ($provide) {
    $provide.service('ngModalService', function() {
      return {};
    });
  }));  

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    $templateCache.put('partials/template-editor/time-picker.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile('<div time-picker></div>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should register functions', function() {
    expect($scope.increaseHours).is.a.function;
    expect($scope.decreaseHours).is.a.function;
    expect($scope.increaseMinutes).is.a.function;
    expect($scope.decreaseMinutes).is.a.function;
    expect($scope.updateTime).is.a.function;
  });

  it('should initialize time even if provided value is not valid', function () {
    $scope.time = 'invalid date';
    $scope.$digest();
    expect($scope.hours).to.equal(12);
    expect($scope.minutes).to.equal(0);
  });

  describe('operations', function() {
    beforeEach(function () {
      $scope.time = '11:59 PM';
      $scope.$digest();
    });

    describe('initialization', function () {
      it('should initialize the internal fields', function () {
        expect($scope.hours).to.equal(11);
        expect($scope.minutes).to.equal(59);
      });
    });

    describe('handle hours', function () {
      it('should increase hours', function () {
        $scope.increaseHours();
        expect($scope.hours).to.equal(12);
        $scope.increaseHours();
        expect($scope.hours).to.equal(1);
      });

      it('should decrease hours', function () {
        $scope.decreaseHours();
        expect($scope.hours).to.equal(10);
        $scope.decreaseHours();
        expect($scope.hours).to.equal(9);
      });
    });

    describe('handle minutes', function () {
      it('should increase minutes', function () {
        $scope.increaseMinutes();
        expect($scope.minutes).to.equal(0);
        $scope.increaseMinutes();
        expect($scope.minutes).to.equal(1);
      });

      it('should decrease hour', function () {
        $scope.decreaseMinutes();
        expect($scope.minutes).to.equal(58);
        $scope.decreaseMinutes();
        expect($scope.minutes).to.equal(57);
      });
    });

    describe('updateTime', function () {
      it('should update time', function () {
        $scope.increaseMinutes();
        expect($scope.time).to.equal('11:00 PM');
        $scope.increaseMinutes();
        expect($scope.time).to.equal('11:01 PM');
        $scope.increaseHours();
        expect($scope.time).to.equal('12:01 PM');
        $scope.increaseHours();
        expect($scope.time).to.equal('01:01 PM');
        $scope.setMeridian('AM');
        expect($scope.time).to.equal('01:01 AM');
      });
    });
  });
});
