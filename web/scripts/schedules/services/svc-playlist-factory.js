'use strict';

angular.module('risevision.schedules.services')
  .constant('TYPE_URL', 'url')
  .constant('TYPE_PRESENTATION', 'presentation')
  .constant('TRANSITION_TYPES', [
    ['normal', 'No transition'],
    ['fadeIn', 'Fade in'],
    ['slideFromLeft', 'Slide from left'],
    ['slideFromRight', 'Slide from right'],
    ['slideFromTop', 'Slide from top'],
    ['slideFromBottom', 'Slide from bottom'],
    ['stripesHorizontal', 'Stripes horizontal'],
    ['stripesVertical', 'Stripes vertical'],
    ['zoomIn', 'Zoom in']
  ])
  .factory('playlistFactory', ['$q', 'scheduleFactory', 'scheduleTracker', 'presentationFactory', 'blueprintFactory',
    'insecureUrl', 'TYPE_URL', 'TYPE_PRESENTATION', 'HTML_PRESENTATION_TYPE', 'TimelineFactory',
    'timelineDescription', 'TRANSITION_TYPES',
    function ($q, scheduleFactory, scheduleTracker, presentationFactory, blueprintFactory, insecureUrl,
      TYPE_URL, TYPE_PRESENTATION, HTML_PRESENTATION_TYPE, TimelineFactory, timelineDescription, TRANSITION_TYPES) {
      var DEFAULT_DURATION = 10;
      var factory = {};

      factory.newPresentationItem = function (presentation) {
        scheduleTracker('Add Presentation to Schedule',
          scheduleFactory.schedule.id, scheduleFactory.schedule.name, {
            presentationId: presentation.id,
            presentationName: presentation.name
          }
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

      factory.moveItem = function (currIndex, newIndex) {
        var playlist = factory.getPlaylist();

        playlist.splice(newIndex, 0, playlist.splice(currIndex, 1)[0]);
      };

      factory.getItemTimeline = function (playlistItem) {
        if (playlistItem.timeDefined) {
          var timeline = TimelineFactory.getTimeline(
            playlistItem.useLocaldate,
            playlistItem.timeDefined,
            playlistItem.startDate,
            playlistItem.endDate,
            playlistItem.startTime,
            playlistItem.endTime,
            playlistItem.recurrenceType,
            playlistItem.recurrenceFrequency,
            playlistItem.recurrenceAbsolute,
            playlistItem.recurrenceDayOfWeek,
            playlistItem.recurrenceDayOfMonth,
            playlistItem.recurrenceWeekOfMonth,
            playlistItem.recurrenceMonthOfYear,
            playlistItem.recurrenceDaysOfWeek);
          return timelineDescription.updateLabel(timeline);
        } else {
          return 'Always';
        }
      };

      factory.getItemTransition = function (playlistItem) {
        var transition = _.find(TRANSITION_TYPES, function (t) {
          return playlistItem.transitionType === t[0];
        });

        return transition ? transition[1] : TRANSITION_TYPES[0][1];
      };

      factory.hasInsecureUrl = function (playlistItem) {
        return !!(playlistItem && playlistItem.type === 'url' && insecureUrl(playlistItem.objectReference));
      };

      return factory;
    }
  ]);
