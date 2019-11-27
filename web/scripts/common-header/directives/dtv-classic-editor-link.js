'use strict';

angular.module('risevision.common.header.directives')
  .constant('CLASSIC_EDITOR_URL', 'https://rva.risevision.com/#PRESENTATIONS')
  .directive('classicEditorLink', ['$window', 'userState', 'CLASSIC_EDITOR_URL',
    function ($window, userState, CLASSIC_EDITOR_URL) {
      return {
        restrict: 'A',
        scope: true,
        link: function ($scope, elem) {
          var editorLink = elem.find('a');
          
          editorLink.bind('click', function () {
            var companyId = userState.getSelectedCompanyId();
            var url = CLASSIC_EDITOR_URL + (companyId ? '?cid=' + companyId : '');

            $window.open(url, '_blank');
          });

          var _isShowingLink = function() {
            var company = userState.getCopyOfSelectedCompany();
            var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
              new Date()));
            $scope.hideEditorLink = creationDate > new Date('Nov 25, 2019');
          };

          $scope.$on('risevision.company.selectedCompanyChanged', function () {
            _isShowingLink();
          });
        } //link()
      };
    }
  ]);
