'use strict';

describe('controller: CopyUrlModalController', function() {
  
  beforeEach(module('risevision.storage.controllers'));

  beforeEach(function() {
    module(function($provide) {
      $provide.service('$modalInstance',function(){
        return {
          close : function(action){},
          dismiss : function(action){}
        }
      });

      $provide.service('storageUtils', function() {
        return {
          getFolderSelfLinkUrl: function() {
            return 'folderSelfLinkUrl';
          },
          getBucketName: function() {
            return 'bucketName';
          },
        };
      });

      $provide.value('STORAGE_FILE_URL', 'STORAGE_FILE_URL');
      $provide.value('copyFile', file);
    });   
  });

  var $scope, $modalInstance, file;
  beforeEach(function(){
    file = {
      name: 'file.jpg',
      kind: 'file'
    };
    
    inject(function ($controller, $rootScope, $injector) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $controller('CopyUrlModalController', {
        $scope : $scope,
        $modalInstance : $modalInstance
      });
      
      $scope.$digest();
    });
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.copyUrl).to.be.ok;
    expect($scope.cancel).to.be.a('function');
  });
  
  describe('copyUrl: ', function() {
    it('should configure file url', function() {
      expect($scope.copyUrl).to.equal('STORAGE_FILE_URLbucketName/file.jpg');
    });

    it('should configure folder url', function(done) {
      file.kind = 'folder';
      file.name = 'folder/';

      inject(function ($controller, $rootScope, $injector) {
        $scope = $rootScope.$new();
        $modalInstance = $injector.get('$modalInstance');
        $controller('CopyUrlModalController', {
          $scope : $scope,
          $modalInstance : $modalInstance
        });
        
        $scope.$digest();

        expect($scope.copyUrl).to.equal('folderSelfLinkUrlfolder/');
        
        done();
      });
    });
  });
  
  xit('should focus on element', function() {
    
  });

  describe('cancel:',function(){
    it('should close modal',function(){
      var $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $scope.cancel();

      $modalInstanceCloseSpy.should.have.been.called;
    });
  });
  
});
