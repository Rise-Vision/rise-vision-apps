import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromiseUtilsService {

  constructor() { }

  generateDeferredPromise() {
    let resolve;
    let reject;
    let p = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise: p, reject, resolve };
  }
}
