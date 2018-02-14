angular.module( "risevision.widget.image.settings" )
  .controller( "imageSettingsController", [ "$scope", "$rootScope", "$q", "$log", "commonSettings",
    function( $scope, $rootScope, $q, $log, commonSettings ) {
      $scope.isFolder = false;


      $scope.$on( "fileSelectorClick", function( event, type ) {
        $scope.isFolder = ( type === "single-folder" ) ? true : false;
      } );

      $scope.$watch( "settings.additionalParams.selector.url", function( url ) {
        if ( typeof url !== "undefined" && url !== "" ) {
          $scope.settings.additionalParams.storage = commonSettings.getStorageUrlData( url );
        }
      } );

      $scope.$watch( "settings.additionalParams.resume", function( resume ) {
        if ( typeof resume === "undefined" ) {
          $scope.settings.additionalParams.resume = true;
        }
      } );

      // Legacy URL setting
      $scope.$watch( "settings.additionalParams.url", function( url ) {
        var storage = {};

        if ( typeof url !== "undefined" && url !== "" ) {
          storage = commonSettings.getStorageUrlData( url );

          if ( Object.keys( storage ).length !== 0 ) {
            // Storage file
            $scope.settings.additionalParams.selector = {
              "selection": "single-file",
              "storageName": storage.folder + storage.fileName,
              "url": url
            };
          } else {
            // Third party file
            $scope.settings.additionalParams.selector = {
              "selection": "custom",
              "storageName": "",
              "url": url
            };
          }

          // ensure this value is empty so it no longer gets used
          $scope.settings.additionalParams.url = "";
        }
      } );
    } ] )
  .value( "defaultSettings", {
    "params": {},
    "additionalParams": {
      "selector": {},
      "storage": {},
      "resume": true,
      "scaleToFit": true,
      "position": "middle-center",
      "duration": 10,
      "pause": 10,
      "autoHide": false,
      "url": "",
      "background": {}
    }
  } );
