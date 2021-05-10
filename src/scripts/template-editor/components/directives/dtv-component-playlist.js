'use strict';

angular.module('risevision.template-editor.directives')
  .constant('FILTER_HTML_TEMPLATES', 'presentationType:"HTML Template"')
  .directive('templateComponentPlaylist', ['templateEditorFactory', 'presentation', '$loading',
    '$q', 'FILTER_HTML_TEMPLATES', 'ScrollingListService', 'editorFactory', 'blueprintFactory',
    'PLAYLIST_COMPONENTS', 'ENV_NAME',
    function (templateEditorFactory, presentation, $loading,
      $q, FILTER_HTML_TEMPLATES, ScrollingListService, editorFactory, blueprintFactory,
      PLAYLIST_COMPONENTS, ENV_NAME) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-playlist.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.playlistItems = [];
          $scope.searchKeyword = '';
          $scope.templatesSearch = {
            sortBy: 'changeDate',
            reverse: true
          };
          $scope.playlistComponents = PLAYLIST_COMPONENTS;
          $scope.addVisualComponents = !!ENV_NAME && ENV_NAME !== 'TEST';

          function _load() {
            var itemsJson = $scope.getAvailableAttributeData($scope.componentId, 'items');
            var itemsArray = $scope.jsonToPlaylistItems(itemsJson);
            $scope.loadTemplateNames(itemsArray);
          }

          $scope.save = function () {
            var itemsJson = $scope.playlistItemsToJson();
            $scope.setAttributeData($scope.componentId, 'items', itemsJson);
          };

          $scope.registerDirective({
            type: 'rise-playlist',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              $scope.playlistItems = [];
              _load();
            },
            onBackHandler: function () {
              if ($scope.view) {
                $scope.showPlaylistItems();
                return true;
              }
            }
          });

          var _mapItemToEditorFormat = function (item) {
            return {
              'duration': item.duration,
              'play-until-done': item['play-until-done'],
              'transition-type': item['transition-type'],
              'tagName': item.element && item.element.tagName ? item.element.tagName : undefined,
              'id': item.element && item.element.attributes ? item.element.attributes['presentation-id'] :
                undefined,
              'productCode': item.element && item.element.attributes ? item.element.attributes[
                'template-id'] : undefined,
              'attributes': item.element.attributes || {}
            };
          };

          $scope.jsonToPlaylistItems = function (playlistItems) {
            var result = [];

            if (Array.isArray(playlistItems)) {
              result = _.map(playlistItems, _mapItemToEditorFormat);
            }

            return result;
          };

          var _mapEditorToItemFormat = function (item) {
            var updatedItem = {
              'duration': item.duration,
              'play-until-done': item['play-until-done'],
              'transition-type': item['transition-type'],
              'element': {
                'tagName': item.tagName || 'rise-embedded-template',
                'attributes': item.attributes || {}
              }
            };
            updatedItem.element.attributes['template-id'] = item.productCode;
            updatedItem.element.attributes['presentation-id'] = item.id;

            return updatedItem;
          };

          $scope.playlistItemsToJson = function () {
            var playlistItems = _.map($scope.playlistItems, _mapEditorToItemFormat);

            return playlistItems;
          };

          $scope.showAddTemplates = function () {
            $scope.canAddTemplates = false;
            $scope.view = 'add-templates';
            $scope.searchTemplates();
          };

          $scope.showPlaylistItems = function () {
            $scope.view = '';
          };

          $scope.showProperties = function () {
            $scope.view = 'edit';
          };

          $scope.isEmbeddedTemplate = function (item) {
            return item.tagName === 'rise-embedded-template' || !item.tagName;
          };

          $scope.loadTemplateNames = function (playlistItems) {

            if (!playlistItems || !playlistItems.length) {
              return;
            }

            var presentationIds = _.map(_.filter(playlistItems, $scope.isEmbeddedTemplate),
              function (item) {
                return 'id:' + item.id;
              });

            if (!presentationIds.length) {
              $scope.playlistItems = playlistItems;

              return;
            }

            var search = {
              filter: presentationIds.join(' OR ')
            };

            $loading.start('rise-playlist-templates-loader');

            presentation.list(search)
              .then(function (res) {
                _.forEach(playlistItems, function (playlistItem) {
                  var found = false;

                  if (res.items) {
                    _.forEach(res.items, function (item) {
                      if (playlistItem.id === item.id) {
                        found = true;
                        playlistItem.name = item.name;
                        playlistItem.revisionStatusName = item.revisionStatusName;
                        playlistItem.removed = false;
                      }
                    });
                  }

                  if (!found && $scope.isEmbeddedTemplate(playlistItem)) {
                    playlistItem.name = 'Unknown';
                    playlistItem.revisionStatusName = 'Template not found.';
                    playlistItem.removed = true;
                  }
                });
                $scope.playlistItems = playlistItems;
              })
              .finally(function () {
                $loading.stop('rise-playlist-templates-loader');
              });
          };

          $scope.searchTemplates = function () {

            $scope.templatesSearch.filter = presentation.buildFilterString($scope.searchKeyword,
              FILTER_HTML_TEMPLATES);

            //exclude a template that is being edited
            $scope.templatesSearch.filter += ' AND NOT id:' + $scope.factory.presentation.id;

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
            $scope.templatesFactory.items.list[key].isSelected = !$scope.templatesFactory.items.list[key]
              .isSelected;
            $scope.canAddTemplates = _.some($scope.templatesFactory.items.list, function (item) {
              return item.isSelected;
            });
          };

          $scope.addTemplates = function () {
            var itemsToAdd = _.filter($scope.templatesFactory.items.list, function (item) {
              return item.isSelected;
            });

            //if template supports PUD, then set it to PUD automatically

            var promises = [];
            _.forEach(itemsToAdd, function (item) {
              promises.push(blueprintFactory.isPlayUntilDone(item.productCode));
            });

            $loading.start('rise-playlist-templates-loader');

            $q.all(promises)
              .then(function (playUntilDoneValues) {

                for (var i = 0; i < playUntilDoneValues.length; i++) {
                  itemsToAdd[i]['play-until-done'] = playUntilDoneValues[i];
                }

                $scope.playlistItems = $scope.playlistItems.concat(itemsToAdd);
                $scope.save();

                $scope.showPlaylistItems();
              })
              .finally(function (e) {
                $loading.stop('rise-playlist-templates-loader');
              });
          };

          $scope.removeItem = function (key) {
            $scope.playlistItems.splice(key, 1);

            $scope.save();
          };

          $scope.sortItem = function (evt) {
            $scope.moveItem(evt.data.oldIndex, evt.data.newIndex);

            $scope.save();
          };

          $scope.moveItem = function (oldIndex, newIndex) {
            $scope.playlistItems.splice(newIndex, 0, $scope.playlistItems.splice(oldIndex, 1)[0]);
          };

          $scope.durationToText = function (item) {
            return item['play-until-done'] ? 'PUD' : (item.duration ? item.duration : '10') + ' seconds';
          };

          var _updatePlayUntilDone = function (isSupported) {
            $scope.selectedItem['play-until-done-supported'] = isSupported;

            $scope.selectedItem['play-until-done'] = $scope.selectedItem['play-until-done-supported'] &&
              $scope.selectedItem['play-until-done'] ? 'true' : 'false';
          };

          $scope.editProperties = function (key) {
            $scope.selectedItem = angular.copy($scope.playlistItems[key]);
            $scope.selectedItem.key = key;

            //set default values
            $scope.selectedItem.duration = Number.isInteger($scope.selectedItem.duration) ? $scope.selectedItem
              .duration : 10;
            $scope.selectedItem['transition-type'] = $scope.selectedItem['transition-type'] ? $scope.selectedItem[
              'transition-type'] : 'normal';

            if (!$scope.isEmbeddedTemplate($scope.selectedItem)) {
              var component = $scope.getComponentByType($scope.selectedItem.tagName);

              _updatePlayUntilDone(!!component.playUntilDone);

              $scope.showProperties();
            } else {
              blueprintFactory.isPlayUntilDone($scope.selectedItem.productCode)
                .then(function (res) {
                  _updatePlayUntilDone(res);
                })
                .catch(function () {
                  _updatePlayUntilDone(false);
                })
                .finally(function () {
                  $scope.showProperties();
                });
            }
          };

          $scope.saveProperties = function () {
            var item = $scope.playlistItems[$scope.selectedItem.key];

            item.duration = Number.isInteger($scope.selectedItem.duration) ? $scope.selectedItem.duration : 10;
            item['play-until-done'] = $scope.selectedItem['play-until-done'] === 'true';
            item['transition-type'] = $scope.selectedItem['transition-type'];

            $scope.save();
          };

          $scope.getComponentByType = function(type) {
            return _.find(PLAYLIST_COMPONENTS, {
              type: type
            });
          };

          var _editComponent = function(item) {
            $scope.editComponent({
              type: item.tagName,
              id: $scope.componentId + ' ' + $scope.playlistItems.indexOf(item)
            });
          };

          $scope.editPlaylistItem = function (key) {
            var item = $scope.playlistItems[key];

            _editComponent(item);
          };

          $scope.addPlaylistItem = function (type) {
            var component = $scope.getComponentByType(type);
            var item = {
              'duration': 10,
              'play-until-done': !!component.playUntilDone,
              'transition-type': 'normal',
              'tagName': type,
              'attributes': angular.copy(component.defaultAttributes) || {}
            };

            $scope.playlistItems.push(item);
            $scope.save();

            _editComponent(item);
          };

          $scope.createNewTemplate = function () {
            editorFactory.addPresentationModal();
          };
        }
      };
    }
  ]);
