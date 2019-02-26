'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory', '$templateCache', '$modal',
    function (templateEditorFactory, $templateCache, $modal) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.isEditingName = false;
          $scope.defaultNameValue = templateEditorFactory.presentation.name;
          $scope.defaultNameWidth = '';

          $scope.onPresentationNameBlur = function() {
            $scope.isEditingName = false;
          };

          $scope.$watch('isEditingName', function(editing) {
            var templateNameInput = element.find('input.presentation-name');

            if (!$scope.defaultNameWidth) {
              // first time editing, store the width of the field when default name is displayed
              $scope.defaultNameWidth = templateNameInput[0].style.width;
            }

            if (editing) {
              setFocus(templateNameInput[0]);
            } else {
              var nameVal = templateNameInput[0].value.replace(/\s/g, '');

              if (!nameVal) {
                // user deleted entire name, set the name and width values to the defaults
                $scope.factory.presentation.name = $scope.defaultNameValue;
                templateNameInput[0].style.width = $scope.defaultNameWidth;
              }
            }
          });

          $scope.confirmDelete = function () {
            $scope.modalInstance = $modal.open({
              template: $templateCache.get('partials/template-editor/confirm-modal.html'),
              controller: 'confirmInstance',
              windowClass: 'modal-custom',
              resolve: {
                confirmationMessage: function () {
                  return 'template.confirm-modal.delete-warning';
                },
                confirmationButton: function () {
                  return 'common.delete-forever';
                },
                confirmationTitle: null,
                cancelButton: null
              }
            });

            $scope.modalInstance.result.then(function () {
              $scope.modalInstance.dismiss();
              templateEditorFactory.deletePresentation();
            });
          };

          function setFocus(elem) {
            if (elem !== null) {
              if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', 0);
                range.select();
              } else {
                if (elem.setSelectionRange) {
                  elem.focus();
                  elem.setSelectionRange(0, elem.value.length);
                } else {
                  elem.focus();
                }
              }
            }
          }
        }
      };
    }
  ]);
