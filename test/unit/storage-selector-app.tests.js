'use strict';
  
describe('app: storage-selector-app:', function() {
   beforeEach(function () {
        angular.module('risevision.apps.partials',[]);

        module('risevision.apps.storage.storage-selector', function ($provide) {
            $provide.factory('storageFactory', function() {
              return {
                storageIFrame: false,
                storageFull: true,
                setSelectorType: function() {
                  selectorInitialized = true;
                }
              };
            });
        });
        inject(function ($injector) {
            storageFactory = $injector.get('storageFactory');            
        });
    });

  var storageFactory, selectorInitialized;
  
  it('should set flag it is an iframe',function (){
    expect(storageFactory.storageIFrame).to.be.true;
  });
  
  it('should set flag it is a modal',function (){
    expect(storageFactory.storageFull).to.be.false;
  });

  it('should setSelectorType', function (){
    expect(selectorInitialized).to.be.true;
  }); 

});
