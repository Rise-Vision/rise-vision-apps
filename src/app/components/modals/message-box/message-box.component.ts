import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent {

  title: string;
  message: string;

  constructor(public modalRef: BsModalRef) { }

  close() {
    this.modalRef.hide()
  }

}
