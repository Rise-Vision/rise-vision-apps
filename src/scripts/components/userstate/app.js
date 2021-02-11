(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.common.components.rvtokenstore', [
    'risevision.common.components.util', 'LocalStorageModule',
    'ngCookies'
  ]);

  angular.module('risevision.common.components.userstate', [
      'ui.router',
      'angular-md5',
      'risevision.common.components.ui-flow',
      'risevision.common.components.util',
      'risevision.common.components.rvtokenstore',
      'risevision.common.components.logging',
      'risevision.common.components.loading',
      'risevision.common.components.password-input',
      'risevision.common.components.scrolling-list',
      'risevision.common.config',
      'risevision.common.gapi',
      'risevision.common.account',
      'LocalStorageModule',
      'risevision.core.company',
      'risevision.core.util', 'risevision.core.userprofile'
    ])

    // Set up our mappings between URLs, templates, and controllers
    .config(['$urlRouterProvider', '$urlMatcherFactoryProvider', '$stateProvider', '$locationProvider',
      function storeRouteConfig($urlRouterProvider, $urlMatcherFactoryProvider, $stateProvider,
        $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('/');

        $urlRouterProvider
          .when(/\/.*(id_token|access_token)=.*/, ['$window', 'userAuthFactory', 'openidConnect',
            function ($window, userAuthFactory, openidConnect) {
              console.log('Google Auth result received');

              var location = $window.location.href;
              location = location.replace('#/', '#');

              openidConnect.signinRedirectCallback(location)
                .then(function (user) {
                  $window.location.hash = '';

                  return userAuthFactory.authenticate(true);
                })
                .catch(function () {
                  $window.location.hash = '';
                });
            }
          ])
          .when('/', ['$location', 'userAuthFactory', 'openidConnect',
            function ($location, userAuthFactory, openidConnect) {
              var hash = $location.hash();

              if (hash && hash.match(/.*(id_token|access_token)=.*/)) {
                console.log('Google Auth result received');

                openidConnect.signinRedirectCallback()
                  .then(function (user) {
                    return userAuthFactory.authenticate(true);
                  })
                  .finally(function () {
                    window.location.hash = '';
                  });
              } else {
                return false;
              }
            }
          ])
          .otherwise('/');

        // https://stackoverflow.com/questions/24420578/handling-trailing-slashes-in-angularui-router
        $urlMatcherFactoryProvider.strictMode(false);

        // Use $stateProvider to configure states.
        $stateProvider.state('common', {
            template: '<div class="container app-login" ui-view></div>'
          })

          .state('common.auth', {
            abstract: true,
            templateProvider: ['$templateCache',
              function ($templateCache) {
                return $templateCache.get('partials/components/userstate/auth-common.html');
              }
            ]
          })

          .state('common.auth.unauthorized', {
            templateProvider: ['$templateCache',
              function ($templateCache) {
                return $templateCache.get('partials/components/userstate/login.html');
              }
            ],
            url: '/unauthorized/:state',
            controller: 'LoginCtrl',
            params: {
              isSignUp: false,
              passwordReset: null
            }
          })

          .state('common.auth.createaccount', {
            templateUrl: 'partials/components/userstate/create-account.html',
            url: '/createaccount/:state',
            controller: 'LoginCtrl',
            params: {
              isSignUp: true,
              joinAccount: false
            }
          })

          .state('common.auth.joinaccount', {
            templateUrl: 'partials/components/userstate/create-account.html',
            url: '/joinaccount/:companyName',
            controller: 'LoginCtrl',
            params: {
              isSignUp: true,
              joinAccount: true
            }
          })

          .state('common.auth.unregistered', {
            templateUrl: 'partials/components/userstate/signup.html',
            url: '/unregistered/:state',
            controller: 'RegistrationCtrl',
            resolve: {
              account: ['userState', 'getUserProfile', 'getAccount',
                function (userState, getUserProfile, getAccount) {
                  return getUserProfile(userState.getUsername())
                    .then(null, function (resp) {
                      if (resp && resp.message ===
                        'User has not yet accepted the Terms of Service'
                      ) {
                        return getAccount();
                      } else {
                        return null;
                      }
                    })
                    .catch(function () {
                      return null;
                    });
                }
              ]
            }
          })

          .state('common.auth.requestpasswordreset', {
            templateUrl: 'partials/components/userstate/request-password-reset.html',
            url: '/requestpasswordreset',
            controller: 'RequestPasswordResetCtrl'
          })

          .state('common.auth.resetpassword', {
            templateUrl: 'partials/components/userstate/reset-password-confirm.html',
            url: '/resetpassword/:user/:token',
            controller: 'ResetPasswordConfirmCtrl'
          })

          .state('common.auth.unsubscribe', {
            templateUrl: 'partials/components/userstate/unsubscribe.html',
            url: '/unsubscribe',
            controller: ['$scope', '$location',
              function ($scope, $location) {
                var params = $location.path('/unsubscribe').search();
                $scope.email = params.email;
                $scope.id = params.id;
                $scope.name = params.name;
              }
            ]
          });
      }
    ])

    .run(['$rootScope', '$state', '$stateParams', 'urlStateService',
      'userState',
      function ($rootScope, $state, $stateParams, urlStateService, userState) {
        userState._restoreState();

        $rootScope.$on('$stateChangeStart', function (event, toState,
          toParams, fromState, fromParams) {
          if (toState && (
              toState.name === 'common.auth.unauthorized' ||
              toState.name === 'common.auth.unregistered' ||
              toState.name === 'common.auth.createaccount') && !toParams.state) {

            if (fromParams.state) {
              toParams.state = fromParams.state;

              event.preventDefault();

              $state.go(toState.name, toParams);
            }
          }
        });

        $rootScope.$on('risevision.user.authorized', function () {
          var currentState = $state.current.name;

          if (currentState.indexOf('common.auth') !== -1 && currentState !== 'common.auth.unsubscribe' &&
            currentState !== 'common.auth.confirmaccount') {
            urlStateService.redirectToState($stateParams.state);
          }
        });
      }
    ]);

})(angular);