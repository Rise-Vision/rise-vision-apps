(function (angular) {

  "use strict";

  angular.module("risevision.common.components.analytics", [])

  .value("SEGMENT_API_KEY", "AFtY3tN10BQj6RbnfpDDp9Hx8N1modKN")
    .value("GA_LINKER_USE_ANCHOR", true)

  .factory("segmentAnalytics", ["$rootScope", "$window", "$log", "$location",
    "GA_LINKER_USE_ANCHOR",
    function ($rootScope, $window, $log, $location, GA_LINKER_USE_ANCHOR) {
      var service = {};
      var loaded;

      $window.analytics = $window.analytics || [];
      var analytics = $window.analytics;
      analytics.SNIPPET_VERSION = "4.0.0";

      analytics.factory = function (t) {
        function addUrl(methodName, args) {
          if ("track" === t && args && args.length > 1 && args[1] &&
            typeof args[1] === "object") {
            args[1].url = $location.host();
          }
        }
        return function () {
          var e = Array.prototype.slice.call(arguments);
          addUrl(t, e);
          e.unshift(t);
          $window.analytics.push(e);

          $log.debug("Segment Tracker", e);

          return $window.analytics;
        };
      };
      analytics.methods = ["trackSubmit", "trackClick", "trackLink",
        "trackForm",
        "pageview", "identify", "group", "track", "ready", "alias",
        "page",
        "once", "off", "on"
      ];
      for (var i = 0; i < analytics.methods.length; i++) {
        var method = analytics.methods[i];
        service[method] = analytics.factory(method);
      }

      service.ready(function () {
        var ga = $window.ga;
        ga("require", "linker");
        ga("linker:autoLink", ["community.risevision.com",
          "store.risevision.com", "help.risevision.com",
          "apps.risevision.com", "risevision.com",
          "preview.risevision.com", "rva.risevision.com"
        ], GA_LINKER_USE_ANCHOR);
      });

      /**
       * @description
       * Load Segment.io analytics script
       * @param apiKey The key API to use
       */
      service.load = function (apiKey) {
        if (apiKey && !loaded) {

          trackPageviews();

          var e = document.createElement("script");
          e.type = "text/javascript";
          e.async = !0;
          e.src = ("https:" === document.location.protocol ? "https://" :
            "http://") + "cdn.segment.com/analytics.js/v1/" + apiKey +
            "/analytics.min.js";
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(e, n);

          loaded = true;
        }
      };

      function trackPageviews() {
        // Listening to $viewContentLoaded event to track pageview
        $rootScope.$on("$viewContentLoaded", function () {
          if (service.location !== $location.path()) {
            service.location = $location.path();
            var properties = {};
            properties.url = $location.path();
            properties.path = $location.path();
            if ($location.search().nooverride) {
              properties.referrer = "";
            }
            service.page(properties);
          }
        });
      }

      return service;
    }
  ])

  .factory("analyticsEvents", ["$rootScope", "segmentAnalytics",
    "userState",
    function ($rootScope, segmentAnalytics, userState) {
      var service = {};

      service.identify = function () {
        if (userState.getUsername()) {
          var profile = userState.getCopyOfProfile();

          var properties = {
            email: profile.email,
            firstName: profile.firstName ? profile.firstName : "",
            lastName: profile.lastName ? profile.lastName : "",
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
        $rootScope.$on("risevision.user.authorized", function () {
          service.identify();
        });
      };

      return service;
    }
  ]);

})(angular);
