'use strict';

angular.module('risevision.apps.directives')
  .directive('pageTitle', ['$rootScope', '$state', '$timeout',
    function ($rootScope, $state, $timeout) {
      return {
        link: function ($scope, element) {

          var _getTitle = function (stateName) {
            switch ($state.current.name) {

              // userstate routes:
            case 'common':
            case 'common.auth':
            case 'common.auth.unauthorized':
              return 'Sign In';

            case 'common.auth.createaccount':
            case 'common.auth.joinaccount':
              return 'Sign Up';

            case 'common.auth.requestpasswordreset':
            case 'common.auth.resetpassword':
              return 'Reset Password';

            case 'common.auth.confirmaccount':
              return 'Confirm Account';

            case 'common.auth.unsubscribe':
              return 'Unsubscribe';

              // Apps auth routes:
            case 'common.auth.signin':
              return 'Sign In';

            case 'common.auth.signup':
            case 'common.auth.unregistered':
              return 'Sign Up';

              // Apps routes:
            case 'apps':
            case 'apps.launcher':
            case 'apps.launcher.home':
              return 'Home';

            case 'apps.launcher.onboarding':
              return 'Onboarding';

            case 'apps.billing':
            case 'apps.billing.home':
              return 'Billing';

            case 'apps.schedules':
            case 'apps.schedules.list':
              return 'Schedules';

            case 'apps.schedules.details':
              return 'Edit Schedule';

            case 'apps.schedules.add':
              return 'Create New Schedule';

            case 'apps.displays':
            case 'apps.displays.list':
              return 'Displays';

            case 'apps.displays.change':
            case 'apps.displays.details':
              return 'Display Settings';

            case 'apps.displays.alerts':
              return 'Alert Settings';

            case 'apps.editor':
            case 'apps.editor.home':
            case 'apps.editor.list':
            case 'apps.editor.add':
              return 'Presentations';

            case 'apps.editor.workspace':
            case 'apps.editor.workspace.artboard':
            case 'apps.editor.workspace.htmleditor':
            case 'apps.editor.templates':
            case 'apps.editor.templates.edit':
              return 'Edit Presentation';

            case 'apps.storage':
            case 'apps.storage.home':
              return 'Storage';

            default:
              return;
            }

          };

          var _updateTitle = function () {
            var title = _getTitle();
            title = title ? (title + ' | ') : '';

            $timeout(function () {
              element.text(title + 'Rise Vision Apps');
            }, 0, false);
          };

          _updateTitle();

          $rootScope.$on('$stateChangeSuccess', function () {
            _updateTitle();
          });
        }
      };
    }
  ]);
