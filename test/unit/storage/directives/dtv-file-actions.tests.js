'use strict';
describe('directive: file-actions', function() {
  beforeEach(module('risevision.storage.directives'));

  beforeEach(module(function ($provide) {
    $provide.service('FileActionsFactory',function(){
      return function(newFilesFactory) {
        expect(newFilesFactory).to.equal(filesFactory);

        return fileActionsFactory = {
        };
      };
    });

    filesFactory = {
      filesDetails: {
        checkedItemsCount: 0
      },
      statusDetails: {},
      isTrashFolder: function() {
        return isTrashFolder;
      }
    };

    $provide.service('pendingOperationsFactory',function(){
      return {};
    });
    $provide.service('$window',function(){
      return $window = {
        addEventListener: function() {}
      };
    });
    $provide.service('$translate',function(){
      return $translate = function() {
        return {
          then: function(callback){
            callback('translated message');
          }
        };
      };
    });
  }));
  var element;
  var $scope, fileActionsFactory, filesFactory, $window, $translate, isTrashFolder, addEventListenerSpy;
  beforeEach(inject(function($compile, $rootScope, $templateCache){
    addEventListenerSpy = sinon.spy($window,'addEventListener');
    $rootScope.filesFactory = filesFactory;

    $templateCache.put('partials/storage/file-actions.html', '<p>mock</p>');

    element = $compile('<file-actions files-factory="filesFactory"></file-actions>')($rootScope);
    $rootScope.$apply();
    
    $scope = element.isolateScope();
  }));

  it('should render directive', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.factory).to.be.ok;
    expect($scope.filesDetails).to.be.ok;
    expect($scope.fileListStatus).to.be.ok;
    expect($scope.leavePageMessage).to.be.ok;

    expect($scope.isDisabledDownloadButton).to.be.a('function');
    expect($scope.isDisabledTrashButton).to.be.a('function');
    expect($scope.isDisabledRestoreButton).to.be.a('function');
    expect($scope.isDisabledDeleteButton).to.be.a('function');
    
    expect($scope.isDisabledCopyUrlButton).to.be.a('function');
    expect($scope.isDisabledRenameButton).to.be.a('function');
    expect($scope.isDisabledMoveButton).to.be.a('function');
  });

  it('should initialize correct values',function(){
    expect($scope.isDisabledDownloadButton()).to.be.true;
    expect($scope.isDisabledTrashButton()).to.be.true;
    expect($scope.isDisabledRestoreButton()).to.be.true;
    expect($scope.isDisabledDeleteButton()).to.be.true;
    
    expect($scope.isDisabledCopyUrlButton()).to.be.true;
    expect($scope.isDisabledRenameButton()).to.be.true;
    expect($scope.isDisabledMoveButton()).to.be.true;    

    expect($scope.leavePageMessage).to.equal('translated message');
  });

  it('should enable buttons when file is selected',function(){
    filesFactory.filesDetails.checkedItemsCount = 1;

    expect($scope.isDisabledDownloadButton()).to.be.false;
    expect($scope.isDisabledTrashButton()).to.be.false;
    expect($scope.isDisabledRestoreButton()).to.be.false;
    expect($scope.isDisabledDeleteButton()).to.be.false;
    
    expect($scope.isDisabledCopyUrlButton()).to.be.false;
    expect($scope.isDisabledRenameButton()).to.be.false;
    expect($scope.isDisabledMoveButton()).to.be.false;
  });
  
  it('should enable buttons when file is selected',function(){
    filesFactory.filesDetails.checkedItemsCount = 5;

    expect($scope.isDisabledDownloadButton()).to.be.false;
    expect($scope.isDisabledTrashButton()).to.be.false;
    expect($scope.isDisabledRestoreButton()).to.be.false;
    expect($scope.isDisabledDeleteButton()).to.be.false;
    
    expect($scope.isDisabledCopyUrlButton()).to.be.true;
    expect($scope.isDisabledRenameButton()).to.be.true;
    expect($scope.isDisabledMoveButton()).to.be.false;
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
