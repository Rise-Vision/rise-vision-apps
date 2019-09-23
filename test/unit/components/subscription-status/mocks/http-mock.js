(function () {
  "use strict";

  try {
    angular.module("pascalprecht.translate");
  }
  catch(err) {
    angular.module("pascalprecht.translate", []);
  }

  angular.module("pascalprecht.translate").factory("$translateStaticFilesLoader", [
    "$q",
    function ($q) {
      return function() {
        var deferred = $q.defer();

        deferred.resolve("{}");

        return deferred.promise;
      };
    }
  ]);

}());
