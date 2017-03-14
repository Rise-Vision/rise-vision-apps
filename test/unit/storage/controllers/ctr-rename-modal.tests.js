'use strict';

describe('controller: RenameModalCtrl', function() {
  var $scope, $modalInstance, $q, storage, filesFactory, getResponse, renameResponse, controller;
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

      $provide.service('storage', function() {
        return {
          files: {
            get: function() {
              if(getResponse && getResponse.error) {
                return Q.reject(getResponse);
              }
              else {
                return Q.resolve(getResponse);
              }
            }
          },
          rename: function() {
            if(renameResponse && renameResponse.error) {
              return Q.reject(renameResponse);
            }
            else {
              return Q.resolve(renameResponse);
            }
          }
        };
      });

      $provide.service('filesFactory', function() {
        return {
          addFile: function() {},
          removeFiles: function() {}
        };
      });
    });
  });

  beforeEach(function() {
    inject(function ($controller, $rootScope, $injector) {
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      storage = $injector.get('storage');
      filesFactory = $injector.get('filesFactory');

      controller = $controller('RenameModalCtrl', {
        $scope: $scope,
        $modalInstance: $modalInstance,
        storage: storage,
        filesFactory: filesFactory,
        sourceName: { name: "test.jpg" }
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
    expect($scope.dismiss).to.be.a('function');
    expect($scope.renameName).to.equal("test.jpg");
  });

  describe('rename: ', function() {
    it('should rename the file', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = { code: 200 };

      $scope.renameName = "test2.jpg";

      $scope.ok()
        .then(function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.have.been.called;
          filesFactory.addFile.should.have.been.called;
          filesFactory.removeFiles.should.have.been.called;
          $modalInstance.close.should.have.been.called;

          expect(storage.rename.getCall(0).args[0]).to.equal('test.jpg');
          expect(storage.rename.getCall(0).args[1]).to.equal('test2.jpg');
          expect(storage.files.get.getCall(0).args[0].file).to.equal('test2.jpg');
          expect(filesFactory.removeFiles.getCall(0).args[0][0].name).to.equal('test.jpg');
          expect(filesFactory.addFile.getCall(0).args[0].name).to.equal('test2.jpg');
          done();
        });
    });

    it('should fail to rename the file because of business logic error', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = { code: 404, message: "not-found" };

      $scope.renameName = "test2.jpg";

      $scope.ok()
        .then(function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.not.have.been.called;
          $modalInstance.close.should.not.have.been.called;

          expect($scope.errorKey).to.equal("not-found");

          done();
        });
    });

    it('should fail to rename the file because of server error', function(done) {
      sandbox.spy($modalInstance, 'close');
      sandbox.spy(storage.files, 'get');
      sandbox.spy(storage, 'rename');
      sandbox.spy(filesFactory, 'addFile');
      sandbox.spy(filesFactory, 'removeFiles');

      getResponse = { files: [{ name: "test2.jpg" }] };
      renameResponse = { error: true };

      $scope.renameName = "test2.jpg";

      $scope.ok()
        .then(function() {
          storage.rename.should.have.been.called;
          storage.files.get.should.not.have.been.called;
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
