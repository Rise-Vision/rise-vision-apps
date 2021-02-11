'use strict';

angular.module('risevision.editor.services')
  .factory('presentationFactory', ['$q', 'presentation',
    function ($q, presentation) {
      var factory = {};

      var _presentations = [];
      factory.loadingPresentation = false;
      factory.apiError = '';

      var _find = function (presentationId) {
        return _.find(_presentations, {
          id: presentationId
        });
      };

      factory.setPresentation = function (presentation) {
        if (presentation.id && !_find(presentation.id)) {
          _presentations.push(presentation);
        }
      };

      factory.getPresentationCached = function (presentationId) {
        var presentation = _find(presentationId);

        if (presentation) {
          return $q.resolve(presentation);
        } else {
          return _getPresentation(presentationId);
        }
      };

      var _getPresentation = function (presentationId) {
        var deferred = $q.defer();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.get(presentationId)
          .then(function (result) {
            factory.setPresentation(result.item);

            deferred.resolve(result.item);
          })
          .then(null, function (e) {
            factory.apiError = e.message ? e.message : e.toString();

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      return factory;
    }
  ]);
