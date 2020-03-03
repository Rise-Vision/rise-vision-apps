(function (angular) {

  'use strict';

  angular.module('risevision.common.components.logging')
    .factory('analyticsFactory', ['$rootScope', '$window', '$log', '$location',
      function ($rootScope, $window, $log, $location) {
        var service = {};
        var loaded;

        $window.dataLayer = $window.dataLayer || [];

        service.track = function (eventName, properties) {
          properties = properties || {};
          properties.category = 'apps';
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
          properties = properties || {};
          properties.category = 'apps';
          $window.dataLayer.push({
            event: 'analytics.page',
            eventName: 'page viewed',
            analytics: {
              event: {
                properties: properties
              }
            }
          });
        };

        service.load = function (gtmContainerId, gtmAuth, gtmEnv) {
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
              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              if (gtmAuth && gtmEnv) {
                j.src += '&gtm_auth=' + gtmAuth + '&gtm_preview=' + gtmEnv + '&gtm_cookies_win=x';
              }
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

    .factory('analyticsEvents', ['$rootScope', 'analyticsFactory',
      'userState',
      function ($rootScope, analyticsFactory, userState) {
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
              properties.parentId = company.parentId;
              properties.company = {
                id: company.id,
                name: company.name,
                companyIndustry: company.companyIndustry,
                parentId: company.parentId
              };
              properties.subscriptionStatus = company.planSubscriptionStatus ? company.planSubscriptionStatus :
                'Free';
              properties.subscriptionRenewalDate = company.planCurrentPeriodEndDate;
              properties.subscriptionTrialExpiryDate = company.planTrialExpiryDate;
            }

            analyticsFactory.identify(userState.getUsername(), properties);
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
