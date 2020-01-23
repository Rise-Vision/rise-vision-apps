(function (angular) {

  'use strict';

  angular.module('risevision.common.components.logging')
    .factory('hubspot', ['$window', 'HUBSPOT_ACCOUNT',
      function ($window, hubspotAccount) {
        var service = {};
        var loaded = false;

        var _hsq = window._hsq = window._hsq || [];

        service.loadAs = function (email) {
          if (!loaded) {
            _hsq.push(['identify', {
              email: email
            }]);

            var e = document.createElement('script');
            e.type = 'text/javascript';
            e.defer = !0;
            e.async = !0;
            e.id = 'hs-script-loader';
            e.src = '//js.hs-scripts.com/' + hubspotAccount + '.js';
            var n = document.getElementsByTagName('script')[0];
            n.parentNode.insertBefore(e, n);

            loaded = true;
          }
        };

        return service;
      }
    ]);

})(angular);
