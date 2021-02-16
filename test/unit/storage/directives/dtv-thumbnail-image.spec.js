'use strict';
describe('directive: thumbnail-image', function() {
  var $rootScope, element, $compile, storageFactory, storageUtils;

  beforeEach(module('risevision.storage.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('storageUtils', function() {
      return {
        fileIsFolder: function() {
          return false;
        }
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector){    
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    storageUtils = $injector.get('storageUtils');
    storageFactory = {
      fileIsVideo: function() {
        return false;
      },
      fileIsImage: function() {
        return true;
      },
      canSelect: function() {
        return true;
      },
      isDisabled: function() {
        return false;
      },
      fileIsTrash: function() {
        return false;
      }
    };

    $rootScope.file = {
      name: "file1.jpg",
      timeCreated: {
        value: '123'
      },
      metadata: {
        thumbnail: 'http://example.com/thumb.jpg'
      }
    };
  }));

  var _compile = function() {
    $rootScope.storageFactory = storageFactory;
    element = $compile('<li thumbnail-image></li>')($rootScope);
    $rootScope.$apply();
  }

  it('should render thumbnail appending timeCreated for cache bursting and using secure url', function() {
    _compile();
    expect(element.scope().isSvg).to.be.false;
    expect(element.scope().imgSrc).to.equal('https://example.com/thumb.jpg?_=123');
    expect(element.scope().imgClasses).to.equal('');
  });

  it('should flag thorttled file',function() {
    $rootScope.file.isThrottled = true;
    _compile();
    expect(element.scope().isSvg).to.be.true;
    expect(element.scope().imgSrc).to.equal('https://s3.amazonaws.com/Rise-Images/UI/storage-file-icon%402x.png');
    expect(element.scope().imgClasses).to.equal('');
  });

  it('should render folders',function() {
    storageUtils.fileIsFolder = function() {return true};
    _compile();
    expect(element.scope().isSvg).to.be.true;
    expect(element.scope().imgSrc).to.equal('https://s3.amazonaws.com/Rise-Images/UI/storage-folder-icon%402x.png');
    expect(element.scope().imgClasses).to.equal('');
  });

  it('should show image icon when no thumbnail',function(){
    $rootScope.file.metadata = {};
    _compile();
    expect(element.scope().isSvg).to.be.true;
    expect(element.scope().imgSrc).to.equal('https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon%402x.png');
    expect(element.scope().imgClasses).to.equal('');
  });

  it('should show video icon for videos',function(){
    $rootScope.file.metadata = {};
    storageFactory.fileIsVideo = function() {return true};
    storageFactory.fileIsImage = function() {return false};
    _compile();
    expect(element.scope().isSvg).to.be.true;
    expect(element.scope().imgSrc).to.equal('https://s3.amazonaws.com/Rise-Images/UI/storage-video-icon%402x.png');
    expect(element.scope().imgClasses).to.equal('');
  });

  it('should show generic icon for other files', function() {
    $rootScope.file.metadata = {};
    storageFactory.fileIsVideo = function() {return false};
    storageFactory.fileIsImage = function() {return false};
    _compile();
    expect(element.scope().isSvg).to.be.true;
    expect(element.scope().imgSrc).to.equal('https://s3.amazonaws.com/Rise-Images/UI/storage-file-icon%402x.png');
    expect(element.scope().imgClasses).to.equal('');
  });

  it('should add disabled class is can\'t select file',function() {
    storageFactory.canSelect = function() {return false};
    _compile();
    expect(element.scope().isSvg).to.be.false;
    expect(element.scope().imgClasses).to.equal('disabled');
  });


  describe('gridItemClasses:',function() {
    it('should add class for file',function(){
      _compile();
      expect(element.scope().gridItemClasses).to.contain('single-item');
      expect(element.scope().gridItemClasses).to.not.contain('list-item_folder');
    });

    it('should add class for folder',function(){
      storageUtils.fileIsFolder = function() {return true};
      _compile();
      expect(element.scope().gridItemClasses).to.not.contain('single-item');
      expect(element.scope().gridItemClasses).to.contain('list-item_folder');
    });

    it('should flag throttled files',function(){
      $rootScope.file.isThrottled = true;
      _compile();
      expect(element.scope().gridItemClasses).to.contain('single-item');
      expect(element.scope().gridItemClasses).to.contain('list-item--throttled');
    });

    it('should flag disabled files',function(){
      storageFactory.canSelect = function() {return false};
      _compile();
      expect(element.scope().gridItemClasses).to.contain('single-item');
      expect(element.scope().gridItemClasses).to.contain('list-item--disabled');
    });

    it('should flag checked files',function(){
      $rootScope.file.isChecked = true;
      _compile();
      expect(element.scope().gridItemClasses).to.contain('single-item');
      expect(element.scope().gridItemClasses).to.contain('list-item--selected');
    });

    it('should flag checked folders',function(){
      storageUtils.fileIsFolder = function() {return true};
      $rootScope.file.isChecked = true;
      _compile();
      expect(element.scope().gridItemClasses).to.contain('list-item_folder');
      expect(element.scope().gridItemClasses).to.contain('list-item--selected');
    });

  });

});
