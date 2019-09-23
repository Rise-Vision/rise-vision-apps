'use strict';

angular.module('risevision.common.header')
  .controller('CloseFrameButtonCtrl', [
    '$scope', '$log', 'gadgetsService',
    function ($scope, $log, gadgetsService) {
      $scope.closeIFrame = function () {
        $log.debug('gadgetsService.closeIFrame');
        gadgetsService.closeIFrame();
      };

    }
  ]);
