'use strict';

angular.module('risevision.editor.services')
  .factory('presentationFactory', ['$q', 'presentation',
    function ($q, presentation) {
      var factory = {};

      var _presentations = [];
      factory.loadingPresentation = false;
      factory.apiError = '';

      factory.getPresentationCached = function (presentationId) {
        var presentation = _.find(_presentations, {
          id: presentationId
        });

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
            _presentations.push(result.item);

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
