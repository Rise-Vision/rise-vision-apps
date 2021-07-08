import {expect} from 'chai';

import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BroadcasterService } from './broadcaster.service';

describe('BroadcasterService', () => {
  let service: BroadcasterService, subscription: any, nextSpy: any;
  let $rootScope: any;

  beforeEach(() => {
    $rootScope = {
      $broadcast: sinon.spy()
    };
    TestBed.configureTestingModule({
      providers: [
        {provide: '$rootScope', useValue: $rootScope},
      ]
    });
    service = TestBed.inject(BroadcasterService);

    subscription = service.subscribe({
      next: nextSpy = sinon.spy()
    });
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should be created', () => {
    expect(service).to.be.ok;
    expect(Object.getPrototypeOf(service) === EventEmitter)
  });

  it('emit:', () => {
    service.emit('message1');

    $rootScope.$broadcast.should.have.been.calledWith('message1');
    nextSpy.should.have.been.calledWith('message1');
  });

  it('emitWithParams:', () => {
    service.emitWithParams('message2', 'params');

    $rootScope.$broadcast.should.have.been.calledWith('message2', 'params');
    nextSpy.should.have.been.calledWith('message2');
  });

});
