'use strict';

angular.module('risevision.apps.services')
  .factory('outsideClickHandler', ['$document', '$timeout',
    function ($document, $timeout) {
      var factory = {};

      factory.bind = function (bindId, elementsWhitelist, callback) {
        $document.bind('click.' + bindId + ' touchstart.' + bindId,
          function (event) {
            var elements = angular.element(elementsWhitelist);

            for (var i = 0; i < elements.length; i++) {
              if (elements[i].contains(event.target)) {
                return;
              }
            }

            $timeout(function () {
              callback();
            });
          });
      };

      factory.unbind = function (bindId) {
        $document.unbind('click.' + bindId + ' touchstart.' + bindId);
      };

      return factory;
    }
  ]);
