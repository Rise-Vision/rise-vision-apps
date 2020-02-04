'use strict';

describe('controller: Presentation Multi Selector Modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close: sinon.spy(),
        dismiss: sinon.spy()
      };
    });

  }));
  var $scope, $modalInstance;

  beforeEach(function(){
    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $controller('PresentationMultiSelectorModal', {
        $scope : $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.togglePresentation).to.be.a('function');
    expect($scope.isSelected).to.be.a("function");

    expect($scope.add).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');

    expect($scope.selected).to.be.a('array');

  });

  describe('togglePresentation:', function() {
    it("should add display to distribution",function(done){
      $scope.togglePresentation({id: 'presentationId'});
      $scope.$digest();

      setTimeout(function(){
        expect($scope.selected).to.contain({id: 'presentationId'});

        done();
      },10);
    });

    it("should remove display from distribution if it was there before",function(done){
      $scope.togglePresentation({id: 'presentationId'});
      $scope.togglePresentation({id: 'presentationId'});
      $scope.$digest();

      setTimeout(function(){
        expect($scope.selected).to.not.contain({id: 'presentationId'});

        done();
      },10);
    });
    
  });

  describe('isSelected:', function() {
    it("should return true if a display is already on the distribution",function(done){
      $scope.togglePresentation({id: 'presentationId'});
      var actual = $scope.isSelected("presentationId");
      $scope.$digest();

      setTimeout(function(){
        expect(actual).to.be.true;

        done();
      },10);
    });

    it("should return false if a display is not on the distribution",function(done){
      var actual = $scope.isSelected("presentationId");
      $scope.$digest();

      setTimeout(function(){
        expect(actual).to.be.false;

        done();
      },10);
    });

  });

  it('should close modal when clicked on add',function(){
    $scope.togglePresentation({id: 'presentationId'});

    $scope.add();

    $modalInstance.close.should.have.been.calledWith($scope.selected);
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstance.dismiss.should.have.been.called;
  });

});
