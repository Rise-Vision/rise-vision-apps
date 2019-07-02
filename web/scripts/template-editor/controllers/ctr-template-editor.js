'use strict';

angular.module('risevision.template-editor.controllers')
  .constant('MINIMUM_INTERVAL_BETWEEN_SAVES', 5000)
  .constant('MAXIMUM_INTERVAL_BETWEEN_SAVES', 20000)
  .controller('TemplateEditorController', ['$scope', '$q', '$filter', '$loading', '$state', '$timeout', '$window',
    'templateEditorFactory', 'userState', 'scheduleFactory', 'presentationUtils', 'MINIMUM_INTERVAL_BETWEEN_SAVES',
    'MAXIMUM_INTERVAL_BETWEEN_SAVES',
    function ($scope, $q, $filter, $loading, $state, $timeout, $window, templateEditorFactory, userState,
      scheduleFactory, presentationUtils, MINIMUM_INTERVAL_BETWEEN_SAVES, MAXIMUM_INTERVAL_BETWEEN_SAVES) {
      var _lastSavedTimestamp = 0,
        _saveTimeout = null;

      $scope.factory = templateEditorFactory;
      $scope.isSubcompanySelected = userState.isSubcompanySelected;
      $scope.isTestCompanySelected = userState.isTestCompanySelected;
      $scope.hasUnsavedChanges = false;

      $scope.considerChromeBarHeight = _considerChromeBarHeight();

      $scope.getBlueprintData = function (componentId, attributeKey) {
        var components = $scope.factory.blueprintData.components;
        var component = _.find(components, {
          id: componentId
        });

        if (!component || !component.attributes) {
          return null;
        }

        var attributes = component.attributes;

        // if the attributeKey is not provided, it returns the full attributes structure
        if (!attributeKey) {
          return attributes;
        }

        var attribute = attributes[attributeKey];
        return attribute && attribute.value;
      };

      $scope.getAttributeData = function (componentId, attributeKey) {
        var component = _componentFor(componentId, false);

        // if the attributeKey is not provided, it returns the full component structure
        return attributeKey ? component[attributeKey] : component;
      };

      $scope.setAttributeData = function (componentId, attributeKey, value) {
        var component = _componentFor(componentId, true);

        component[attributeKey] = value;
      };

      $scope.isPublishDisabled = function () {
        var isNotRevised = !$scope.factory.isRevised() && scheduleFactory.hasSchedules();

        return $scope.factory.savingPresentation || $scope.hasUnsavedChanges || isNotRevised;
      };

      // updateAttributeData: do not update the object on getAttributeData
      // or it will unnecessarily trigger hasUnsavedChanges = true
      function _componentFor(componentId, updateAttributeData) {
        var attributeData = $scope.factory.presentation.templateAttributeData;
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
      }

      function _getCurrentTimestamp() {
        return new Date().getTime();
      }

      function _programSave() {
        _saveTimeout = $timeout(function () {
          _saveTimeout = null;

          // if a previous save hasn't finished, give more time
          if ($scope.factory.savingPresentation) {
            _programSave();
          } else {
            _lastSavedTimestamp = _getCurrentTimestamp();

            $scope.factory.save();
          }
        }, MINIMUM_INTERVAL_BETWEEN_SAVES);
      }

      function _clearSaveTimeout() {
        if (_saveTimeout) {
          $timeout.cancel(_saveTimeout);
          _saveTimeout = null;
        }
      }

      function _reprogramSave() {
        _clearSaveTimeout();
        _programSave();
      }

      var _bypassUnsaved = false,
        _initializing = false;
      var _setUnsavedChanges = function (state) {
        $scope.hasUnsavedChanges = state;

        if ($scope.hasUnsavedChanges) {
          if (_saveTimeout) {
            var elapsed = _getCurrentTimestamp() - _lastSavedTimestamp;

            if (elapsed < MAXIMUM_INTERVAL_BETWEEN_SAVES) {
              _reprogramSave();
            }
          } else {
            _programSave();
          }
        }
      };

      var _setUnsavedChangesAsync = function (state) {
        $timeout(function () {
          _setUnsavedChanges(state);
        });
      };

      function _considerChromeBarHeight() {
        var userAgent = $window.navigator.userAgent;

        // Firefox requires desktop rule
        return presentationUtils.isMobileBrowser() &&
          !(/Firefox/i.test(userAgent));
      }

      $scope.$watch('factory.presentation', function (newValue, oldValue) {
        var ignoredFields = [
          'id', 'companyId', 'revisionStatus', 'revisionStatusName',
          'changeDate', 'changedBy', 'creationDate', 'publish', 'layout'
        ];

        if (!newValue.id) {
          $scope.factory.save();
          return;
        }
        if ($scope.hasUnsavedChanges) {
          return;
        }

        if (_initializing) {
          $timeout(function () {
            _initializing = false;
          });
        } else {
          if (!_.isEqual(_.omit(newValue, ignoredFields), _.omit(oldValue, ignoredFields))) {
            _setUnsavedChanges(true);
          }
        }
      }, true);

      $scope.$on('presentationCreated', _setUnsavedChangesAsync.bind(null, false));
      $scope.$on('presentationUpdated', _setUnsavedChangesAsync.bind(null, false));
      $scope.$on('presentationDeleted', _setUnsavedChanges.bind(null, false));
      $scope.$on('presentationPublished', _setUnsavedChangesAsync.bind(null, false));

      $scope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (_bypassUnsaved) {
          _bypassUnsaved = false;
          return;
        }
        if (toState.name.indexOf('apps.editor.templates') === -1) {
          event.preventDefault();

          _clearSaveTimeout();

          var savePromise = $scope.hasUnsavedChanges ? $scope.factory.save() : $q.resolve();
          var hasSchedules = scheduleFactory.hasSchedules();

          savePromise
          .then(function () {
            if (!hasSchedules) {
              return $scope.factory.publishPresentation();
            }
          })
          .finally(function () {
            // If the modal was displayed we can't navigate away, otherwise it will be closed by apps.js' $modalStack.dismissAll
            if (hasSchedules) {
              _bypassUnsaved = true;
              $state.go(toState, toParams);
            }
          });
        }
      });

      $window.onbeforeunload = function () {
        if ($scope.hasUnsavedChanges) {
          return $filter('translate')('common.saveBeforeLeave');
        }
      };

      $scope.$on('$destroy', function () {
        $window.onbeforeunload = undefined;
      });

      $scope.$watch('factory.loadingPresentation', function (loading) {
        if (loading) {
          $loading.start('template-editor-loader');
        } else {
          $loading.stop('template-editor-loader');
        }
      });
    }
  ]);
