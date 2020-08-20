'use strict';

describe('directive: yes no toggle', function() {
  var element, $rootScope, $scope, $timeout;

  beforeEach(module('risevision.apps.directives'));

  beforeEach(inject(function($injector, $compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;
    $timeout = $injector.get('$timeout');

    $templateCache.put('partials/common/yes-no-toggle.html', '<div>yes no toggle</div>');

    $rootScope.inputValue = 'presentationName';
    $rootScope.changeHandler = sinon.stub();
    $rootScope.isDisabled = false;
    element = $compile('<yes-no-toggle ng-model="inputValue" ng-change="changeHandler()" ng-disabled="isDisabled"></yes-no-toggle>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;

    expect($scope.ngModel).to.equal('presentationName');
    expect($scope.ngDisabled).to.be.false;

    expect($scope.onChange).to.be.a('function');
  });

  it('should render content', function() {
    expect(element.html()).to.equal('yes no toggle');
  });

  it('onChange:', function() {
    $scope.onChange();

    $rootScope.changeHandler.should.not.have.been.called;
    
    $timeout.flush();

    $rootScope.changeHandler.should.have.been.called;
  });

  it('null onChange:', function() {
    $rootScope.changeHandler = null;
    $rootScope.$digest();

    $scope.onChange();
  });

});
