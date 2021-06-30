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
        link: function postLink(scope, $element, iAttrs) {
          scope.active = true;
          var tpl =
            '<div ng-show="active" class="spinner-backdrop fade {{backdropClass}}"' +
            ' ng-class="{in: active}" us-spinner="rvSpinnerOptions"' +
            ' spinner-key="{{rvSpinnerKey}}" spinner-start-active="1"></div>';

          $element.prepend($compile(tpl)(scope));

          if (angular.isDefined(scope.rvShowSpinner)) {
            scope.$watch('rvShowSpinner', function (loading) {
              if (loading) {
                usSpinnerService.spin(scope.rvSpinnerKey);
                scope.active = true;
              } else {
                usSpinnerService.stop(scope.rvSpinnerKey);
                scope.active = false;
              }
            });            
          }

          scope.$on('rv-spinner:start', function (event, key) {
            if (key === scope.rvSpinnerKey) {
              usSpinnerService.spin(key);
              scope.active = true;
            }
          });

          scope.$on('rv-spinner:stop', function (event, key) {
            if (key === scope.rvSpinnerKey) {
              usSpinnerService.stop(key);
              scope.active = false;
            }
          });
        }
      };
    }
  ]);
