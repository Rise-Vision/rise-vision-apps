'use strict';

angular.module('risevision.common.components.loading')
  .service('$loading', ['$q', '$rootScope', '$document',
    '_rvGlobalSpinnerRegistry',
    function ($q, $rootScope, $document, _rvGlobalSpinnerRegistry) {
      var self = this;

      this.start = function (spinnerKeys) {
        spinnerKeys = angular.isArray(spinnerKeys) ? spinnerKeys : [
          spinnerKeys
        ];
        for (var i = 0; i < spinnerKeys.length; i++) {
          $rootScope.$broadcast('rv-spinner:start', spinnerKeys[i]);
        }
      };

      this.stop = function (spinnerKeys) {
        spinnerKeys = angular.isArray(spinnerKeys) ? spinnerKeys : [
          spinnerKeys
        ];
        for (var i = 0; i < spinnerKeys.length; i++) {
          $rootScope.$broadcast('rv-spinner:stop', spinnerKeys[i]);
        }
      };

      /* Global Spinner */
      //append global spinner
      if ($document && $document[0]) {
        angular.element($document[0].body).append(
          '<div rv-global-spinner class="ng-hide" style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 1040; "></div>'
        );
      }

      function _addKeyToRegistry(key) {
        if (_rvGlobalSpinnerRegistry.indexOf(key) < 0) {
          _rvGlobalSpinnerRegistry.push(key);
        }
      }

      function _removeKeyFromRegistry(key) {
        var index;
        if ((index = _rvGlobalSpinnerRegistry.indexOf(key)) >= 0) {
          _rvGlobalSpinnerRegistry.splice(index, 1);
        }
      }

      this.startGlobal = function (spinnerKeys) {
        spinnerKeys = angular.isArray(spinnerKeys) ? spinnerKeys : [
          spinnerKeys
        ];
        angular.forEach(spinnerKeys, function (key) {
          _addKeyToRegistry(key);
        });
      };

      this.stopGlobal = function (spinnerKeys) {
        spinnerKeys = angular.isArray(spinnerKeys) ? spinnerKeys : [
          spinnerKeys
        ];
        angular.forEach(spinnerKeys, function (key) {
          _removeKeyFromRegistry(key);
        });
      };

      this.stopSpinnerAfterPromise = function (spinnerKeys, promises) {

        spinnerKeys = angular.isArray(spinnerKeys) ? spinnerKeys : [
          spinnerKeys
        ];

        var stop = function () {
          for (var i = 0; i < spinnerKeys.length; i++) {
            $rootScope.$broadcast('rv-spinner:stop', spinnerKeys[i]);
          }
        };

        var promise = angular.isArray(promises) ? $q.all(promises) : promises;
        promise.then(function () {
          stop();
        }, function () {
          stop();
        });
      };

      this.getDefaultSpinnerOptions = function () {
        return self.defaultSpinnerOptions;
      };

      this.defaultSpinnerOptions = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#555', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent in px
        left: '50%' // Left position relative to parent in px
      };
    }
  ]);
