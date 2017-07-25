'use strict';

// Resolution Filter
angular.module('risevision.displays.filters')
  .filter('playerVersionName', function () {
    return function (playerName, playerVersion, offlineSubscription) {
      var name = playerName ? playerName + " " : "";
      name += playerVersion ? playerVersion + " " : ""; 
      name += offlineSubscription? "Professional":"Standard";
      return name;
    };
  });
