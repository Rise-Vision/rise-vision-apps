'use strict';

describe('directive: componentStorageSelector', function() {
  var sandbox = sinon.sandbox.create(),
      $scope, element, $loading, componentsFactory, templateEditorUtils, storageManagerFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$loading', function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sandbox.stub(),
        setPanelIcon: sandbox.stub(),
        setPanelTitle: sandbox.stub(),
        resetPanelHeader: sandbox.stub(),
        showPreviousPage: sandbox.stub(),
      };
    });

    $provide.service('storageManagerFactory', function() {
      return {
        loadFiles: sandbox.stub().returns(Q.resolve('folderItems')),
        fileType: 'image',
        isSingleFileSelector: sandbox.stub()
      };
    });

    $provide.service('currentPlanFactory',function(){});

  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache) {
    $loading = $injector.get('$loading');
    componentsFactory = $injector.get('componentsFactory');
    templateEditorUtils = $injector.get('templateEditorUtils');
    storageManagerFactory = $injector.get('storageManagerFactory');

    $templateCache.put('partials/template-editor/components/component-storage-selector.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile('<component-storage-selector></component-storage-selector>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
    expect($scope.search).to.be.ok;
    expect($scope.storageManagerFactory).to.be.ok;

    expect($scope.thumbnailFor).to.be.a('function');

    expect($scope.selectItem).to.be.a('function');
    expect($scope.isSelected).to.be.a('function');
    expect($scope.addSelected).to.be.a('function');
    expect($scope.loadItems).to.be.a('function');

    expect($scope.sortBy).to.be.a('function');
    expect($scope.dateModifiedOrderFunction).to.be.a('function');
    expect($scope.fileNameOrderFunction).to.be.a('function');

    expect($scope.currentPlanFactory).to.be.ok;
  });

  it('should init default values', function() {
    expect($scope.filterConfig.placeholder).to.be.equal('Search Rise Storage');
    expect($scope.filterConfig.id).to.be.equal('componentStorageSearchInput');
    expect($scope.search.reverse).to.be.false;
    expect($scope.search.doSearch).to.be.a('function');
    expect($scope.search.sortBy).to.equal($scope.fileNameOrderFunction);
  });

  it('should add utils on scope', function() {
    sandbox.stub(templateEditorUtils, 'hasRegularFileItems');

    expect($scope.isFolder).to.be.a('function');
    expect($scope.fileNameOf).to.be.a('function');

    expect($scope.hasRegularFileItems).to.be.a('function');

    $scope.hasRegularFileItems();

    templateEditorUtils.hasRegularFileItems.should.have.been.calledWith($scope.folderItems);
  });

  it('thumbnailFor:', function() {
    expect($scope.thumbnailFor({
      metadata: {
        thumbnail: 'thumb'
      }
    })).to.equal('thumb?_=undefined');

    expect($scope.thumbnailFor({
      metadata: {
        thumbnail: 'thumb'
      },
      timeCreated: {
        value: 'time'
      }
    })).to.equal('thumb?_=time');

    expect($scope.thumbnailFor({
      mediaLink: 'link'
    })).to.equal('link');

  });

  describe('storageUploadManager:', function() {
    it('should initialize', function() {
      expect($scope.storageUploadManager).to.be.ok;
      expect($scope.storageUploadManager.folderPath).to.equal('');
      expect($scope.storageUploadManager.onUploadStatus).to.be.a('function');
      expect($scope.storageUploadManager.addFile).to.be.a('function');
    });

    it('onUploadStatus:', function() {
      $scope.storageUploadManager.onUploadStatus('uploading');

      expect($scope.isUploading).to.equal('uploading');
    });

    it('addFile:', function() {
      var file = {
        name: 'file1',
        size: 2
      };
      sandbox.stub(templateEditorUtils, 'addOrReplaceAll');

      $scope.storageUploadManager.addFile(file);

      templateEditorUtils.addOrReplaceAll.should.have.been.calledWith([], {
        name: 'file1'
      }, file);
    });

  });

  describe('registerDirective:', function() {
    beforeEach(function() {
      sandbox.stub($scope, 'loadItems');
    });

    it('should initialize', function() {
      componentsFactory.registerDirective.should.have.been.called;

      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-storage-selector');
      expect(directive.element).to.be.an('object');
      expect(directive.show).to.be.a('function');
      expect(directive.onBackHandler).to.be.a('function');
    });

    it('show:', function() {
      componentsFactory.registerDirective.getCall(0).args[0].show();

      expect(storageManagerFactory.isListView).to.be.true;
      expect($scope.fileType).to.equal('image');

      $scope.loadItems.should.have.been.calledWith('');
    });

    describe('onBackHandler:', function() {
      it('should navigate away', function() {
        expect(componentsFactory.registerDirective.getCall(0).args[0].onBackHandler()).to.be.false;

        $scope.loadItems.should.not.have.been.called;
      });

      it('should update folder path and load files', function() {
        $scope.storageUploadManager.folderPath = 'someFolder/subfolder/';

        expect(componentsFactory.registerDirective.getCall(0).args[0].onBackHandler()).to.be.true;

        expect($scope.storageUploadManager.folderPath).to.equal('someFolder/');

        $scope.loadItems.should.have.been.calledWith($scope.storageUploadManager.folderPath);
      });        

      it('should handle going to root', function() {
        $scope.storageUploadManager.folderPath = 'someFolder/';

        expect(componentsFactory.registerDirective.getCall(0).args[0].onBackHandler()).to.be.true;

        expect($scope.storageUploadManager.folderPath).to.equal('');
      });
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
        storageManagerFactory.isSingleFileSelector.returns(true);
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

  describe('selectAllItems:', function() {
    beforeEach(function() {
      $scope.folderItems = [{
        name: 'folder/'
      }, {
        name: 'folder/file1.jpg'
      }, {
        name: 'folder/file2.png'
      }, {
        name: 'folder/file3.pdf'
      }];
    })

    it('should select all files and skip folders', function() {
      $scope.search.selectAll = false;
      $scope.selectAllItems();

      expect($scope.selectedItems.length).to.equal(3);
    });
    
    it('should select all filtered files and folders', function() {
      $scope.search.selectAll = false;
      $scope.search.query = 'file1';
      $scope.selectAllItems();

      expect($scope.selectedItems.length).to.equal(1);
    });

    it('should deselect all files and folders', function() {
      $scope.search.selectAll = true;
      $scope.selectedItems = [{
        name: 'folder/file2.png'
      }, {
        name: 'folder/file3.pdf'
      }];
      $scope.selectAllItems();

      expect($scope.selectedItems.length).to.equal(0);
    });

  });

  describe('isSelected', function () {
    it('should return true if the item is selected', function () {
      expect($scope.isSelected({ name: 'test.jpg' })).to.be.false;
      $scope.selectItem({ name: 'test.jpg' });
      expect($scope.isSelected({ name: 'test.jpg' })).to.be.true;
    });
  });

  describe('addSelected:', function () {
    it('should handle missing callback', function () {
      $scope.addSelected();

      componentsFactory.showPreviousPage.should.not.have.been.called;
    });

    it('should call callback and reset the internal status', function () {
      var item = { name: 'test.jpg' };
      var selectedItems = [item];
      $scope.search.selectAll = true;

      storageManagerFactory.onSelectHandler = sandbox.stub();

      $scope.selectItem(item);
      expect($scope.selectedItems).to.have.lengthOf(1);
      $scope.addSelected();
      expect($scope.selectedItems).to.be.empty;
      expect($scope.search.selectAll).to.be.false;
      expect(storageManagerFactory.onSelectHandler).to.have.been.calledWith(selectedItems);

      componentsFactory.resetPanelHeader.should.have.been.called;

      componentsFactory.showPreviousPage.should.have.been.called;
    });
  });

  describe('loadItems', function () {
    it('should update currentFolder', function() {
      $scope.loadItems('folder/subfolder');

      expect($scope.currentFolder).to.equal('subfolder');
    });

    describe('_handleNavigation', function() {
      beforeEach(function() {
        sandbox.stub(templateEditorUtils, 'fileNameOf').returns('folderName');
      });

      it('should navigate to a folder', function() {
        $scope.loadItems('folder/');

        templateEditorUtils.fileNameOf.should.have.been.calledWith('folder/');

        componentsFactory.setPanelIcon.should.have.been.calledWith('folder', 'streamline');
        componentsFactory.setPanelTitle.should.have.been.calledWith('folderName');

        componentsFactory.resetPanelHeader.should.not.have.been.called;
      });

      it('should navigate to root', function() {
        templateEditorUtils.fileNameOf.returns(false);

        $scope.loadItems();

        templateEditorUtils.fileNameOf.should.have.been.called;

        componentsFactory.setPanelIcon.should.not.have.been.called;
        componentsFactory.setPanelTitle.should.not.have.been.called;

        componentsFactory.resetPanelHeader.should.have.been.called;
      });
    });

    it('should load the files on the given path', function (done) {
      var files = [{
        name: 'folder/file1.jpg'
      }, {
        name: 'folder/file2.jpg'
      }];

      $scope.selectedItems = [ files[0] ];
      $scope.storageUploadManager.folderPath = 'folder/';
      $scope.folderItems = files;

      $scope.loadItems('folder/')
        .then(function () {
          expect($scope.selectedItems).to.be.empty;
          expect($scope.search.selectAll).to.be.false;
          expect($scope.storageUploadManager.folderPath).to.equal('folder/');
          expect($scope.folderItems).to.equal('folderItems');

          done();
        })
        .catch(done);
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

      storageManagerFactory.loadFiles.returns(Q.reject('Failed to load'));

      $scope.loadItems('folder/')
        .catch(function () {
          expect($scope.selectedItems).to.be.have.lengthOf(1);
          expect($scope.storageUploadManager.folderPath).to.equal('folder/');
          expect($scope.folderItems).to.have.lengthOf(2);

          done();
        });
    });
  });

  it('dateModifiedOrderFunction: ', function() {
    expect($scope.dateModifiedOrderFunction({})).to.equal('');
    expect($scope.dateModifiedOrderFunction({updated: {value: undefined}})).to.be.undefined;
    expect($scope.dateModifiedOrderFunction({updated: {value: 'timestamp'}})).to.equal('timestamp');
  });
  
  it('fileNameOrderFunction: ', function() {
    expect($scope.fileNameOrderFunction({name: 'someFolder/'})).to.equal('somefolder/');
    expect($scope.fileNameOrderFunction({name: 'someFolder/Image.jpg'})).to.equal('somefolder/image.jpg');
  });

  describe('sortBy: ',function(){
    it('should reverse sort',function(){
      $scope.sortBy($scope.fileNameOrderFunction);

      expect($scope.search.sortBy).to.equal($scope.fileNameOrderFunction);
      expect($scope.search.reverse).to.be.true;
    });
    
    it('should should sort by file date',function(){
      $scope.sortBy($scope.dateModifiedOrderFunction);

      expect($scope.search.sortBy).to.equal($scope.dateModifiedOrderFunction);
      expect($scope.search.reverse).to.be.false;
    });
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('component-storage-selector-spinner');
    });
    
    it('should start spinner', function(done) {
      storageManagerFactory.loadingFiles = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('component-storage-selector-spinner');
        
        done();
      }, 10);
    });
  });

});
