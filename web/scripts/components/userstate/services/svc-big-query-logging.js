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
        if (typeof object === 'string') {
          return object;
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
        var message = '';

        if (exception && exception instanceof Error) {
          message += 'error: ' + exception.toString();
        } else if (exception && exception.code) {
          message += 'response: ' + exception.code + ': ' + exception.message;
        } else {
          message += 'value: ' + _stringify(exception);
        }

        if (cause) {
          message += '; cause: ' + _stringify(cause);
        }

        factory.logEvent(eventName, message);
      };

      return factory;
    }
  ]);
