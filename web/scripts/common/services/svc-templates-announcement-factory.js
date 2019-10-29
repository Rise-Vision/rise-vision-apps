'use strict';

angular.module('risevision.apps.services')
  .factory('templatesAnnouncementFactory', ['localStorageService', 'userState', 'CachedRequest', 'presentation', '$q',
    '$rootScope', '$templateCache', '$modal',
    function (localStorageService, userState, CachedRequest, presentation, $q, $rootScope, $templateCache, $modal) {
      var presentationListReq = new CachedRequest(presentation.list, {});
      var factory = {};

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _reset();
      });
      $rootScope.$on('risevision.company.updated', function () {
        _reset();
      });

      factory.showTemplatesAnnouncementIfNeeded = function() {
        console.log('showTemplatesAnnouncementIfNeeded');
        if(_shouldShowTemplatesAnnouncement()) {
          var instance = $modal.open({
            template: $templateCache.get('partials/common/templates-announcement-modal.html'),
            controller: 'TemplatesAnnouncementModalCtrl',
            size: 'lg',
            backdrop: 'static', //prevent from closing modal by clicking outside
            keyboard: false, //prevent from closing modal by pressing escape
          });
          instance.result.then(function (liked) {
            console.log('liked',liked);
          });
        }
      };

      var _reset = function () {
        presentationListReq = new CachedRequest(presentation.list, {});
      };

      var _shouldShowTemplatesAnnouncement = function() {
        return true;
      };

      return factory;
    }
  ]);
