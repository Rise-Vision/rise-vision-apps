'use strict';

angular.module('risevision.common.header', [
    'ui.router',
    'risevision.apps.partials',
    'risevision.common.account',
    'risevision.common.gapi',
    'risevision.common.config',
    'risevision.core.company',
    'risevision.common.cookie',
    'risevision.common.header.directives',
    'risevision.common.header.filters',
    'risevision.common.header.services',
    'risevision.common.i18n',
    'risevision.core.countries',
    'risevision.store.authorization',
    'risevision.store.services',
    'risevision.common.geodata',
    'risevision.store.data-gadgets',
    'risevision.core.userprofile',
    'risevision.common.registration',
    'checklist-model',
    'ui.bootstrap', 'ngSanitize', 'ngCsv', 'ngTouch', 'ngTagsInput',
    'risevision.common.components.action-sheet',
    'risevision.common.components.off-canvas-nav',
    'risevision.common.components.userstate',
    'risevision.common.components.last-modified',
    'risevision.common.components.loading',
    'risevision.common.components.search-filter',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.stop-event',
    'risevision.common.components.logging',
    'risevision.common.components.message-box',
    'risevision.common.components.confirm-modal',
    'risevision.common.components.svg',
    'risevision.common.components.subscription-status',
    'risevision.common.components.plans',
    'risevision.common.components.purchase-flow',
    'risevision.common.support'
  ])

  .factory('bindToScopeWithWatch', [

    function () {
      return function (fnToWatch, scopeVar, scope) {
        scope.$watch(function () {
            return fnToWatch.call();
          },
          function (val) {
            scope[scopeVar] = val;
          });
      };
    }
  ])

  .value('ENV_NAME', '')

  // Fix issue with modal closing when clicking inside the modal, dragging the
  // mouse button and releasing it outside
  // https://github.com/angular-ui/bootstrap/issues/5810#issuecomment-486149448
  .run(['$rootScope', '$document', '$modalStack',
    function ($rootScope, $document, $modalStack) {
      // abort for unit tests
      if ($document[0] && $document[0].querySelectorAll) {
        $rootScope.$watch(function () {
          return $document[0].querySelectorAll('.modal').length;
        }, function (numberOfModals) {
          // Sometimes there are other elements with the .modal class
          var top = $modalStack.getTop();

          if (numberOfModals > 0 && top) {
            $document[0].querySelectorAll('.modal').forEach(function (modal) {
              if (top.value.backdrop !== 'static') { // Don't bother with static modals
                modal.addEventListener('mousedown', function (e) {
                  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which
                  var leftButton = 1;
                  if (e.which === leftButton) {
                    $modalStack.getTop().key.dismiss();
                  }
                });

                // Sometimes there are other elements with the .modal class that don't have .modal-content
                var modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                  modalContent.addEventListener('mousedown', function (e) {
                    e.stopPropagation();
                  });
                }
              }
            });

            top.value.backdrop = 'static';
          }
        });
      }
    }
  ])

  .directive('commonHeader', ['$rootScope', '$q', '$loading',
    '$interval', '$log',
    '$templateCache', 'userState', '$location', 'bindToScopeWithWatch',
    '$document', 'cookieTester', 'companyIcpFactory', 'ENV_NAME', '$window', 'APPS_URL',
    function ($rootScope, $q, $loading, $interval,
      $log, $templateCache, userState, $location,
      bindToScopeWithWatch, $document, cookieTester, companyIcpFactory,
      ENV_NAME, $window, APPS_URL) {
      return {
        restrict: 'E',
        template: $templateCache.get('partials/common-header/common-header.html'),
        scope: false,
        link: function ($scope, element, attr) {
          companyIcpFactory.init();
          cookieTester.checkCookies().then(function () {
            $scope.cookieEnabled = true;
          }, function () {
            $scope.cookieEnabled = false;
          });
          $scope.navCollapsed = true;
          $scope.inRVAFrame = userState.inRVAFrame();
          $scope.isSubcompanySelected = userState.isSubcompanySelected;
          $scope.isTestCompanySelected = userState.isTestCompanySelected;
          $scope.ENV_NAME = ENV_NAME;

          // If nav options not provided use defaults
          if (!$scope[attr.navOptions]) {
            $scope.navOptions = [{
              title: 'Home',
              link: '#/'
            }, {
              title: 'Account',
              link: ''
            }, {
              title: 'Sellers',
              link: ''
            }, {
              title: 'Platform',
              link: 'http://rva.risevision.com/',
              target: '_blank'
            }];
          }

          //default to true
          $scope.hideHelpMenu = attr.hideHelpMenu !== '0' &&
            attr.hideHelpMenu !== 'false';

          $scope.isApps = function () {
            return APPS_URL === '' || $window.location.href.startsWith(APPS_URL);
          };

          // used by userState; determines if the URL root is used for
          // Authentication redirect
          $rootScope.redirectToRoot = attr.redirectToRoot !== '0' &&
            attr.redirectToRoot !== 'false';

          // disable opening home page in new tab (default true)
          $rootScope.newTabHome = attr.newTabHome !== '0' &&
            attr.newTabHome !== 'false';

          bindToScopeWithWatch(userState.isRiseVisionUser, 'isRiseVisionUser',
            $scope);

          $rootScope.$on('$stateChangeSuccess', function () {
            if ($scope.inRVAFrame) {
              $location.search('inRVA', $scope.inRVAFrame);
            }
          });

          //insert meta tag to page to prevent zooming in in mobile mode
          var viewPortTag = $document[0].createElement('meta');
          viewPortTag.id = 'viewport';
          viewPortTag.name = 'viewport';
          viewPortTag.content =
            'width=device-width, initial-scale=1, user-scalable=no';
          $document[0].getElementsByTagName('head')[0].appendChild(viewPortTag);
        }
      };
    }
  ])

  .run(['analyticsFactory', 'analyticsEvents', 'TAG_MANAGER_CONTAINER_ID', 'TAG_MANAGER_AUTH', 'TAG_MANAGER_ENV',
    function (analyticsFactory, analyticsEvents, TAG_MANAGER_CONTAINER_ID, TAG_MANAGER_AUTH, TAG_MANAGER_ENV) {
      analyticsEvents.initialize();
      analyticsFactory.load(TAG_MANAGER_CONTAINER_ID, TAG_MANAGER_AUTH, TAG_MANAGER_ENV);
    }
  ])

  .run(['$document',
    function ($document) {
      $document.on('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode === 8) {
          var d = event.srcElement || event.target;
          if ((d.tagName.toUpperCase() === 'INPUT' &&
              (
                d.type.toUpperCase() === 'TEXT' ||
                d.type.toUpperCase() === 'PASSWORD' ||
                d.type.toUpperCase() === 'FILE' ||
                d.type.toUpperCase() === 'SEARCH' ||
                d.type.toUpperCase() === 'EMAIL' ||
                d.type.toUpperCase() === 'NUMBER' ||
                d.type.toUpperCase() === 'DATE' ||
                d.type.toUpperCase() === 'TEL' ||
                d.type.toUpperCase() === 'URL')
            ) ||
            d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
          } else {
            doPrevent = true;
          }
        }
        if (doPrevent) {
          event.preventDefault();
        }
      });
    }
  ])

  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })

  .directive('ngDisableRightClick', function () {
    return function (scope, element) {
      element.bind('contextmenu', function (event) {
        scope.$apply(function () {
          event.preventDefault();
        });
      });
    };
  });

angular.module('risevision.common.header.directives', []);
angular.module('risevision.common.header.filters', []);
angular.module('risevision.common.header.services', []);
angular.module('risevision.store.services', []);
