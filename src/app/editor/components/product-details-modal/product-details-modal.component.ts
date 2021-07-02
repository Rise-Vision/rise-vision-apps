import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss']
})
export class ProductDetailsModalComponent implements OnInit {

  product: any;
  
  promise: Promise<void>;
  private reject: any;
  private resolve: any

  constructor(public modalRef: BsModalRef) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.modalRef.onHide.subscribe((reason: string | any) => {
      if (typeof reason === 'string') {
        this.close();
      }
    });
  }

  ngOnInit(): void {
  }

  confirm() {
    this.modalRef.hide();
    this.resolve();
  }

  close() {
    this.modalRef.hide();
    this.reject();
  }

}
