'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentPlaylist', ['$loading', 'componentsFactory', 'attributeDataFactory',
    'playlistComponentFactory', 'blueprintFactory', 'templateEditorUtils', 'PLAYLIST_COMPONENTS', 'analyticsFactory',
    function ($loading, componentsFactory, attributeDataFactory, playlistComponentFactory,
      blueprintFactory, templateEditorUtils, PLAYLIST_COMPONENTS, analyticsFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-playlist.html',
        link: function ($scope, element) {
          $scope.playlistComponentFactory = playlistComponentFactory;
          $scope.playlistItems = [];
          $scope.playlistComponents = PLAYLIST_COMPONENTS;
          $scope.addVisualComponents = true;

          var _updatePlaylistComponents = function() {
            if (!blueprintFactory.isRiseInit()) {
              $scope.addVisualComponents = false;
            } else {
              var allowedComponents = attributeDataFactory.getBlueprintData($scope.componentId, 'allowed-components');

              if (!allowedComponents || allowedComponents === '*') {
                $scope.playlistComponents = PLAYLIST_COMPONENTS;
              } else {
                var componentsArray = allowedComponents.split(',');

                $scope.playlistComponents = _.filter(PLAYLIST_COMPONENTS, function(component) {
                  return componentsArray.indexOf(component.type) !== -1;
                });
              }
            }
          };

          function _loadPresentationNames() {
            if (!$scope.playlistItems || !$scope.playlistItems.length) {
              return;
            }

            var presentationItems = _.filter($scope.playlistItems, $scope.isEmbeddedTemplate);
            
            if (!presentationItems.length) {
              return;
            }

            playlistComponentFactory.loadPresentationNames(presentationItems);
          }

          function _load() {
            _updatePlaylistComponents();

            var itemsJson = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'items');
            $scope.playlistItems = $scope.jsonToPlaylistItems(itemsJson);

            _loadPresentationNames();
          }

          $scope.save = function () {
            var itemsJson = $scope.playlistItemsToJson();
            attributeDataFactory.setAttributeData($scope.componentId, 'items', itemsJson);
          };

          componentsFactory.registerDirective({
            type: 'rise-playlist',
            element: element,
            show: function () {
              $scope.componentId = componentsFactory.selected.id;
              $scope.playlistItems = [];

              playlistComponentFactory.onAddHandler = $scope.addItems;

              _load();

              analyticsFactory.track('Playlist Viewed', {
                componentId: $scope.componentId
              });
            }
          });

          componentsFactory.registerDirective({
            type: 'rise-playlist-item',
            element: element
          });

          $scope.showComponentsDropdown = function() {
            return $scope.addVisualComponents && !!$scope.playlistComponents && $scope.playlistComponents.length > 0;
          };

          var _mapItemToEditorFormat = function (item) {
            return {
              'duration': item.duration,
              'play-until-done': item['play-until-done'] === '' ? true : item['play-until-done'],
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
            componentsFactory.editComponent({
              type: 'rise-presentation-selector'
            });

            analyticsFactory.track('Playlist Item Added', {
              componentType: 'rise-embedded-template',
            });
          };

          $scope.showProperties = function () {
            componentsFactory.editComponent({
              type: 'rise-playlist-item'
            });
          };

          $scope.isEmbeddedTemplate = function (item) {
            return item.tagName === 'rise-embedded-template' || !item.tagName;
          };

          $scope.addItems = function (itemsToAdd) {
            $scope.playlistItems = $scope.playlistItems.concat(itemsToAdd);
            $scope.save();
          };

          $scope.copyItem = function (key) {
            var item = angular.copy($scope.playlistItems[key]);

            $scope.playlistItems.splice(key + 1, 0, item);

            $scope.save();
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
            return item['play-until-done'] ? 'PUD' : (item.duration ? item.duration : '10') + 's';
          };

          var _updatePlayUntilDone = function (isSupported) {
            $scope.selectedItem['play-until-done-supported'] = isSupported;

            $scope.selectedItem['play-until-done'] = $scope.selectedItem['play-until-done-supported'] &&
              $scope.selectedItem['play-until-done'];
          };

          $scope.editProperties = function (key) {
            $scope.selectedItem = angular.copy($scope.playlistItems[key]);
            $scope.selectedItem.key = key;

            //set default values
            $scope.selectedItem.duration = templateEditorUtils.intValueFor($scope.selectedItem.duration, 10);
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
            item['play-until-done'] = $scope.selectedItem['play-until-done'];
            item['transition-type'] = $scope.selectedItem['transition-type'];

            $scope.save();
          };

          $scope.savePlayUntilDone = function () {
            $scope.selectedItem['play-until-done'] = !$scope.selectedItem['play-until-done'];

            $scope.saveProperties();
          };

          $scope.getComponentByType = function(type) {
            return _.find(PLAYLIST_COMPONENTS, {
              type: type
            });
          };

          var _getComponentObject = function(item) {
            return {
              type: item.tagName,
              id: $scope.componentId + ' ' + $scope.playlistItems.indexOf(item)
            };
          };

          $scope.getComponentName = function(item) {
            return componentsFactory.getComponentName(_getComponentObject(item));
          };

          var _editComponent = function(item) {
            componentsFactory.editComponent(_getComponentObject(item));
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

            analyticsFactory.track('Playlist Item Added', {
              componentType: type,
            });

            _editComponent(item);
          };

          $scope.$watch('playlistComponentFactory.loading', function (loading) {
            if (loading) {
              $loading.start('rise-playlist-loader');
            } else {
              $loading.stop('rise-playlist-loader');
            }
          });
        }
      };
    }
  ]);
