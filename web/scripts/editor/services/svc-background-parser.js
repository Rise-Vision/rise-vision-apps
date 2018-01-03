'use strict';

angular.module('risevision.editor.services')
  .factory('backgroundParser', [

    function () {
      var factory = {};

      var BACKGROUND_TOKENS = {
        RGB: 'rgb',
        HEX: /#([a-f0-9]{3,4}){1,2}\b/i,
        URL: 'url'
      };

      var POSITION_OPTIONS = [
        ['left top', 'top-left'],
        ['center top', 'top-center'],
        ['right top', 'top-right'],
        ['left center', 'middle-left'],
        ['center center', 'middle-center'],
        ['right center', 'middle-right'],
        ['left bottom', 'bottom-left'],
        ['center bottom', 'bottom-center'],
        ['right bottom', 'bottom-right']
      ];

      var REPEAT_OPTIONS = [
        'repeat',
        'no-repeat',
        'repeat-y',
        'repeat-x'
      ];

      factory.parseBackground = function (backgroundStyle,
        backgroundScaleToFit) {
        var background = {};
        var closingParenthesesPosition;

        if (backgroundStyle) {

          var rgbTokenPosition = backgroundStyle.indexOf(BACKGROUND_TOKENS.RGB);
          if (rgbTokenPosition !== -1) {
            closingParenthesesPosition = backgroundStyle.indexOf(')',
              rgbTokenPosition);
            background.color = backgroundStyle.substring(rgbTokenPosition,
              closingParenthesesPosition + 1);
          }

          var hexTokens = BACKGROUND_TOKENS.HEX.exec(backgroundStyle);

          if (hexTokens) {
            background.color = hexTokens[0];
          }

          var urlTokenPosition = backgroundStyle.indexOf(
            BACKGROUND_TOKENS.URL);
          if (urlTokenPosition !== -1) {

            background.useImage = true;
            background.image = {};

            var openingParenthesesPosition = backgroundStyle.indexOf(
              '(\'', urlTokenPosition);
            closingParenthesesPosition = backgroundStyle.indexOf(
              '\')', urlTokenPosition);
            background.image.url = backgroundStyle.substring(
              openingParenthesesPosition + 2,
              closingParenthesesPosition).replace(/\\'/g, '\'');

            for (var i = 0; i < POSITION_OPTIONS.length; i++) {
              if (backgroundStyle.indexOf(POSITION_OPTIONS[i][0]) !== -1) {
                background.image.position = POSITION_OPTIONS[i][1];
              }
            }

            for (i = 0; i < REPEAT_OPTIONS.length; i++) {
              if (backgroundStyle.indexOf(REPEAT_OPTIONS[i]) !== -1) {
                background.image.repeat = REPEAT_OPTIONS[i];
              }
            }

            background.image.scale = backgroundScaleToFit;
          }

        }

        return Object.keys(background).length ? background : undefined;
      };

      factory.getStyle = function (background) {

        var backgroundStyle = '';

        if (background && background.color) {
          backgroundStyle = background.color;
        }

        if (background && background.useImage) {
          backgroundStyle += backgroundStyle ? ' ' : '';
          backgroundStyle += 'url(\'' + background.image.url.replace(/'/g,
              '\\\'') +
            '\')';

          if (background.image.repeat && !background.image.scale) {
            backgroundStyle += ' ' + background.image.repeat;
          } else {
            backgroundStyle += ' no-repeat';
          }

          if (background.image.position) {
            for (var i = 0; i < POSITION_OPTIONS.length; i++) {
              if (background.image.position.indexOf(POSITION_OPTIONS[i][1]) !==
                -1) {
                backgroundStyle += ' ' + POSITION_OPTIONS[i][0];
              }
            }
          }
        }

        return backgroundStyle;
      };

      factory.getScaleToFit = function (background) {

        var backgroundScaleToFit = false;

        if (background && background.useImage && background.image.scale) {
          backgroundScaleToFit = true;
        }

        return backgroundScaleToFit;
      };

      return factory;
    }
  ]);
