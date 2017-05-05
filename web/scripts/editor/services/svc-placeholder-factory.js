'use strict';

angular.module('risevision.editor.services')
  .factory('placeholderFactory', ['$rootScope', 'gadgetFactory',
    function ($rootScope, gadgetFactory) {
      var factory = {};

      factory.setPlaceholder = function (placeholder) {
        factory.placeholder = placeholder;
      };

      factory.clearPlaceholder = function () {
        factory.placeholder = undefined;
      };

      factory.updateSubscriptionStatus = function () {
        if (factory.placeholder && factory.placeholder.items) {
          gadgetFactory.updateItemsStatus(factory.placeholder.items);
        }
      };

      $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState !== 'apps.editor.workspace.artboard') {
          factory.clearPlaceholder();
        }
      });

      $rootScope.$on('presentationUpdated', function (event, toState) {
        factory.clearPlaceholder();
      });

      return factory;
    }
  ]);
