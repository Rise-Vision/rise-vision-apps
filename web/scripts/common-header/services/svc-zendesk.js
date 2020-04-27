/* jshint maxlen: false */

(function (angular) {
  'use strict';

  angular.module('risevision.common.support', [])
    .value('ZENDESK_WEB_WIDGET_SCRIPT',
      'window.zE||(function(e,t,s){var n=window.zE=window.zEmbed=function(){n._.push(arguments)},a=n.s=e.createElement(t),r=e.getElementsByTagName(t)[0];n.set=function(e){n.set._.push(e)},n._=[],n.set._=[],a.async=true,a.setAttribute("charset","utf-8"),a.src="https://static.zdassets.com/ekr/asset_composer.js?key="+s,n.t=+new Date,a.type="text/javascript",r.parentNode.insertBefore(a,r)})(document,"script","b8d6bdba-10ea-4b88-b96c-9d3905b85d8f");'
    )
    .factory('zendesk', ['$q', '$window', 'userState', 'ZENDESK_WEB_WIDGET_SCRIPT',
      function ($q, $window, userState, ZENDESK_WEB_WIDGET_SCRIPT) {

        var loaded = false;
        var previousUsername = '';
        var $ = $window.$;

        function ensureScript() {
          if (!loaded) {
            $window.zESettings = {
              webWidget: {
                helpCenter: {
                  title: {
                    '*': 'Help'
                  },
                  searchPlaceholder: {
                    '*': 'How can we help?'
                  },
                  messageButton: {
                    '*': 'Open a Support Ticket'
                  }
                },

                chat: {
                  suppress: true
                },

                contactForm: {
                  title: {
                    '*': 'Open a Support Ticket'
                  }
                }
              }
            };

            var scriptElem = $window.document.createElement('script');
            scriptElem.innerText = ZENDESK_WEB_WIDGET_SCRIPT;

            $window.document.body.appendChild(scriptElem);
            loaded = true;

            hideWidget();
          }
          return $q.when();
        }

        function initializeWidget() {
          return ensureScript()
            .then(_completeInitialization);
        }

        function _completeInitialization() {
          var username = userState.getUsername();

          if (previousUsername !== username) {
            var identity = {
              email: username,
              name: userState.getUserFullName()
            };

            if (username) {
              $window.zE(function () {
                $window.zE.identify(identity);
              });
            }

            previousUsername = username;
          }

          _changeBorderStyle();
          _enableSuggestions();
        }

        function _changeBorderStyle() {
          $('iframe[class^=zEWidget]').contents().find('.Container')
            .css('border', '1px solid #4ab767');
        }

        function logout() {
          previousUsername = '';
        }

        function _enableSuggestions() {
          if ($window.zE) {
            $window.zE(function () {
              $window.zE.setHelpCenterSuggestions({
                labels: ['help_widget_top_suggestions']
              });
            });
          }
        }

        function displayButton() {
          if ($window.zE) {
            $window.zE(function () {
              $window.zE.show();
            });
          }
        }

        function hideWidget() {
          if ($window.zE) {
            $window.zE(function () {
              $window.zE.hide();
            });
          }
        }

        function activateWidget() {
          if ($window.zE) {
            $window.zE(function () {
              $window.zE.activate();
            });
          }
        }

        return {
          initializeWidget: initializeWidget,
          displayButton: displayButton,
          hideWidget: hideWidget,
          activateWidget: activateWidget,
          logout: logout
        };

      }
    ])

    .run(['$rootScope', '$window', 'userState', 'userAuthFactory', 'zendesk', 'ZENDESK_WEB_WIDGET_SCRIPT',
      function ($rootScope, $window, userState, userAuthFactory, zendesk, ZENDESK_WEB_WIDGET_SCRIPT) {
        var widgetVisible = false;

        if (ZENDESK_WEB_WIDGET_SCRIPT) {
          zendesk.initializeWidget();

          userAuthFactory.authenticate()
            .then(function () {
              if (!userState.isLoggedIn()) {
                _showWebWidget();
              }
            })
            .catch(function () {
              _showWebWidget();
            });

          $rootScope.$on('risevision.user.authorized', function () {
            zendesk.initializeWidget(); // Needed to authenticate the user
            _hideWebWidget();
          });

          $rootScope.$on('risevision.user.signedOut', function () {
            _showWebWidget();
          });
        }

        function _hideWebWidget() {
          if (widgetVisible) {
            zendesk.hideWidget();
            widgetVisible = false;
          }
        }

        function _showWebWidget() {
          setTimeout(function () {
            zendesk.logout();
            zendesk.displayButton();
            widgetVisible = true;
          }, 2000);
        }
      }
    ]);
})(angular);
