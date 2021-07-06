import {expect} from 'chai';
import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

describe('ModalService', () => {
  let service: ModalService;
  let modalService;

  beforeEach(() => {
    modalService = {
      show: sinon.stub().returns({
        content: {
          promise: Promise.resolve()
        }
      })
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

  describe('showMessage:', () => {
    it('should pass attributes and show the modal', () => {
      const title = 'title';
      const message = 'message'
      service.showMessage(title, message);

      modalService.show.should.have.been.calledWith(MessageBoxComponent,{
        class: "madero-style modal-sm",
        initialState:{ title, message}
      });
    });
  });

  describe('confirm:', () => {
    it('should return a promise',(done) => {
      service.confirm('title', 'message').then(() => {
        expect(true).to.be.true;
        done();
      });
    });

    it('should pass attributes and show the modal with default buttons', () => {
      const title = 'title';
      const message = 'message'
      service.confirm(title, message);

      modalService.show.should.have.been.calledWith(ConfirmModalComponent, {
        class: "madero-style modal-md",
        initialState:{ cancelButton: 'Cancel', confirmButton: 'Ok', title, message }
      });
    });

    it('should pass attributes and show the modal with custom buttons', () => {
      const title = 'title';
      const message = 'message'
      const confirmButton = 'confirmButton';
      const cancelButton = 'cancelButton'
      service.confirm(title, message, confirmButton, cancelButton);

      modalService.show.should.have.been.calledWith(ConfirmModalComponent, {
        class: "madero-style modal-md",
        initialState:{ cancelButton , confirmButton, title, message }
      });
    });
  });

  describe('confirmDanger:', () => {
    it('should return a promise',(done) => {
      service.confirmDanger('title', 'message').then(() => {
        expect(true).to.be.true;
        done();
      });
    });

    it('should pass attributes and show the modal with default buttons', () => {
      const title = 'title';
      const message = 'message'
      service.confirmDanger(title, message);

      modalService.show.should.have.been.calledWith(ConfirmModalComponent, {
        class: "madero-style modal-md",
        initialState:{ confirmButtonClass: 'btn-danger', cancelButton: 'Cancel', confirmButton: 'Ok', title, message }
      });
    });

    it('should pass attributes and show the modal with custom buttons', () => {
      const title = 'title';
      const message = 'message'
      const confirmButton = 'confirmButton';
      const cancelButton = 'cancelButton'
      service.confirmDanger(title, message, confirmButton, cancelButton);

      modalService.show.should.have.been.calledWith(ConfirmModalComponent, {
        class: "madero-style modal-md",
        initialState:{ confirmButtonClass: 'btn-danger', cancelButton , confirmButton, title, message }
      });
    });
  });
});
