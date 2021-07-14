import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { PlaylistComponentService } from './playlist-component.service';

describe('PlaylistComponentService', () => {
  let service: PlaylistComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistComponentService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
