'use strict';

// ------------------------------------
// Action Sheet
// ------------------------------------
angular.module('risevision.common.components.action-sheet', [])
  .directive('actionSheet', ['$document', '$compile', '$timeout',
    function ($document, $compile, $timeout) {
      return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {

          var body = $document.find('body').eq(0);
          var isVisible = false;
          var backdropDomEl = document.getElementById('action-sheet-backdrop');
          var showBackdrop = iAttrs.actionSheetBackdrop !== 'false';
          var bindClick = iAttrs.actionSheetBindClick !== 'false';


          if (showBackdrop) {
            if (!angular.isObject(backdropDomEl)) {
              backdropDomEl = angular.element(
                '<div id="action-sheet-backdrop" class="modal-backdrop"></div>'
              );
              body.append(backdropDomEl);
            } else {
              backdropDomEl = angular.element(backdropDomEl);
            }
          }

          scope.templateUrl = scope.$eval(iAttrs.actionSheet);
          scope.title = scope.$eval(iAttrs.title);

          var angularDomEl = angular.element(
            '<div class="action-sheet is-action-sheet-closed"><ng-include src="templateUrl"></ng-include></div>'
          );

          var actionSheetDomEl = $compile(angularDomEl)(scope);
          body.append(actionSheetDomEl);

          var toggle = function () {
            isVisible = !isVisible;
            //fix for #298 - BEGIN
            //need to completly hide element
            if (isVisible) {
              //make element visible first, then apply transformation
              actionSheetDomEl.toggleClass('is-action-sheet-closed');
              $timeout(function () {
                actionSheetDomEl.toggleClass('is-action-sheet-opened');
                if (showBackdrop) {
                  backdropDomEl.toggleClass('is-action-sheet-opened');
                }
              });
            } else {
              //apply transformation first, then hide element
              actionSheetDomEl.toggleClass('is-action-sheet-opened');
              if (showBackdrop) {
                backdropDomEl.toggleClass('is-action-sheet-opened');
              }
              $timeout(function () {
                actionSheetDomEl.toggleClass('is-action-sheet-closed');
              }, 500);
            }
            //fix for #298 - END

            if (showBackdrop) {
              if (isVisible && bindClick) {
                backdropDomEl.bind('tap', toggle);
                backdropDomEl.bind('click', toggle);
              } else {
                backdropDomEl.unbind('tap');
                backdropDomEl.unbind('click');
              }
            }
          };

          //add classes

          if (iAttrs.actionSheetClass) {
            iAttrs.actionSheetClass.split(' ').forEach(function (cls) {
              actionSheetDomEl.addClass(cls);
            });
          }

          if (bindClick) {
            iElement.bind('tap', toggle);
            iElement.bind('click', toggle);
            angularDomEl.bind('tap', toggle);
            angularDomEl.bind('click', toggle);
          } else {
            iElement.bind('toggle', toggle);
          }

          scope.$on('$destroy', function () {
            actionSheetDomEl.remove();
          });
        }
      };
    }
  ])
  .directive('replaceInclude', function () {
    return {
      require: 'ngInclude',
      restrict: 'A',
      link: function (scope, el) {
        el.replaceWith(el.children());
      }
    };
  });
