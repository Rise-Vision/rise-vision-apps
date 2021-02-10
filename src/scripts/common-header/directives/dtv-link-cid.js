'use strict';

angular.module('risevision.common.header.directives')
  .directive('linkCid', ['userState',
    function (userState) {
      return {
        link: function ($scope, ele, attr) {

          var linkCompanyId = '';

          var updateLinkCompanyId = function (companyId) {
            var index = attr.href.indexOf('cid=');
            var value;
            if (index > -1) {
              value = attr.href.substring(0, index + 4) + companyId;
            } else {
              value = attr.href +
                (attr.href.indexOf('?') === -1 ? '?' : '&') +
                'cid=' + companyId;
            }
            linkCompanyId = companyId;
            attr.$set('href', value);
          };

          $scope.$watch(function () {
            return userState.getSelectedCompanyId();
          }, function (newValue) {
            if (newValue && newValue !== linkCompanyId) {
              updateLinkCompanyId(newValue);
            }
          });
        }
      };
    }
  ]);
