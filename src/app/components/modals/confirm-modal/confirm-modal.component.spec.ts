import {expect} from 'chai';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponent } from './confirm-modal.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'streamline-icon',
  template: ''
})
class MockStreamlineIcon {
}

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let modalRef;

  beforeEach(async () => {
    modalRef = {
      onHide: {
        subscribe: sinon.stub()
      },
      hide: sinon.stub()
    }
    await TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponent, MockStreamlineIcon ],
      providers: [
        {provide: BsModalRef, useValue: modalRef}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // modalRef.onHide.subscribe.getCall(0).args[0]();
    expect(component).to.exist;
  });
});
