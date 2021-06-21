'use strict';
  
describe('service: storageUtils:', function() {
  beforeEach(module('risevision.storage.services'));
  var storageUtils, SELECTOR_FILTERS, currentPlanFactory;
  var $modal, modalSuccess, modalOpenObj;

  beforeEach(module(function ($provide) {
    modalOpenObj = null;

    $provide.service('$q', function() {return Q;});
    $provide.service('$modal', function() {
      return {
        open: function(obj){
          var deferred = Q.defer();

          if (obj.resolve) {
            obj.resolve.enableByURL ? obj.resolve.enableByURL() : undefined;
            obj.resolve.selectorType ? obj.resolve.selectorType() : undefined;
            obj.resolve.selectorFilter ? obj.resolve.selectorFilter() : undefined;
            obj.resolve.filesFactory ? obj.resolve.filesFactory() : undefined;
          }
          
          modalOpenObj = obj;

          if(modalSuccess) {
            deferred.resolve('success');  
          }
          else {
            deferred.reject();
          }

          return {
            result: deferred.promise
          }
        }
      };
    });
    $provide.service('userState', function() {
      return {
        getSelectedCompanyId: function() {
          return 'companyId';
        },
        _restoreState: function() {}
      };
    });
    $provide.service('currentPlanFactory',function(){
      return {
        isPlanActive: sinon.stub().returns(true),
        showUnlockThisFeatureModal: sinon.stub()
      };
    });

  }));

  beforeEach(function(){
    inject(function($injector){  
      storageUtils = $injector.get('storageUtils');
      $modal = $injector.get('$modal');
      currentPlanFactory = $injector.get('currentPlanFactory');
      SELECTOR_FILTERS = $injector.get('SELECTOR_FILTERS');
    });
  });

  it('should exist',function(){
    expect(storageUtils).to.be.ok;
        
    expect(storageUtils.fileIsFolder).to.be.a('function');
    expect(storageUtils.fileIsTrash).to.be.a('function');
    expect(storageUtils.fileName).to.be.a('function');
    expect(storageUtils.fileParent).to.be.a('function');
    expect(storageUtils.getBucketName).to.be.a('function');
    expect(storageUtils.getFolderSelfLinkUrl).to.be.a('function');
    expect(storageUtils.getFileUrls).to.be.a('function');

    expect(storageUtils.openSelector).to.be.a('function');
    expect(storageUtils.addFolder).to.be.a('function');
  });

  it('fileIsFolder: ', function() {
    expect(storageUtils.fileIsFolder({name: '--TRASH--/'})).to.be.true;
    expect(storageUtils.fileIsFolder({name: 'someFolder/'})).to.be.true;
    expect(storageUtils.fileIsFolder({name: 'someFolder/image.jpg'})).to.be.false;
    expect(storageUtils.fileIsFolder({name: 'image.jpg'})).to.be.false;
    expect(storageUtils.fileIsFolder({name: ''})).to.be.true;
  });
  
  it('fileIsTrash: ', function() {
    expect(storageUtils.fileIsTrash({name: '--TRASH--/'})).to.be.true;
    expect(storageUtils.fileIsTrash({name: 'image.jpg'})).to.be.false;
  });

  it('fileName: ', function() {
    expect(storageUtils.fileName({name: 'image.jpg'})).to.equal('image.jpg');
    expect(storageUtils.fileName({name: 'folder/image.jpg'})).to.equal('image.jpg');
    expect(storageUtils.fileName({name: 'folder/subfolder/image.jpg'})).to.equal('image.jpg');
    expect(storageUtils.fileName({name: 'folder/'})).to.equal('folder/');
    expect(storageUtils.fileName({name: 'folder/subfolder/folder1/'})).to.equal('folder1/');
    expect(storageUtils.fileName({name: '--TRASH--/'})).to.equal('--TRASH--/');
    expect(storageUtils.fileName({name: '--TRASH--/image.jpg'})).to.equal('image.jpg');
  });

  it('fileParent: ', function() {
    expect(storageUtils.fileParent({name: 'image.jpg'})).to.equal('');
    expect(storageUtils.fileParent({name: 'folder/image.jpg'})).to.equal('folder/');
    expect(storageUtils.fileParent({name: 'folder/subfolder/image.jpg'})).to.equal('folder/subfolder/');
    expect(storageUtils.fileParent({name: 'folder/'})).to.equal('');
    expect(storageUtils.fileParent({name: 'folder/subfolder/folder1/'})).to.equal('folder/subfolder/');
    expect(storageUtils.fileParent({name: '--TRASH--/'})).to.equal('');
    expect(storageUtils.fileParent({name: '--TRASH--/image.jpg'})).to.equal('--TRASH--/');
  });
  
  it('getBucketName: ', function() {
    expect(storageUtils.getBucketName()).to.equal('risemedialibrary-companyId');
  });
  
  it('getFolderSelfLinkUrl: ', function() {
    expect(storageUtils.getFolderSelfLinkUrl()).to.equal('https://www.googleapis.com/storage/v1/b/risemedialibrary-companyId/o?prefix=');
  });
  
  it('getFileUrls: ', function() {
    expect(storageUtils.getFileUrls([{ 'name': 'test/file2', 'size': 3 },
          { 'name': 'test/file3', 'size': 8 }])).to.deep.equal([
      'https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile2', 
      'https://storage.googleapis.com/risemedialibrary-companyId/test%2Ffile3'
    ]);
  });

  describe('openSelector:', function(){
    it('should return a promise', function() {
      expect(storageUtils.openSelector().then).to.be.a('function');
    });

    it('should open modal', function() {
      storageUtils.openSelector();
      
      expect(modalOpenObj.templateUrl).to.equal('partials/storage/storage-modal.html');
      expect(modalOpenObj.controller).to.equal('StorageSelectorModalController');
      expect(modalOpenObj.size).to.equal('lg');
      expect(modalOpenObj.resolve.enableByURL).to.be.a('function');
      expect(modalOpenObj.resolve.selectorType).to.be.a('function');
      expect(modalOpenObj.resolve.selectorFilter).to.be.a('function');
    });

    it('should resolve promise', function(done) {
      storageUtils.openSelector()
      .then(function(result){
        expect(result).to.equal('success');

        done();
      })
      .then(null,done);
    });
    
    it('should reject promise on cancel', function(done) {
      modalSuccess = false;
      storageUtils.openSelector()
      .then(function(result) {
        done('failed');
      })
      .then(null, function() {
        done();
      })
      .then(null,done);
    });

  });

  describe('addFolder:', function(){
    it('should open modal', function(){
      storageUtils.addFolder();

      currentPlanFactory.isPlanActive.should.have.been.called;
      currentPlanFactory.showUnlockThisFeatureModal.should.not.have.been.called;

      expect(modalOpenObj.templateUrl).to.equal('partials/storage/new-folder-modal.html');
      expect(modalOpenObj.controller).to.equal('NewFolderModalCtrl');
      expect(modalOpenObj.size).to.equal('md');
      expect(modalOpenObj.resolve.filesFactory).to.be.a('function');
    });

    it('should show unlock feature modal if plan is not active', function(){
      currentPlanFactory.isPlanActive.returns(false);

      storageUtils.addFolder();

      currentPlanFactory.isPlanActive.should.have.been.called;
      currentPlanFactory.showUnlockThisFeatureModal.should.have.been.called;

      expect(modalOpenObj).to.not.be.ok;
    });

  });

});
