'use strict';

angular.module('risevision.template-editor.controllers')
  .controller('TemplateEditorController', ['$scope', '$q', '$filter', '$loading', '$state', '$timeout', '$window',
    'templateEditorFactory', 'AutoSaveService',
    'presentationUtils', 'componentsFactory', 'userState',
    function ($scope, $q, $filter, $loading, $state, $timeout, $window, templateEditorFactory,
      AutoSaveService, presentationUtils, componentsFactory, userState) {
      var autoSaveService = new AutoSaveService(templateEditorFactory.save);

      $scope.templateEditorFactory = templateEditorFactory;
      $scope.componentsFactory = componentsFactory;
      templateEditorFactory.hasUnsavedChanges = false;

      $scope.considerChromeBarHeight = _considerChromeBarHeight();

      $scope.hasContentEditorRole = function () {
        return userState.hasRole('ce');
      };

      var _bypassUnsaved = false,
        _initializing = false;
      var _setUnsavedChanges = function (state) {
        templateEditorFactory.hasUnsavedChanges = state;

        if (templateEditorFactory.hasUnsavedChanges && $scope.hasContentEditorRole()) {
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

      $scope.$watch('templateEditorFactory.presentation', function (newValue, oldValue) {
        if (!$scope.hasContentEditorRole()) {
          return;
        }
        var ignoredFields = [
          'id', 'companyId', 'revisionStatus', 'revisionStatusName',
          'changeDate', 'changedBy', 'creationDate', 'publish', 'layout'
        ];

        if (!newValue.id) {
          templateEditorFactory.save();
          return;
        }
        if (templateEditorFactory.hasUnsavedChanges) {
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

          var savePromise = templateEditorFactory.isUnsaved() && $scope.hasContentEditorRole() ? templateEditorFactory.save() :
            $q.resolve();

          savePromise
            .finally(function () {
              _bypassUnsaved = true;
              $state.go(toState, toParams);
            });
        }
      });

      $window.onbeforeunload = function () {
        if (templateEditorFactory.isUnsaved()) {
          return $filter('translate')('common.saveBeforeLeave');
        }
      };

      $scope.$on('$destroy', function () {
        $window.onbeforeunload = undefined;
      });

      $scope.$watch('templateEditorFactory.loadingPresentation', function (loading) {
        if (loading) {
          $loading.start('template-editor-loader');
        } else {
          $loading.stop('template-editor-loader');
        }
      });
    }
  ]);
