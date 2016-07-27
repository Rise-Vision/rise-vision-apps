'use strict';
describe('controller: playlist item modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    itemProperties = {
      name: 'test',
      type: itemType,
      objectReference: '123',
      objectData: '345'
    };
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
    
    $provide.service('gadgetFactory', function() {
      return {
        getGadget: function() {
          var deferred = Q.defer();
                    
          deferred.resolve({name: 'Widget'});
          
          return deferred.promise;
        }
      }
    });

    $provide.service('placeholderPlaylistFactory',function(){
      return {
        updateItem: function(item) {
          itemUpdated = item;
        }
      }
    });

    $provide.service('placeholderFactory',function(){
      return {
        updateSubscriptionStatus: function() {
          updateSubscriptionStatusCalled = true;
        }
      }
    });
    
    $provide.service('widgetModalFactory',function(){
      return {
        showWidgetModal: function() {}
      }
    });

    $provide.service('editorFactory',function(){
      return {
        presentation: presentation
      }
    });

    $provide.value('RVA_URL',"http://rva.risevision.com");

    $provide.service('userState',function(){
      return {
        getSelectedCompanyId: function () {
          return "123456"
        }
      }
    });

  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, itemProperties, itemType, 
  itemUpdated, updateSubscriptionStatusCalled, presentation, showWidgetModalSpy;

  describe('Normal checks', function () {
    beforeEach(function(){
      presentation = {
        id : ''
      };

      inject(function($injector,$rootScope, $controller){
        itemUpdated = null;
        itemType = 'widget';
        updateSubscriptionStatusCalled = false;
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');

        $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

        $controller('PlaylistItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          item: itemProperties,
          showWidgetModal: false,
          editorFactory: $injector.get('editorFactory')
        });
        $scope.$digest();
      });
    });
    it('should exist',function(){
      expect($scope).to.be.truely;
      expect($scope.save).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');
    });

    it('should copy the item properties',function(){
      expect($scope.item).to.not.equal(itemProperties);
      expect($scope.item).to.deep.equal(itemProperties);
    });

    it('should load widget name', function(done) {
      setTimeout(function() {
        expect($scope.widgetName).to.equal('Widget');

        done();
      }, 10);
    });

    it('should update item properties on apply',function(){
      $scope.save();

      expect(itemUpdated).to.not.equal($scope.item);
      expect(itemUpdated).to.equal(itemProperties);

      $modalInstanceDismissSpy.should.have.been.called;
    });

    it('should update subscription status on apply',function(){
      $scope.save();

      expect(updateSubscriptionStatusCalled).to.be.true;

      $modalInstanceDismissSpy.should.have.been.called;
    });

    it('should update subscription status on apply',function(){
      $scope.save();

      expect(updateSubscriptionStatusCalled).to.be.true;

      $modalInstanceDismissSpy.should.have.been.called;
    });

    it('should dismiss modal when cancel',function(){
      $scope.dismiss();
      expect(itemUpdated).to.not.be.ok;
      $modalInstanceDismissSpy.should.have.been.called;
    });

    it('should have previous editor url without presentation id',function(){
      presentation.id = undefined;
      $scope.$digest();
      expect($scope.PREVIOUS_EDITOR_URL).to.equal('http://rva.risevision.com' + '/#/PRESENTATION_MANAGE?cid=123456');
    });
  });

  describe('Gadget checks', function () {
    beforeEach(function(){
      presentation = {
        id : ''
      };

      inject(function($injector,$rootScope, $controller){
        itemUpdated = null;
        itemProperties.type = 'gadget';
        updateSubscriptionStatusCalled = false;
        $scope = $rootScope.$new();

        $controller('PlaylistItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          item: itemProperties,
          showWidgetModal: false,
          editorFactory: $injector.get('editorFactory')
        });
        $scope.$digest();
      });
    });

    it('should not load widget name for Gadget', function(done) {
      setTimeout(function() {
        expect($scope.widgetName).to.not.equal('Widget');

        done();
      }, 10);
    });

  });

  describe('Check presentation id on the previous editor url', function () {
    beforeEach(function(){
      presentation.id = 852;

      inject(function($injector,$rootScope, $controller){
        $scope = $rootScope.$new();

        $controller('PlaylistItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          item: itemProperties,
          showWidgetModal: false,
          editorFactory: $injector.get('editorFactory')
        });
        $scope.$digest();
      });
    });

    it('should have previous editor url with presentation id',function(done){
      setTimeout(function() {
        expect($scope.PREVIOUS_EDITOR_URL).to.equal('http://rva.risevision.com' + '/#/PRESENTATION_MANAGE/id=852?cid=123456');
        done();
      }, 10);
    });
  });

  describe('Checks for widget by url',function(){

    beforeEach(function(){
      inject(function($injector,$rootScope, $controller){
        $scope = $rootScope.$new();

        delete itemProperties.objectReference;
        itemProperties.name = 'Widget from URL';
        itemProperties.itemType = 'widget';
        itemProperties.settingsUrl = 'http://www.risevision.com/settings.html';


        $controller('PlaylistItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          item: itemProperties,
          showWidgetModal: false,
          editorFactory: $injector.get('editorFactory')
        });
        $scope.$digest();
      });
    });

    it('should set widget name for widgets from url', function(done) {
      setTimeout(function() {
        expect($scope.widgetName).to.equal('Widget from URL');

        done();
      }, 10);
    });
  });

  describe('Widget modal on init: ',function(){

    var _createController = function(showWidgetModal) {
      inject(function($injector,$rootScope, $controller){
        $scope = $rootScope.$new();

        var widgetModalFactory = $injector.get('widgetModalFactory');
        showWidgetModalSpy = sinon.spy(widgetModalFactory, 'showWidgetModal');

        $controller('PlaylistItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          item: itemProperties,
          showWidgetModal: showWidgetModal,
          editorFactory: $injector.get('editorFactory')
        });
      });
    }

    it('should open widget modal on init if requested', function() {
      _createController(true);
      showWidgetModalSpy.should.have.been.called;
      showWidgetModalSpy.should.have.been.calledWith(itemProperties);
    });

    it('should not open widget modal if not requested', function() {
      _createController(false);
      showWidgetModalSpy.should.not.have.been.called;
    });

    it('should not open widget modal for gadgets', function() {
      itemProperties.type = 'gadget';
      _createController(false);
      showWidgetModalSpy.should.not.have.been.called;
    });
  });


});
