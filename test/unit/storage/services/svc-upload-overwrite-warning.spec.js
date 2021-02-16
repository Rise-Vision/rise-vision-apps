'use strict';
describe('service: uploadOverwriteWarning', function() {
  var uploadOverwriteWarning, $modal;
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.storage.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });
    $provide.factory('$modal', function() {
      return $modal = {
        open: sandbox.stub().returns({result: Q.reject()})
      };
    });
  }));

  beforeEach(function(){
    inject(function($injector){
      uploadOverwriteWarning = $injector.get('uploadOverwriteWarning');

      var $templateCache = $injector.get('$templateCache');

      $templateCache.put('partials/components/confirm-modal/confirm-modal.html', 'confirm-modal');
      $templateCache.put('partials/components/confirm-modal/madero-confirm-danger-modal.html', 'confirm-modal-madero');
    });
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('should exist',function(){
    expect(uploadOverwriteWarning).to.be.truely;
    expect(uploadOverwriteWarning.checkOverwrite).to.be.a('function');
    expect(uploadOverwriteWarning.resetConfirmation).to.be.a('function');
  });

  describe('checkOverwrite:', function() {
    it('should resolve if overwrite is not provided',function(done){
      uploadOverwriteWarning.checkOverwrite({}).then(done)
        .catch(function(){
          done('should have resolved');
        });
    });

    it('should resolve if not overwrite',function(done){
      uploadOverwriteWarning.checkOverwrite({isOverwrite: false}).then(done)
        .catch(function(){
          done('should have resolved');
        });
    });

    it('should forward modal reject result when isOverwrite',function(done){
      $modal.open.returns({result: Q.reject()});   

      uploadOverwriteWarning.checkOverwrite({isOverwrite: true})
        .then(function(){
          done('should have rejected')
        })
        .catch(function(){
          expect($modal.open).to.have.been.called;
          expect($modal.open.getCall(0).args[0].template).to.equal('confirm-modal');
          expect($modal.open.getCall(0).args[0].controller).to.equal('confirmModalController');
          expect($modal.open.getCall(0).args[0].windowClass).to.equal('modal-custom confirm-overwrite-modal');      
          expect($modal.open.getCall(0).args[0].resolve).to.be.ok;

          done();
        });
    });

    it('should forward modal resolve result when isOverwrite',function(done){
      $modal.open.returns({result: Q.resolve()});
      uploadOverwriteWarning.checkOverwrite({isOverwrite: true}).then(done)
        .catch(function(){
          done('should have resolved');
        });
    });

    it('should use madero style', function(){
      $modal.open.returns({result: Q.resolve()});
      uploadOverwriteWarning.checkOverwrite({isOverwrite: true},true).then(function(){
          expect($modal.open).to.have.been.called;
          expect($modal.open.getCall(0).args[0].template).to.equal('confirm-modal-madero');
          expect($modal.open.getCall(0).args[0].controller).to.equal('confirmModalController');
          expect($modal.open.getCall(0).args[0].windowClass).to.equal('madero-style centered-modal');      
          expect($modal.open.getCall(0).args[0].resolve).to.be.ok;

          done();
        }).catch(function(){
          done('should have resolved');
        });
    });

    it('should ask for confirmation only once for multiple calls', function(done) {
      uploadOverwriteWarning.checkOverwrite({isOverwrite: true});
      uploadOverwriteWarning.checkOverwrite({isOverwrite: true});

      setTimeout(function(){
        expect($modal.open).to.have.been.calledOnce;

        done();
      },10);
    });
  });

  describe('resetConfirmation',function(){
    it('should clear modal instance', function(){
      uploadOverwriteWarning.confirmOverwriteModal = {};
      uploadOverwriteWarning.resetConfirmation();
      expect(uploadOverwriteWarning.confirmOverwriteModal).to.equal(undefined);
    });

    it('should reset confirmation and open modal again on next check',function(done){
      uploadOverwriteWarning.checkOverwrite({isOverwrite: true});
      uploadOverwriteWarning.checkOverwrite({isOverwrite: true});

      setTimeout(function(){
        expect($modal.open).to.have.been.calledOnce;

        uploadOverwriteWarning.resetConfirmation();
        uploadOverwriteWarning.checkOverwrite({isOverwrite: true});
        setTimeout(function(){
          expect($modal.open).to.have.been.calledTwice;
          done();
        },10);        
      },10);
    })
  });
});
