(function () {
  "use strict";

  angular.module("risevision.widget.common.tooltip", ["ui.bootstrap"])
    .directive("rvTooltip", [function () {
      return {
        restrict: "A",
        link: function($scope, element) {
          element.addClass("fa");
          element.addClass("fa-question-circle");
          element.addClass("fa-lg");
        }
      };
    }]);
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.url-field", [
    "risevision.common.i18n",
    "risevision.widget.common.tooltip"
  ])
    .directive("urlField", ["$templateCache", "$log", function ($templateCache, $log) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          url: "=",
          hideLabel: "@",
          fileType: "@"
        },
        template: $templateCache.get("_angular/url-field/url-field.html"),
        link: function (scope, element, attrs, ctrl) {

          function hasValidExtension(url, fileType) {
            var testUrl = url.toLowerCase(),
              extensions;

            switch(fileType) {
              case "image":
                extensions = [".jpg", ".jpeg", ".png", ".bmp", ".svg", ".gif", ".webp"];
                break;
              case "video":
                extensions = [".webm", ".mp4", ".ogv", ".ogg"];
                break;
              default:
                extensions = [];
            }

            for (var i = 0, len = extensions.length; i < len; i++) {
              if (testUrl.indexOf(extensions[i]) !== -1) {
                return true;
              }
            }

            return false;
          }

          // Check that the URL points to a valid image file.
          function testImage() {
            if ((scope.fileType !== "undefined") && (scope.url !== "undefined")) {
              if (scope.fileType === "image") {
                var image = new Image();

                image.onload = function() {
                  scope.valid = true;
                  scope.$apply();
                };

                image.onerror = function() {
                  scope.valid = false;
                  scope.invalidType = scope.fileType;
                  scope.$apply();
                };

                image.src = scope.url;
              }
            }
          }

          function testUrl(value) {
            var urlRegExp,
              isValid;

            /*
             Discussion
             http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491

             Using
             https://gist.github.com/dperini/729294
             Reasoning
             http://mathiasbynens.be/demo/url-regex */

            urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i; // jshint ignore:line

            // Add http:// if no protocol parameter exists
            if (value.indexOf("://") === -1) {
              value = "http://" + value;
            }

            isValid = urlRegExp.test(value);

            if (isValid && typeof scope.fileType !== "undefined") {
              isValid = hasValidExtension(value, scope.fileType);
              if (!isValid) {
                scope.invalidType = scope.fileType;
              }
            } else {
              scope.invalidType = "url";
            }

            if (isValid) {
              testImage();
            }

            return isValid;
          }

          // By default enforce validation
          scope.doValidation = true;
          // A flag to set if the user turned off validation
          scope.forcedValid = false;
          // Validation state
          scope.valid = true;

          scope.invalidType = "url";

          scope.allowInitEmpty = (typeof attrs.initEmpty !== "undefined");

          scope.blur = function() {
            scope.$emit("urlFieldBlur");
          };

          scope.$watch("url", function (url) {

            if (typeof url !== "undefined" && url !== null) {

              if (url !== "" && scope.allowInitEmpty) {
                // ensure an empty "" value now gets validated
                scope.allowInitEmpty = false;
              }

              if (scope.doValidation && !scope.allowInitEmpty) {
                scope.valid = testUrl(scope.url);
              }
            }
          });

          scope.$watch("valid", function (valid) {
            if (ctrl) {
              $log.info("Calling $setValidity() on parent controller");
              ctrl.$setValidity("valid", valid);
            }
          });

          scope.$watch("doValidation", function (doValidation) {
            if(typeof scope.url !== "undefined") {
              if (doValidation) {
                scope.forcedValid = false;

                if (!scope.allowInitEmpty) {
                  scope.valid = testUrl(scope.url);
                }
              } else {
                scope.forcedValid = true;
                scope.valid = true;
              }
            }
          });

        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.url-field"); }
catch(err) { module = angular.module("risevision.widget.common.url-field", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/url-field/url-field.html",
    "<div class=\"form-group\" >\n" +
    "  <label ng-if=\"!hideLabel\">{{ \"url.label\" | translate }}</label>\n" +
    "  <div>\n" +
    "    <input name=\"url\" type=\"text\" ng-model=\"url\" ng-blur=\"blur()\" class=\"form-control\" placeholder=\"http://\">\n" +
    "  </div>\n" +
    "  <p ng-if=\"!valid && invalidType === 'url'\" class=\"text-danger\">{{ \"url.errors.url\" | translate }}</p>\n" +
    "  <p ng-if=\"!valid && invalidType === 'image'\" class=\"text-danger\">{{ \"url.errors.image\" | translate }}</p>\n" +
    "  <p ng-if=\"!valid && invalidType === 'video'\" class=\"text-danger\">{{ \"url.errors.video\" | translate }}</p>\n" +
    "  <div class=\"checkbox\" ng-show=\"forcedValid || !valid\">\n" +
    "    <label>\n" +
    "      <input name=\"validate-url\" ng-click=\"doValidation = !doValidation\" type=\"checkbox\"\n" +
    "             value=\"validate-url\"> {{\"url.validate.label\" | translate}}\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function () {
  "use strict";

  angular.module("risevision.widget.common.file-selector", [
      "risevision.common.i18n",
      "risevision.widget.common.storage-selector",
      "risevision.widget.common.url-field",
    ])
    .directive("fileSelector", ["$templateCache", "$log", "$window", "$rootScope", function ($templateCache, $log, $window, $rootScope) {
      return {
        restrict: "E",
        require: "?ngModel",
        scope: {
          title: "@",
          fileLabel: "@",
          folderLabel: "@",
          companyId: "@",
          fileType: "@",
          selector: "="
        },
        template: $templateCache.get("_angular/file-selector/file-selector.html"),
        link: function (scope, element, attrs, ctrl) {

          function hasValidExtension(url, fileType) {
            var testUrl = url.toLowerCase(),
              extensions;

            switch(fileType) {
              case "image":
                extensions = [".jpg", ".jpeg", ".png", ".bmp", ".svg", ".gif", ".webp"];
                break;
              case "video":
                extensions = [".webm", ".mp4", ".ogv", ".ogg"];
                break;
              default:
                extensions = [];
            }

            for (var i = 0, len = extensions.length; i < len; i++) {
              if (testUrl.indexOf(extensions[i]) !== -1) {
                return true;
              }
            }

            return false;
          }

          function toggleButtons(selectedType) {

            switch (selectedType) {
              case "single-file":
                scope.fileBtnSelected = true;
                scope.folderBtnSelected = false;
                scope.customBtnSelected = false;
                break;
              case "single-folder":
                scope.fileBtnSelected = false;
                scope.folderBtnSelected = true;
                scope.customBtnSelected = false;
                break;
              case "custom":
                scope.fileBtnSelected = false;
                scope.folderBtnSelected = false;
                scope.customBtnSelected = true;
                break;
              default:
                scope.fileBtnSelected = false;
                scope.folderBtnSelected = false;
                scope.customBtnSelected = false;
                break;
            }

          }

          function getStorageName(url, type) {
            var str, arr, params, pair, fileName, folder, name;

            if (type === "single-file") {
              // example single storage file url
              // https://storage.googleapis.com/risemedialibrary-abc123/test%2Fvideos%2Ftest.webm

              // get the second part of the split
              str = url.split("storage.googleapis.com/risemedialibrary-")[1];
              // extract everything starting after the company id
              str = decodeURIComponent(str.slice(str.indexOf("/") + 1));
              // split up based on folder separator
              arr = str.split("/");

              // assign the last index of array split as the file name
              fileName = arr.pop();
              // join the remaining array to form the folder name/path
              folder = arr.length > 0 ? arr.join("/") : "";

              if (folder !== "") {
                // add ending "/" to the folder path
                folder += "/";
              }

              name = folder + fileName;
            }
            else if (type === "single-folder") {
              // example single storage folder url
              // https://www.googleapis.com/storage/v1/b/risemedialibrary-abc123/o?prefix=test%2Fvideos%2F

              // everything after "?" will involve the folder name/path
              params = url.split("?");

              for (var i = 0; i < params.length; i++) {
                // "prefix" will be the param name and the folder name/path will be the value
                pair = params[i].split("=");

                if (pair[0] === "prefix" && typeof pair[1] !== "undefined" && pair[1] !== "") {
                  name = decodeURIComponent(pair[1]);
                  break;
                }
              }

            }

            return name;
          }

          scope.defaultSetting = {
            selection: "", // "single-file", "single-folder", or "custom"
            storageName: "", // name of file or folder path
            url: ""
          };

          // set default button states
          toggleButtons();

          // default to false so it will set validity on parent to false initially
          scope.selectorValid = false;
          // a flag to check if custom url is in an initial empty state
          scope.customInit = false;
          // default to false so the subscription-status component doesn't show itself until it receives its status
          scope.isSubscribed = true;
          // will hide subscription status permanently if attr was used
          scope.hideSubscription = (typeof attrs.hideSubscription !== "undefined");
          // a flag to toggle subscription status visibility (depends on selection type)
          scope.subscriptionOff = true;

          scope.defaults = function(obj) {
            if (obj) {
              for (var i = 1, length = arguments.length; i < length; i++) {
                var source = arguments[i];

                for (var prop in source) {
                  if (obj[prop] === void 0) {
                    obj[prop] = source[prop];
                  }
                }
              }
            }
            return obj;
          };

          scope.onCustomBtnHandler = function() {
            scope.selector.selection = "custom";
            scope.selector.url = "";
            scope.selector.storageName = "";
          };

          scope.previewFile = function () {
            $window.open(scope.selector.url, "_blank");
          };

          scope.$on("picked", function (event, data, type) {
            scope.selector.selection = type;
            scope.selector.storageName = getStorageName(data[0], scope.selector.selection);
            scope.selector.url = data[0];
          });

          scope.$watch("selectorValid", function (valid) {
            if (ctrl) {
              ctrl.$setValidity("selectorValid", valid);
            }
          });

          scope.$watch("selector", function(selector) {
            scope.defaults(selector, scope.defaultSetting);
          });

          scope.$watch("selector.selection", function (selection) {
            if (typeof selection !== "undefined") {
              toggleButtons(selection);

              scope.subscriptionOff = (selection === "" || selection === "custom");

              if (selection === "single-folder") {
                // validity is fine when choosing a single-folder from storage
                scope.selectorValid = true;
              }
              else if (selection === "custom") {
                scope.customInit = true;
                // set selector validity to false to account for allowing an initial empty value for url-field
                scope.selectorValid = false;
              }

              if (!scope.subscriptionOff && !scope.hideSubscription) {
                // ensure subscription-status component does a refresh in case user subscribed from in-app storage
                scope.isSubscribed = false;
                $rootScope.$broadcast("refreshSubscriptionStatus", null);
              }

              $rootScope.$broadcast("fileSelectorClick", selection);
            }
          });

          scope.$watch("selector.url", function (url) {
            if (typeof url !== "undefined" && url !== null) {
              if (scope.selector.selection === "single-file" && typeof scope.fileType !== "undefined") {
                // set validity from the single-file storage selection
                scope.selectorValid = hasValidExtension(url, scope.fileType);
              }
              else if (scope.selector.selection === "custom" && scope.customInit && url !== "") {
                // an entry was made in url-field
                scope.customInit = false;
                scope.selectorValid = true;
              }
            }
          });

          scope.$watch("subscribed", function (subscription) {
            if (typeof subscription !== "undefined" && subscription.statusCode !== "na") {
              scope.isSubscribed = subscription.subscribed;
            }
          });

        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.file-selector"); }
catch(err) { module = angular.module("risevision.widget.common.file-selector", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/file-selector/file-selector.html",
    "<div class=\"form-group file-selector\">\n" +
    "  <label ng-if=\"title\" class=\"control-label remove-bottom\">{{ title }}</label>\n" +
    "\n" +
    "  <div class=\"row half-top half-bottom\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <!-- Storage Single File - Button -->\n" +
    "      <storage-selector selected=\"fileBtnSelected\"\n" +
    "                        company-id=\"{{companyId}}\"\n" +
    "                        type=\"single-file\"\n" +
    "                        label=\"{{ fileLabel }}\"></storage-selector>\n" +
    "      <!-- Storage Single Folder - Button -->\n" +
    "      <storage-selector ng-if=\"folderLabel\"\n" +
    "                        selected=\"folderBtnSelected\"\n" +
    "                        company-id=\"{{companyId}}\"\n" +
    "                        type=\"single-folder\"\n" +
    "                        label=\"{{ folderLabel }}\"></storage-selector>\n" +
    "      <!-- Custom File - Button -->\n" +
    "      <button name=\"customBtn\" type=\"button\" class=\"btn btn-default\"\n" +
    "              ng-class=\"{active: customBtnSelected}\"\n" +
    "              ng-click=\"onCustomBtnHandler()\">{{ 'file-selector.buttons.custom' | translate }}\n" +
    "        <i class=\"fa fa-link fa-large\"></i></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Storage Single File - Input -->\n" +
    "  <div class=\"form-group\" ng-if=\"selector.selection === 'single-file'\">\n" +
    "    <div class=\"input-group custom-addon\">\n" +
    "      <input name=\"storage-file-name\" type=\"text\" class=\"form-control\" ng-model=\"selector.storageName\" readonly>\n" +
    "      <span class=\"input-group-addon\">\n" +
    "        <button name=\"previewBtn\" class=\"btn btn-default\" ng-click=\"previewFile()\">{{ 'file-selector.buttons.preview' | translate }}\n" +
    "          <img src=\"http://s3.amazonaws.com/Rise-Images/Icons/newtab-icon.png\" class=\"storage-selector-icon icon-right\">\n" +
    "        </button>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "    <p ng-if=\"!selectorValid && fileType === 'image'\" class=\"text-danger\">{{ \"file-selector.errors.storage.image\" | translate }}</p>\n" +
    "    <p ng-if=\"!selectorValid && fileType === 'video'\" class=\"text-danger\">{{ \"file-selector.errors.storage.video\" | translate }}</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Storage Single Folder - Input -->\n" +
    "  <div ng-if=\"selector.selection === 'single-folder'\">\n" +
    "    <input name=\"storage-folder-name\" type=\"text\" class=\"form-control\" ng-model=\"selector.storageName\" readonly>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Custom File - Input -->\n" +
    "  <div ng-if=\"selector.selection === 'custom'\">\n" +
    "    <url-field id=\"customUrl\" name=\"customUrl\" url=\"selector.url\"\n" +
    "               file-type=\"{{fileType}}\"\n" +
    "               hide-label=\"true\"\n" +
    "               ng-model=\"customurlentry\" valid init-empty></url-field>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Storage Subscription Status -->\n" +
    "  <div ng-if=\"!isSubscribed && !hideSubscription && !subscriptionOff\" subscription-status expanded-format=\"true\"\n" +
    "       product-id=\"24\" product-code=\"b0cba08a4baa0c62b8cdc621b6f6a124f89a03db\" company-id=\"{{companyId}}\"\n" +
    "       ng-model=\"$parent.subscribed\">\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
})();

(function () {
  "use strict";

  angular.module("risevision.widget.common.position-setting", ["risevision.common.i18n"])
    .directive("positionSetting", ["$templateCache", "$log", function ($templateCache/*, $log*/) {
      return {
        restrict: "E",
        scope: {
          position: "=",
          hideLabel: "@",
          parentContainerClass: "=",
          containerClass: "="
        },
        template: $templateCache.get("_angular/position-setting/position-setting.html"),
        link: function ($scope) {
          $scope.$watch("position", function(position) {
            if (typeof position === "undefined") {
              // set a default
              $scope.position = "top-left";
            }
          });
        }
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.position-setting"); }
catch(err) { module = angular.module("risevision.widget.common.position-setting", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/position-setting/position-setting.html",
    "<div class=\"{{parentContainerClass || 'row'}}\">\n" +
    "  <div class=\"{{containerClass || 'col-md-4'}}\">\n" +
    "    <label ng-if=\"!hideLabel\"> {{'widgets.alignment' | translate}}</label>\n" +
    "    <select name=\"position\" ng-model=\"position\" class=\"form-control\">\n" +
    "      <option value=\"top-left\">{{'position.top.left' | translate}}</option>\n" +
    "      <option value=\"top-center\">{{'position.top.center' | translate}}</option>\n" +
    "      <option value=\"top-right\">{{'position.top.right' | translate}}</option>\n" +
    "      <option value=\"middle-left\">{{'position.middle.left' | translate}}</option>\n" +
    "      <option value=\"middle-center\">{{'position.middle.center' | translate}}</option>\n" +
    "      <option value=\"middle-right\">{{'position.middle.right' | translate}}</option>\n" +
    "      <option value=\"bottom-left\">{{'position.bottom.left' | translate}}</option>\n" +
    "      <option value=\"bottom-center\">{{'position.bottom.center' | translate}}</option>\n" +
    "      <option value=\"bottom-right\">{{'position.bottom.right' | translate}}</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function () {
  "use strict";

  angular.module("risevision.widget.common.widget-button-toolbar", ["risevision.common.i18n"])
    .directive("widgetButtonToolbar", ["$templateCache", function ($templateCache) {
      return {
        restrict: "E",
        scope: {
          save: "&",
          cancel: "&",
          disableSave: "&"
        },
        template: $templateCache.get("_angular/widget-button-toolbar/widget-button-toolbar.html")
      };
    }]);
}());

(function(module) {
try { module = angular.module("risevision.widget.common.widget-button-toolbar"); }
catch(err) { module = angular.module("risevision.widget.common.widget-button-toolbar", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("_angular/widget-button-toolbar/widget-button-toolbar.html",
    "<div class=\"pull-right\">\n" +
    "  <button id=\"save\" class=\"btn btn-primary btn-fixed-width\" type=\"button\" ng-click=\"save()\" ng-disabled=\"disableSave()\">\n" +
    "    <span>{{\"common.save\" | translate}}</span>\n" +
    "    <i class=\"fa fa-white fa-check icon-right\"></i>\n" +
    "  </button>\n" +
    "  <button id=\"cancel\" class=\"btn btn-default btn-fixed-width\" type=\"button\" ng-click=\"cancel()\">\n" +
    "    <span>{{\"common.cancel\" | translate}}</span>\n" +
    "    <i class=\"fa fa-white fa-times icon-right\"></i>\n" +
    "  </button>\n" +
    "</div>\n" +
    "");
}]);
})();

angular.module( "risevision.widget.image.settings", [
  "risevision.common.i18n",
  "risevision.widget.common",
  "risevision.widget.common.widget-button-toolbar",
  "risevision.widget.common.position-setting",
  "risevision.widget.common.tooltip",
  "risevision.widget.common.file-selector"
] );

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
