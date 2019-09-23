"use strict";
/* global angular */

try {
  angular.module("risevision.common.i18n.config");
} catch (err) {
  angular.module("risevision.common.i18n.config", []);
}

/**
 * Reimplementation of $translateStaticFilesLoader to handle missing files and locale hierarchy (en/en_US)
 */
angular.module("pascalprecht.translate")
  .factory("$translateStaticFilesLoader", ["$q", "$http",
    function ($q, $http) {
      function loadTranslationFile(options, deferred) {
        $http(angular.extend({
          url: [
            options.prefix,
            options.key.toLowerCase(),
            options.suffix
          ].join(""),
          method: "GET",
          params: ""
        }, options.$http)).then(function (response) {
          deferred.resolve(response.data);
        }, function () {
          if (options.key.indexOf("_") >= 0) {
            var key = options.key.substr(0, options.key.lastIndexOf("_"));
            var opts = angular.extend({}, options, {
              key: key
            });

            loadTranslationFile(opts, deferred);
          } else {
            deferred.resolve("{}");
          }

        });
      }

      return function (options) {
        if (!options || (!angular.isString(options.prefix) ||
          !angular.isString(options.suffix))) {
          throw new Error(
            "Couldn\"t load static files, no prefix or suffix specified!");
        }

        var deferred = $q.defer();

        loadTranslationFile(options, deferred);

        return deferred.promise;
      };
    }
  ]);

angular.module("risevision.common.i18n", [
  "pascalprecht.translate",
  "risevision.common.i18n.config"
])
  .config(["$translateProvider", "LOCALES_PREFIX", "LOCALES_SUFIX",
    function ($translateProvider, LOCALES_PREFIX, LOCALES_SUFIX) {
      // Tries to determine the browsers locale
      $translateProvider.useStaticFilesLoader({
        prefix: LOCALES_PREFIX,
        suffix: LOCALES_SUFIX
      });

      $translateProvider
        .determinePreferredLanguage()
        .fallbackLanguage("en")
        .useSanitizeValueStrategy(null);
    }
  ]);
