import { Injectable } from '@angular/core';
import { AnalyticsFactory, CanvaTypePicker } from 'src/app/ajs-upgraded-providers';

@Injectable({
  providedIn: 'root'
})
export class CanvaApiService {

  private _canvaApiPromise: Promise<any>;
  private _designButtonPromise: Promise<CanvaButtonApi>;

  constructor(private canvaTypePicker: CanvaTypePicker, private analyticsFactory: AnalyticsFactory) {}

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

  createDesign(): Promise<any>{
    const self = this;
    this.analyticsFactory.track('Canva Design Started');
    const promise = new Promise((resolve, reject) => {
    Promise.all([this.initializeDesignButtonApi(),this.canvaTypePicker()])
      .then((result: Array<any>) => {
        const api: CanvaButtonApi = result[0];
        const designType: string = result[1];
        api.createDesign({
          design: {
            type: designType,
          },
          editor: {
            publishLabel: 'Save'
          },
          onDesignPublish: function (options) {
            self.analyticsFactory.track('Canva Design Published', {
              designId: options.designId,
              designTitle: options.designTitle,
            });
            resolve(options);
          },
          onDesignClose: function () {              
            reject('closed');
          },
        });
      })
      .catch(reject);
    });
    return promise;
  }
}
