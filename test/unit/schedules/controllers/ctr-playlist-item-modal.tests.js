'use strict';
describe('controller: Playlist Item Modal', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal',function(){
      return {
        open : function(){
          var deferred = Q.defer();
          deferred.resolve(['presentationId', 'name']);

          return {
            result: deferred.promise
          };
        }
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
        }
      }
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: function() {
          return 'companyId';
        }
      };
    })
    $provide.value('playlistItem', playlistItem);
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, itemUpdated, playlistItem;
  beforeEach(function(){
    itemUpdated = false;
    playlistItem = {
      name: 'Some Item',
      type: 'url'
    };
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $controller('playlistItemModal', {
        $scope : $scope,
        $rootScope: $rootScope,
        $modalInstance : $modalInstance,
        $modal : $injector.get('$modal'),
        userState: $injector.get('userState'),
        playlistFactory: $injector.get('playlistFactory'),
        playlistItem: $injector.get('playlistItem')
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;
    
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
  
  it('should populate open presentation selector and update id', function(done) {
    $scope.selectPresentation();

    setTimeout(function() {
      expect($scope.playlistItem.objectReference).to.equal('presentationId');
      
      done();
    }, 10);
  });
  
  it('should populate url on picked event',function(){
    $scope.$broadcast('picked', ['some_url']);
    $scope.$digest();
    expect($scope.playlistItem.objectReference).to.equal('some_url');
  });
});
