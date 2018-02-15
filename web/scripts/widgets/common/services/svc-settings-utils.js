angular.module('risevision.widgets.services')
  .service('settingsSaver', ['$q', '$log', 'settingsParser',
  function ($q, $log, settingsParser) {

    this.saveSettings = function (settings, validator) {
      var deferred = $q.defer();
      var alerts = [], str = '';

      settings = processSettings(settings);

      if (validator) {
        alerts = validator(settings);
      }

      if(alerts.length > 0) {
        $log.debug('Validation failed.', alerts);
        deferred.reject({alerts: alerts});
      }

      if (settings.params.hasOwnProperty('layoutURL')) {
        // ensure the url is the start of the string
        str += settings.params.layoutURL + '?';
        // delete this property so its not included below in encodeParams call
        delete settings.params.layoutURL;
      }

      str += settingsParser.encodeParams(settings.params);

      var additionalParamsStr =
        settingsParser.encodeAdditionalParams(settings.additionalParams);

      deferred.resolve({
        params: str,
        additionalParams: additionalParamsStr
      });

      return deferred.promise;
    };

    function processSettings(settings) {
      var newSettings = angular.copy(settings);

      delete newSettings.params.id;
      delete newSettings.params.companyId;
      delete newSettings.params.rsW;
      delete newSettings.params.rsH;

      return newSettings;
    }

  }])

  .service('settingsGetter', ['settingsParser', 'defaultSettings',
    function (settingsParser, defaultSettings) {

      this.getAdditionalParams = function (additionalParams) {
        var defaultAdditionalParams = defaultSettings.additionalParams || {};

        if (additionalParams) {
          additionalParams = settingsParser.parseAdditionalParams(additionalParams);
        }
        else {
          additionalParams = {};
        }

        return $.extend(true, defaultAdditionalParams, additionalParams);
      };

      this.getParams = function (params) {
        var defaultParams = defaultSettings.params || {};
        return angular.extend(defaultParams, settingsParser.parseParams(params));
      };
  }])

  .service('settingsParser', [function () {
    this.parseAdditionalParams = function (additionalParamsStr) {
      if(additionalParamsStr) {
        return JSON.parse(additionalParamsStr);
      }
      else {
        return {};
      }
    };

    this.encodeAdditionalParams = function (additionalParams) {
      return JSON.stringify(additionalParams);
    };

    this.encodeParams = function (params) {
      var str = [];
      for(var p in params) {
        if (params.hasOwnProperty(p)) {
          var value;
          if (typeof params[p] === 'object') {
            value = JSON.stringify(params[p]);
          }
          else {
            value = params[p];
          }
          str.push('up_' + encodeURIComponent(p) + '=' + encodeURIComponent(value));
        }
      }

      return str.join('&');
    };

    function stripPrefix(name) {
      if(name.indexOf('up_') === 0) {
        return name.slice(3);
      }
      else {
        return null;
      }
    }

    this.parseParams = function (paramsStr) {
      //get rid of preceeding '?'
      if(paramsStr[0] === '?') {
        paramsStr = paramsStr.slice(1);
      }
      var result = {};
      var vars = paramsStr.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        var name = stripPrefix(decodeURIComponent(pair[0]));
        //save settings only if it has up_ prefix. Ignore otherwise
        if (name) {
          try {
            result[name] = JSON.parse(decodeURIComponent(pair[1]));
          }
          catch (e) {
            result[name] = decodeURIComponent(pair[1]);
          }
        }
      }
      return result;
    };

  }])

  .value('defaultSettings', {});
