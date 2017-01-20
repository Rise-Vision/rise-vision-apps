'use strict';

angular.module('risevision.schedules.services')
  .constant('TYPE_URL', 'url')
  .constant('TYPE_PRESENTATION', 'presentation')
  .factory('playlistFactory', ['scheduleFactory', 'scheduleTracker',
    'TYPE_URL', 'TYPE_PRESENTATION',
    function (scheduleFactory, scheduleTracker, TYPE_URL, TYPE_PRESENTATION) {
      var DEFAULT_DURATION = 10;
      var factory = {};

      factory.getNewPresentationItem = function () {
        scheduleTracker('Add Presentation to Schedule',
          scheduleFactory.schedule.id, scheduleFactory.schedule.name
        );

        return {
          duration: DEFAULT_DURATION,
          type: TYPE_PRESENTATION
        };
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

      return factory;
    }
  ]);
