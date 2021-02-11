'use strict';

angular.module('risevision.common.components.logging')
  .config(['$qProvider',
    function ($qProvider) {
      $qProvider.errorOnUnhandledRejections(false);
    }
  ])

  .factory('$exceptionHandler', ['$log', '$injector', 'getError',
    function ($log, $injector, getError) {
      var _stringify = function (object) {
        if (typeof object === 'string') {
          return object;
        } else {
          try {
            return JSON.stringify(object);
          } catch (e) {
            return object;
          }
        }
      };

      var _logException = function (exception, cause, caught) {
        // Prevents circular reference
        // https://stackoverflow.com/questions/22332130/injecting-http-into-angular-factoryexceptionhandler-results-in-a-circular-de
        var bigQueryLogging = $injector.get('bigQueryLogging');
        var analyticsFactory = $injector.get('analyticsFactory');

        var error = getError(exception);
        var eventName = caught ? 'Exception' : 'Uncaught Exception';
        var message = '';

        if (exception && exception instanceof Error) {
          message += 'error: ' + exception.toString();
        } else if (error && error.code) {
          message += 'response: ' + error.code + ': ' + error.message;
        } else {
          message += 'value: ' + _stringify(exception);
        }

        if (cause) {
          message += '; cause: ' + _stringify(cause);
        }

        analyticsFactory.track(eventName, {
          message: message
        });
        bigQueryLogging.logEvent(eventName, message);
      };

      return function customExceptionHandler(exception, cause, caught) {
        _logException(exception, cause, caught);
        $log.error.apply($log, arguments);
      };
    }
  ]);
