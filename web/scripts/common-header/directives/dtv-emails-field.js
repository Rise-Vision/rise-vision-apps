"use strict";

angular.module("risevision.common.header.directives")
  .value("EMAIL_REGEX",
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
)
  .directive("emailsField", ["$templateCache", "$timeout", "EMAIL_REGEX",
    function ($templateCache, $timeout, EMAIL_REGEX) {
      return {
        restrict: "E",
        require: "ngModel",
        scope: {
          emails: "=ngModel"
        },
        template: $templateCache.get("partials/common-header/emails-field.html"),
        link: function ($scope, elem, attr, ngModel) {
          var updatingEmails = false;
          var validationError = false;

          function _findBySelector(selector) {
            var queryResult = elem[0].querySelector(selector);
            return angular.element(queryResult);
          }

          /* Handles the case when invalid email is entered, a bad input is reported but the user then removes the text.
            Since the tag was never created, a new event is not generated by tags-input and this directive would remain $invalid if not handled */
          $timeout(function () {
            // jQuery lite only allows searching by simple tag name, and a more complex selector is needed here
            var inputField = _findBySelector("tags-input > div > div > input");
            var spanField = _findBySelector("tags-input > div > div > span");

            inputField.keyup(function () {
              // Needed to wait an extra cycle
              $timeout(function () {
                if (spanField.text() === "Add an email") {
                  _setValid(true);
                  $scope.$digest();
                }
              });
            });
          });

          $scope.$watch("emails", function () {
            if (!updatingEmails) {
              $scope.emailsList = _.uniq($scope.emails).map(function (e) {
                return {
                  text: e
                };
              });
            }

            updatingEmails = false;
          });

          $scope.updateModel = function () {
            _setValid(true);
            updatingEmails = true;
            $scope.emails = _emailsModelToStrings();
          };

          $scope.invalidateModel = function () {
            _setValid(false);
          };

          $scope.canRemove = function () {
            return !validationError;
          };

          $scope.isValidEmail = function (email) {
            return !!(email && email.text && EMAIL_REGEX.test(email.text) && _emailsModelToStrings().indexOf(email.text) ===
              -1);
          };

          function _emailsModelToStrings() {
            return $scope.emailsList.map(function (t) {
              return t.text;
            });
          }

          function _setValid(isValid) {
            validationError = !isValid;
            ngModel.$setValidity("emails", isValid);
          }
        }
      };
    }
  ]);
