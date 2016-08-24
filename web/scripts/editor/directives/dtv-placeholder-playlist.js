'use strict';

angular.module('risevision.editor.directives')
  .directive('placeholderPlaylist', ['placeholderPlaylistFactory',
    'playlistItemFactory', 'widgetModalFactory', 'widgetUtils', '$modal',
    '$templateCache',
    function (placeholderPlaylistFactory, playlistItemFactory,
      widgetModalFactory, widgetUtils, $modal, $templateCache) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/editor/placeholder-playlist.html',
        link: function ($scope, $elem) {
          $scope.factory = placeholderPlaylistFactory;
          $scope.widgetModalFactory = widgetModalFactory;
          $scope.widgetUtils = widgetUtils;
          $scope.playlistItemFactory = playlistItemFactory;

          $scope.remove = function (item) {
            var modalInstance = $modal.open({
              template: $templateCache.get(
              'confirm-instance/confirm-modal.html'),
              controller: 'confirmInstance',
              windowClass: 'modal-custom',
              resolve: {
                confirmationTitle: function () {
                  return 'editor-app.details.removePlaylistItem';
                },
                confirmationMessage: function () {
                  return '' +
                    'editor-app.details.removePlaylistItemWarning';
                },
                confirmationButton: function () {
                  return 'editor-app.details.remove';
                },
                cancelButton: null
              }
            });

            modalInstance.result.then(function () {
              placeholderPlaylistFactory.removeItem(item);
            });
          };

          applySortable();

          function applySortable() {
            var el = $elem.find('.sortable-list')[0];

            if(el) {
              var sortable = new Sortable(el, {
                sort: true,
                animation: 150,
                hande: '.sortable-handle',
                draggable: '.draggable-item',
                onEnd: function applyChanges(evt) {
                  var oldIndex = evt.oldIndex;
                  var newIndex = evt.newIndex;
                  var item = placeholderPlaylistFactory.getItems()[oldIndex];
                  placeholderPlaylistFactory.moveItem(item, newIndex);
                  $scope.$apply();
                }
              });
            }
          }
        }
      };
    }
  ]);
