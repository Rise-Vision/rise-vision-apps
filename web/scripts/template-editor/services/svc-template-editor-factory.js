'use strict';

angular.module('risevision.template-editor.services')
  .constant('HTML_PRESENTATION_TYPE', 'HTML Template')
  .factory('templateEditorFactory', ['$q', '$log', '$state', 'messageBox', 'presentation', 'processErrorCode', 'userState', 'HTML_PRESENTATION_TYPE',
    function ($q, $log, $state, messageBox, presentation, processErrorCode, userState, HTML_PRESENTATION_TYPE) {
      var factory = {};

      factory.addPresentation = function (productDetails) {
        _clearMessages();

        factory.presentation = {
          id: undefined,
          productId: productDetails.productId,
          name: 'Copy of ' + productDetails.name,
          presentationType: HTML_PRESENTATION_TYPE,
          templateAttributeData: {},
          revisionStatusName: undefined,
          isTemplate: false,
          isStoreProduct: false
        };

        $state.go('apps.editor.templates.add');
      };

      factory.getPresentation = function (presentationId) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.get(presentationId)
          .then(function (result) {
            result.item.templateAttributeData = _parseJSON(result.item.templateAttributeData) || {};

            factory.presentation = result.item;

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      var _parseJSON = function (json) {
        try {
          return JSON.parse(json);
        } catch (err) {
          $log.error('Invalid JSON: ' + err);
          return null;
        }
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Presentation.';
        factory.apiError = processErrorCode('Presentation', action, e);

        $log.error(factory.errorMessage, e);

        messageBox(factory.errorMessage, factory.apiError);
      };

      var _clearMessages = function () {
        factory.loadingPresentation = false;
        factory.savingPresentation = false;

        factory.errorMessage = '';
        factory.apiError = '';
      };

      var _init = function () {
        factory.presentation = {};

        _clearMessages();
      };

      _init();

      $log.info('Current user is: ' + userState.getUsername());
      $log.info(factory.presentation);

      return factory;
    }
  ]);
