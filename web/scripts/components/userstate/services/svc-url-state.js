(function (angular) {
  "use strict";

  angular.module("risevision.common.components.userstate")
    .factory("urlStateService", ["$window", "$location", "userState",
      function ($window, $location, userState) {

        var urlStateService = {};

        urlStateService.get = function () {
          var state = "";
          var stateObject = {
            p: null,
            u: null,
            s: null
          };

          // Redirect to the URL root and append pathname back to the URL
          // on Authentication success
          // This prevents Domain authentication errors for sub-folders
          // Warning: Root folder must have CH available for this to work,
          // otherwise no redirect is performed!
          // loc = $window.location.origin + "/";
          // Remove first character (/) from path since we're adding it to loc
          stateObject.p = $window.location.pathname ? $window.location
            .pathname
            .substring(1) : "";
          stateObject.s = $window.location.search;
          stateObject.u = $window.location.hash;

          if (stateObject.p || stateObject.s || stateObject.u) {
            state = encodeURIComponent(JSON.stringify(stateObject));
          }

          return state;
        };

        var _parseState = function (stateString) {
          var state = {};

          try {
            state = JSON.parse(decodeURIComponent(stateString));
          } catch (err) {
            // Parse failed
          }

          return state;
        };

        urlStateService.redirectToState = function (stateString) {
          var state = _parseState(stateString);

          if (state.u || !$location.$$html5) { // hash found, assume non HTML5 mode
            if (state.p || state.s) { // requires redirect
              userState._persistState();

              $window.location.replace(state.p +
                state.s +
                state.u
              );
            } else {
              $window.location.hash = state.u;
            }
          } else { // HTML5 mode
            state.p = state.p || "/";
            state.s = state.s || "";
            $location.url(state.p + state.s);
            $location.replace();
          }
        };

        urlStateService.clearStatePath = function (stateString) {
          var state = _parseState(stateString);

          state.p = undefined;
          state.s = undefined;

          return encodeURIComponent(JSON.stringify(state));
        };

        urlStateService.getUrlParam = function (paramName) {
          // if page is reloaded, then you can get param from $location.search()
          // otherwise you need to parse $location.path()

          if ($location.search()[paramName]) {
            return $location.search()[paramName];
          } else {
            var decodedPath = decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent($location
              .path()))));
            var match = new RegExp("[\?&]" + paramName + "=([^&#\"]*)").exec(decodedPath);
            return match && match[1];
          }
        };

        return urlStateService;
      }
    ]);

})(angular);
