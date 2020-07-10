'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentRichText', ['$timeout', '$window', 'templateEditorFactory',
    'COMMON_FONT_FAMILIES', 'GOOGLE_MOST_POPULAR_FONTS',
    function ($timeout, $window, templateEditorFactory,
      COMMON_FONT_FAMILIES, GOOGLE_MOST_POPULAR_FONTS) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-rich-text.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.data = {};

          loadGoogleFonts();
          initTinyMce();

          function _load() {
            $scope.data.richText = $scope.getAvailableAttributeData($scope.componentId, 'richtext');
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'richtext', $scope.data.richText);
            $scope.setAttributeData($scope.componentId, 'googlefonts', getGoogleFontsUsed(getAllFontsUsed($scope
              .data.richText)));
          };

          $scope.registerDirective({
            type: 'rise-rich-text',
            iconType: 'streamline',
            icon: 'text',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            }
          });

          function initTinyMce() {
            /*jshint camelcase: false */
            $scope.tinymceOptions = {
              baseURL: '/vendor/tinymce/', //set path to load theme and skin files
              plugins: 'colorpicker textcolor lists',
              menubar: false,
              toolbar1: 'fontselect fontsizeselect | ' +
                'bold italic underline | ' +
                'forecolor backcolor | ' +
                'numlist bullist | ' +
                'alignleft aligncenter alignright | ' +
                'removeformat',
              fontsize_formats: getFontSizes(),
              force_p_newlines: false,
              forced_root_block: '',
              elementpath: false,
              content_style: getContentStyle(),
              font_formats: getSortedFontFormats(),
              setup: function (editor) {
                editor.on('paste', function (e) {
                  //paste does not trigger change event
                  //editor.getContent() needs timeout in order to include the change
                  setTimeout(function () {
                    $scope.data.richText = editor.getContent();
                    $scope.save();
                  }, 100);
                });
              }
            };
            /*jshint camelcase: true */
          }

          function getAllFontsUsed(richText) {
            var wrapper = document.createElement('div'),
              families = '',
              $wrapper;

            wrapper.innerHTML = richText;
            $wrapper = angular.element(wrapper);

            // go through fonts applied in html to prepare a list to find out which ones are google fonts
            angular.forEach($wrapper.find('span'), function (span) {
              var family = angular.element(span).css('font-family');
              // remove single quotes (if applied) and fallback fonts
              if (family) {
                family = family.replace(/[']/g, '').split(',')[0];

                if (families.indexOf(family) === -1) {
                  // add font family to the list
                  families += family + ',';
                }
              }
            });

            return families;
          }

          function getGoogleFontsUsed(fontsUsed) {
            var googleFontsUsed = [];

            angular.forEach(GOOGLE_MOST_POPULAR_FONTS, function (family) {
              if (fontsUsed.indexOf(family) !== -1) {
                googleFontsUsed.push(family);
              }
            });

            return googleFontsUsed;
          }

          function getSortedFontFormats() {
            var allFonts = COMMON_FONT_FAMILIES.concat(getGoogleFontsFamilies());
            return allFonts.sort().join('');
          }

          function getGoogleFontsUrl() {
            return 'https://fonts.googleapis.com/css2?family=' +
              encodeURI(GOOGLE_MOST_POPULAR_FONTS.join('&family='));
          }

          function getGoogleFontsFamilies() {
            var result = [];
            var fallback = ',sans-serif;';

            angular.forEach(GOOGLE_MOST_POPULAR_FONTS, function (family) {
              result.push(family + '=' + family + fallback);
            });

            return result;
          }

          //lazy load Google fonts
          function loadGoogleFonts() {
            var linkId = 'mostPopularGoogleFonts';
            if (!document.getElementById(linkId)) {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.type = 'text/css';
              link.id = linkId;
              link.href = getGoogleFontsUrl();
              document.head.appendChild(link);
            }
          }

          function getContentStyle() {
            var googleFontsCss = '@import url("' + getGoogleFontsUrl() + '");';
            //zoom calculation: 400px (attribute editor width) / 1920px (temaplte width) = ~20%
            var scaleEditorCss = 'body {transform-origin: top left; transform: scale(0.2); width: 500%;' +
              //set default font size
              'font-size: 96px !important;}';
            return googleFontsCss + scaleEditorCss;
          }

          function getFontSizes() {
            var result = '';

            for (var i = 24; i <= 300; i += 6) {
              result += (result ? ' ' : '') + i + 'px';
            }

            return result;
          }

        }
      };
    }
  ])
  .constant('COMMON_FONT_FAMILIES',
    [
      'Andale Mono=andale mono,monospace;',
      'Arial=arial,helvetica,sans-serif;',
      'Arial Black=arial black,sans-serif;',
      'Book Antiqua=book antiqua,palatino,serif;',
      'Comic Sans MS=comic sans ms,sans-serif;',
      'Courier New=courier new,courier,monospace;',
      'Georgia=georgia,palatino,serif;',
      'Helvetica=helvetica,arial,sans-serif;',
      'Impact=impact,sans-serif;',
      'Symbol=symbol;',
      'Tahoma=tahoma,arial,helvetica,sans-serif;',
      'Terminal=terminal,monaco,monospace;',
      'Times New Roman=times new roman,times,serif;',
      'Trebuchet MS=trebuchet ms,geneva,sans-serif;',
      'Verdana=verdana,geneva,sans-serif;'
    ])
  .constant('GOOGLE_MOST_POPULAR_FONTS',
    [
      'Roboto',
      'Open Sans',
      'Lato',
      'Noto Sans JP',
      'Montserrat',
      'Roboto Condensed',
      'Source Sans Pro',
      'Oswald',
      'Raleway',
      'Roboto Mono',
      'Poppins',
      'Noto Sans',
      'Roboto Slab',
      'Merriweather',
      'PT Sans',
      'Ubuntu',
      'Playfair Display',
      'Muli',
      'Open Sans Condensed',
      'PT Serif',
      'Mukta',
      'Nunito',
      'Lora',
      'Work Sans',
      'Fira Sans',
      'Rubik',
      'Noto Sans KR',
      'Noto Serif',
      'Titillium Web',
      'Nanum Gothic',
      'Noto Sans TC',
      'Quicksand',
      'Nunito Sans',
      'PT Sans Narrow',
      'Heebo',
      'Inconsolata',
      'Barlow',
      'Hind Siliguri',
      'Oxygen',
      'Arimo',
      'Dosis',
      'Libre Baskerville',
      'Crimson Text',
      'Karla',
      'Slabo 27px',
      'Josefin Sans',
      'Bitter',
      'Anton',
      'Libre Franklin',
      'Cabin'
    ]);
