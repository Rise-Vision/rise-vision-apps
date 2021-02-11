/* jshint maxlen: false */

(function (angular) {
  'use strict';

  angular.module('risevision.common.support', [])
    .value('HELP_URL', 'https://help.risevision.com/')
    .value('HELP_WIDGET_SCRIPT',
      '!function(e,l,v,i,o,n){e[i]||(e[i]={}),e[i].account_id=n;var g,h;g=l.createElement(v),g.type="text/javascript",g.async=1,g.src=o+n,h=l.getElementsByTagName(v)[0],h.parentNode.insertBefore(g,h);e[i].q=[];e[i].on=function(z,y){e[i].q.push([z,y])}}(window,document,"script","_elev","https://cdn.elev.io/sdk/bootloader/v4/elevio-bootloader.js?cid=","5f2331387a97f");'
    )
    .factory('helpWidgetFactory', ['$window', 'HELP_URL', 'HELP_WIDGET_SCRIPT',
      function ($window, HELP_URL, HELP_WIDGET_SCRIPT) {
        var loaded = false;
        var widgetScriptLoaded = false;

        function initializeWidget() {
          if (!loaded) {
            var scriptElem = $window.document.createElement('script');
            scriptElem.innerText = HELP_WIDGET_SCRIPT;

            $window.document.body.appendChild(scriptElem);
            $window._elev.on('load', function (_elev) {
              widgetScriptLoaded = true;
              _elev.setSettings({
                hideLauncher: true
              });
            });
            loaded = true;
          }
        }

        function showWidgetButton() {
          if ($window._elev) {
            $window._elev.setSettings({
              hideLauncher: false
            });
          }
        }

        function hideWidgetButton() {
          if ($window._elev) {
            $window._elev.setSettings({
              hideLauncher: true
            });
          }
        }

        function showHelpWidget() {
          if ($window._elev && widgetScriptLoaded) {
            $window._elev.openHome();
          } else {
            $window.open(HELP_URL, '_blank');
          }
        }

        function showContactUs() {
          if ($window._elev && widgetScriptLoaded) {
            $window._elev.openHome();
            $window._elev.openModule('2'); //defined in elev.io
          } else {
            $window.open(HELP_URL, '_blank');
          }
        }

        return {
          initializeWidget: initializeWidget,
          showWidgetButton: showWidgetButton,
          hideWidgetButton: hideWidgetButton,
          showHelpWidget: showHelpWidget,
          showContactUs: showContactUs
        };

      }
    ])

    .run(['$rootScope', '$window', 'userState', 'userAuthFactory', 'helpWidgetFactory', 'HELP_WIDGET_SCRIPT',
      function ($rootScope, $window, userState, userAuthFactory, helpWidgetFactory, HELP_WIDGET_SCRIPT) {
        if (HELP_WIDGET_SCRIPT) {
          helpWidgetFactory.initializeWidget();

          userAuthFactory.authenticate()
            .then(function () {
              if (!userState.isLoggedIn()) {
                _showHelpWidgetButton();
              }
            })
            .catch(function () {
              _showHelpWidgetButton();
            });

          $rootScope.$on('risevision.user.authorized', function () {
            _hideHelpWidgetButton();
          });

          $rootScope.$on('risevision.user.signedOut', function () {
            _showHelpWidgetButton();
          });
        }

        function _hideHelpWidgetButton() {
          helpWidgetFactory.hideWidgetButton();
        }

        function _showHelpWidgetButton() {
          helpWidgetFactory.showWidgetButton();
        }
      }
    ]);
})(angular);
