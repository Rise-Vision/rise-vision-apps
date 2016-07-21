'use strict';
describe('controller: Files List', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$timeout', function() {
      return function(callback, duration) {
        setTimeout(callback, duration);
      };
    });
    $provide.service('$loading', function() {
      return {
        start: function() {},
        stop: function() {}
      }
    });
    $provide.factory('$translate', function() {
      return function() {
        return {
          then: function(callback) {
            callback('Trash');
          }
        }
      }
    });
    $provide.service('storageFactory', function() {
      return storageFactory = {
        storageFull: true,
        folderPath: 'folder/',
        fileIsCurrentFolder: function (file) {
          return file.name === '';
        },
        fileIsFolder: function (file) {
          return file.name.substr(-1) === '/';
        },
        fileIsTrash: function (file) {
          return file.name === '--TRASH--/';
        }
      };
    });
    $provide.service('fileSelectorFactory',function(){
      return {
        onFileSelect: function() {
          onFileSelect = true;
        },
        changeFolder: function() {
          changeFolder = true;
        }
      };
    });
    $provide.service('filesFactory',function(){
      return {
        refreshFilesList : function(){
        },
        filesDetails: {
          files: []
        },
        statusDetails: {}
      }
    });
    $provide.service('FileUploader',function(){
      return {}
    });
    $provide.value('SELECTOR_TYPES', {SINGLE_FILE: 'single-file'});
  }));
  var $scope, onFileSelect, changeFolder, storageFactory;
  beforeEach(function(){
    onFileSelect = changeFolder = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $controller('FilesListController', {
        $scope : $scope,
        $rootScope: $rootScope,
        fileSelectorFactory: $injector.get('fileSelectorFactory'),
        filesFactory: $injector.get('filesFactory'),
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.storageFactory).to.be.ok;
    expect($scope.filesFactory).to.be.ok;
    expect($scope.fileSelectorFactory).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
    expect($scope.fileUploader).to.be.ok;    

    expect($scope.filesDetails).to.be.ok;
    expect($scope.statusDetails).to.be.ok;
    expect($scope.bucketCreationStatus).to.be.ok;

    expect($scope.fileClick).to.be.a('function');
    expect($scope.currentDecodedFolder).to.be.a('function');
    expect($scope.dateModifiedOrderFunction).to.be.a('function');
    expect($scope.fileNameOrderFunction).to.be.a('function');
    expect($scope.orderByAttribute).to.be.a('function');
    expect($scope.fileExtOrderFunction).to.be.a('function');
    expect($scope.fileSizeOrderFunction).to.be.a('function');
    expect($scope.isFileListVisible).to.be.a('function');
  });
  
  it('should reset folderPath on startup', function() {
    expect(storageFactory.folderPath).to.equal('');
  });

  it('should watch loading variable', function() {
    expect($scope.$$watchers[0].exp).to.equal('filesFactory.loadingItems');
  });
  
  it('should update subscription status', function(done) {
    var subscriptionStatus = {statusCode: 'trial-available'};
    $scope.$emit('subscription-status:changed', subscriptionStatus);
    
    setTimeout(function() {
      expect($scope.subscriptionStatus).to.equal(subscriptionStatus);
      expect($scope.trialAvailable).to.be.true;
      
      done();
    }, 10);
  });  
  
  describe('fileClick: ', function() {
    it('should select file', function() {
      $scope.fileClick({name: 'someFolder/image.jpg'});
      
      expect(onFileSelect).to.be.true;
      expect(changeFolder).to.be.false;
    });
    
    it('should post throttle warning, and not select file', function() {
      var file = {name: 'someFolder/image.jpg', isThrottled: true};
      $scope.fileClick(file);
      
      expect(file.showThrottledCallout).to.be.true;
      expect(onFileSelect).to.be.false;
      expect(changeFolder).to.be.false;
    });
    
    it('two clicks should close throttle warning', function() {
      var file = {name: 'someFolder/image.jpg', isThrottled: true};
      $scope.fileClick(file);
      $scope.fileClick(file);

      expect(file.showThrottledCallout).to.be.false;
      expect(onFileSelect).to.be.false;
      expect(changeFolder).to.be.false;
    });
    
    it('should select folder with one click', function(done) {
      $scope.fileClick({name: 'someFolder/'});
      
      setTimeout(function() {
        expect(onFileSelect).to.be.true;
        expect(changeFolder).to.be.false;
        
        done();        
      }, 500);
    });
    
    it('should open folder with double click', function(done) {
      $scope.fileClick({name: 'someFolder/'});
      
      setTimeout(function() {
        $scope.fileClick({name: 'someFolder/'});
        
        expect(onFileSelect).to.be.false;
        expect(changeFolder).to.be.true;

        done();        
      }, 200);
    });
  });
  
  it('currentDecodedFolder: ', function() {
    $scope.storageFactory.folderPath = '';
    expect($scope.currentDecodedFolder()).to.be.undefined;
    
    $scope.storageFactory.folderPath = 'someFolder/';
    expect($scope.currentDecodedFolder()).to.equal('someFolder/');

    $scope.storageFactory.folderPath = 'my%20test/';
    expect($scope.currentDecodedFolder()).to.equal('my test/');
  });
  
  it('dateModifiedOrderFunction: ', function() {
    expect($scope.dateModifiedOrderFunction({})).to.equal('');
    expect($scope.dateModifiedOrderFunction({updated: {value: undefined}})).to.be.undefined;
    expect($scope.dateModifiedOrderFunction({updated: {value: 'timestamp'}})).to.equal('timestamp');
  });
  
  it('fileNameOrderFunction: ', function() {
    expect($scope.fileNameOrderFunction({name: '--TRASH--/'})).to.equal('trash');
    expect($scope.fileNameOrderFunction({name: 'someFolder/'})).to.equal('somefolder/');
    expect($scope.fileNameOrderFunction({name: 'someFolder/Image.jpg'})).to.equal('somefolder/image.jpg');
  });
  
  it('orderByAttribute: ', function() {
    expect($scope.orderByAttribute).to.equal($scope.fileNameOrderFunction);
  })
  
  it('fileExtOrderFunction: ', function() {
    expect($scope.fileExtOrderFunction({name: 'someFolder/'})).to.equal('Folder');
    expect($scope.fileExtOrderFunction({name: 'someFolder/image.jpg'})).to.equal('jpg');
    expect($scope.fileExtOrderFunction({name: 'image.jpg'})).to.equal('jpg');
    expect($scope.fileExtOrderFunction({name: 'imagejpg'})).to.equal('');
  });
  
  it('fileSizeOrderFunction: ', function() {
    expect($scope.fileSizeOrderFunction({size: '20'})).to.equal(20);
    expect($scope.fileSizeOrderFunction({size: 20})).to.equal(20);
    expect($scope.fileSizeOrderFunction({size: 'i'})).to.be.NaN;
    expect($scope.fileSizeOrderFunction({})).to.equal(0);
  })

  describe('isFileListVisible: ', function() {
    beforeEach(function() {
      $scope.storageFactory.folderPath = '';
      $scope.storageFactory.storageFull = false;
    });

    it('hidden for no files', function() {
      expect($scope.isFileListVisible()).to.be.false;
    });
    
    it('hidden if Trash & current folder are only files', function() {
      $scope.filesDetails.files.push({name: '--TRASH--/'});
      $scope.filesDetails.files.push({name: ''});
      expect($scope.isFileListVisible()).to.be.false;
    });

    it('always visible for full screen storage', function() {
      $scope.storageFactory.storageFull = true;

      expect($scope.isFileListVisible()).to.be.true;
    });

    it('show for subfolders', function() {
      $scope.storageFactory.folderPath = 'someFolder/';

      expect($scope.isFileListVisible()).to.be.true;
    });

  });

});
