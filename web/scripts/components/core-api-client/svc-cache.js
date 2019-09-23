(function (angular) {
  "use strict";

  angular.module("risevision.core.cache", [])

  .factory("userInfoCache", ["$cacheFactory",
    function ($cacheFactory) {
      return $cacheFactory("user-info-cache");
    }
  ]);

})(angular);
