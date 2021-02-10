'use strict';

angular.module('risevision.editor.services')
  .value('IFRAME_PREFIX', 'if_')
  .factory('widgetRenderer', ['gadgetsApi', '$window', 'IFRAME_PREFIX',
    'userState', 'widgetUtils',
    function (gadgetsApi, $window, IFRAME_PREFIX, userState, widgetUtils) {
      var factory = {};

      factory._placeholders = {};

      var _isRenderingAllowed = function (placeholder) {
        if (placeholder.items && placeholder.items[0]) {
          var playlistItem = placeholder.items[0];
          var objectReference = playlistItem.objectReference;

          if (widgetUtils.isRenderingAllowed(objectReference)) {
            if (widgetUtils.isWebpageWidget(objectReference)) {
              var params = JSON.parse(playlistItem.additionalParams);
              return params && ((params.url && params.url.slice(0, 8) ===
                'https://') || (params.selector && params.selector.url &&
                params.selector.url.slice(0, 8) === 'https://'));
            }
            return true;
          }
        }
        return false;
      };

      var _setPlaceholderIcon = function (placeholder) {
        placeholder.className = '';

        if (placeholder.items && placeholder.items[0]) {
          placeholder.className = widgetUtils.getIconClass(placeholder.items[0]);
        }
      };

      factory.register = function (placeholder, element) {
        if (_isRenderingAllowed(placeholder)) {
          placeholder.className = '';
          factory._placeholders[placeholder.id] = placeholder;
          _createIframe(placeholder, element);
        } else {
          _setPlaceholderIcon(placeholder);
        }
      };

      factory.unregister = function (placeholder, element) {
        _setPlaceholderIcon(placeholder);
        delete factory._placeholders[placeholder.id];
        var frameName = IFRAME_PREFIX + placeholder.id;
        gadgetsApi.rpc.removeReceiver(frameName);
        element.find('#' + frameName).remove();
      };

      factory.forceReload = function (placeholder, element) {
        if (factory._placeholders[placeholder.id]) {
          factory.unregister(placeholder, element);
          factory.register(placeholder, element);
        }
      };

      factory.notifyChanges = function (placeholder, element) {
        if (factory._placeholders[placeholder.id]) {
          if (!_isRenderingAllowed(placeholder)) {
            factory.unregister(placeholder, element);
          } else {
            gadgetsApi.rpc.call(IFRAME_PREFIX + placeholder.id,
              'rsparam_set_' +
              placeholder.id, null, 'additionalParams', placeholder.items[
                0].additionalParams);
          }
        } else {
          factory.register(placeholder, element);
        }
      };

      var _createIframe = function (placeholder, element) {
        var renderId = placeholder.id;
        var widgetUrl = widgetUtils.rewriteS3Urls(placeholder.items[0].objectData);
        widgetUrl = widgetUrl +
          (widgetUrl.indexOf('?') > -1 ? '&' : '?') +
          'up_id=' + renderId +
          '&up_companyId=' + userState.getSelectedCompanyId() +
          '&up_rsW=' + placeholder.width +
          '&up_rsH=' + placeholder.height +
          '&parent=' + encodeURIComponent($window.location.origin);

        widgetUrl = widgetUrl
          .replace('http://', '//')
          .replace('https://', '//');

        var frameName = IFRAME_PREFIX + renderId;
        var myFrame = document.createElement('iFrame');
        myFrame.setAttribute('id', frameName);
        myFrame.setAttribute('name', frameName);
        myFrame.style.width = '100%';
        myFrame.style.height = '100%';
        myFrame.setAttribute('allowTransparency', true);
        myFrame.setAttribute('frameBorder', '0');
        myFrame.setAttribute('scrolling', 'no');
        element.append(myFrame);
        var myFrameObj = (myFrame.contentWindow) ? myFrame.contentWindow :
          (myFrame.contentDocument.document) ? myFrame.contentDocument.document :
          myFrame.contentDocument;
        myFrame.src = widgetUrl;

        myFrameObj.onload = (function () {
          gadgetsApi.rpc.setupReceiver(frameName);
        })();
      };

      gadgetsApi.rpc.register('rsevent_ready', function (id) {
        gadgetsApi.rpc.call(IFRAME_PREFIX + id, 'rscmd_play_' + id);
        //force redraw to fix #866
        angular.element('#' + IFRAME_PREFIX + id).parent().css('top', '+=1');
        $window.setTimeout(function () {
          angular.element('#' + IFRAME_PREFIX + id).parent().css('top', '-=1');
        }, 0);
      });

      gadgetsApi.rpc.register('rsparam_get', function (id, param) {
        var value;
        if (typeof (param) === 'string') {
          value = getParam(param, id);
        } else if (param.length) {
          value = [];
          for (var i = 0; i < param.length; i++) {
            value[i] = getParam(param[i], id);
          }
        }
        gadgetsApi.rpc.call(IFRAME_PREFIX + id, 'rsparam_set_' + id, null,
          param,
          value);
      });

      var getParam = function (paramName, id) {
        if (paramName === 'additionalParams') {
          return factory._placeholders[id].items[0].additionalParams;
        } else {
          return '';
        }
      };

      return factory;
    }
  ]);
