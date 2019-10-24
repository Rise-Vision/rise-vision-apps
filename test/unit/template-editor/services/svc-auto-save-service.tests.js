'use strict';

describe('service: auto save service', function() {
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranslate()));

  var autoSaveService, saveFunction, clock, $timeout, MINIMUM_INTERVAL_BETWEEN_SAVES, MAXIMUM_INTERVAL_BETWEEN_SAVES;
  beforeEach(function(){
    saveFunction = sinon.stub().returns(Q.resolve());
    
    inject(function($injector){
      $timeout = $injector.get('$timeout');

      MINIMUM_INTERVAL_BETWEEN_SAVES = $injector.get('MINIMUM_INTERVAL_BETWEEN_SAVES');
      MAXIMUM_INTERVAL_BETWEEN_SAVES = $injector.get('MAXIMUM_INTERVAL_BETWEEN_SAVES');

      var AutoSaveService = $injector.get('AutoSaveService');
      autoSaveService = new AutoSaveService(saveFunction);
    });
  });

  it('should exist',function(){
    expect(autoSaveService).to.be.ok;
    
    expect(autoSaveService.save).to.be.a('function');
    expect(autoSaveService.clearSaveTimeout).to.be.a('function');
    expect(MINIMUM_INTERVAL_BETWEEN_SAVES).to.equal(5000);
  });

  describe('save: ',function(){
    beforeEach(function(){
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should save after minimum interval', function() {
      autoSaveService.save();

      saveFunction.should.not.have.been.called;

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.not.have.been.called;

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;
    });

    it('should reprogram save and save after minimum interval', function() {
      autoSaveService.save();

      saveFunction.should.not.have.been.called;

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      autoSaveService.save();

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.not.have.been.called;

      $timeout.flush();

      saveFunction.should.have.been.calledOnce;
    });

    it('should not reprogram save if we reach maximum interval', function() {
      autoSaveService.save();

      saveFunction.should.not.have.been.called;

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);
      clock.tick(MAXIMUM_INTERVAL_BETWEEN_SAVES);

      autoSaveService.save();

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;

      $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;
    });

  });

  describe('_saving: ', function() {
    var saveDeferred;

    beforeEach(function() {
      saveDeferred = Q.defer();
      saveFunction.returns(saveDeferred.promise);
    });

    it('should reprogram save if previous save is in progress', function(done) {
      autoSaveService.save();

      $timeout.flush();

      saveFunction.should.have.been.called;

      autoSaveService.save();

      $timeout.flush();

      saveFunction.should.have.been.calledOnce;

      saveDeferred.resolve();

      setTimeout(function() {
        $timeout.flush();

        saveFunction.should.have.been.calledTwice;          

        done();
      });
    });
  });

  it('clearSaveTimeout: ', function() {
    autoSaveService.save();

    saveFunction.should.not.have.been.called;

    $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

    autoSaveService.clearSaveTimeout();

    $timeout.flush(MINIMUM_INTERVAL_BETWEEN_SAVES);

    saveFunction.should.not.have.been.called;
  });

});
