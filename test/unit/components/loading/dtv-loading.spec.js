'use strict';
describe('directive: loading', function() {
  beforeEach(module('risevision.common.components.loading'));
  beforeEach(module(function ($provide) {
    $provide.service('usSpinnerService',function(){
      return {
        spin: sinon.spy(),
        stop: sinon.spy()
      };
    });
  }));

  var elm, $scope, usSpinnerService;

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache){
    usSpinnerService = $injector.get('usSpinnerService');

    $rootScope.loadingItems = true;

    var tpl = '<div rv-spinner rv-spinner-key="list-loader" rv-show-spinner="loadingItems"></div>';

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.isolateScope();
  }));

  it('should compile html', function() {
    expect(elm.html()).to.contain('us-spinner="rvSpinnerOptions" spinner-key="list-loader" spinner-start-active="1"');

    expect($scope.rvSpinnerKey).to.equal('list-loader');
    expect($scope.rvShowSpinner).to.be.true;
  });

  describe('rvShowSpinner:', function() {
    it('should start spinner', function() {
      usSpinnerService.spin.should.have.been.calledWith('list-loader');
      expect($scope.active).to.be.true;
    });
    
    it('should stop spinner', function() {
      $scope.rvShowSpinner = false;
      $scope.$digest();

      usSpinnerService.stop.should.have.been.calledWith('list-loader');
      expect($scope.active).to.be.false;
    });
  });

  describe('rv-spinner:start', function() {
    beforeEach(function() {
      $scope.rvShowSpinner = false;
      $scope.$digest();
      usSpinnerService.spin.reset();
    });

    it('should start spinner', function() {
      $scope.$emit('rv-spinner:start', 'list-loader');

      $scope.$digest();

      usSpinnerService.spin.should.have.been.calledWith('list-loader');
      expect($scope.active).to.be.true;
    });
    
    it('should check spinner key', function() {
      $scope.$emit('rv-spinner:start', 'another-loader');

      $scope.$digest();

      usSpinnerService.spin.should.not.have.been.called;
      expect($scope.active).to.be.false;
    });
  });

  describe('rv-spinner:stop', function() {
    it('should stop spinner', function() {
      $scope.$emit('rv-spinner:stop', 'list-loader');

      $scope.$digest();

      usSpinnerService.stop.should.have.been.calledWith('list-loader');
      expect($scope.active).to.be.false;
    });
    
    it('should check spinner key', function() {
      $scope.$emit('rv-spinner:stop', 'another-loader');

      $scope.$digest();

      usSpinnerService.stop.should.not.have.been.called;
      expect($scope.active).to.be.true;
    });
  });

});
