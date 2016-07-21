'use strict';

angular.module('risevision.editor.services')
  .value('IFRAME_PREFIX', 'if_')
  .value('CUSTOM_WIDGET_ICONS', {
    '2d407395-d1ae-452c-bc27-78124a47132b': 'ph-video-item', // Video Widget - Prod
    '4bf6fb3d-1ead-4bfb-b66f-ae1fcfa3c0c6': 'ph-video-item' // Video Widget - Test
  })
  .factory('widgetRenderer', ['gadgetsApi', '$window', 'IFRAME_PREFIX',
    'RENDER_WIDGETS', 'userState', 'CUSTOM_WIDGET_ICONS',
    function (gadgetsApi, $window, IFRAME_PREFIX, RENDER_WIDGETS, userState,
      CUSTOM_WIDGET_ICONS) {
      var factory = {};

      factory._placeholders = {};

      var _isRenderingAllowed = function (playlistItem) {
        var objectReference = playlistItem.objectReference;
        for (var k in RENDER_WIDGETS) {
          if (RENDER_WIDGETS[k] === objectReference) {
            if (objectReference === RENDER_WIDGETS.WEB_PAGE_WIDGET) {
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
        if (placeholder.items && placeholder.items[0]) {
          var objectReference = placeholder.items[0].objectReference;
          if (Object.keys(CUSTOM_WIDGET_ICONS).indexOf(objectReference) >=
            0) {
            placeholder.className = 'ph-item-icon ' + CUSTOM_WIDGET_ICONS[
              objectReference];
          } else {
            placeholder.className = 'ph-item-icon';
          }
        } else {
          placeholder.className = '';
        }
      };

      factory.register = function (placeholder, element) {
        if (placeholder.items && placeholder.items[0] &&
          _isRenderingAllowed(placeholder.items[0])) {
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
          if (!placeholder.items || !placeholder.items[0] || !
            _isRenderingAllowed(placeholder.items[0])) {
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
        var widgetUrl = placeholder.items[0].objectData +
          '?up_id=' + renderId +
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
