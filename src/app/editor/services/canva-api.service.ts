import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvaApiService {

  private _canvaApiPromise: Promise<any>;
  private _designButtonPromise: Promise<any>;

  constructor() {}

  loadCanvaApi() {
    if (this._canvaApiPromise) {
      return this._canvaApiPromise;
    } else {
      this._canvaApiPromise = new Promise((resolve, reject) => {        
        const script = document.createElement('script');
        script.src = 'https://sdk.canva.com/designbutton/v2/api.js';
        script.onload = function () {
          console.log('Canva loaded');
          if (window['Canva'] && window['Canva'].DesignButton) {
            resolve(window['Canva']);
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

  initializeDesignButtonApi() {
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
      this.initializeDesignButtonApi().then(api => {
        console.log('Canva DesignButton API ready');
        api.createDesign({
          design: {
            type: 'Logo',
          },
          onDesignPublish: function (options) {
            var exportUrl = options.exportUrl;
            resolve(exportUrl);
          },
          onDesignClose: function () {              
            reject('closed');
          },
        });
      });      
    });
    return promise;
  }

}
