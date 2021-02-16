'use strict';

describe('controller: NewFolderModalCtrl', function() {
  
  beforeEach(module('risevision.storage.controllers'));

  beforeEach(function() {
    module(function($provide) {
      $provide.service('storage', function() {
        return {
          createFolder: function () {
            var deferred = Q.defer();

            // Always resolve, result contains error code
            deferred.resolve(result);

            return deferred.promise;            
          }
        };
      });

      $provide.service('$modalInstance',function(){
        return {
          close : function(action){},
          dismiss : function(action){}
        }
      });

      $provide.service('filesFactory',function(){
        return {
          getFileNameIndex : function(){
            if (duplicatedName) {
              return 1;
             } else {
              return -1;
            }            
          },
          refreshFilesList : function(){},
          folderPath: ''
        }
      });

      $provide.factory('$translate', function() {
        return function() {
          return {
            then: function(callback) {
              callback('translated message');
            }
          }
        }
      });
    });   
  });

  var $scope, storage, $modalInstance, $modalInstanceCloseSpy, createFolderSpy, 
    duplicatedName, filesFactory, refreshFilesListSpy, emitSpy, result;
  beforeEach(function(){
    duplicatedName = false;
    result = { code: 200 };
    inject(function ($controller, $rootScope, $injector) {
      $scope = $rootScope.$new();
      emitSpy = sinon.spy($rootScope,'$emit');
      storage = $injector.get('storage');
      filesFactory = $injector.get('filesFactory');
      refreshFilesListSpy = sinon.spy(filesFactory, 'refreshFilesList');
      createFolderSpy = sinon.spy(storage,'createFolder');
      $modalInstance = $injector.get('$modalInstance');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $controller('NewFolderModalCtrl', {
        $scope : $scope,
        $modalInstance : $modalInstance
      });
      $scope.$digest();
    });
  });

  it('should exist', function() {
    expect($scope).to.be.ok;

    expect($scope.duplicateFolderSpecified).to.be.false;
    expect($scope.accessDenied).to.be.false;
    expect($scope.serverError).to.be.false;
    expect($scope.waitingForResponse).to.be.false;

    expect($scope.ok).to.be.a('function');
    expect($scope.cancel).to.be.a('function');
  });

  it('should create folder',function(done){
    $scope.folderName = 'newFolder';
    $scope.ok();

    expect($scope.waitingForResponse).to.be.true;
    createFolderSpy.should.have.been.calledWith('newFolder');

    setTimeout(function() {
      expect($scope.waitingForResponse).to.be.false;
      refreshFilesListSpy.should.have.been.called;      
      $modalInstanceCloseSpy.should.have.been.calledWith('newFolder');
      emitSpy.should.have.been.calledWith('refreshSubscriptionStatus', 'trial-available');
      
      done();
    }, 10);
  });

  it('should not allow duplicated folder name',function(){
    duplicatedName = true;
    $scope.folderName = 'newFolder';

    $scope.ok();
    
    createFolderSpy.should.not.have.been.called;
    expect($scope.duplicateFolderSpecified).to.be.true;
    expect($scope.waitingForResponse).to.be.false;
  });
  
  it('should correctly create sub-folder of folder with % in name',function(done){
    filesFactory.folderPath = 'some % folder/';

    $scope.folderName = 'newFolder';
    $scope.ok();

    expect($scope.waitingForResponse).to.be.true;
    createFolderSpy.should.have.been.calledWith('some % folder/newFolder');

    setTimeout(function() {
      expect($scope.waitingForResponse).to.be.false;
      refreshFilesListSpy.should.have.been.called;      
      $modalInstanceCloseSpy.should.have.been.calledWith('newFolder');
      emitSpy.should.have.been.calledWith('refreshSubscriptionStatus', 'trial-available');
      
      done();
    }, 10);
  });

  it('should not proceed if foder name is empty',function(){
    $scope.folderName = '';
    $scope.ok();
    
    createFolderSpy.should.not.have.been.called;
    expect($scope.waitingForResponse).to.be.false;
  });

  it('should not proceed if foder name is undefined',function(){
    $scope.folderName = null;
    $scope.ok();
    
    createFolderSpy.should.not.have.been.called;
    expect($scope.waitingForResponse).to.be.false;
  });

  it('should handle access denied',function(done){
    result = { code: 403, message: 'restricted-role', userEmail: 'test@test.com'};
    $scope.folderName = 'newFolder';
    $scope.ok();

    expect($scope.waitingForResponse).to.be.true;
    createFolderSpy.should.have.been.calledWith('newFolder');

    setTimeout(function() {
      expect($scope.waitingForResponse).to.be.false;
      expect($scope.accessDenied).to.be.true;

      refreshFilesListSpy.should.not.have.been.called;      
      $modalInstanceCloseSpy.should.not.have.been.called;
      emitSpy.should.not.have.been.called;     
      
      done();
    }, 10);
  });

  it('should handle server error',function(done){
    result = { code: 500};
    $scope.folderName = 'newFolder';
    $scope.ok();

    expect($scope.waitingForResponse).to.be.true;
    createFolderSpy.should.have.been.calledWith('newFolder');

    setTimeout(function() {
      expect($scope.waitingForResponse).to.be.false;
      expect($scope.accessDenied).to.be.true;

      refreshFilesListSpy.should.not.have.been.called;      
      $modalInstanceCloseSpy.should.not.have.been.called;
      emitSpy.should.not.have.been.called;     
      
      done();
    }, 10);
  });

  describe('cancel:',function(){
    it('should dimiss modal',function(){
      var modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $scope.cancel();

      modalInstanceDismissSpy.should.have.been.calledWith('cancel');
    })
  })
});
