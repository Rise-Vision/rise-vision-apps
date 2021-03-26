/*jshint camelcase: false */

'use strict';

/* jshint ignore:start */
var gapiLoadingStatus = null;
var handleClientJSLoad = function () {
  gapiLoadingStatus = 'loaded';
  console.debug('ClientJS is loaded.');
  //Ready: create a generic event
  var evt = document.createEvent('Events');
  //Aim: initialize it to be the event we want
  evt.initEvent('gapi.loaded', true, true);
  //FIRE!
  window.dispatchEvent(evt);
};
/* jshint ignore:end */

angular.module('risevision.common.gapi', [
    'risevision.common.components.util'
  ])
  .factory('gapiLoader', ['$q', '$window',
    function ($q, $window) {
      var deferred = $q.defer();

      return function () {
        var gapiLoaded;

        if ($window.gapiLoadingStatus === 'loaded') {
          deferred.resolve($window.gapi);
        } else if (!$window.gapiLoadingStatus) {
          $window.gapiLoadingStatus = 'loading';

          var src = $window.gapiSrc ||
            '//apis.google.com/js/client.js?onload=handleClientJSLoad';
          var fileref = document.createElement('script');
          fileref.setAttribute('type', 'text/javascript');
          fileref.setAttribute('src', src);

          fileref.onerror = function(error) {
            console.log('gapi load error', error);
            deferred.reject(error);
            $window.removeEventListener('gapi.loaded', gapiLoaded, false);
          };

          if (typeof fileref !== 'undefined') {
            document.getElementsByTagName('body')[0].appendChild(fileref);
          }

          gapiLoaded = function () {
            deferred.resolve($window.gapi);
            $window.removeEventListener('gapi.loaded', gapiLoaded, false);
          };
          $window.addEventListener('gapi.loaded', gapiLoaded, false);
        }
        return deferred.promise;
      };
    }
  ])

  .factory('clientAPILoader', ['$q', '$log', 'gapiLoader',
    function ($q, $log, gapiLoader) {
      return function () {
        var deferred = $q.defer();
        gapiLoader().then(function (gApi) {
          if (gApi.client) {
            //already loaded. return right away
            deferred.resolve(gApi);
          } else {
            gApi.load('client', function (err) {
              if (gApi.client) {
                $log.debug('client API Loaded');

                deferred.resolve(gApi);
              } else {
                var errMsg = 'client API Load Failed';
                $log.error(errMsg, err);
                deferred.reject(err || errMsg);
              }
            });
          }
        }).catch(function(err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };
    }
  ])

  //abstract method for creading a loader factory service that loads any
  //custom Google Client API library

  .factory('gapiClientLoaderGenerator', ['$q', '$log', 'clientAPILoader',
    function ($q, $log, clientAPILoader) {
      return function (libName, libVer, baseUrl) {
        return function () {
          var deferred = $q.defer();
          clientAPILoader().then(function (gApi) {
            if (gApi.client[libName]) {
              // already loaded. return right away
              deferred.resolve(gApi.client[libName]);
            } else {
              gApi.client.load(libName, libVer, null, baseUrl)
                .then(function () {
                  if (gApi.client[libName]) {
                    $log.debug(libName + '.' + libVer + ' Loaded');
                    deferred.resolve(gApi.client[libName]);
                  } else {
                    return $q.reject();
                  }
                })
                .catch(function (err) {
                  var errMsg = libName + '.' + libVer + ' Load Failed';
                  $log.error(errMsg, err);
                  deferred.reject(err || errMsg);
                });
            }
          }).catch(function(err) {
            deferred.reject(err);
          });
          return deferred.promise;
        };
      };
    }
  ])

  .factory('DedupingGenerator', ['gapiClientLoaderGenerator',
    function (gapiClientLoaderGenerator) {
      return function () {
        var generator;
        var args = arguments;

        return function () {
          if (generator) {
            return generator;
          }

          generator = gapiClientLoaderGenerator.apply(null, args)()
            .finally(function () {
              generator = undefined;
            });

          return generator;
        };
      };
    }
  ])

  .factory('coreAPILoader', ['CORE_URL', 'DedupingGenerator', '$location',
    function (CORE_URL, DedupingGenerator, $location) {
      var baseUrl = $location.search() && $location.search().core_api_base_url ?
        $location.search().core_api_base_url + '/_ah/api' : CORE_URL;

      return new DedupingGenerator('core', 'v1', baseUrl);
    }
  ])

  .factory('riseAPILoader', ['CORE_URL', 'DedupingGenerator', '$location',
    function (CORE_URL, DedupingGenerator, $location) {
      var baseUrl = $location.search() && $location.search().core_api_base_url ?
        $location.search().core_api_base_url + '/_ah/api' : CORE_URL;

      return new DedupingGenerator('rise', 'v0', baseUrl);
    }
  ])

  .factory('storeAPILoader', ['STORE_ENDPOINT_URL', 'DedupingGenerator', '$location',
    function (STORE_ENDPOINT_URL, DedupingGenerator, $location) {
      var baseUrl = $location.search() && $location.search().store_api_base_url ?
        $location.search().store_api_base_url + '/_ah/api' : STORE_ENDPOINT_URL;

      return new DedupingGenerator('store', 'v0.01', baseUrl);
    }
  ])

  .factory('storageAPILoader', ['STORAGE_ENDPOINT_URL', 'DedupingGenerator', '$location',
    function (STORAGE_ENDPOINT_URL, DedupingGenerator, $location) {
      var baseUrl = $location.search() && $location.search().storage_api_base_url ?
        $location.search().storage_api_base_url + '/_ah/api' : STORAGE_ENDPOINT_URL;

      return new DedupingGenerator('storage', 'v0.02', baseUrl);
    }
  ]);
