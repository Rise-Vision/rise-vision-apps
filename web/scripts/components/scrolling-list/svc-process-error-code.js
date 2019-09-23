"use strict";

angular.module("risevision.common.components.scrolling-list")
  .service("processErrorCode", ["$filter",
    function ($filter) {
      var actionsMap = {
        get: "loaded",
        load: "loaded",
        add: "added",
        update: "updated",
        delete: "deleted",
        publish: "published",
        restore: "restored",
        move: "moved",
        rename: "renamed",
        upload: "uploaded",
        restart: "restarted",
        reboot: "rebooted"
      };

      return function (itemName, action, e) {
        var tryAgainMessage = $filter("translate")("apps-common.errors.tryAgain");
        var actionName = actionsMap[action];
        var error = (e && e.result && e.result.error) || {};
        var errorString = error.message ? error.message : "An Error has Occurred";
        var messagePrefix = $filter("translate")("apps-common.errors.actionFailed", {
          itemName: itemName,
          actionName: actionName
        });

        // Attempt to internationalize Storage error
        var key = "storage-client.error." + (action ? action + "." : "") + error.message;
        var msg = $filter("translate")(key);
        if (msg !== key) {
          errorString = msg;
        }

        if (!e) {
          return errorString;
        } else if (e.status === 400) {
          if (errorString.indexOf("is not editable") >= 0) {
            return messagePrefix + " " + errorString;
          } else if (errorString.indexOf("is required") >= 0) {
            return messagePrefix + " " + errorString;
          } else {
            return messagePrefix + " " + errorString;
          }
        } else if (e.status === 401) {
          return $filter("translate")("apps-common.errors.notAuthenticated", {
            itemName: itemName,
            actionName: action
          });
        } else if (e.status === 403) {
          if (errorString.indexOf("User is not allowed access") >= 0) {
            return messagePrefix + " " + $filter("translate")("apps-common.errors.parentCompanyAction");
          } else if (errorString.indexOf("User does not have the necessary rights") >= 0) {
            return messagePrefix + " " + $filter("translate")("apps-common.errors.permissionRequired");
          } else if (errorString.indexOf("Premium Template requires Purchase") >= 0) {
            return messagePrefix + " " + $filter("translate")("apps-common.errors.premiumTemplate");
          } else if (errorString.indexOf("Storage requires active subscription") >= 0) {
            return messagePrefix + " " + $filter("translate")("apps-common.errors.storageSubscription");
          } else {
            return messagePrefix + " " + errorString;
          }
        } else if (e.status === 404) {
          return $filter("translate")("apps-common.errors.notFound", {
            itemName: itemName
          });
        } else if (e.status === 409) {
          return messagePrefix + " " + errorString;
        } else if (e.status === 500 || e.status === 503) {
          return $filter("translate")("apps-common.errors.serverError", {
            itemName: itemName,
            actionName: action
          }) + " " + tryAgainMessage;
        } else if (e.status === -1 || error.code === -1 || error.code === 0) {
          return $filter("translate")("apps-common.errors.checkConnection");
        } else {
          return errorString;
        }
      };
    }
  ]);
