'use strict';

angular.module('risevision.common.components.loading')
  .directive('rvSpinner', ['usSpinnerService', '$compile',
    function (usSpinnerService, $compile) {
      return {
        scope: {
          backdropClass: '@rvSpinnerBackdropClass',
          rvSpinnerKey: '@rvSpinnerKey',
          rvSpinnerOptions: '=rvSpinner',
          rvShowSpinner: '=?rvShowSpinner'
        },
        link: function postLink($scope, $element) {
          $scope.active = true;
          var tpl =
            '<div ng-show="active" class="spinner-backdrop fade {{backdropClass}}"' +
            ' ng-class="{in: active}" us-spinner="rvSpinnerOptions"' +
            ' spinner-key="{{rvSpinnerKey}}" spinner-start-active="1"></div>';

          $element.prepend($compile(tpl)($scope));

          var _startSpinner = function() {
            usSpinnerService.spin($scope.rvSpinnerKey);
            $scope.active = true;
          };

          var _stopSpinner = function() {
            usSpinnerService.stop($scope.rvSpinnerKey);
            $scope.active = false;
          };

          if (angular.isDefined($scope.rvShowSpinner)) {
            $scope.$watch('rvShowSpinner', function (loading) {
              if (loading) {
                _startSpinner();
              } else {
                _stopSpinner();
              }
            });            
          }

          $scope.$on('rv-spinner:start', function (event, key) {
            if (key === $scope.rvSpinnerKey) {
              _startSpinner();
            }
          });

          $scope.$on('rv-spinner:stop', function (event, key) {
            if (key === $scope.rvSpinnerKey) {
              _stopSpinner();
            }
          });
        }
      };
    }
  ]);
