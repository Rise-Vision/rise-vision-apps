'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentFinancial', ['$timeout', 'templateEditorFactory',
    function ($timeout, templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/components/component-financial.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          function _reset() {
            $scope.showInstrumentList = false;
            $scope.showSymbolSelector = false;
            $scope.enteringInstrumentSelector = false;
            $scope.exitingInstrumentSelector = false;
            $scope.enteringSymbolSelector = false;
            $scope.exitingSymbolSelector = false;
          }

          _reset();

          $scope.registerDirective({
            type: 'rise-data-financial',
            icon: 'fa-line-chart',
            element: element,
            show: function() {
              element.show();

              _reset();
              $scope.enteringInstrumentSelector = true;

              $timeout(function () {
                $scope.enteringInstrumentSelector = false;
                $scope.showInstrumentList = true;
              }, 1000);
            },
            onBackHandler: function () {
              if ($scope.showSymbolSelector) {
                _changeInstrumentView(false);
                return true;
              }
            }
          });

          $scope.showSymbolSearch = function () {
            _changeInstrumentView(true);
          };

          $scope.selectInstruments = function () {
            _changeInstrumentView(false);
          };

          function _changeInstrumentView(enteringSelector, delay) {
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
