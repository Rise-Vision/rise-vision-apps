'use strict';

angular.module('risevision.template-editor.directives')
  .constant('FILTER_HTML_TEMPLATES', 'presentationType:"HTML Template"')
  .directive('templateComponentPlaylist', ['templateEditorFactory', 'presentation', '$loading',
  'FILTER_HTML_TEMPLATES', 'ScrollingListService', 'editorFactory',
    function (templateEditorFactory, presentation, $loading,
      FILTER_HTML_TEMPLATES, ScrollingListService, editorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-playlist.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.selectedTemplates = [];
          $scope.searchKeyword = '';
          $scope.templatesSearch = {
            sortBy: 'changeDate'
          };

          function _load() {
            var itemsJson = $scope.getAvailableAttributeData($scope.componentId, 'items');
            var itemsArray = $scope.jsonToSelectedTemplates(itemsJson);
            $scope.loadTemplateNames(itemsArray);
          }

          $scope.save = function () {
            var itemsJson = $scope.selectedTemplatesToJson();
            $scope.setAttributeData($scope.componentId, 'items', itemsJson);
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

          $scope.jsonToSelectedTemplates = function (playlistItems) {
            var result = [];

            if (Array.isArray(playlistItems)) {
              result = _.map(playlistItems, function (item) {
                return {
                  'duration': item.duration,
                  'play-until-done': item['play-until-done'],
                  'transition-type': item['transition-type'],
                  'id': item.element && item.element.attributes ? item.element.attributes['presentation-id'] : undefined,
                  'productCode': item.element && item.element.attributes ? item.element.attributes['template-id'] : undefined
                };
              });
            }

            return result;
          };

          $scope.selectedTemplatesToJson = function () {
            var playlistItems = _.map($scope.selectedTemplates, function (item) {
              return {
                'duration': item.duration,
                'play-until-done': item['play-until-done'],
                'transition-type': item['transition-type'],
                'element': {
                  'tagName': 'rise-embedded-template',
                  'attributes': {
                    'template-id': item.productCode,
                    'presentation-id': item.id
                  }
                }
              };
            });

            return playlistItems;
          };

          $scope.showAddTemplates = function () {
            $scope.canAddTemplates = false;
            $scope.view = 'add-templates';
            $scope.searchTemplates();
          };

          $scope.showSelectedTemplates = function () {
            $scope.view = '';
          };

          $scope.showProperties = function () {
            $scope.view = 'edit';
          };

          $scope.loadTemplateNames = function (templates) {

            if (!templates || !templates.length) {
              return;
            }

            var presentationIds = _.map(templates, function (item) {
              return 'id:' + item.id;
            });

            var search = {filter: presentationIds.join(' OR ')};

            presentation.list(search)
            .then(function(res) {
              if (res.items) {
                _.forEach(templates, function (template) {
                  _.forEach(res.items, function (item) {
                    if (template.id === item.id) {
                      template.name = item.name;
                      template.revisionStatusName = item.revisionStatusName;
                    }
                  });
                });
              }
              $scope.selectedTemplates = templates;
            });
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
            $scope.templatesFactory.items.list[key].isSelected = !$scope.templatesFactory.items.list[key].isSelected;
            $scope.canAddTemplates = _.some($scope.templatesFactory.items.list, function (item) {
              return item.isSelected;
            });
          };

          $scope.addTemplates = function () {
            var itemsToAdd = _.filter($scope.templatesFactory.items.list, function (item) {
              return item.isSelected;
            });

            $scope.selectedTemplates = $scope.selectedTemplates.concat(itemsToAdd);

            $scope.save();

            $scope.showSelectedTemplates();
          };

          $scope.removeTemplate = function (key) {
            $scope.selectedTemplates.splice(key, 1);

            $scope.save();
          };

          $scope.sortItem = function (evt) {
            $scope.moveItem(evt.data.oldIndex, evt.data.newIndex);

            $scope.save();
          };

          $scope.moveItem = function (oldIndex, newIndex) {
            $scope.selectedTemplates.splice(newIndex, 0, $scope.selectedTemplates.splice(oldIndex, 1)[0]);
          };

          $scope.durationToText = function (item) {
            return item['play-until-done'] ? 'PUD' : (item.duration ? item.duration : '10') + ' seconds';
          };

          $scope.editProperties = function (key) {
            $scope.selectedItem = angular.copy($scope.selectedTemplates[key]);
            $scope.selectedItem.key = key;

            //set default values
            $scope.selectedItem.duration = Number.isInteger($scope.selectedItem.duration) ? $scope.selectedItem.duration : 10;
            $scope.selectedItem['play-until-done'] = $scope.selectedItem['play-until-done'] ? 'true' : 'false';
            $scope.selectedItem['transition-type'] = $scope.selectedItem['transition-type'] ? $scope.selectedItem['transition-type'] : 'normal';

            $scope.showProperties();
          };

          $scope.saveProperties = function () {
            var item = $scope.selectedTemplates[$scope.selectedItem.key];

            item.duration = Number.isInteger($scope.selectedItem.duration) ? $scope.selectedItem.duration : 10;
            item['play-until-done'] = $scope.selectedItem['play-until-done'] === 'true';
            item['transition-type'] = $scope.selectedItem['transition-type'];

            $scope.save();
          };

          $scope.createNewTemplate = function () {
            editorFactory.addPresentationModal();
          };
        }
      };
    }
  ]);