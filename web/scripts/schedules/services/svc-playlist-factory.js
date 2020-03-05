'use strict';

angular.module('risevision.schedules.services')
  .constant('TYPE_URL', 'url')
  .constant('TYPE_PRESENTATION', 'presentation')
  .factory('playlistFactory', ['$q', 'scheduleFactory', 'scheduleTracker', 'presentationFactory', 'blueprintFactory',
    'TYPE_URL', 'TYPE_PRESENTATION', 'HTML_PRESENTATION_TYPE',
    function ($q, scheduleFactory, scheduleTracker, presentationFactory, blueprintFactory,
      TYPE_URL, TYPE_PRESENTATION, HTML_PRESENTATION_TYPE) {
      var DEFAULT_DURATION = 10;
      var factory = {};

      factory.newPresentationItem = function (presentation) {
        scheduleTracker('Add Presentation to Schedule',
          scheduleFactory.schedule.id, scheduleFactory.schedule.name
        );

        // Cache presentation to avoid API call for the name
        presentationFactory.setPresentation(presentation);

        return {
          duration: DEFAULT_DURATION,
          type: TYPE_PRESENTATION,
          objectReference: presentation.id,
          name: presentation.name,
          presentationType: presentation.presentationType
        };
      };

      factory.initPlayUntilDone = function (item, presentation, isNew) {
        if (presentation.presentationType === HTML_PRESENTATION_TYPE) {
          return blueprintFactory.isPlayUntilDone(presentation.productCode)
            .then(function (playUntilDone) {
              if (playUntilDone && isNew) {
                //When user schedules a PUD template, then set schedule item to PUD by default.
                item.playUntilDone = true;
              }
              if (!playUntilDone) {
                item.playUntilDone = false;
              }

              return $q.resolve(playUntilDone);
            })
            .catch(function (e) {
              console.error('Failed to check HTML Template Play Until Done', e);

              item.playUntilDone = false;

              return $q.resolve(false);
            });
        } else {
          return $q.resolve(true);
        }
      };

      factory.addPresentationItem = function (presentation) {
        var playlistItem = factory.newPresentationItem(presentation);

        return factory.initPlayUntilDone(playlistItem, presentation, true)
          .then(function () {
            factory.updatePlaylistItem(playlistItem);
          });
      };

      factory.addPresentationItems = function (presentations) {
        for (var i in presentations) {
          factory.addPresentationItem(presentations[i]);
        }
      };

      factory.getNewUrlItem = function () {
        scheduleTracker('Add URL Item to Schedule',
          scheduleFactory.schedule.id, scheduleFactory.schedule.name
        );

        return {
          duration: DEFAULT_DURATION,
          type: TYPE_URL,
          name: 'URL Item'
        };
      };

      factory.getPlaylist = function () {
        return scheduleFactory.schedule.content ? scheduleFactory.schedule.content :
          scheduleFactory.schedule.content = [];
      };

      var _getItemIndex = function (playlistItem) {
        return factory.getPlaylist() ?
          factory.getPlaylist().indexOf(playlistItem) : -1;
      };

      factory.isNew = function (playlistItem) {
        return _getItemIndex(playlistItem) === -1;
      };

      factory.updatePlaylistItem = function (playlistItem) {
        if (_getItemIndex(playlistItem) === -1) {
          factory.getPlaylist().push(playlistItem);
        }
      };

      factory.removePlaylistItem = function (playlistItem) {
        var index = _getItemIndex(playlistItem);
        if (index !== -1) {
          factory.getPlaylist().splice(index, 1);
        }
      };

      factory.duplicatePlaylistItem = function (playlistItem) {
        var index = _getItemIndex(playlistItem);
        if (index !== -1) {
          var newPlaylistItem = angular.copy(playlistItem);
          newPlaylistItem.name = 'Copy of ' + newPlaylistItem.name;

          factory.getPlaylist().splice(index + 1, 0, newPlaylistItem);
        }
      };

      factory.canPlaylistItemMoveDown = function (playlistItem) {
        var index = _getItemIndex(playlistItem);

        return index > -1 && index < factory.getPlaylist().length - 1;
      };

      factory.canPlaylistItemMoveUp = function (playlistItem) {
        return _getItemIndex(playlistItem) > 0;
      };

      var _moveItem = function (playlistItem, newIndex) {
        var index = _getItemIndex(playlistItem);
        var playlist = factory.getPlaylist();

        playlist.splice(newIndex, 0, playlist.splice(index, 1)[0]);
      };

      factory.movePlaylistItemDown = function (playlistItem) {
        if (factory.canPlaylistItemMoveDown(playlistItem)) {
          _moveItem(playlistItem, _getItemIndex(playlistItem) + 1);
        }
      };

      factory.movePlaylistItemUp = function (playlistItem) {
        if (factory.canPlaylistItemMoveUp(playlistItem)) {
          _moveItem(playlistItem, _getItemIndex(playlistItem) - 1);
        }
      };

      factory.moveItem = function (currIndex, newIndex) {
        var playlist = factory.getPlaylist();

        playlist.splice(newIndex, 0, playlist.splice(currIndex, 1)[0]);
      };

      return factory;
    }
  ]);
