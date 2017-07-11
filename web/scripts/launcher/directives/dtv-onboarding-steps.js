'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('onboardingSteps', ['$rootScope', 'launcherFactory', 
    'editorFactory', 'displayFactory',
    function ($rootScope, launcherFactory, editorFactory, displayFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/launcher/onboarding-steps.html',
        link: function ($scope, element) {
          $scope.launcherFactory = launcherFactory;
          $scope.editorFactory = editorFactory;
          $scope.displayFactory = displayFactory;
          $rootScope.showOnboarding = false;
          var addPresentationListener, displaysListener;

          var _checkPresentationCreated = function() {
            if (addPresentationListener) { 
              addPresentationListener();
              addPresentationListener = null;
            }

            $scope.addPresentationCompleted = 
                launcherFactory.presentations.list && 
                launcherFactory.presentations.list.length > 0;

            if ($scope.addPresentationCompleted) { return; }

            addPresentationListener = $rootScope.$on('presentationCreated', 
              function (event) {
                $scope.addPresentationCompleted = true;

                _stepCount();
                addPresentationListener();
              });
          };

          var _checkDisplaysHandler = function() {
            if (displaysListener) { 
              displaysListener();
              displaysListener = null;
            }

            displaysListener = $rootScope.$on('displaysLoaded', 
              function (event, displays) {
                var activeDisplayFound = false;

                displays.forEach(function(display) {
                  $scope.addDisplayCompleted = true;

                  // Add first display if list is empty
                  if (!launcherFactory.displays.list.length) {
                    $scope.launcherFactory.displays.list.push(display);                    
                  }

                  if (display.playerVersion || display.lastConnectionTime ||
                    display.onlineStatus === 'online') {
                    activeDisplayFound = true;
                  }
                });
                
                if (activeDisplayFound) {
                  $scope.activateDisplayCompleted = true;

                  displaysListener();
                }

                _stepCount();
              });       
          };

          var _stepCount = function() {
            var count = 3;

            count -= $scope.addPresentationCompleted ? 1 : 0;
            count -= $scope.addDisplayCompleted ? 1 : 0;
            count -= $scope.activateDisplayCompleted ? 1 : 0;

            $scope.stepCount = count;
          };

          $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
            $rootScope.showOnboarding = false;
            _checkDisplaysHandler();

            launcherFactory.load().then(function() {
              _checkPresentationCreated();

              _stepCount();

              $rootScope.showOnboarding = !$scope.activateDisplayCompleted;              
            });
          });

          $scope.currentStep = function(step) {
            if (!$scope.addPresentationCompleted) {
              return step === 'addPresentation';
            } else if (!$scope.addDisplayCompleted) {
              return step === 'addDisplay';
            } else if (!$scope.activateDisplayCompleted) {
              return step === 'activateDisplay';
            }
            
            return false;
          };
        }
      };
    }
  ]);
