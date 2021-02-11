'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController', ['$scope', '$q', '$filter', '$loading', '$state', '$timeout', '$window',
    'templateEditorFactory', 'blueprintFactory', 'AutoSaveService',
    'presentationUtils', 'userState',
    function ($scope, $q, $filter, $loading, $state, $timeout, $window, templateEditorFactory,
      blueprintFactory, AutoSaveService, presentationUtils, userState) {
      var autoSaveService = new AutoSaveService(templateEditorFactory.save);

      $scope.factory = templateEditorFactory;
      $scope.factory.hasUnsavedChanges = false;

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

      $scope.getAttributeDataGlobal = function (attributeKey) {
        return templateEditorFactory.getAttributeDataGlobal(attributeKey);
      };

      $scope.setAttributeDataGlobal = function (attributeKey, value) {
        templateEditorFactory.setAttributeDataGlobal(attributeKey, value);
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

      $scope.hasContentEditorRole = function () {
        return userState.hasRole('ce');
      };

      var _bypassUnsaved = false,
        _initializing = false;
      var _setUnsavedChanges = function (state) {
        $scope.factory.hasUnsavedChanges = state;

        if ($scope.factory.hasUnsavedChanges && $scope.hasContentEditorRole()) {
          autoSaveService.save();
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
        if (!$scope.hasContentEditorRole()) {
          return;
        }
        var ignoredFields = [
          'id', 'companyId', 'revisionStatus', 'revisionStatusName',
          'changeDate', 'changedBy', 'creationDate', 'publish', 'layout'
        ];

        if (!newValue.id) {
          $scope.factory.save();
          return;
        }
        if ($scope.factory.hasUnsavedChanges) {
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

      $scope.$on('risevision.template-editor.brandingUnsavedChanges', _setUnsavedChangesAsync.bind(null, true));

      $scope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (_bypassUnsaved) {
          _bypassUnsaved = false;
          return;
        }
        if (toState.name.indexOf('apps.editor.templates') === -1) {
          event.preventDefault();

          autoSaveService.clearSaveTimeout();

          var savePromise = $scope.factory.isUnsaved() && $scope.hasContentEditorRole() ? $scope.factory.save() :
            $q.resolve();

          savePromise
            .finally(function () {
              _bypassUnsaved = true;
              $state.go(toState, toParams);
            });
        }
      });

      $window.onbeforeunload = function () {
        if ($scope.factory.isUnsaved()) {
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
