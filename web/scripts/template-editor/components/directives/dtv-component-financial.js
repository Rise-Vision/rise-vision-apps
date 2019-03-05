'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentFinancial', ['$log', '$timeout', 'templateEditorFactory',
    function ($log, $timeout, templateEditorFactory) {
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

            $scope.instruments = [];
          }

          function _loadInstrumentList() {
            var componentId = $scope.factory.selected.id;
            var instruments =
              $scope.getAttributeData(componentId, "instruments");

            if(instruments) {
              $scope.instruments = instruments;
            } else {
              _buildInstrumentListFromBlueprint();
            }
          }

          function _buildInstrumentListFromBlueprint() {
            var symbolString = $scope.getBlueprintData(componentId, "symbols");

            if(!symbolString) {
              $log.error("The component blueprint data is not providing default symbols value: " + componentId)

              return;
            }

            var symbols = symbolString.split("|");
          }

          _reset();

          $scope.registerDirective({
            type: 'rise-data-financial',
            icon: 'fa-line-chart',
            element: element,
            show: function() {
              element.show();

              _reset();
              _loadInstrumentList();
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
        }
      };
    }
  ]);
