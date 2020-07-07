'use strict';

angular.module('risevision.template-editor.services')
  .constant('HTML_TEMPLATE_DOMAIN', 'https://widgets.risevision.com')
  .factory('templateEditorFactory', ['$q', '$log', '$state', '$rootScope', 'presentation',
    'processErrorCode', 'userState', 'createFirstSchedule',
    'templateEditorUtils', 'brandingFactory', 'blueprintFactory', 'scheduleFactory', 'presentationTracker',
    'HTML_PRESENTATION_TYPE', 'REVISION_STATUS_REVISED', 'REVISION_STATUS_PUBLISHED', '$modal',
    function ($q, $log, $state, $rootScope, presentation, processErrorCode, userState,
      createFirstSchedule, templateEditorUtils, brandingFactory, blueprintFactory, scheduleFactory,
      presentationTracker, HTML_PRESENTATION_TYPE, REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED, $modal) {
      var factory = {
        hasUnsavedChanges: false
      };

      var _setPresentation = function (presentation, isUpdate) {

        if (isUpdate) {
          factory.presentation.id = presentation.id;
          factory.presentation.companyId = presentation.companyId;
          factory.presentation.revisionStatus = presentation.revisionStatus;
          factory.presentation.revisionStatusName = presentation.revisionStatusName;
          factory.presentation.creationDate = presentation.creationDate;
          factory.presentation.changeDate = presentation.changeDate;
          factory.presentation.changedBy = presentation.changedBy;
        } else {
          presentation.templateAttributeData =
            _parseJSON(presentation.templateAttributeData) || {};

          factory.presentation = presentation;
        }

        $rootScope.$broadcast('presentationUpdated');
      };

      var _getPresentationForUpdate = function () {
        var presentationVal = JSON.parse(JSON.stringify(factory.presentation));

        presentationVal.templateAttributeData =
          JSON.stringify(presentationVal.templateAttributeData);

        return presentationVal;
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

        presentationTracker('HTML Template Copied', productDetails.productCode, productDetails.name);

        return blueprintFactory.getBlueprintCached(factory.presentation.productCode)
          .then(factory.save)
          .then(null, function (e) {
            _showErrorMessage('add', e);
            return $q.reject(e);
          });
      };

      factory.addPresentation = function () {
        var presentationVal = _getPresentationForUpdate();

        return presentation.add(presentationVal)
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              $rootScope.$broadcast('presentationCreated');

              _setPresentation(resp.item);

              presentationTracker('Presentation Created', resp.item.id, resp.item.name, {
                presentationType: 'HTML Template',
                sharedTemplate: resp.item.productCode
              });

              $state.go('apps.editor.templates.edit', {
                presentationId: resp.item.id,
                productId: undefined,
                skipAccessNotice: true
              }, {
                location: 'replace'
              });

              return $q.resolve(resp.item.id);
            }
          });
      };

      factory.updatePresentation = function () {
        if (!factory.hasUnsavedChanges) {
          //Factory has no Changes.
          return $q.resolve();
        }

        var presentationVal = _getPresentationForUpdate();

        return presentation.update(presentationVal.id, presentationVal)
          .then(function (resp) {
            presentationTracker('Presentation Updated', resp.item.id, resp.item.name);

            _setPresentation(resp.item, true);

            return $q.resolve(resp.item.id);
          });
      };

      factory.isUnsaved = function () {
        return !!(factory.hasUnsavedChanges || brandingFactory.hasUnsavedChanges);
      };

      factory.save = function () {
        var deferred = $q.defer(),
          saveFunction;

        if (factory.presentation.id) {
          saveFunction = factory.updatePresentation;
        } else {
          saveFunction = factory.addPresentation;
        }

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        $q.all([brandingFactory.saveBranding(), saveFunction()])
          .then(function () {
            deferred.resolve();
          })
          .then(null, function (e) {
            // If adding, and there is a Presentation Id it means save was successful
            // and the failure was to update Branding
            _showErrorMessage(factory.presentation.id ? 'update' : 'add', e);

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };


      factory.getPresentation = function (presentationId) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.get(presentationId)
          .then(function (result) {
            _setPresentation(result.item);

            return blueprintFactory.getBlueprintCached(factory.presentation.productCode);
          })
          .then(function () {
            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);
            factory.presentation = null;
            blueprintFactory.blueprintData = null;

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      factory.deletePresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.delete(factory.presentation.id)
          .then(function () {
            presentationTracker('Presentation Deleted', factory.presentation.id, factory.presentation.name);

            $rootScope.$broadcast('presentationDeleted');

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

      factory.isRevised = function () {
        return factory.presentation.revisionStatusName === REVISION_STATUS_REVISED;
      };

      factory.isPublishDisabled = function () {
        var isNotRevised = !factory.isRevised() && !brandingFactory.isRevised() &&
          scheduleFactory.hasSchedules();

        return factory.savingPresentation || factory.isUnsaved() || isNotRevised;
      };

      factory.publish = function () {
        return _checkAssignedToSchedules().then(_publish);
      };

      var _checkAssignedToSchedules = function() {
        if (!scheduleFactory.hasSchedules()) {
          return $q.resolve();
        }
        var modalInstance = $modal.open({
          templateUrl: 'partials/template-editor/add-to-schedule-modal.html',
          controller: 'AddToScheduleModalController',
          windowClass: 'madero-style centered-modal',
          size: 'sm'
        });
        return modalInstance.result;
      };

      var _publish = function () {        
        var deferred = $q.defer();

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        $q.all([brandingFactory.publishBranding(), _publishPresentation()])
          .then(function () {
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

      factory.getAttributeData = function (componentId, attributeKey) {
        if (!componentId) {
          return null;
        }

        var component = _componentFor(componentId, false);

        // if the attributeKey is not provided, it returns the full component structure
        return attributeKey ? component[attributeKey] : component;
      };

      factory.setAttributeData = function (componentId, attributeKey, value) {
        if (!componentId) {
          return null;
        }

        var component = _componentFor(componentId, true);

        component[attributeKey] = value;
      };

      // updateAttributeData: do not update the object on getAttributeData
      // or it will unnecessarily trigger hasUnsavedChanges = true
      var _componentFor = function (componentId, updateAttributeData) {
        var attributeData = factory.presentation.templateAttributeData;
        var component;

        if (attributeData.components) {
          component = _.find(attributeData.components, {
            id: componentId
          });
        } else if (updateAttributeData) {
          attributeData.components = [];
        }

        if (!component) {
          component = {
            id: componentId
          };

          if (updateAttributeData) {
            attributeData.components.push(component);
          }
        }

        return component;
      };

      var _publishPresentation = function () {
        if (!factory.isRevised()) {
          // template is already published
          return _createFirstSchedule();
        }

        return presentation.publish(factory.presentation.id)
          .then(function () {
            presentationTracker('Presentation Published', factory.presentation.id, factory.presentation.name);

            factory.presentation.revisionStatusName = REVISION_STATUS_PUBLISHED;
            factory.presentation.changeDate = new Date();
            factory.presentation.changedBy = userState.getUsername();
            $rootScope.$broadcast('presentationPublished');

            return _createFirstSchedule();
          });
      };

      var _createFirstSchedule = function () {
        return createFirstSchedule(factory.presentation)
          .catch(function (err) {
            return err === 'Already have Schedules' ? $q.resolve() : $q.reject(err);
          });
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
