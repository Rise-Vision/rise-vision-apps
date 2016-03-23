'use strict';
  
describe('service: storageFactory:', function() {
  beforeEach(module('risevision.storage.services'));
  var storageFactory, $modal;
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
        open: function(){}
      };
    });
  }));
  beforeEach(function(){
    
    inject(function($injector){  
      storageFactory = $injector.get('storageFactory');
      $modal = $injector.get('$modal');
      
      storageFactory.selectorType = 'single-file';
      storageFactory.storageFull = true;
    });
  });

  it('should exist',function(){
    expect(storageFactory).to.be.ok;
    
    // Hardcoded
    expect(storageFactory.storageFull).to.be.true;
    expect(storageFactory.isSingleFileSelector()).to.be.true;
    expect(storageFactory.isMultipleFileSelector()).to.be.false;
    expect(storageFactory.isSingleFolderSelector()).to.be.false;
    
    expect(storageFactory.fileIsCurrentFolder).to.be.a('function');
    expect(storageFactory.fileIsFolder).to.be.a('function');
    expect(storageFactory.fileIsTrash).to.be.a('function');
  });

  it('fileIsCurrentFolder: ', function() {
    storageFactory.folderPath = '';
    expect(storageFactory.fileIsCurrentFolder({name: 'someFolder/'})).to.be.false;
    
    storageFactory.folderPath = 'someFolder/';
    expect(storageFactory.fileIsCurrentFolder({name: 'someFolder/'})).to.be.true;
  });

  it('fileIsFolder: ', function() {
    expect(storageFactory.fileIsFolder({name: '--TRASH--/'})).to.be.true;
    expect(storageFactory.fileIsFolder({name: 'someFolder/'})).to.be.true;
    expect(storageFactory.fileIsFolder({name: 'someFolder/image.jpg'})).to.be.false;
    expect(storageFactory.fileIsFolder({name: 'image.jpg'})).to.be.false;
  });
  
  it('fileIsTrash: ', function() {
    expect(storageFactory.fileIsTrash({name: '--TRASH--/'})).to.be.true;
    expect(storageFactory.fileIsTrash({name: 'image.jpg'})).to.be.false;
  });

  describe('addFolder:', function(){
    it('should open modal', function(){
      var modalOpenSpy = sinon.spy($modal,'open');
      storageFactory.addFolder();

      modalOpenSpy.should.have.been.calledWith({
        templateUrl: "partials/storage/new-folder-modal.html",
        controller: "NewFolderModalCtrl",
        size: 'md'
      });

    });
  });

});
