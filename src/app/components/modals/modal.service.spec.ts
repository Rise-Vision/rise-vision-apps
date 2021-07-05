import {expect} from 'chai';
import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('ModalService', () => {
  let service: ModalService;
  let modalService;

  beforeEach(() => {
    modalService = {
      show: sinon.stub()
    };
    TestBed.configureTestingModule({
      providers: [
        {provide: BsModalService, useValue: modalService}
      ]
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).to.exist;
  });
});
