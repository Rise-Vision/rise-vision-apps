'use strict';

angular.module('risevision.template-editor.services')
  .constant('BLUEPRINT_URL', 'https://widgets.risevision.com/stable/templates/PRODUCT_CODE/blueprint.json')
  .constant('HTML_TEMPLATE_URL', 'https://widgets.risevision.com/stable/templates/PRODUCT_CODE/src/template.html')
  .constant('HTML_TEMPLATE_DOMAIN', 'https://widgets.risevision.com')
  .factory('templateEditorFactory', ['$q', '$log', '$state', '$rootScope', '$http', 'presentation',
    'processErrorCode', 'userState', 'checkTemplateAccess', '$modal', 'scheduleFactory', 'plansFactory',
    'templateEditorUtils',
    'HTML_PRESENTATION_TYPE', 'BLUEPRINT_URL', 'REVISION_STATUS_REVISED', 'REVISION_STATUS_PUBLISHED',
    function ($q, $log, $state, $rootScope, $http, presentation, processErrorCode, userState,
      checkTemplateAccess, $modal, scheduleFactory, plansFactory, templateEditorUtils,
      HTML_PRESENTATION_TYPE, BLUEPRINT_URL, REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED) {
      var factory = {};

      var _setPresentation = function (presentation) {
        presentation.templateAttributeData =
          _parseJSON(presentation.templateAttributeData) || {};

        factory.presentation = presentation;
        factory.selected = null;

        $rootScope.$broadcast('presentationUpdated');
      };

      var _getPresentationForUpdate = function () {
        var presentationVal = JSON.parse(JSON.stringify(factory.presentation));

        presentationVal.templateAttributeData =
          JSON.stringify(presentationVal.templateAttributeData);

        return presentationVal;
      };

      var _openExpiredModal = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/template-editor/expired-modal.html',
          controller: 'confirmInstance',
          windowClass: 'madero-style centered-modal',
          resolve: {
            confirmationTitle: function () {
              return 'template.expired-modal.expired-title';
            },
            confirmationMessage: function () {
              return 'template.expired-modal.expired-message';
            },
            confirmationButton: function () {
              return 'template.expired-modal.confirmation-button';
            },
            cancelButton: null
          }
        });

        modalInstance.result.then(function () {
          plansFactory.showPlansModal();
        });
      };

      var _checkTemplateAccess = function (productCode) {
        checkTemplateAccess(productCode)
          .catch(function () {
            _openExpiredModal();
          });
      };

      var _checkFinancialDataLicenseMessage = function (blueprintData) {
        if (templateEditorUtils.needsFinancialDataLicense(factory.blueprintData)) {
          templateEditorUtils.showFinancialDataLicenseRequiredMessage();
        }
      };

      factory.addFromProduct = function (productDetails) {
        _clearMessages();

        factory.selected = null;

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

            _checkFinancialDataLicenseMessage(factory.blueprintData);
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

              $state.go('apps.editor.templates.edit', {
                presentationId: resp.item.id,
                productId: undefined
              }, {
                notify: false,
                location: 'replace'
              }).then(function () {
                scheduleFactory.createFirstSchedule(resp.item.id, resp.item.name);
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
            _checkTemplateAccess(factory.presentation.productCode);

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
            $rootScope.$broadcast('presentationDeleted');

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

      factory.isRevised = function () {
        return factory.presentation.revisionStatusName === REVISION_STATUS_REVISED;
      };

      factory.publishPresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.publish(factory.presentation.id)
          .then(function () {
            factory.presentation.revisionStatusName = REVISION_STATUS_PUBLISHED;
            factory.presentation.changeDate = new Date();
            factory.presentation.changedBy = userState.getUsername();
            $rootScope.$broadcast('presentationPublished');

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('publish', e);

            deferred.reject();
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

        templateEditorUtils.showMessageWindow(factory.errorMessage, factory.apiError);
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

      return factory;
    }
  ]);
