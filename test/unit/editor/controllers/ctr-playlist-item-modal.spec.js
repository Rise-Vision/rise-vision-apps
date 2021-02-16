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
        getGadgetById: function() {
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

    $provide.service('settingsFactory',function(){
      return {
        showSettingsModal: sinon.stub()
      }
    });
    
    $provide.service('editorFactory',function(){
      return {
        presentation: presentation
      }
    });

    $provide.value('RVA_URL', 'http://rva.risevision.com');

    $provide.value('EMBEDDED_PRESENTATIONS_CODE', 'test-code');

    $provide.service('userState',function(){
      return {
        getSelectedCompanyId: function () {
          return '123456';
        }
      }
    });

    $provide.service('plansFactory', function() {
      return {
        showPurchaseOptions: sinon.stub()
      };
    });

  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, itemProperties, itemType, 
  itemUpdated, presentation;

  describe('Normal checks', function () {
    beforeEach(function(){
      presentation = {
        id : ''
      };

      inject(function($injector,$rootScope, $controller){
        itemUpdated = null;
        itemType = 'widget';
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');

        $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

        $controller('PlaylistItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          item: itemProperties,
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
    
    describe('showSettingsModal: ', function() {
      var settingsFactory;
      beforeEach(function() {
        inject(function($injector){
          settingsFactory = $injector.get('settingsFactory');
        });
      });
      
      it('should open settings', function() {
        $scope.showSettingsModal();
        
        expect(settingsFactory.showSettingsModal).to.have.been.calledWith($scope.item, true);
      });
    })
  });
  
  describe('Presentation Item checks', function () {
    beforeEach(function(){
      presentation = {
        id : ''
      };

      inject(function($injector,$rootScope, $controller){
        itemUpdated = null;
        itemProperties.type = 'presentation';
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

    it('should not load widget name for Presentation Item', function(done) {
      setTimeout(function() {
        expect($scope.widgetName).to.equal('editor-app.playlistItem.presentation.name');

        done();
      }, 10);
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

});
