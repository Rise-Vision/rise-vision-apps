(function (angular) {

  'use strict';

  angular.module('risevision.common.components.userstate')

    .run(['$rootScope', 'userState', 'selectedCompanyUrlHandler',
      function ($rootScope, userState, selectedCompanyUrlHandler) {
        $rootScope.$on('risevision.company.selectedCompanyChanged',
          function (newCompanyId) {
            if (newCompanyId) {
              selectedCompanyUrlHandler.updateUrl();
            }
          });

        //detect selectCompany changes on route UI
        $rootScope.$on('$stateChangeSuccess', selectedCompanyUrlHandler.updateSelectedCompanyFromUrl);
        $rootScope.$on('$routeChangeSuccess', selectedCompanyUrlHandler.updateSelectedCompanyFromUrl);
        $rootScope.$on('$locationChangeSuccess', selectedCompanyUrlHandler.locationChangeSuccess);
      }
    ])

    .service('selectedCompanyUrlHandler', ['$state', '$stateParams',
      '$location', 'userState',
      function ($state, $stateParams, $location, userState) {
        // Called when the selectedCompanyId is changed
        this.updateUrl = function () {
          var selectedCompanyId = userState.getSelectedCompanyId();
          // This parameter is only appended to the url if the user is logged in
          // Do not apply during $state.trasition (handler will)
          if (selectedCompanyId && $location.search().cid !==
            selectedCompanyId && !$state.transition) {
            $stateParams.cid = selectedCompanyId;
            $state.params.cid = selectedCompanyId;

            $location.search('cid', selectedCompanyId);
          }
        };

        this.updateSelectedCompanyFromUrl = function () {
          var newCompanyId = $location.search().cid;

          if (newCompanyId && userState.getUserCompanyId() &&
            newCompanyId !== userState.getSelectedCompanyId()) {
            // The CID is changed in the URL; switch company
            userState.switchCompany(newCompanyId);
          } else if (!newCompanyId && userState.getSelectedCompanyId()) {
            // The CID is missing in the URL; add it
            var currentURL = $location.absUrl();

            $stateParams.cid = userState.getSelectedCompanyId();
            $state.params.cid = userState.getSelectedCompanyId();

            $location.search('cid', userState.getSelectedCompanyId());
            if (currentURL === $location.destUrl) {
              // see explanation below
              $location.replace();
            }
          }
        };

        this.locationChangeSuccess = function (event, newUrl) {
          $location.destUrl = newUrl;
        };

        /*

        Explanation for the usage of the $location.replace() above
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        Scenario 1: When application is using 'ng-href' directive, then application goes through the following cycle

          $locationChangeSuccess -> $stateChangeSuccess -> $locationChangeSuccess

        Scenario 2: When application is using 'ui-sref' directive or '$state.go' funtion, then application goes through the following cycle

          $stateChangeSuccess -> $locationChangeSuccess

        Here is the dilemma:
        - without $location.replace(), scenarion #2 works as expected creating single entries in the browser navigation history, 
        however scenario #1 creates duplicate entries - one URL without 'cid' parameter and with 'cid'.
        - with $location.replace(), scenarion #2 does not add any entries to the browser navigation history, 
        however scenario #1 works as expected.
        
        The solution is to monitor $locationChangeSuccess events and record 'newUrl' parameter, then use it in $stateChangeSuccess event
        in order to detect if pattern falls under scenario 1 or 2 then call $location.replace() based on that condition.

        */

      }
    ]);
})(angular);
