'use strict';
angular.module('risevision.common.cookie', [])
  .service('cookieTester', ['$q', '$document',
    function ($q, $document) {
      var svc = {};

      var _checkLocalCookiePermission = function () {
        $document[0].cookie = 'rv-test-local-cookie=yes';
        if ($document[0].cookie.indexOf('rv-test-local-cookie') > -1) {
          return $q.resolve();
        }

        return $q.reject();
      };

      svc.checkCookies = function () {
        return _checkLocalCookiePermission();
      };

      return svc;
    }
  ]);
