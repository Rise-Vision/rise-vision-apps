/* jshint maxlen: false */

(function (angular) {
  'use strict';

  angular.module('risevision.common.support', [])
    .value('HELP_WIDGET_SCRIPT',
      '!function(e,l,v,i,o,n){e[i]||(e[i]={}),e[i].account_id=n;var g,h;g=l.createElement(v),g.type="text/javascript",g.async=1,g.src=o+n,h=l.getElementsByTagName(v)[0],h.parentNode.insertBefore(g,h);e[i].q=[];e[i].on=function(z,y){e[i].q.push([z,y])}}(window,document,"script","_elev","https://cdn.elev.io/sdk/bootloader/v4/elevio-bootloader.js?cid=","5f2331387a97f");'
    )
    .factory('helpWidget', ['$q', '$window', 'userState', 'HELP_WIDGET_SCRIPT',
      function ($q, $window, userState, HELP_WIDGET_SCRIPT) {
        var loaded = false;

        function ensureScript() {
          if (!loaded) {
            var scriptElem = $window.document.createElement('script');
            scriptElem.innerText = HELP_WIDGET_SCRIPT;

            $window.document.body.appendChild(scriptElem);
            $window._elev.on('load', function(_elev) {
              _elev.setSettings({
                hideLauncher: true
              });
            });
            loaded = true;
          }
          return $q.when();
        }

        function initializeWidget() {
          return ensureScript();
        }


        function showWidgetButton() {
          if ($window._elev) {
            $window._elev.setSettings({hideLauncher: false});
          }
        }

        function hideWidgetButton() {
          if ($window._elev) {
            $window._elev.setSettings({hideLauncher: true});
          }
        }

        function activateWidget() {
          if ($window._elev) {
            $window._elev.openHome();
          }
        }

        return {
          initializeWidget: initializeWidget,
          showWidgetButton: showWidgetButton,
          hideWidgetButton: hideWidgetButton,
          activateWidget: activateWidget
        };

      }
    ])

    .run(['$rootScope', '$window', 'userState', 'userAuthFactory', 'helpWidget', 'HELP_WIDGET_SCRIPT',
      function ($rootScope, $window, userState, userAuthFactory, helpWidget, HELP_WIDGET_SCRIPT) {
        if (HELP_WIDGET_SCRIPT) {
          helpWidget.initializeWidget();

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
          helpWidget.hideWidgetButton();
        }

        function _showHelpWidgetButton() {
          helpWidget.showWidgetButton();
        }
      }
    ]);
})(angular);
