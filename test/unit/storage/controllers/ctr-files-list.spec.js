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
    $provide.service('storageUtils', function () {
      return {
        fileIsFolder: function (file) {
          return file.name.substr(-1) === '/';
        },
        fileIsTrash: function (file) {
          return file.name === '--TRASH--/';       
        }
      };
    });
    $provide.service('StorageFactory', function() {
      return function() {
        return storageFactory = {
          storageFull: true,
          setSelectorType: sinon.stub()
        };
      };
    });
    $provide.service('FilesFactory',function(){
      return function () {
        return {
          refreshFilesList : function(){
          },
          filesDetails: {
            files: []
          },
          onFileSelect: function() {
            onFileSelect = true;
          },
          changeFolder: function() {
            changeFolder = true;
          },
          folderPath: 'folder/'
        };
      };
    });
    $provide.service('FileUploader',function(){
      return {}
    });
    $provide.service('currentPlanFactory',function(){});

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
        filesFactory: $injector.get('FilesFactory'),
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.storageFactory).to.be.ok;
    expect($scope.filesFactory).to.be.ok;
    expect($scope.storageUtils).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
    expect($scope.fileUploader).to.be.ok;    
    expect($scope.isListView).to.be.false;
    expect($scope.search).to.be.ok;

    expect($scope.filesDetails).to.be.ok;
    expect($scope.bucketCreationStatus).to.be.ok;

    expect($scope.setSelectorType).to.be.a('function');
    expect($scope.setExcludedFiles).to.be.a('function');
    expect($scope.fileClick).to.be.a('function');
    expect($scope.dateModifiedOrderFunction).to.be.a('function');
    expect($scope.fileNameOrderFunction).to.be.a('function');
    expect($scope.fileExtOrderFunction).to.be.a('function');
    expect($scope.fileSizeOrderFunction).to.be.a('function');
    expect($scope.isFileListVisible).to.be.a('function');

    expect($scope.currentPlanFactory).to.be.ok;
  });
  
  it('should initialize search', function() {
    expect($scope.search).to.be.a('object');
    expect($scope.search.sortBy).to.equal($scope.fileNameOrderFunction);
    expect($scope.search.reverse).to.be.false;
    expect($scope.search.doSearch).to.be.a('function');
  })
  
  it('should reset folderPath on startup', function() {
    expect($scope.filesFactory.folderPath).to.equal('');
  });

  it('should watch loading variable', function() {
    expect($scope.$$watchers[0].exp).to.equal('filesFactory.loadingItems');
  });
  
  it('setSelectorType: ', function() {
    expect(storageFactory.storageFull).to.be.true;
    $scope.setSelectorType('type', 'filter');
    
    expect(storageFactory.setSelectorType).to.have.been.calledWith('type', 'filter');
    expect(storageFactory.storageFull).to.be.false;
  });
  
  it('setExcludedFiles: ', function() {
    expect($scope.filesFactory.excludedFiles).to.not.be.ok;
    $scope.setExcludedFiles(['file1', 'file2']);
    
    expect($scope.filesFactory.excludedFiles).to.deep.equal(['file1', 'file2']);
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
  });

  it('toggleListView:' ,function(){
    expect($scope.isListView).to.be.false;
    $scope.toggleListView();
    expect($scope.isListView).to.be.true;
    $scope.toggleListView();
    expect($scope.isListView).to.be.false;
  });
  
  describe('sortBy: ',function(){
    it('should reverse sort',function(){
      $scope.sortBy($scope.fileNameOrderFunction);

      expect($scope.search.sortBy).to.equal($scope.fileNameOrderFunction);
      expect($scope.search.reverse).to.be.true;
    });
    
    it('should should sort by file ext',function(){
      $scope.sortBy($scope.fileExtOrderFunction);

      expect($scope.search.sortBy).to.equal($scope.fileExtOrderFunction);
      expect($scope.search.reverse).to.be.false;
    });
  });

  describe('isFileListVisible: ', function() {
    beforeEach(function() {
      $scope.filesFactory.folderPath = '';
      $scope.trialAvailable = false;
      $scope.fileUploader.queue = [];
    });

    it('should be hidden for no files', function() {
      expect($scope.isFileListVisible()).to.be.false;
    });

    it('should be hidden if loading', function() {
      $scope.storageFactory.loadingItems = true;
      expect($scope.isFileListVisible()).to.be.false;
    });

    it('should be hidden if trial is available',function(){
      $scope.trialAvailable = true;
      expect($scope.isFileListVisible()).to.be.false;
    });

    it('should show if file list is not empty',function(){
      $scope.filesDetails.files.push({name: 'aa'});
      expect($scope.isFileListVisible()).to.be.true;
    });

  });

  describe('isEmptyState:', function(){
    beforeEach(function() {
      $scope.filesFactory.folderPath = '';
      $scope.fileUploader.queue = [];
    });

    it('should be true if list is empty',function(){     
      expect($scope.isEmptyState()).to.be.true;
    });

    it('should hide empty state when uploading files',function(){
      $scope.fileUploader.queue = [{}];
      expect($scope.isEmptyState()).to.be.false;
    });
    
    it('show be false for subfolders', function() {
      $scope.filesFactory.folderPath = 'someFolder/';
      expect($scope.isEmptyState()).to.be.false;
    });

    it('should be false if file list is not empty',function(){
      $scope.filesDetails.files.push({name: 'aa'});
      expect($scope.isEmptyState()).to.be.false;
    });

    it('should be true if Trash is the only file', function() {
      $scope.filesDetails.files.push({name: '--TRASH--/'});
      expect($scope.isEmptyState()).to.be.true;
    });

  });

});
