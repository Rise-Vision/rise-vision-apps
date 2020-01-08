'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('OnboardingCtrl', ['$scope', '$loading', 'onboardingFactory', 'editorFactory',
    'FEATURED_TEMPLATES',
    function ($scope, $loading, onboardingFactory, editorFactory, FEATURED_TEMPLATES) {
      $scope.factory = onboardingFactory;
      $scope.editorFactory = editorFactory;
      $scope.featuredTemplates = FEATURED_TEMPLATES;

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

    }
  ]); //ctr
