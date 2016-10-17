angular.module('risevision.displays.services')
  .factory('loadPrimus', ['$q', '$window', function ($q, $window) {
    var deferred = $q.defer();

    return function () {
      deferred.resolve($window['Primus']);
      return deferred.promise;
    };
  }])

  .factory('getDisplayStatus', ['loadPrimus', '$q', function(loadPrimus, $q) {
    return function(displayIds) {
      var deferred = $q.defer();
      loadPrimus()
        .then(function(Primus) {
          var primus = new Primus('https://display-messaging.risevision.com:3000');
          primus.on('data', function(d) {
            if(d.msg === 'presence-result') {
              deferred.resolve(d.result);
            }
          });

          primus.on('error', function(err) {
            deferred.reject(err);
          });

          primus.on('open', function open() {
            primus.write({
              'msg': 'presence-request',
              'displayIds': displayIds,
            });
          });

          primus.open();

        });

      return deferred.promise;
    };
  }]);
