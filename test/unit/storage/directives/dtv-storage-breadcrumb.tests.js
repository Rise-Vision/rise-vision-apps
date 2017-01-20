'use strict';
describe('directive: storage-breadcrumb', function() {
  var $rootScope, element, storageFactory, parent;

  beforeEach(module('risevision.storage.directives'));

  beforeEach(module(function ($provide) {
    $provide.service('storageFactory', function() {
      return storageFactory = {folderPath: ''};
    });
    $provide.service('fileSelectorFactory', function() {
      return {};
    });
    $provide.value('translateFilter', function(){
      return 'Trash';
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, $document){    
    var $compile = _$compile_;
    $rootScope = _$rootScope_;
    var $scope = $rootScope.$new();
    
    $templateCache.put('partials/storage/breadcrumb.html', '<p>mock</p>');
    parent = angular.element('<div style="width:650px"></div>');
    angular.element($document[0].body).append(parent);
    var el = angular.element('<storage-breadcrumb></storage-breadcrumb>');
    parent.append(el);
    element = $compile(el)($scope);
    $scope.$apply();
  }));

  it('should exist', function() {
    expect(element.scope().storageFactory).to.be.ok;
    expect(element.scope().fileSelectorFactory).to.be.ok;
    expect(element.scope().tree).to.be.ok;
  });

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('scope.tree',function(){
    it('should have My Storage as root',function(){
      var tree = element.scope().tree;
      expect(tree.length).to.equal(1);
      expect(tree[0].name).to.equal('My Storage');
    });

    it('should have full path',function(){
      storageFactory.folderPath = 'subfolder1/subfolder2/';
      element.scope().$apply();

      var tree = element.scope().tree;

      expect(tree.length).to.equal(3);
      expect(tree[0].name).to.equal('My Storage');
      expect(tree[1].name).to.equal('subfolder1');
      expect(tree[2].name).to.equal('subfolder2');

      expect(tree[0].path).to.equal('');
      expect(tree[1].path).to.equal('subfolder1/');
      expect(tree[2].path).to.equal('subfolder1/subfolder2/');
    });

    it('should have a pretty name for --TRASH--',function(){
      storageFactory.folderPath = '--TRASH--/';
      element.scope().$apply();
      var tree = element.scope().tree;

      expect(tree.length).to.equal(2);
      expect(tree[0].name).to.equal('My Storage');
      expect(tree[1].name).to.equal('Trash');
    });

    it('should crop long names',function() {
      storageFactory.folderPath = 'folder/veryveryveryveryverylongname';
      element.scope().$apply();
      var tree = element.scope().tree;

      expect(tree.length).to.equal(3);
      expect(tree[0].name).to.equal('My Storage');
      expect(tree[1].name).to.equal('folder');
      expect(tree[2].name).to.equal('veryveryveryveryvery...');
    });

    it('should compact breadcrumb folders based on width',function(){
      storageFactory.folderPath = 'folder1/folder2/folder3/folder4/current';
      
      element.scope().$apply();
      var tree = element.scope().tree;

      expect(tree.length).to.equal(4);
      expect(tree[0].name).to.equal('My Storage');
      expect(tree[1].name).to.equal('...');
      expect(tree[2].name).to.equal('folder4');
      expect(tree[3].name).to.equal('current');
    });

    it('should recalculate on resize',function(){
      storageFactory.folderPath = 'folder1/folder2/folder3/folder4/current';
      
      parent.css({width:'900px'});

      var evt = window.document.createEvent('UIEvents'); 
      evt.initUIEvent('resize', true, false, window, 0); 
      window.dispatchEvent(evt);
      
      var tree = element.scope().tree;

      expect(tree.length).to.equal(5);
      expect(tree[0].name).to.equal('My Storage');
      expect(tree[1].name).to.equal('...');
      expect(tree[2].name).to.equal('folder3');
      expect(tree[3].name).to.equal('folder4');
      expect(tree[4].name).to.equal('current');
    })

  });  
});
