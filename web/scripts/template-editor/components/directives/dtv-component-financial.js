'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentFinancial', ['$timeout', 'templateEditorFactory',
    function ($timeout, templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-financial.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.showSelector = false;

          $scope.registerDirective({
            type: 'rise-data-financial',
            icon: 'fa-line-chart',
            element: element,
            onBackHandler: function () {
              if ($scope.showSelector) {
                $scope.showSelector = false;
              }
              else {
                $scope.backToList();
              }
            }
          });

          $scope.addInstruments = function () {
            _startAnimationDelay(0);
            $scope.showSelector = true;
          };

          $scope.selectInstruments = function () {
            _startAnimationDelay(0);
            $scope.showSelector = false;
          };

          function _startAnimationDelay(delay) {
            $scope.animationRunning = true;
            $timeout(function () {
              $scope.animationRunning = false;
            }, !isNaN(delay) ? delay : 500);
          }

          $scope.instruments = [{
            name: 'Canadian Dollar',
            rate: 'CADUSD=X'
          }, {
            name: 'Swiss Franc',
            rate: 'CHFUSD=X'
          }, {
            name: 'Hong Kong Dollar',
            rate: 'HKDUSD=X'
          }];
        }
      };
    }
  ]);
