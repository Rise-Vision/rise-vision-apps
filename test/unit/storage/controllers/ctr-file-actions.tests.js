'use strict';
describe('controller: File Actions', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('fileActionsFactory',function(){
      return fileActionsFactory = {
      }
    });
    $provide.service('filesFactory',function(){
      return filesFactory = {
        filesDetails: {
          checkedItemsCount: 0
        },
        statusDetails: {}
      }
    });
    $provide.service('storageFactory',function(){
      return storageFactory = {
        isTrashFolder: function() {
          return isTrashFolder;
        }
      }
    });
    $provide.service('downloadFactory', function() {
      return {};
    });
    $provide.service('$window',function(){
      return $window = {
          addEventListener: function() {}
      }
    });
    $provide.service('$translate',function(){
      return $translate = function() {
        return {
          then: function(callback){
            callback('translated message');
          }
        }
      }
    });
  }));
  var $scope, fileActionsFactory, filesFactory, storageFactory, $window, $translate, isTrashFolder, addEventListenerSpy;
  beforeEach(function(){
    isTrashFolder = false;
    inject(function($injector,$rootScope, $controller){
      addEventListenerSpy = sinon.spy($window,'addEventListener');

      $scope = $rootScope.$new();
      $controller('FileActionsController', {
        $scope : $scope
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.factory).to.be.ok;
    expect($scope.storageFactory).to.be.ok;
    expect($scope.filesDetails).to.be.ok;
    expect($scope.fileListStatus).to.be.ok;
    expect($scope.leavePageMessage).to.be.ok;

    expect($scope.isDisabledDownloadButton).to.be.a('function');
    expect($scope.isDisabledTrashButton).to.be.a('function');
    expect($scope.isDisabledRestoreButton).to.be.a('function');
    expect($scope.isDisabledDeleteButton).to.be.a('function');
    
    expect($scope.isDisabledCopyUrlButton).to.be.a('function');
  });

  it('should initialize correct values',function(){
    expect($scope.isDisabledDownloadButton()).to.be.true;
    expect($scope.isDisabledTrashButton()).to.be.true;
    expect($scope.isDisabledRestoreButton()).to.be.true;
    expect($scope.isDisabledDeleteButton()).to.be.true;

    expect($scope.leavePageMessage).to.equal('translated message');
  });

  it('should enable buttons when file is selected',function(){
    filesFactory.filesDetails.checkedItemsCount = 1;

    expect($scope.isDisabledDownloadButton()).to.be.false;
    expect($scope.isDisabledTrashButton()).to.be.false;
    expect($scope.isDisabledRestoreButton()).to.be.false;
    expect($scope.isDisabledDeleteButton()).to.be.false;
  });

  it('should disable Copy URL if is trash folder',function(){
    expect($scope.isDisabledCopyUrlButton()).to.be.true;   

    filesFactory.filesDetails.checkedItemsCount = 1;
    expect($scope.isDisabledCopyUrlButton()).to.be.false;

    isTrashFolder = true;
    expect($scope.isDisabledCopyUrlButton()).to.be.true;
  });

  it('should watch exiting page',function(){
    addEventListenerSpy.should.have.been.calledWith('beforeunload');
  });

});
