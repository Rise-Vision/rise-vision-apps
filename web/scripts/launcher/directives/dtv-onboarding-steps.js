'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('onboardingSteps', ['$rootScope', '$state', 'launcherFactory',
    'editorFactory', 'displayFactory',
    function ($rootScope, $state, launcherFactory, editorFactory, displayFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/launcher/onboarding-steps.html',
        link: function ($scope, element) {
          $scope.launcherFactory = launcherFactory;
          $scope.editorFactory = editorFactory;
          $scope.displayFactory = displayFactory;
          $rootScope.showOnboarding = false;
          var addPresentationListener, addDisplayListener, displaysListener;

          var _checkPresentationCreated = function () {
            if (addPresentationListener) {
              addPresentationListener();
              addPresentationListener = null;
            }

            $scope.addPresentationCompleted =
              launcherFactory.presentations.list &&
              launcherFactory.presentations.list.length > 0;

            if (!$scope.addPresentationCompleted) {
              addPresentationListener = $scope.$on('presentationCreated',
                function (event) {
                  $scope.addPresentationCompleted = true;

                  _stepCount();
                  addPresentationListener();
                });
            }
          };

          var _validateActiveDisplay = function (displays) {
            var activeDisplayFound = false;

            displays.forEach(function (display) {
              if (display.playerVersion || display.lastConnectionTime ||
                display.onlineStatus === 'online') {
                activeDisplayFound = true;
              }
            });

            if (activeDisplayFound) {
              $scope.activateDisplayCompleted = true;

              displaysListener();

              _stepCount();
            }
          };

          var _checkDisplayCreated = function () {
            if (addDisplayListener) {
              addDisplayListener();
              addDisplayListener = null;
            }

            $scope.addDisplayCompleted =
              launcherFactory.displays.list &&
              launcherFactory.displays.list.length > 0;

            if (!$scope.addDisplayCompleted) {
              addDisplayListener = $scope.$on('displayCreated',
                function (event, display) {
                  // Add first display if list is empty
                  if (!launcherFactory.displays.list.length) {
                    launcherFactory.displays.list.push(display);
                  }

                  $scope.addDisplayCompleted = true;

                  _stepCount();
                  addDisplayListener();
                });
            } else {
              _validateActiveDisplay(launcherFactory.displays.list);
            }
          };

          var _checkDisplaysLoaded = function () {
            if (displaysListener) {
              displaysListener();
            }

            displaysListener = $scope.$on('displaysLoaded',
              function (event, displays) {
                _validateActiveDisplay(displays);
              });
          };

          var _stepCount = function () {
            var count = 3;

            count -= $scope.addPresentationCompleted ? 1 : 0;
            count -= $scope.addDisplayCompleted ? 1 : 0;
            count -= $scope.activateDisplayCompleted ? 1 : 0;

            $scope.stepCount = count;

            $rootScope.showOnboarding = _shouldShowOnboarding($state.current.name);
          };

          $scope.$on('risevision.company.selectedCompanyChanged', function () {
            $scope.addPresentationCompleted = false;
            $scope.addDisplayCompleted = false;
            $scope.activateDisplayCompleted = false;

            $rootScope.showOnboarding = false;
            _checkDisplaysLoaded();

            launcherFactory.load().then(function () {
              _checkPresentationCreated();
              _checkDisplayCreated();

              _stepCount();
            });
          });

          $scope.currentStep = function (step) {
            if (!$scope.addPresentationCompleted) {
              return step === 'addPresentation';
            } else if (!$scope.addDisplayCompleted) {
              return step === 'addDisplay';
            } else if (!$scope.activateDisplayCompleted) {
              return step === 'activateDisplay';
            }

            return false;
          };

          function _shouldShowOnboarding(state) {
            return !$scope.activateDisplayCompleted && state.indexOf('common.auth.') === -1;
          }

          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.showOnboarding = _shouldShowOnboarding(toState.name);
          });
        }
      };
    }
  ]);
