'use strict';

angular.module('risevision.common.components.logging')
  .factory('bigQueryLogging', ['externalLogging', 'userState',
    function (externalLogging, userState) {
      var factory = {};

      factory.logEvent = function (eventName, eventDetails, eventValue,
        username, companyId) {
        return externalLogging.logEvent(eventName, eventDetails, eventValue,
          username || userState.getUsername(), companyId || userState.getSelectedCompanyId()
        );
      };

      var _stringify = function(object) {
        if (object && object instanceof String) {
          return exception;
        } else {
          try {
            return JSON.stringify(object);  
          } catch(e) {
            return object;
          }
        }
      }

      factory.logException = function(exception, cause, caught) {
        var eventName = caught ? 'Exception' : 'Uncaught Exception';
        var message = 'exception: ';

        if (exception instanceof Error) {
          message += exception.toString();
        } else {
          message += _stringify(exception);
        }

        if (cause) {
          message += ' cause: ' + _stringify(cause);
        }

        factory.logEvent(eventName, message);
      };

      return factory;
    }
  ]);
