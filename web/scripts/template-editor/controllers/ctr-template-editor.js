'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController',
    ['$scope', '$filter', '$loading', '$modal', '$state', '$timeout', '$window', 'templateEditorFactory', 'userState',
    function ($scope, $filter, $loading, $modal, $state, $timeout, $window, templateEditorFactory, userState) {
      $scope.factory = templateEditorFactory;
      $scope.isSubcompanySelected = userState.isSubcompanySelected;
      $scope.isTestCompanySelected = userState.isTestCompanySelected;
      $scope.hasUnsavedChanges = false;

      $scope.getBlueprintData = function(componentId, attributeKey) {
        var components = $scope.factory.blueprintData.components;
        var component = _.find(components, {id: componentId});

        if(!component || !component.attributes) {
          return null;
        }

        var attributes = component.attributes;

        // if the attributeKey is not provided, it returns the full attributes structure
        if(!attributeKey) {
          return attributes;
        }

        var attribute = attributes[attributeKey];
        return attribute && attribute.value;
      };

      $scope.getAttributeData = function(componentId, attributeKey) {
        var component = _componentFor(componentId);

        // if the attributeKey is not provided, it returns the full component structure
        return attributeKey ? component[attributeKey] : component;
      };

      $scope.setAttributeData = function(componentId, attributeKey, value) {
        var component = _componentFor(componentId);

        component[attributeKey] = value;
      };

      function _componentFor(componentId) {
        var attributeData = $scope.factory.presentation.templateAttributeData;

        if(!attributeData.components) {
          attributeData.components = [];
        }

        var component = _.find(attributeData.components, {id: componentId});

        if(!component) {
          component = { id: componentId };

          attributeData.components.push(component);
        }

        return component;
      }

      var _bypassUnsaved = false, _initializing = false;
      var _setUnsavedChanges = function (state) {
        $timeout(function () {
          $scope.hasUnsavedChanges = state;
        });
      };

      $scope.$watch('factory.presentation', function (newValue, oldValue) {
        if ($scope.hasUnsavedChanges) {
          return;
        }
        if (_initializing) {
          $timeout(function () {
            _initializing = false;
          });
        } else {
          if (!_.isEqual(newValue, oldValue)) {
            _setUnsavedChanges(true);
          }
        }
      }, true);

      $scope.$on('presentationCreated', _setUnsavedChanges.bind(null, false));
      $scope.$on('presentationUpdated', _setUnsavedChanges.bind(null, false));
      $scope.$on('presentationDeleted', _setUnsavedChanges.bind(null, false));

      $scope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (_bypassUnsaved) {
          _bypassUnsaved = false;
          return;
        }
        if ($scope.hasUnsavedChanges && toState.name.indexOf('apps.editor.templates') === -1) {
          event.preventDefault();
          var modalInstance = $modal.open({
            templateUrl: 'partials/template-editor/unsaved-changes-modal.html',
            size: 'md',
            controller: 'TemplateEditorUnsavedChangesModalController'
          });
          modalInstance.result.then(function () {
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

      $scope.$watch('factory.loadingPresentation', function(loading) {
        if (loading) {
          $loading.start('template-editor-loader');
        } else {
          $loading.stop('template-editor-loader');
        }
      });
    }
  ]);
