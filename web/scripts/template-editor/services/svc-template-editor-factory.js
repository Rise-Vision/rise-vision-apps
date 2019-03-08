'use strict';

angular.module('risevision.template-editor.services')
  .constant('BLUEPRINT_URL', 'https://widgets.risevision.com/beta/templates/PRODUCT_CODE/blueprint.json')
  .factory('templateEditorFactory', ['$q', '$log', '$state', '$rootScope', '$http', 'messageBox', 'presentation', 'processErrorCode', 'userState',
    'HTML_PRESENTATION_TYPE', 'BLUEPRINT_URL',
    function ($q, $log, $state, $rootScope, $http, messageBox, presentation, processErrorCode, userState,
      HTML_PRESENTATION_TYPE, BLUEPRINT_URL) {
      var factory = {};

      var _setPresentation = function (presentation) {
        presentation.templateAttributeData =
          _parseJSON(presentation.templateAttributeData) || {};

        factory.presentation = presentation;
        factory.selected = null;
      };

      var _getPresentationForUpdate = function() {
        var presentationVal = JSON.parse(JSON.stringify(factory.presentation));

        presentationVal.templateAttributeData =
          JSON.stringify(presentationVal.templateAttributeData);

        return presentationVal;
      }

      factory.createFromTemplate = function (productDetails) {
        _clearMessages();

        factory.presentation = {
          id: undefined,
          productCode: productDetails.productCode,
          name: 'Copy of ' + productDetails.name,
          presentationType: HTML_PRESENTATION_TYPE,
          templateAttributeData: {},
          revisionStatusName: undefined,
          isTemplate: false,
          isStoreProduct: false
        };

        return factory.loadBlueprintData(factory.presentation.productCode)
          .then(function (blueprintData) {
            factory.blueprintData = blueprintData.data;

            $state.go('apps.editor.templates.add');
          })
          .then(null, function (e) {
            _showErrorMessage('add', e);
            return $q.reject(e);
          });
      };

      factory.addPresentation = function () {
        var deferred = $q.defer(),
          presentationVal = _getPresentationForUpdate();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.add(presentationVal)
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              $rootScope.$broadcast('presentationCreated');

              factory.presentation.id = resp.item.id;
              $state.go('apps.editor.templates.add', {
                presentationId: resp.item.id
              });

              deferred.resolve(resp.item.id);
            }
          })
          .then(null, function (e) {
            _showErrorMessage('add', e);

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.updatePresentation = function () {
        var deferred = $q.defer(),
          presentationVal = _getPresentationForUpdate();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.update(presentationVal.id, presentationVal)
          .then(function (resp) {
            _setPresentation(resp.item);
            $rootScope.$broadcast('presentationUpdated');

            deferred.resolve(resp.item.id);
          })
          .then(null, function (e) {
            _showErrorMessage('update', e);

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.save = function () {
        if (factory.presentation.id) {
          return factory.updatePresentation();
        } else {
          return factory.addPresentation();
        }
      };

      factory.getPresentation = function (presentationId) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.get(presentationId)
          .then(function (result) {
            _setPresentation(result.item);

            return factory.loadBlueprintData(factory.presentation.productCode);
          })
          .then(function (blueprintData) {
            factory.blueprintData = blueprintData.data;

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);
            factory.presentation = null;
            factory.blueprintData = null;

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      factory.loadBlueprintData = function (productCode) {
        var url = BLUEPRINT_URL.replace('PRODUCT_CODE', productCode);

        return $http.get(url);
      };

      factory.deletePresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.delete(factory.presentation.id)
          .then(function () {
            factory.presentation = {};

            $state.go('apps.editor.list');
            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('delete', e);
            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
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
