'use strict';
describe('controller: Playlist Item Modal', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal',function(){
      return {
        open: sinon.stub().returns({
          result: Q.resolve(['presentationId', 'name', presentationType])
        })
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
    $provide.service('playlistFactory',function(){
      return {
        updatePlaylistItem : function(){
          itemUpdated = true;
        },
        isNew: function() {
          return true;
        },
        initPlayUntilDone: sinon.stub().returns(Q.resolve())
      }
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: function() {
          return 'companyId';
        }
      };
    });
    $provide.service('presentationFactory',function(){
      return {
        getPresentationCached: sinon.stub().returns(Q.resolve('presentation'))
      };
    });
    $provide.service('$loading',function(){
      return {
        start: function(){},
        stop: function(){}
      };
    });
    $provide.value('playlistItem', playlistItem);
    $provide.value('TRANSITION_TYPES', []);
  }));

  var $scope, $modalInstance, $modalInstanceDismissSpy, itemUpdated, playlistItem, presentationType, playlistFactory, presentationFactory;

  beforeEach(function(){
    itemUpdated = false;
    playlistItem = {
      name: 'Some Item',
      type: 'url',
      objectReference: 'objectReference'
    };
    
    presentationType= '';

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      playlistFactory = $injector.get('playlistFactory');
      presentationFactory = $injector.get('presentationFactory');

      $controller('playlistItemModal', {
        $scope : $scope,
        $rootScope: $rootScope,
        $modalInstance : $modalInstance,
        $modal : $injector.get('$modal'),
        userState: $injector.get('userState'),
        playlistFactory: playlistFactory,
        playlistItem: $injector.get('playlistItem')
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;
    
    expect($scope.transitionTypes).to.be.ok;
    expect($scope.companyId).to.equal('companyId');
    expect($scope.isNew).to.be.true;
    expect($scope.playlistItem).to.deep.equal(playlistItem);
    expect($scope.playlistItem).to.not.equal(playlistItem);

    expect($scope.selectPresentation).to.be.a('function');
    expect($scope.save).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
  });

  it('should close modal on save',function(){
    $scope.save();

    expect(itemUpdated).to.be.true;
    $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();
    
    expect(itemUpdated).to.be.false;
    $modalInstanceDismissSpy.should.have.been.called;
  });
  
  describe('selectPresentation:', function(done) {
    it('should get cached presentation:', function(done) {
      $scope.selectPresentation();

      expect($scope.loadingTemplate).to.be.true;

      setTimeout(function() {
        expect($scope.loadingTemplate).to.be.false;

        presentationFactory.getPresentationCached.should.have.been.calledWith('objectReference');
        
        done();
      }, 10);
    });

    it('should init playlist item playUntilDone', function(done) {
      $scope.selectPresentation();

      setTimeout(function() {
        var updatedPlaylistItem = angular.copy(playlistItem);
        updatedPlaylistItem.objectReference = 'presentationId';
        updatedPlaylistItem.presentationType = '';

        playlistFactory.initPlayUntilDone.should.have.been.calledWith(updatedPlaylistItem, 'presentation', true);

        expect($scope.playUntilDoneSupported).to.not.be.ok;
        
        done();
      }, 10);
    });

  });

  describe('_configurePlayUntilDone:', function() {
    it('should set playUntilDoneSupported to FALSE if initPlayUntilDone resolves false', function(done) {
      playlistFactory.initPlayUntilDone.returns(Q.resolve(false));

      $scope.selectPresentation();

      setTimeout(function() {
        expect($scope.playUntilDoneSupported).to.be.false;
        
        done();
      }, 10);
    });

    it('should set playUntilDoneSupported to TRUE if initPlayUntilDone resolves true', function(done) {
      playlistFactory.initPlayUntilDone.returns(Q.resolve(true));

      $scope.selectPresentation();

      setTimeout(function() {
        expect($scope.playUntilDoneSupported).to.be.true;
        
        done();
      }, 10);
    });
    
  });

});
