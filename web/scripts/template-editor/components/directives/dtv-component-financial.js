'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentFinancial', ['$timeout', 'templateEditorFactory',
    function ($timeout, templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-financial.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.showInstrumentList = false;
          $scope.showSymbolSelector = false;
          $scope.enteringInstrumentSelector = true;
          $scope.enteringSymbolSelector = false;
          $scope.exitingSymbolSelector = false;
          console.log("entering symbol selector");
          $timeout(function () {
            $scope.enteringInstrumentSelector = false;
            $scope.showInstrumentList = true;
            console.log("entered symbol selector");
          }, 3000);

          $scope.registerDirective({
            type: 'rise-data-financial',
            icon: 'fa-line-chart',
            element: element,
            onBackHandler: function () {
              if ($scope.showSymbolSelector) {
                changeInstrumentView(false);
                return true;
              }
            }
          });

          $scope.showSymbolSearch = function () {
            changeInstrumentView(true);
          };

          $scope.selectInstruments = function () {
            changeInstrumentView(false);
          };

          function changeInstrumentView(enteringSelector, delay) {
            $scope.showInstrumentList = false;
            $scope.showSymbolSelector = false;

            if(enteringSelector) {
              $scope.enteringSymbolSelector = true;
              $scope.exitingSymbolSelector = false;
            } else {
              $scope.enteringSymbolSelector = false;
              $scope.exitingSymbolSelector = true;
            }

            $timeout(function () {
              $scope.enteringSymbolSelector = false;
              $scope.exitingSymbolSelector = false;
              $scope.showSymbolSelector = enteringSelector;
              $scope.showInstrumentList = !enteringSelector;
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
