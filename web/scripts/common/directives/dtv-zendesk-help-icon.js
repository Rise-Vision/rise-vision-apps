'use strict';

angular.module('risevision.apps.directives')
  .directive('zendeskHelpIcon', ['$rootScope', 'zendesk', function ($rootScope, zendesk) {
    return {
      restrict: 'E',
      template: '<div class="zendesk-help-icon">?</div>',
      link: function ($scope, $element) {
        zendesk.ensureScript();

        $element.on('click', function () {
          zendesk.showWidget();
        });

        $rootScope.$on('$stateChangeStart', function (event, toState) {
          if (toState && toState.name.indexOf('apps.editor.workspace') >= 0) {
            $element.children().addClass('zendesk-help-icon-editor');
          }
          else {
            $element.children().removeClass('zendesk-help-icon-editor');
          }
        });
      }
    };
  }]);
