'use strict';
describe('controller: ShareUrlController', function() {
  beforeEach(module('risevision.apps.billing.controllers'));

  var $scope, $window;

  beforeEach(function(){
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();
      $window = $injector.get('$window');

      $controller('ShareUrlController', {
        $scope: $scope
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.getUrl).to.be.a('function');
    expect($scope.copyToClipboard).to.be.a('function');
    expect($scope.onTextFocus).to.be.a('function');
  });

  it('getUrl:', function() {
    expect($scope.getUrl()).to.equal($window.location.href);
  });

  describe('copyToClipboard:', function() {
    beforeEach(function() {
      //phantomJS does not provide navigator.clipboard, so we are mocking it
      $window.navigator.clipboard = {
        writeText: sinon.stub()
      };
    });
    afterEach(function() {
      delete $window.navigator.clipboard;
    });

    it('should copy to clipboard', function(){
      $scope.copyToClipboard('text');
      $window.navigator.clipboard.writeText.should.have.been.calledWith('text');
    });
  });

  describe('onTextFocus', function() {
    it('should select target element text', function() {
      var event = {
        target: {
          select: sinon.stub()
        }
      };

      $scope.onTextFocus(event);

      event.target.select.should.have.been.called;
    });
  });

});
