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
          }, {
            name: 'Test Dollar 1',
            rate: 'TS1USD=X'
          }, {
            name: 'Test Dollar 2',
            rate: 'TS2USD=X'
          }, {
            name: 'Test Dollar 3',
            rate: 'TS3USD=X'
          }, {
            name: 'Test Dollar 4',
            rate: 'TS4USD=X'
          }, {
            name: 'Test Dollar 5',
            rate: 'TS5USD=X'
          }, {
            name: 'Test Dollar 6',
            rate: 'TS6USD=X'
          }, {
            name: 'Test Dollar 7',
            rate: 'TS7USD=X'
          }, {
            name: 'Test Dollar 8',
            rate: 'TS8USD=X'
          }, {
            name: 'Test Dollar 9',
            rate: 'TS9USD=X'
          }, {
            name: 'Test Dollar 10',
            rate: 'TS10USD=X'
          }, {
            name: 'Test Dollar 11',
            rate: 'TS11USD=X'
          }, {
            name: 'Test Dollar 12',
            rate: 'TS12USD=X'
          }, {
            name: 'Test Dollar 13',
            rate: 'TS13USD=X'
          }, {
            name: 'Test Dollar 14',
            rate: 'TS14USD=X'
          }, {
            name: 'Test Dollar 15',
            rate: 'TS15USD=X'
          }];
        }
      };
    }
  ]);
