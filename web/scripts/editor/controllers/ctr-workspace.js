'use strict';

angular.module('risevision.editor.controllers')
  .controller('WorkspaceController', ['$scope', 'editorFactory',
    'placeholderFactory', 'userState', '$modal', '$templateCache',
    '$location', '$stateParams', '$window', 'RVA_URL', '$timeout', '$state',
    '$filter',
    function ($scope, editorFactory, placeholderFactory, userState, $modal,
      $templateCache, $location, $stateParams, $window, RVA_URL, $timeout,
      $state, $filter) {
      $scope.factory = editorFactory;
      $scope.placeholderFactory = placeholderFactory;
      $scope.isSubcompanySelected = userState.isSubcompanySelected;
      $scope.isTestCompanySelected = userState.isTestCompanySelected;
      $scope.hasUnsavedChanges = false;

      var _initializing = true;
      $scope.$watch('factory.presentation', function (newValue, oldValue) {
        if (_initializing) {
          $timeout(function () {
            _initializing = false;
          });
        } else {
          $scope.hasUnsavedChanges = true;
        }
      }, true);

      $scope.$on('presentationUpdated', function () {
        $timeout(function () {
          $scope.hasUnsavedChanges = false;
        });
      });

      var _bypass = false;
      $scope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (_bypass) {
          _bypass = false;
          return;
        }
        if ($scope.hasUnsavedChanges && (toState.name !==
            'apps.editor.workspace.artboard' && toState.name !==
            'apps.editor.workspace.htmleditor')) {
          event.preventDefault();
          var modalInstance = $modal.open({
            templateUrl: 'partials/editor/unsaved-changes-modal.html',
            size: 'md',
            controller: 'UnsavedChangesModalController'
          });
          modalInstance.result.then(function () {
            _bypass = true;
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

      $scope.changeTemplate = function() {
        $scope.hasUnsavedChanges = false;
        $state.go('apps.editor.add');
      };

      $scope.$watch('factory.hasLegacyItems', function (newValue) {
        if (newValue) {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'confirm-instance/confirm-modal.html'),
            controller: 'confirmInstance',
            windowClass: 'modal-custom',
            resolve: {
              confirmationTitle: function () {
                return 'editor-app.workspace.legacyWarning.title';
              },
              confirmationMessage: function () {
                return 'editor-app.workspace.legacyWarning.message';
              },
              confirmationButton: function () {
                var confirmation =
                  'editor-app.workspace.legacyWarning.confirmation';
                return confirmation;
              },
              cancelButton: null
            }
          });
          $scope.modalInstance.result.then(function () {
            $window.location.href = RVA_URL +
              '/#/PRESENTATION_MANAGE/id=' + $stateParams.presentationId +
              '?cid=' + $location.search().cid;
          });
        }
      });
    }
  ]); //ctr
