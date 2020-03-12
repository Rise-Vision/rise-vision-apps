'use strict';

angular.module('risevision.common.header')
  .controller('CompanyRoleModalCtrl', ['$scope', '$modalInstance', 'user',
    'EDUCATION_COMPANY_ROLE_FIELDS',
    function ($scope, $modalInstance, user, EDUCATION_COMPANY_ROLE_FIELDS) {

      $scope.user = user;
      $scope.COMPANY_ROLE_FIELDS = EDUCATION_COMPANY_ROLE_FIELDS;

      $scope.save = function () {
        $modalInstance.close({
          user: user
        });
      };

    }
  ]);
