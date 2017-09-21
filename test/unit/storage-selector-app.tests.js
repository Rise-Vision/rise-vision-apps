'use strict';
  
describe('app: storage-selector-app:', function() {
  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps.storage.storage-selector', function ($provide) {
      $provide.service('canAccessApps',function(){
        return function() {
          var deferred = Q.defer();
          deferred.resolve("auth");
          return deferred.promise;
        }
      });
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
      $state = $injector.get('$state');
      storageFactory = $injector.get('storageFactory');            
    });
    
  });

  var storageFactory, $state;
  
  it('should initialize storage iframe',function (){
    var storageState = $state.get('apps.storage.home')
    expect(storageState).to.be.ok;
    expect(storageState.url).to.equal('/');
    expect(storageState.controller).to.equal('StorageSelectorIFrameController');
    expect(storageState.resolve.selectorType[1]).to.be.a('function');
    expect(storageState.resolve.selectorFilter[1]).to.be.a('function');
  });

});
