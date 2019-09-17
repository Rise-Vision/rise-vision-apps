'use strict';

angular.module('risevision.template-editor.controllers')
  .constant('MINIMUM_INTERVAL_BETWEEN_SAVES', 5000)
  .constant('MAXIMUM_INTERVAL_BETWEEN_SAVES', 20000)
  .controller('TemplateEditorController', ['$scope', '$q', '$filter', '$loading', '$state', '$timeout', '$window',
    'templateEditorFactory', 'brandingFactory', 'blueprintFactory', 'scheduleFactory', 'presentationUtils',
    'MINIMUM_INTERVAL_BETWEEN_SAVES', 'MAXIMUM_INTERVAL_BETWEEN_SAVES',
    function ($scope, $q, $filter, $loading, $state, $timeout, $window, templateEditorFactory, brandingFactory,
      blueprintFactory, scheduleFactory, presentationUtils,
      MINIMUM_INTERVAL_BETWEEN_SAVES, MAXIMUM_INTERVAL_BETWEEN_SAVES) {
      var _lastSavedTimestamp = 0,
        _saveTimeout = null;

      $scope.factory = templateEditorFactory;
      $scope.hasUnsavedChanges = false;

      $scope.considerChromeBarHeight = _considerChromeBarHeight();

      $scope.getBlueprintData = function (componentId, attributeKey) {
        return blueprintFactory.getBlueprintData(componentId, attributeKey);
      };

      $scope.getAttributeData = function (componentId, attributeKey) {
        return templateEditorFactory.getAttributeData(componentId, attributeKey);
      };

      $scope.setAttributeData = function (componentId, attributeKey, value) {
        templateEditorFactory.setAttributeData(componentId, attributeKey, value);
      };

      $scope.getAvailableAttributeData = function (componentId, attributeName) {
        var result = $scope.getAttributeData(componentId, attributeName);

        if (angular.isUndefined(result)) {
          result = $scope.getBlueprintData(componentId, attributeName);
        }

        return result;
      };

      $scope.getComponentIds = function (filter) {
        var components = blueprintFactory.blueprintData.components;

        var filteredComponents = _.filter(components, filter);

        return _.map(filteredComponents, function (component) {
          return component.id;
        });
      };

      $scope.isPublishDisabled = function () {
        var isNotRevised = !$scope.factory.isRevised() && !brandingFactory.isRevised() &&
          scheduleFactory.hasSchedules();

        return $scope.factory.savingPresentation || $scope.hasUnsavedChanges || isNotRevised;
      };

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

        // Firefox and Samsung browser require desktop rule
        return presentationUtils.isMobileBrowser() &&
          !(/Firefox|SamsungBrowser/i.test(userAgent));
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

          savePromise
            .finally(function () {
              _bypassUnsaved = true;
              $state.go(toState, toParams);
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
