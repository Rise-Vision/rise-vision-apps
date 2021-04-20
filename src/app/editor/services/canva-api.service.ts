import { Injectable } from '@angular/core';
import { CanvaTypePicker } from 'src/app/ajs-upgraded-providers';

@Injectable({
  providedIn: 'root'
})
export class CanvaApiService {

  private _canvaApiPromise: Promise<any>;
  private _designButtonPromise: Promise<CanvaButtonApi>;

  constructor(private canvaTypePicker: CanvaTypePicker) {}

  loadCanvaApi() {
    if (this._canvaApiPromise) {
      return this._canvaApiPromise;
    } else {
      this._canvaApiPromise = new Promise<any>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://sdk.canva.com/designbutton/v2/api.js';
        script.onload = function () {
          console.log('Canva loaded');
          if (window.Canva && window.Canva.DesignButton) {
            resolve(window.Canva);
          } else {
            reject();
          }
        };
        script.onerror = reject;
        document.body.appendChild(script);
      });
      return this._canvaApiPromise;
    }
  }

  initializeDesignButtonApi(): Promise<CanvaButtonApi> {
    if (this._designButtonPromise) {
      return this._designButtonPromise;
    } else {      
      this._designButtonPromise = this.loadCanvaApi().then(canvaApi => {
        return canvaApi.DesignButton.initialize({
          apiKey: 'EwLWFws4Qjpa-n_2ZJgBMQbz',
        });
      });       
      return this._designButtonPromise;
    }
  }

  createDesign() {
    const promise = new Promise((resolve, reject) => {
      Promise.all([this.initializeDesignButtonApi(),this.pickDesingType()])
      .then((result: Array<any>) => {
        const api: CanvaButtonApi = result[0];
        const designType: string = result[1];
        api.createDesign({
          design: {
            type: designType,
          },
          onDesignPublish: function (options) {
            resolve(options);
          },
          onDesignClose: function () {              
            reject('closed');
          },
        });
      });      
    });
    return promise;
  }

  pickDesingType() {
    const promise = new Promise<string>((resolve, reject) => {
      this.canvaTypePicker('Assign license?',
      'Do you want to assign licenses to the selected displays?',
      'Yes',
      'No',
      'madero-style centered-modal',
      'partials/components/confirm-modal/madero-confirm-modal.html',
      'sm')
      .then(() => {
        resolve('Logo');
      })
      .catch(reject);
    });
    return promise;
  }

}
