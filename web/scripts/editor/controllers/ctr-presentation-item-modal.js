'use strict';

angular.module('risevision.editor.controllers')
  .controller('PresentationItemModalController', ['$scope', '$log', '$modal',
    '$modalInstance', 'presentationFactory', 'item',
    function ($scope, $log, $modal, $modalInstance, presentationFactory, 
      item) {
      var initialPresentationName;
      $scope.item = angular.copy(item);
      
      if ($scope.item.objectData) {
        $scope.presentationId = $scope.item.objectData;
      }

      $scope.$watch('presentationId', function (id) {
        $scope.apiWarning = false;

        if (id && !$scope.presentationItemFields.presentationId.$error.guid) {
          $scope.item.objectData = id;
          presentationFactory.getPresentationCached(id)
          .then(function(presentation) {
            if (presentation && presentation.name) {
              $scope.presentationName = presentation.name;
            }
          })
          .then(null, function() {
            $scope.showPresentationId = true;
            $scope.presentationName = '';
            $scope.apiWarning = true;
          });
        }
      });

      $scope.$watch("presentationName", function (name) {
        if (name) {
          if (!$scope.item.name || 
              initialPresentationName === $scope.item.name) {
                
            $scope.item.name = name;
          }
          initialPresentationName = name;
        }
      });

      $scope.selectPresentation = function() {
        var modalInstance = $modal.open({
          templateUrl: 'presentation-selector/presentation-modal.html',
          controller: 'selectPresentationModal'
        });

        modalInstance.result.then(function (presentationDetails) {
          $scope.presentationId = presentationDetails[0];
          $scope.presentationName = presentationDetails[1];
        });
      };
      
      $scope.clearSelection = function() {
        $scope.item.objectData = '';
        $scope.presentationId = '';
        $scope.presentationName = '';
        $scope.apiWarning = false;
      }

      $scope.save = function () {
        angular.copy($scope.item, item);

        $log.info('Embedded Presentation saved', item);

        $scope.dismiss();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]); //ctr
