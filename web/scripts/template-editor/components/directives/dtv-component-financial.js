'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentFinancial', ['$log', '$timeout', 'templateEditorFactory', 'instrumentSearchService',
    function ($log, $timeout, templateEditorFactory, instrumentSearchService) {
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

            // TODO: hardcoding category for now until templates have component surface category attribute
            $scope.category = "currencies";
            $scope.instruments = [];
          }

          function _loadInstrumentList() {
            var componentId = $scope.factory.selected.id;
            var instruments =
              $scope.getAttributeData(componentId, "instruments");

            if(instruments) {
              $scope.instruments = instruments;
            } else {
              _buildInstrumentListFromBlueprint(componentId);
            }
          }

          function _buildInstrumentListFromBlueprint(componentId) {
            var symbolString = $scope.getBlueprintData(componentId, "symbols");

            if(!symbolString) {
              $log.error("The component blueprint data is not providing default symbols value: " + componentId)

              return;
            }

            var instruments = [];
            var symbols = symbolString.split("|");

            _buildListRecursive(componentId, instruments, symbols);
          }

          function _buildListRecursive(componentId, instruments, symbols) {
            if( symbols.length === 0 ) {
              _setInstruments(componentId, instruments);

              return;
            }

            var symbol = symbols.shift();

            instrumentSearchService.keywordSearch($scope.category, symbol)
            .then( function(items) {
              var instrument = _.find(items, {symbol: symbol});

              if(instrument) {
                instruments.push(instrument);
              } else {
                $log.warn("no instrument found for symbol: " + symbol);
              }
            })
            .catch( function(error) {
              $log.error( error );
            })
            .finally( function() {
              _buildListRecursive(componentId, instruments, symbols);
            });
          }

          function _symbolsFor(instruments) {
            return _.map(instruments, function(instrument) {
              return instrument.symbol;
            }).join("|");
          }

          function _setInstruments(componentId, instruments) {
            var value = angular.copy(instruments);

            $scope.instruments = value;
            $scope.setAttributeData(componentId, "instruments", value);
            $scope.setAttributeData(componentId, "symbols", _symbolsFor(value));
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

          $scope.selectInstrument = function(key) {
            if ( $scope.searching ) {
              return;
            }
            $scope.instrumentSearch[ key ].isSelected = !$scope.instrumentSearch[ key ].isSelected;
          };

          $scope.searchInstruments = function() {
            var promise = $scope.searchKeyword ?
              instrumentSearchService.keywordSearch( $scope.category, $scope.searchKeyword ) :
              instrumentSearchService.popularSearch( $scope.category );

            $scope.searching = true;
            promise.then( function( res ) {
              $scope.instrumentSearch = angular.copy( res );
              $scope.searching = false;
            } )
              .catch( function( err ) {
                console.error( err );
                $scope.searching = false;
              } );
          };

          $scope.getPopularTitle = function() {
            return 'template.financial.most-popular-category.' + $scope.category;
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

          $scope.$watch("showInstrumentList", function(value) {
            if (value) {
              $scope.searchKeyword = "";
              $scope.searching = false;

              if ($scope.instrumentSearch) {
                $scope.instrumentSearch.forEach(function(item) {
                  item.isSelected = false;
                });
              }
            }
          });

          $scope.searchInstruments();
        }
      };
    }
  ]);
