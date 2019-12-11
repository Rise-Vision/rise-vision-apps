'use strict';

angular.module('risevision.editor.controllers')
  .controller('PresentationItemModalController', ['$scope', '$timeout', '$log', '$modal',
    '$modalInstance', 'presentationFactory', 'item', 'PRESENTATION_SEARCH', 'HTML_PRESENTATION_TYPE',
    function ($scope, $timeout, $log, $modal, $modalInstance, presentationFactory,
      item, PRESENTATION_SEARCH, HTML_PRESENTATION_TYPE) {
      var initialPresentationName;
      $scope.item = angular.copy(item);

      var _init = function () {
        if ($scope.item.objectData) {
          $scope.presentationId = $scope.item.objectData;
        } else {
          $scope.selectPresentation();
        }
      };

      $scope.$watch('presentationId', function (id) {
        $scope.presentationItemFields.presentationId.$setValidity('template', true);
        $scope.apiWarning = false;

        if (id && !$scope.presentationItemFields.presentationId.$error.guid) {
          $scope.item.objectData = id;
          presentationFactory.getPresentationCached(id)
            .then(function (presentation) {
              if (presentation && presentation.presentationType === HTML_PRESENTATION_TYPE) {
                $scope.presentationItemFields.presentationId.$setValidity('template', false);                
              }

              if (presentation && presentation.name) {
                $scope.presentationName = presentation.name;
              }
            })
            .then(null, function () {
              $scope.showPresentationId = true;
              $scope.presentationName = '';
              $scope.apiWarning = true;
            });
        }
      });

      $scope.$watch('presentationName', function (name) {
        if (name) {
          if (!$scope.item.name ||
            $scope.item.name === 'Embedded Presentation' ||
            initialPresentationName === $scope.item.name) {

            $scope.item.name = name;
          }
          initialPresentationName = name;
        }
      });

      $scope.selectPresentation = function () {
        PRESENTATION_SEARCH.filter = ' NOT presentationType:\"HTML Template\"';
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/presentation-selector-modal.html',
          controller: 'PresentationSelectorModal'
        });

        $timeout(function () {
          PRESENTATION_SEARCH.filter = '';
        });

        modalInstance.result.then(function (presentationDetails) {
          $scope.presentationId = presentationDetails[0];
          $scope.presentationName = presentationDetails[1];
        });
      };

      $scope.clearSelection = function () {
        $scope.item.objectData = '';
        $scope.presentationId = '';
        $scope.presentationName = '';
        $scope.apiWarning = false;
      };

      $scope.save = function () {
        angular.copy($scope.item, item);

        $log.info('Embedded Presentation saved', item);

        $modalInstance.close();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      _init();
    }
  ]); //ctr
