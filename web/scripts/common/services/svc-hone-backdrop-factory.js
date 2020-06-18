'use strict';

angular.module('risevision.apps.services')
  .factory('honeBackdropFactory', ['$window', '$document',
    function ($window, $document) {
      var service = {};
      var $body = angular.element($document[0].body);
      var preventDefault = function (e) {
        e.preventDefault();
      };
      var hone = new $window.Hone({
        classPrefix: 'madero-style tooltip-backdrop',
        borderRadius: 4,
        padding: '10px'
      });

      function preventScrolling() {
        $body.addClass('no-scrolling');
        $body.on('touchmove', preventDefault);
      }

      function allowScrolling() {
        $body.removeClass('no-scrolling');
        $body.off('touchmove', preventDefault);
      }

      service.createForElement = function (element, backdropOptions) {
        hone.setOptions(backdropOptions);
        hone.position(element[0]);
        hone.show();

        if (backdropOptions.preventScrolling) {
          service.shouldPreventScrolling(true);
        } else {
          service.shouldPreventScrolling(false);
        }
      };

      service.hide = function () {
        hone.hide();
        service.shouldPreventScrolling(false);
      };

      service.shouldPreventScrolling = function (shouldPreventScrolling) {
        if (shouldPreventScrolling) {
          preventScrolling();
        } else {
          allowScrolling();
        }
      };

      service.reposition = function () {
        if (hone.status === $window.Hone.status.VISIBLE) {
          hone.position();
        }
      };

      return service;
    }
  ]);
