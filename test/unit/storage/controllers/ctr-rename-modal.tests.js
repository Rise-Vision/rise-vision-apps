'use strict';

describe('controller: RenameModalCtrl', function() {
  var $rootScope, $scope, $modalInstance, fileActionsFactory, storageFactory, sourceObject, renameResp, controller;
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.storage.controllers'));

  beforeEach(function() {
    module(function($provide) {
      $provide.service('$modalInstance',function(){
        return {
          close : function(action){},
          dismiss : function(action){}
        };
      });

      $provide.service('storageFactory', function() {
        return {
          fileParent: function(file) {
            return '';
          },
          fileName: function(file) {
            return file.name;
          }
        };
      });

      $provide.service('fileActionsFactory', function() {
        return {
          renameObject: function() {
            if(!renameResp.error) {
              return Q.resolve(renameResp);
            }
            else {
              return Q.reject(renameResp);
            }
          }
        };
      });
    });
  });

  beforeEach(function() {
    inject(function ($controller, _$rootScope_, $injector) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      fileActionsFactory = $injector.get('fileActionsFactory');
      storageFactory = $injector.get('storageFactory');
      sourceObject = { name: "test.jpg" };
      renameResp = {};

      controller = $controller('RenameModalCtrl', {
        $scope: $scope,
        $modalInstance: $modalInstance,
        filesActionsFactory: fileActionsFactory,
        storageFactory: storageFactory,
        sourceObject: sourceObject
      });

      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.ok).to.be.a('function');
    expect($scope.cancel).to.be.a('function');
    expect($scope.renameName).to.equal("test.jpg");
  });

  describe('rename: ', function() {
    it('should rename a file', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(fileActionsFactory, 'renameObject');

      $scope.renameName = "test2.jpg";
      renameResp.code = 200;

      $scope.ok()
        .then(function() {
          fileActionsFactory.renameObject.should.have.been.called;
          $modalInstance.close.should.have.been.called;

          expect(fileActionsFactory.renameObject.getCall(0).args[0].name).to.equal('test.jpg');
          expect(fileActionsFactory.renameObject.getCall(0).args[1]).to.equal('test2.jpg');
          done();
        });
    });

    it('should rename a folder', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(fileActionsFactory, 'renameObject');

      sourceObject.name = "test/";
      $scope.renameName = "test2";
      renameResp.code = 200;

      $scope.ok()
        .then(function() {
          fileActionsFactory.renameObject.should.have.been.called;
          $modalInstance.close.should.have.been.called;

          expect(fileActionsFactory.renameObject.getCall(0).args[0].name).to.equal('test/');
          expect(fileActionsFactory.renameObject.getCall(0).args[1]).to.equal('test2');
          done();
        });
    });

    it('should fail to rename the file because of business logic error', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(fileActionsFactory, 'renameObject');

      $scope.renameName = "test2.jpg";
      renameResp.code = 404;
      renameResp.message = "not-found";

      $scope.ok()
        .then(function() {
          fileActionsFactory.renameObject.should.have.been.called;
          $modalInstance.close.should.not.have.been.called;

          expect($scope.errorKey).to.equal("not-found");
          done();
        });
    });

    it('should fail to rename the file because of server error', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(fileActionsFactory, 'renameObject');

      $scope.renameName = "test2.jpg";
      renameResp.error = true;
      renameResp.code = 500;

      $scope.ok()
        .then(function() {
          fileActionsFactory.renameObject.should.have.been.called;
          $modalInstance.close.should.not.have.been.called;

          expect($scope.errorKey).to.equal("unknown");
          done();
        });
    });
  });

  describe('cancel:',function(){
    it('should close modal',function(){
      sandbox.spy($modalInstance, 'dismiss');
      $scope.cancel();

      $modalInstance.dismiss.should.have.been.called;
    });
  });
});
