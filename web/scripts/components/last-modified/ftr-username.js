(function () {
  'use strict';

  // Simple filter that removes the domain from an email
  // for example, bld@riseholdings.com would return bld
  angular.module('risevision.common.components.last-modified')
    .filter('username', function () {
      return function (email) {
        var username = email;
        if (email && email.indexOf('@') !== -1) {
          username = email.substring(0, email.indexOf('@'));
        }
        return username;
      };
    });
}());
