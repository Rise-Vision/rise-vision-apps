'use strict';

describe('directive: basicStorageSelector', function() {
  var sandbox = sinon.sandbox.create(),
      $scope, $loading, storage, element;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('$loading', function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service('storage', function() {
      return {
        files: {
          get: function () {}
        }
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache) {
    $rootScope.validExtensions = '.jpg, .png';
    $rootScope.storageManager = {
      addSelectedItems: sandbox.stub(),
      isSingleFileSelector: sandbox.stub().returns(false),
      handleNavigation: sandbox.stub()
    };

    $loading = $injector.get('$loading');
    storage = $injector.get('storage');

    $templateCache.put('partials/template-editor/basic-storage-selector.html', '<p>mock</p>');
    element = $compile('<basic-storage-selector storage-selector-id="test" file-type="image" valid-extensions="validExtensions" storage-manager="storageManager"></basic-storage-selector>')($rootScope);
    $rootScope.$apply();

    $scope = element.isolateScope();
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
    expect($scope.search).to.be.ok;
    expect($scope.isFolder).to.be.a.function;
    expect($scope.fileNameOf).to.be.a.function;
    expect($scope.selectItem).to.be.a.function;
    expect($scope.isSelected).to.be.a.function;
    expect($scope.addSelected).to.be.a.function;
    expect($scope.loadItems).to.be.a.function;
  });

  it('should init default values', function() {
    expect($scope.filterConfig.placeholder).to.be.equal('Search Rise Storage');
    expect($scope.filterConfig.id).to.be.equal('basicStorageSearchInput');
    expect($scope.search.reverse).to.equal(false);
    expect($scope.search.doSearch).to.be.a.function;
  });

  it('should receive attributes', function () {
    expect($scope.storageSelectorId).to.equal('test');
    expect($scope.fileType).to.equal('image');
  });

  describe('fileNameOf', function () {
    it('should return only the name of the file given a full path', function () {
      expect($scope.fileNameOf('')).to.equal('');
      expect($scope.fileNameOf('test.jpg')).to.equal('test.jpg');
      expect($scope.fileNameOf('folder/')).to.equal('folder');
      expect($scope.fileNameOf('folder/test.jpg')).to.equal('test.jpg');
      expect($scope.fileNameOf('folder/subfolder/test.jpg')).to.equal('test.jpg');
    });
  });

  describe('selectItem', function () {
    it('should mark an item as selected', function () {
      expect($scope.selectedItems).to.be.empty;
      $scope.selectItem({ name: 'test.jpg' });
      expect($scope.selectedItems).to.have.lengthOf(1);
    });

    it('should unmark the item if it is selected twice', function () {
      expect($scope.selectedItems).to.be.empty;
      $scope.selectItem({ name: 'test.jpg' });
      expect($scope.selectedItems).to.have.lengthOf(1);
      $scope.selectItem({ name: 'test.jpg' });
      expect($scope.selectedItems).to.have.lengthOf(0);
    });

    it('should select multiple items', function(){
      expect($scope.selectedItems).to.be.empty;
      $scope.selectItem({ name: 'test.jpg' });
      expect($scope.selectedItems).to.have.lengthOf(1);
      $scope.selectItem({ name: 'test2.jpg' });
      expect($scope.selectedItems).to.have.lengthOf(2);
    });

    describe('selectItem() as single file selector',function(){
      beforeEach(function(){
        $scope.storageManager.isSingleFileSelector.returns(true);
      });

      it('should select an item',function(){
        expect($scope.selectedItems).to.be.empty;
        $scope.selectItem({ name: 'test.jpg' });
        expect($scope.selectedItems).to.have.lengthOf(1);
      });
      
      it('should unmark the item if it is selected twice', function () {
        expect($scope.selectedItems).to.be.empty;
        $scope.selectItem({ name: 'test.jpg' });
        expect($scope.selectedItems).to.have.lengthOf(1);
        $scope.selectItem({ name: 'test.jpg' });
        expect($scope.selectedItems).to.have.lengthOf(0);
      });

      it('should not select multiple items, only the last item',function(){
        expect($scope.selectedItems).to.be.empty;
        $scope.selectItem({ name: 'test.jpg' });
        expect($scope.selectedItems).to.have.lengthOf(1);        
        $scope.selectItem({ name: 'test2.jpg' });
        expect($scope.selectedItems).to.have.lengthOf(1);
        expect($scope.selectedItems).to.deep.equals([{ name: 'test2.jpg' }]);
      });
    });    
  });

  describe('isSelected', function () {
    it('should return true if the item is selected', function () {
      expect($scope.isSelected({ name: 'test.jpg' })).to.be.false;
      $scope.selectItem({ name: 'test.jpg' });
      expect($scope.isSelected({ name: 'test.jpg' })).to.be.true;
    });
  });

  describe('addSelected', function () {
    it('should call storageManager.addSelectedItems and reset the internal status', function () {
      var item = { name: 'test.jpg' };
      var selectedItems = [item];

      $scope.selectItem(item);
      expect($scope.selectedItems).to.have.lengthOf(1);
      $scope.addSelected();
      expect($scope.selectedItems).to.be.empty;
      expect($scope.storageManager.addSelectedItems).to.have.been.calledWith(selectedItems);
    });
  });

  describe('loadItems', function () {
    it('should load the files on the given path', function (done) {
      var files = [{
        name: 'folder/'
      }, {
        name: 'folder/file1.jpg'
      }, {
        name: 'folder/file2.jpg'
      }];

      sandbox.stub(storage.files, 'get').returns(Q.resolve({ files: files }));

      $scope.loadItems('folder/')
      .then(function () {
        expect($loading.start).to.have.been.called;
        expect($loading.stop).to.have.been.called;
        expect($scope.selectedItems).to.be.empty;
        expect($scope.storageUploadManager.folderPath).to.equal('folder/');
        expect($scope.folderItems).to.have.lengthOf(2);
        expect($scope.storageManager.handleNavigation).to.have.been.calledWith('folder/');

        done();
      });
    });

    it('should only load the files with the provided extensions', function (done) {
      var files = [{
        name: 'folder/'
      }, {
        name: 'folder/file1.jpg'
      }, {
        name: 'folder/file2.png'
      }, {
        name: 'folder/file3.pdf'
      }];

      sandbox.stub(storage.files, 'get').returns(Q.resolve({ files: files }));

      $scope.loadItems('folder/')
      .then(function () {
        expect($loading.start).to.have.been.called;
        expect($loading.stop).to.have.been.called;
        expect($scope.selectedItems).to.be.empty;
        expect($scope.storageUploadManager.folderPath).to.equal('folder/');
        expect($scope.folderItems).to.have.lengthOf(2);

        done();
      });
    });

    it('should not clear information if loading fails', function (done) {
      var files = [{
        name: 'folder/file1.jpg'
      }, {
        name: 'folder/file2.jpg'
      }];

      $scope.selectedItems = [ files[0] ];
      $scope.storageUploadManager.folderPath = 'folder/';
      $scope.folderItems = files;

      sandbox.stub(storage.files, 'get').returns(Q.reject('Failed to load'));

      $scope.loadItems('folder/')
      .then(function () {
        expect($loading.start).to.have.been.called;
        expect($loading.stop).to.have.been.called;
        expect($scope.selectedItems).to.be.have.lengthOf(1);
        expect($scope.storageUploadManager.folderPath).to.equal('folder/');
        expect($scope.folderItems).to.have.lengthOf(2);

        done();
      });
    });
  });
});
