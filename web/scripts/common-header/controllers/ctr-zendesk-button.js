'use strict';

angular.module('risevision.common.header')
  .controller('ZendeskButtonCtrl', ['$scope', 'zendesk',
    function ($scope, zendesk) {
      $scope.showZendeskWidget = function () {
        zendesk.activateWidget();
      };
    }
  ]);
