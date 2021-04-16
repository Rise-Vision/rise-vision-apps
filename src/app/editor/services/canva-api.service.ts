import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvaApiService {

  constructor() { }

  load() {
    console.log('Canva API loading');

    let promise = new Promise((resolve, reject) => {
      (function (document, url) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = function () {
          console.log('Canva loaded', window['Canva']);
  
          if (window['Canva'] && window['Canva'].DesignButton) {
            window['Canva'].DesignButton.initialize({
              apiKey: 'EwLWFws4Qjpa-n_2ZJgBMQbz',
            }).then(function (api) {
              console.log('Canva API ready', api);
              api.createDesign({
                design: {
                  type: 'Poster',
                },
                onDesignOpen: function (options) {
                  var designId = options.designId;
                  console.log('Canva designId', designId);
                },
                onDesignPublish: function (options) {
                  console.log('Canva design Published', options);
                  var exportUrl = options.exportUrl;
                  resolve(exportUrl);                  
                },
                onDesignClose: function () {
                  console.log('Canva design closed');
                },
              });
            });
          }
        };
        document.body.appendChild(script);
      })(document, 'https://sdk.canva.com/designbutton/v2/api.js');
    });
    return promise;

    
  }
}
