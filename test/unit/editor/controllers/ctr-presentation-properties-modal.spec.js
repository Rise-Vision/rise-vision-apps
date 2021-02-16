'use strict';
describe('controller: presentation properties modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    placeholders = {
      id: 'ph0'
    }
    $provide.factory('placeholdersFactory',function(){
      return {
        getPlaceholders : function () {
          return placeholders;
        }
      };
    });

    presentationProperties = {
      id: 'test'
    };
    $provide.factory('presentationPropertiesFactory',function(){
      return {
        getPresentationProperties : function () {
          return presentationProperties;
        },
        setPresentationProperties : function () {
          return;
        }
      };
    });
    $provide.factory('editorFactory',function(){
      return {
        copyPresentation : function () {
          return;
        },
        deletePresentation: function() {}
      };
    });
    $provide.service('$modalInstance',function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(action){
          return;
        }
      }
    });
    $provide.service('$modal',function(){
      return {
        open: function(func){
          return {
            result:{
              then:function(func){
                expect(func).to.be.a('function');
                if(confirmDelete) {
                  func();  
                }                
              }
            }
          }
        }
      };
    });

    companyId = 'TEST_COMP_ID';
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return companyId;
        }
      }
    });
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, 
    editorFactory, copyPresentationSpy, presentationPropertiesFactory, 
    setPresentationPropertiesSpy, companyId, presentationProperties, placeholders,
    $modal, confirmDelete, $broadcastSpy;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.presentationPropertiesDetails = {};
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $broadcastSpy = sinon.spy($rootScope,'$broadcast');
      $modal = $injector.get('$modal');
      confirmDelete = false;

      editorFactory = $injector.get('editorFactory');
      copyPresentationSpy = sinon.spy(editorFactory, 'copyPresentation');
      presentationPropertiesFactory = $injector.get('presentationPropertiesFactory');
      setPresentationPropertiesSpy = sinon.spy(presentationPropertiesFactory, 'setPresentationProperties');

      $controller('PresentationPropertiesModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance,
        presentationPropertiesFactory: presentationPropertiesFactory,
        editorFactory: editorFactory,
        userState: $injector.get('userState')
      });
      $scope.$digest();
    });
  });
  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.copy).to.be.a('function');
    expect($scope.apply).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should get the selected company id',function(){
    expect($scope.companyId).to.equal(companyId);
  });

  it('should get the presentation properties',function(){
    expect($scope.presentationProperties).to.equal(presentationProperties);
  });

  it('should get the placeholders',function(){
    expect($scope.placeholders).to.equal(placeholders);
  });

  it('should copy presentation',function(){
    $scope.copy();
    copyPresentationSpy.should.have.been.called;
    $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should set presentation properties',function(){
    $scope.apply();
    setPresentationPropertiesSpy.should.have.been.calledWith(presentationProperties);
    $modalInstanceDismissSpy.should.have.been.called;
    $broadcastSpy.should.have.been.calledWith('presentationPropertiesDismissed');
  });

  it('should not set presentation properties if form is invalid',function(){
    $scope.presentationPropertiesDetails.$invalid = true;
    $scope.apply();
    setPresentationPropertiesSpy.should.not.have.been.called;
    $modalInstanceDismissSpy.should.not.have.been.called;
    $broadcastSpy.should.not.have.been.called;
  });

  it('should dismiss modal when cancel',function(){
    $scope.dismiss();
    $modalInstanceDismissSpy.should.have.been.called;
    $broadcastSpy.should.have.been.calledWith('presentationPropertiesDismissed');
  });

  describe('confirm delete',function(){
    it('should open modal to confirm',function(){
      var modalOpenSpy = sinon.spy($modal,'open');
      $scope.confirmDelete();
      modalOpenSpy.should.have.been.called;
    });

    it('should dismiss modal and delete on confirm',function(){
      var editorDeleteSpy = sinon.spy(editorFactory,'deletePresentation');
      confirmDelete = true
      $scope.confirmDelete();
      $modalInstanceDismissSpy.should.have.been.called;
      editorDeleteSpy.should.have.been.called;
    });

  });
});
