'use strict';
describe('controller: Playlist Item Modal', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal',function(){
      return {
        open : function(){
          var deferred = Q.defer();
          deferred.resolve(['presentationId', 'name', presentationType]);

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
    });
    $provide.service('presentation',function(){
      return {
        get: function(){
          return Q.resolve({item: {productCode: '123'}});
        }
      };
    });
    $provide.service('blueprintFactory',function(){
      return {
        isPlayUntilDone: sinon.stub()
      };
    });
    $provide.service('$loading',function(){
      return {
        start: function(){},
        stop: function(){}
      };
    });
    $provide.value('playlistItem', playlistItem);
    $provide.constant('HTML_PRESENTATION_TYPE', 'HTML Template');
  }));

  var $scope, $modalInstance, $modalInstanceDismissSpy, itemUpdated, playlistItem, presentationType, blueprintFactory;

  beforeEach(function(){
    itemUpdated = false;
    playlistItem = {
      name: 'Some Item',
      type: 'url'
    };
    
    presentationType= '';

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      blueprintFactory = $injector.get('blueprintFactory');

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
      expect($scope.playUntilDoneSupported).to.equal(true);
      
      done();
    }, 10);
  });

  describe('playUntilDone: ', function() {
    it('should set playUntilDoneSupported to FALSE for HTML template', function(done) {

      presentationType = 'HTML Template';
      blueprintFactory.isPlayUntilDone.returns(Q.resolve(false));

      $scope.selectPresentation();

      setTimeout(function() {
        expect($scope.playlistItem.objectReference).to.equal('presentationId');
        expect($scope.playUntilDoneSupported).to.equal(false);
        
        done();
      }, 10);
    });

    it('should set playUntilDoneSupported to TRUE for HTML template', function(done) {

      presentationType = 'HTML Template';
      blueprintFactory.isPlayUntilDone.returns(Q.resolve(true));

      $scope.selectPresentation();

      setTimeout(function() {
        expect($scope.playlistItem.objectReference).to.equal('presentationId');
        expect($scope.playUntilDoneSupported).to.equal(true);
        
        done();
      }, 10);
    });

    it('should set playlistItem.playUntilDone to TRUE when adding a new HTML template that is PUD', function(done) {

      presentationType = 'HTML Template';
      blueprintFactory.isPlayUntilDone.returns(Q.resolve(true));
      $scope.playlistItem.playUntilDone = undefined;
      $scope.isNew = true;

      $scope.selectPresentation();

      setTimeout(function() {
        expect($scope.playlistItem.objectReference).to.equal('presentationId');
        expect($scope.playUntilDoneSupported).to.equal(true);
        expect($scope.playlistItem.playUntilDone).to.equal(true);
        
        done();
      }, 10);
    });

    it('should not set playlistItem.playUntilDone to TRUE when editing existing HTML template that is PUD', function(done) {

      presentationType = 'HTML Template';
      blueprintFactory.isPlayUntilDone.returns(Q.resolve(true));
      $scope.playlistItem.playUntilDone = false;
      $scope.isNew = false;

      $scope.selectPresentation();

      setTimeout(function() {
        expect($scope.playlistItem.objectReference).to.equal('presentationId');
        expect($scope.playUntilDoneSupported).to.equal(true);
        expect($scope.playlistItem.playUntilDone).to.equal(false);
        
        done();
      }, 10);
    });
    
  });

});
