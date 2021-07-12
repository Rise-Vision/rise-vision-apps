import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { WorldTimezonesService } from './world-timezones.service';

describe('WorldTimezonesService', () => {
  let service: WorldTimezonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorldTimezonesService);
  });

  it('should be created', () => {
    expect(service).to.exist;
    expect(WorldTimezonesService.WORLD_TIMEZONES).to.exist;
  });
});
