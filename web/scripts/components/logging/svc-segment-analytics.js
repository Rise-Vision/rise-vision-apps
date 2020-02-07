(function (angular) {

  'use strict';

  angular.module('risevision.common.components.logging')
    .value('GA_LINKER_USE_ANCHOR', true)
    .factory('segmentAnalytics', ['$rootScope', '$window', '$log', '$location',
      'GA_LINKER_USE_ANCHOR',
      function ($rootScope, $window, $log, $location, GA_LINKER_USE_ANCHOR) {
        var service = {};
        var loaded;

        $window.dataLayer = $window.dataLayer || [];

        service.track = function (eventName, properties) {
          $window.dataLayer.push({
            event: 'analytics.track',
            eventName: eventName,
            trackingProperties: properties
          });
        };

        service.identify = function (userId, properties) {
          $window.dataLayer.push({
            event: 'analytics.identify',
            userId: userId,
            trackingProperties: properties
          });
        };

        service.page = function (properties) {
          $window.dataLayer.push({
            event: 'analytics.page',
            trackingProperties: properties
          });
        };

        // TODO: move to Tag Manager
        // service.ready(function () {
        //   var ga = $window.ga;
        //   if (ga) {
        //     ga('require', 'linker');
        //     ga('linker:autoLink', ['community.risevision.com',
        //       'store.risevision.com', 'help.risevision.com',
        //       'apps.risevision.com', 'risevision.com',
        //       'preview.risevision.com', 'rva.risevision.com'
        //     ], GA_LINKER_USE_ANCHOR);
        //   }
        // });

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
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j, f);
            })($window, $window.document, 'script', 'dataLayer', gtmContainerId);

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
