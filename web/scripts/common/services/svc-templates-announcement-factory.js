'use strict';

angular.module('risevision.apps.services')
  .factory('templatesAnnouncementFactory', ['localStorageService', 'userState', 'CachedRequest', 'presentation', '$q',
    '$templateCache', '$modal', 'segmentAnalytics', 'bigQueryLogging', 'CHECK_TEMPLATES_ANNOUNCEMENT',
    function (localStorageService, userState, CachedRequest, presentation, $q, $templateCache, $modal,
      segmentAnalytics, bigQueryLogging, CHECK_TEMPLATES_ANNOUNCEMENT) {
      var dismissedKey = 'templatesAnnouncement.dismissed';
      var factory = {};
      var search = {
        sortBy: 'changeDate',
        reverse: true,
        count: 1,
        filter: 'presentationType:\"HTML Template\"'
      };
      var presentationListReq = new CachedRequest(presentation.list, search);

      factory.showAnnouncementIfNeeded = function () {
        _shouldShowAnnouncement().then(function () {
          var instance = $modal.open({
            template: $templateCache.get('partials/common/templates-announcement-modal.html'),
            controller: 'TemplatesAnnouncementModalCtrl',
            size: 'lg',
            backdrop: 'static', //prevent closing modal by clicking outside
            keyboard: false, //prevent closing modal by pressing escape
          });
          instance.result.then(function (liked) {
            localStorageService.set(dismissedKey, true);

            var eventName = 'Templates Announcement';
            eventName += liked ? ' Thumbs Up' : ' Thumbs Down';
            segmentAnalytics.track(eventName);
            bigQueryLogging.logEvent(eventName);
          });
        });
      };

      var _shouldShowAnnouncement = function () {
        if (CHECK_TEMPLATES_ANNOUNCEMENT !== 'true' || !userState.isEducationCustomer() || _isDismissed() || !_isOlderThan15Days()) {
          return $q.reject();
        }

        var deferred = $q.defer();

        presentationListReq.execute().then(function (resp) {
          var hasAddedHtmlPresentationRecently = resp && resp.items && resp.items.length > 0 &&
            _daysDiff(new Date(), new Date(resp.items[0].changeDate)) < 30;

          if (!hasAddedHtmlPresentationRecently) {
            deferred.resolve();
          } else {
            deferred.reject();
          }
        }).catch(function (e) {
          deferred.reject(e);
        });

        return deferred.promise;
      };

      var _isOlderThan15Days = function () {
        var company = userState.getCopyOfSelectedCompany();
        var creationDate = (company && company.creationDate) ? new Date(company.creationDate) : new Date();
        return _daysDiff(new Date(), creationDate) > 15;
      };

      var _isDismissed = function () {
        return localStorageService.get(dismissedKey) === true;
      };

      var _daysDiff = function (date1, date2) {
        return Math.abs((date1 - date2) / 1000 / 60 / 60 / 24);
      };

      return factory;
    }
  ]);
