'use strict';

angular.module('risevision.template-editor.directives')
  .constant('FILTER_HTML_TEMPLATES', 'presentationType:"HTML Template"')
  .directive('templateComponentPlaylist', ['templateEditorFactory', 'presentation', '$log', '$loading',
  'FILTER_HTML_TEMPLATES', 'ScrollingListService',
    function (templateEditorFactory, presentation, $log, $loading,
      FILTER_HTML_TEMPLATES, ScrollingListService) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-playlist.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.searchKeyword = '';
          $scope.templatesSearch = {
            sortBy: 'changeDate'
          };

          function _load() {
            //
          }

          $scope.save = function () {
            //
          };

          $scope.registerDirective({
            type: 'rise-playlist',
            iconType: 'streamline',
            icon: 'embedded-template',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            },
            onBackHandler: function () {
              if ($scope.view) {
                $scope.showSelectedTemplates();
                return true;
              }
            }
          });

          $scope.showAddTemplates = function () {
            $scope.view = 'add-templates';
            $scope.searchTemplates();
          };

          $scope.showSelectedTemplates = function () {
            $scope.view = '';
          };

          $scope.searchTemplates = function () {

            $scope.templatesSearch.filter = presentation.buildFilterString($scope.searchKeyword, FILTER_HTML_TEMPLATES);
  
            if (!$scope.templatesFactory) {
              $scope.initTemplatesFactory();
            } else {
              $scope.templatesFactory.doSearch();
            }
          };

          $scope.searchKeyPressed = function (keyEvent) {
            // handle enter key
            if (keyEvent.which === 13) {
              $scope.searchTemplates();
            }
          };

          $scope.resetSearch = function () {
            $scope.searchKeyword = '';
            $scope.searchTemplates();
          };

          $scope.initTemplatesFactory = function () {

            $scope.templatesFactory = new ScrollingListService(presentation.list, $scope.templatesSearch);

            $scope.$watch('templatesFactory.loadingItems', 
            function (loading) {
              if (loading) {
                $loading.start('rise-playlist-templates-loader');
              } else {
                $loading.stop('rise-playlist-templates-loader');
              }
            });
          };

          $scope.selectTemplate = function (key) {
            console.log('selectTemplate');
            $scope.templatesFactory.items.list[key].isSelected = !$scope.templatesFactory.items.list[key].isSelected;
            // $scope.canAddInstrument = _.some($scope.instrumentSearch, function (item) {
            //   return item.isSelected === true;
            // });
          };

        }
      };
    }
  ]);