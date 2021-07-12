import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { AutoSaveService } from './auto-save.service';
import * as Q from 'q';

describe('AutoSaveService', () => {
  let autoSaveService: AutoSaveService;
  let saveFunction, clock;

  beforeEach(() => {
    saveFunction = sinon.stub().resolves();

    TestBed.configureTestingModule({
      providers: [{provide: Function, useValue: saveFunction}]
    });
    autoSaveService = TestBed.inject(AutoSaveService);
  });

  beforeEach(function(){
    clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    clock.restore();
  });

  it('should be created', () => {
    expect(autoSaveService).to.exist;
  });

  describe('save: ',function(){
    

    it('should save after minimum interval', function() {
      autoSaveService.save();

      saveFunction.should.not.have.been.called;

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.not.have.been.called;

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;
    });
 

    it('should reprogram save and save after minimum interval', function() {
      autoSaveService.save();

      saveFunction.should.not.have.been.called;

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      autoSaveService.save();

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.not.have.been.called;

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;
    });

    it('should not reprogram save if we reach maximum interval', function() {
      autoSaveService.save();

      saveFunction.should.not.have.been.called;

      clock.tick(AutoSaveService.MAXIMUM_INTERVAL_BETWEEN_SAVES);

      autoSaveService.save();

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

      saveFunction.should.have.been.calledOnce;
    });

  });

  describe('_saving: ', function() {
    var saveDeferred;

    beforeEach(function() {
      saveDeferred = Q.defer();
      saveFunction.returns(saveDeferred.promise);
    });

    it('should reprogram save if previous save is in progress', function() {
      autoSaveService.save();

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES);

      saveFunction.should.have.been.called;

      autoSaveService.save();

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES);

      saveFunction.should.have.been.calledOnce;

      saveDeferred.resolve();

      clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES);

      saveFunction.should.have.been.calledTwice;          

    });
  });

  it('clearSaveTimeout: ', function() {
    autoSaveService.save();

    saveFunction.should.not.have.been.called;

    clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES / 2);

    autoSaveService.clearSaveTimeout();

    clock.tick(AutoSaveService.MINIMUM_INTERVAL_BETWEEN_SAVES);

    saveFunction.should.not.have.been.called;
  });
});
