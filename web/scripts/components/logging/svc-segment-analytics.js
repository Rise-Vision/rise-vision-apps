(function (angular) {

  'use strict';

  angular.module('risevision.common.components.logging')
    .factory('segmentAnalytics', ['$rootScope', '$window', '$log', '$location',
      function ($rootScope, $window, $log, $location) {
        var service = {};
        var loaded;

        $window.dataLayer = $window.dataLayer || [];

        service.track = function (eventName, properties) {
          $window.dataLayer.push({
            event: 'analytics.track',
            eventName: eventName,
            analytics: {
              event: {
                properties: properties
              }
            }
          });
        };

        service.identify = function (userId, properties) {
          $window.dataLayer.push({
            event: 'analytics.identify',
            userId: userId,
            analytics: {
              user: {
                properties: properties
              }
            }
          });
        };

        service.page = function (properties) {
          service.track('page viewed', properties);
        };

        service.load = function (gtmContainerId) {
          if (gtmContainerId && !loaded) {

            //Google Tag Manager snippet
            (function (w, d, s, l, i) {
              w[l] = w[l] || [];
              w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
              });
              var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l !== 'dataLayer' ? '&l=' + l : '';
              j.async = true;
              j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl +
                '&gtm_auth=Ry3lxk_Xrlx2qhbXmLA-Pg&gtm_preview=env-254&gtm_cookies_win=x';
              f.parentNode.insertBefore(j, f);
            })($window, $window.document, 'script', 'dataLayer', 'GTM-MMTK3JH');

            loaded = true;
            trackPageviews();
          }
        };

        function trackPageviews() {
          // Listening to $viewContentLoaded event to track pageview
          $rootScope.$on('$viewContentLoaded', function () {
            if (service.location !== $location.path()) {
              service.location = $location.path();
              var properties = {};
              properties.url = $location.path();
              properties.path = $location.path();
              if ($location.search().nooverride) {
                properties.referrer = '';
              }
              service.page(properties);
            }
          });
        }

        return service;
      }
    ])

    .factory('analyticsEvents', ['$rootScope', 'segmentAnalytics',
      'userState',
      function ($rootScope, segmentAnalytics, userState) {
        var service = {};

        service.identify = function () {
          if (userState.getUsername()) {
            var profile = userState.getCopyOfProfile();

            var properties = {
              email: profile.email,
              firstName: profile.firstName ? profile.firstName : '',
              lastName: profile.lastName ? profile.lastName : '',
            };
            if (userState.getUserCompanyId()) {
              var company = userState.getCopyOfUserCompany();

              properties.companyId = company.id;
              properties.companyName = company.name;
              properties.companyIndustry = company.companyIndustry;
              properties.company = {
                id: company.id,
                name: company.name,
                companyIndustry: company.companyIndustry
              };
            }

            segmentAnalytics.identify(userState.getUsername(), properties);
          }
        };

        service.initialize = function () {
          $rootScope.$on('risevision.user.authorized', function () {
            service.identify();
          });
        };

        return service;
      }
    ]);

})(angular);
