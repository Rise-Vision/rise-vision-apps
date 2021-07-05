import {expect} from 'chai';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBoxComponent } from './message-box.component';
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'streamline-icon',
  template: ''
})
class MockStreamlineIcon {
}

describe('MessageBoxComponent', () => {
  let component: MessageBoxComponent;
  let fixture: ComponentFixture<MessageBoxComponent>;
  let modalRef;

  beforeEach(async () => {
    modalRef = {
      onHide: {
        subscribe: sinon.stub()
      },
      hide: sinon.stub()
    }
    await TestBed.configureTestingModule({
      declarations: [ MessageBoxComponent, MockStreamlineIcon ],
      providers: [
        {provide: BsModalRef, useValue: modalRef}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.exist;
  });
});
