'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('OnboardingCtrl', ['$scope', '$interval', '$loading', 'onboardingFactory', 'companyAssetsFactory',
    'editorFactory', 'FEATURED_TEMPLATES',
    function ($scope, $interval, $loading, onboardingFactory, companyAssetsFactory,
      editorFactory, FEATURED_TEMPLATES) {
      $scope.factory = onboardingFactory;
      $scope.editorFactory = editorFactory;
      $scope.featuredTemplates = FEATURED_TEMPLATES;

      var activeDisplayPolling;

      $scope.select = function (product) {
        editorFactory.addFromProduct(product);
      };

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('onboarding-loader');
        } else {
          $loading.stop('onboarding-loader');
        }
      });

      var _clearActiveDisplayPolling = function () {
        if (activeDisplayPolling) {
          $interval.cancel(activeDisplayPolling);
          activeDisplayPolling = null;
        }
      };

      var _startActiveDisplayPolling = function () {
        if (!activeDisplayPolling) {
          activeDisplayPolling = $interval(function () {
            companyAssetsFactory.hasDisplays(true);
          }, 30 * 1000);
        }
      };

      $scope.$watch(function () {
        return onboardingFactory.isCurrentStep('activateDisplay');
      }, function (isActivateDisplay) {
        if (isActivateDisplay) {
          _startActiveDisplayPolling();
        } else {
          _clearActiveDisplayPolling();
        }
      });

      $scope.$on('$destroy', function () {
        _clearActiveDisplayPolling();
      });

    }
  ]); //ctr
