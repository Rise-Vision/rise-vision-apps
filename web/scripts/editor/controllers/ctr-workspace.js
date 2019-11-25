'use strict';

angular.module('risevision.editor.controllers')
  .value('IGNORE_FIELDS', [
    'revisionStatusName',
    'changeDate',
    'changedBy',
    'statusMessage',
    'subscriptionStatus'
  ])
  .controller('WorkspaceController', ['$scope', 'editorFactory',
    'artboardFactory', 'placeholderFactory', '$modal',
    '$templateCache', '$location', '$stateParams', '$window', 'RVA_URL',
    'IGNORE_FIELDS', '$timeout', '$state', '$filter', 'userState',
    function ($scope, editorFactory, artboardFactory, placeholderFactory,
      $modal, $templateCache, $location, $stateParams, $window,
      RVA_URL, IGNORE_FIELDS, $timeout, $state, $filter, userState) {
      $scope.factory = editorFactory;
      $scope.artboardFactory = artboardFactory;
      $scope.placeholderFactory = placeholderFactory;
      $scope.hasUnsavedChanges = false;

      $scope.hasContentEditorRole = function () {
        return userState.hasRole('ce');
      };

      var _isEqualIgnoringFields = function (o1, o2) {
        if (typeof o1 === 'object') {
          if (typeof o2 === 'object') {
            if (angular.isArray(o1)) {
              if (!angular.isArray(o2)) {
                return false;
              }
              if (o1.length !== o2.length) {
                return false;
              }
              for (var k = 0; k < o1.length; k++) {
                if (!_isEqualIgnoringFields(o1[k], o2[k])) {
                  return false;
                }
              }
              return true;
            } else {
              for (var j in o1) {
                if (IGNORE_FIELDS.indexOf(j) === -1 && j.charAt(0) !== '$') {
                  if (!_isEqualIgnoringFields(o1[j], o2[j])) {
                    return false;
                  }
                }
              }
              return true;
            }
          } else {
            return false;
          }
        } else {
          return angular.equals(o1, o2);
        }
      };

      var _initializing = true;
      $scope.$watch('factory.presentation', function (newValue, oldValue) {
        if ($scope.hasUnsavedChanges) {
          return;
        }
        if (_initializing) {
          $timeout(function () {
            _initializing = false;
          });
        } else {
          if (!_isEqualIgnoringFields(newValue, oldValue)) {
            $scope.hasUnsavedChanges = true;
          }
        }
      }, true);

      $scope.$on('presentationUpdated', function () {
        $timeout(function () {
          $scope.hasUnsavedChanges = false;
        });
      });

      $scope.$on('presentationDeleted', function () {
        $scope.hasUnsavedChanges = false;
      });

      var _bypass = false;
      $scope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (_bypass) {
          _bypass = false;
          return;
        }
        if ($scope.hasUnsavedChanges && $scope.hasContentEditorRole() && (toState.name !==
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
        if ($scope.hasUnsavedChanges && $scope.hasContentEditorRole()) {
          return $filter('translate')('common.saveBeforeLeave');
        }
      };

      $scope.$on('$destroy', function () {
        $window.onbeforeunload = undefined;
      });

      $scope.$watch('factory.hasLegacyItems', function (newValue) {
        if (newValue) {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'partials/components/confirm-modal/confirm-modal.html'),
            controller: 'confirmModalController',
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
