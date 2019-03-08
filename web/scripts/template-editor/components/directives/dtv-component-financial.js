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
            $scope.category = 'currencies';
            $scope.instruments = [];
          }

          function _loadInstrumentList() {
            var instruments =
              $scope.getAttributeData($scope.componentId, 'instruments');

            if(instruments) {
              $scope.instruments = instruments;
            } else {
              _buildInstrumentListFromBlueprint();
            }
          }

          function _buildInstrumentListFromBlueprint() {
            $scope.factory.loadingPresentation = true;
            var symbolString = $scope.getBlueprintData($scope.componentId, 'symbols');

            if(!symbolString) {
              $log.error('The component blueprint data is not providing default symbols value: ' + $scope.componentId)

              return;
            }

            var instruments = [];
            var symbols = symbolString.split('|');

            _buildListRecursive(instruments, symbols);
          }

          function _buildListRecursive(instruments, symbols) {
            if( symbols.length === 0 ) {
              _setInstruments(instruments);
              $scope.factory.loadingPresentation = false;

              return;
            }

            var symbol = symbols.shift();

            instrumentSearchService.keywordSearch($scope.category, symbol)
            .then( function(items) {
              var instrument = _.find(items, {symbol: symbol});

              if(instrument) {
                instruments.push(instrument);
              } else {
                $log.warn('no instrument found for symbol: ' + symbol);
              }
            })
            .catch( function(error) {
              $log.error( error );
            })
            .finally( function() {
              _buildListRecursive(instruments, symbols);
            });
          }

          function _symbolsFor(instruments) {
            return _.map(instruments, function(instrument) {
              return instrument.symbol;
            }).join('|');
          }

          function _setInstruments(instruments) {
            var value = angular.copy(instruments);

            $scope.instruments = value;
            $scope.setAttributeData($scope.componentId, 'instruments', value);
            $scope.setAttributeData($scope.componentId, 'symbols', _symbolsFor(value));
          }

          _reset();

          $scope.registerDirective({
            type: 'rise-data-financial',
            icon: 'fa-line-chart',
            element: element,
            show: function() {
              element.show();

              _reset();
              $scope.componentId = $scope.factory.selected.id;

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

          $scope.searchKeyPressed = function( keyEvent ) {
            // handle enter key
            if ( keyEvent.which === 13 ) {
              $scope.searchInstruments();
            }
          };

          $scope.selectInstrument = function(key) {
            if ( $scope.searching ) {
              return;
            }
            $scope.instrumentSearch[ key ].isSelected = !$scope.instrumentSearch[ key ].isSelected;
            $scope.canAddInstrument = _.some($scope.instrumentSearch, function(item) {
              return item.isSelected === true;
            });
          };

          $scope.searchInstruments = function() {
            var promise = $scope.searchKeyword ?
              instrumentSearchService.keywordSearch( $scope.category, $scope.searchKeyword ) :
              instrumentSearchService.popularSearch( $scope.category );

            $scope.searching = true;
            $scope.canAddInstrument = false;

            promise.then( function( res ) {
              $scope.instrumentSearch = angular.copy( res );
              $scope.popularResults = !$scope.searchKeyword;
              $scope.searching = false;
            } )
              .catch( function( err ) {
                $log.error( err );
                $scope.searching = false;
              } );
          };

          $scope.resetSearch = function() {
            $scope.searchKeyword = '';
            $scope.searchInstruments();
          };

          $scope.getOpenSymbolSelectorButtonLabel = function() {
            return _getFinancialLabel('add-category');
          };

          $scope.getPopularTitle = function() {
            return _getFinancialLabel('most-popular-category');
          };

          $scope.getSearchPlaceholder = function() {
            return _getFinancialLabel('search-category');
          };

          function _getFinancialLabel(key) {
            var category = $scope.category.toLowerCase().replace(' ', '-');

            return 'template.financial.' + key + '.' + category;
          }

          $scope.removeInstrument = function(symbol) {
            var filtered = _.reject($scope.instruments, {symbol: symbol});

            _setInstruments(filtered);
          }

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

          $scope.$watch('showInstrumentList', function(value) {
            if (value) {
              $scope.searching = false;

              if ($scope.instrumentSearch) {
                $scope.instrumentSearch.forEach(function(item) {
                  item.isSelected = false;
                });
              }

              $scope.resetSearch();
            }
          });
        }
      };
    }
  ]);
