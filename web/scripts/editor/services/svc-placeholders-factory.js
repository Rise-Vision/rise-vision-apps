'use strict';

angular.module('risevision.editor.services')
  .factory('placeholdersFactory', ['editorFactory', 'artboardFactory',
    'presentationParser', 'presentationTracker', 'placeholderFactory',
    function (editorFactory, artboardFactory, presentationParser,
      presentationTracker, placeholderFactory) {
      var factory = {};

      factory.getPlaceholders = function () {
        return editorFactory.presentation.placeholders ?
          editorFactory.presentation.placeholders :
          editorFactory.presentation.placeholders = [];
      };

      var _newPlaceholder = function () {
        return {
          type: 'playlist',
          width: 400,
          widthUnits: 'px',
          height: 200,
          heightUnits: 'px',
          top: 0,
          topUnits: 'px',
          left: 0,
          leftUnits: 'px',
          visibility: true,
          transition: 'none',
          timeDefined: false,
          distributeToAll: true
        };
      };

      var _getCenterPosition = function (widgetSize, artboardSize,
        totalPixelSize, scroll) {
        var center = (artboardSize / 2) + scroll;
        var position = center - (widgetSize / 2);

        if (position < 0) {
          position = 0;
        } else if (position + widgetSize > totalPixelSize) {
          position = totalPixelSize - widgetSize;
        }

        return parseInt(position, 10);
      };

      var _offsetPlaceholder = function (placeholder) {
        var placeholders = factory.getPlaceholders();

        for (var i = 0; i < placeholders.length; i++) {
          if (placeholders[i].top === placeholder.top && placeholders[i].left ===
            placeholder.left) {
            var cornersFound = 0;

            var rightPadding = editorFactory.presentation.width -
              (placeholder.left + placeholder.width);
            var bottomPadding = editorFactory.presentation.height -
              (placeholder.top + placeholder.height);
            if (rightPadding > 0) {
              placeholder.left += Math.min(20, rightPadding);
            } else {
              cornersFound++;
            }

            if (bottomPadding > 0) {
              placeholder.top += Math.min(20, bottomPadding);
            } else {
              cornersFound++;
            }

            if (cornersFound < 2) {
              _offsetPlaceholder(placeholder);
            }

            break;
          }
        }
      };

      var _centerPlaceholder = function (placeholder) {
        if (!artboardFactory.getWorkspaceElement) {
          return;
        }

        var leftPadding = 12;
        var topPadding = 60 + 12;
        var workspaceElement = artboardFactory.getWorkspaceElement();
        var width = editorFactory.presentation.width;
        var height = editorFactory.presentation.height;
        if (placeholder.width > width) {
          placeholder.width = width;
          placeholder.left = 0;
        } else {
          var totalWidth = Math.min(width, workspaceElement.clientWidth -
            leftPadding);
          var scrollLeft = workspaceElement.scrollLeft;

          placeholder.left = _getCenterPosition(placeholder.width,
            totalWidth, width, scrollLeft);
        }

        if (placeholder.height > height) {
          placeholder.height = height;
          placeholder.top = 0;
        } else {
          var totalHeight = Math.min(height, workspaceElement.clientHeight -
            topPadding);
          var scrollTop = workspaceElement.scrollTop;

          placeholder.top = _getCenterPosition(placeholder.height,
            totalHeight, height, scrollTop);
        }

        _offsetPlaceholder(placeholder);
      };

      factory.addNewPlaceholder = function (placeholder) {
        presentationTracker('Add Placeholder', editorFactory.presentation.id,
          editorFactory.presentation.name);
        placeholder = placeholder || _newPlaceholder();

        _centerPlaceholder(placeholder);

        factory.getPlaceholders().push(placeholder);

        placeholder.zIndex = factory.getPlaceholders().length - 1;

        // Update Presentation - adds Placeholder to HTML
        // & assigns Id to placeholder
        presentationParser.updatePresentation(editorFactory.presentation);
        placeholderFactory.setPlaceholder(placeholder);
      };

      var _getItemIndex = function (placeholder) {
        return factory.getPlaceholders() ?
          factory.getPlaceholders().indexOf(placeholder) : -1;
      };

      factory.isNew = function (placeholder) {
        return _getItemIndex(placeholder) === -1;
      };

      factory.updatePlaceholder = function (placeholder) {
        if (factory.isNew(placeholder)) {
          factory.getPlaceholders().push(placeholder);
        }
      };

      factory.removePlaceholder = function (placeholder) {
        var index = _getItemIndex(placeholder);
        if (index !== -1) {
          placeholder.deleted = true;

          // Update Presentation - removes placeholder form HTML
          presentationParser.updatePresentation(editorFactory.presentation);
        }
      };

      factory.duplicatePlaceholder = function (placeholder) {
        var index = _getItemIndex(placeholder);
        if (index !== -1) {
          var newPlaceholder = angular.copy(placeholder);
          newPlaceholder.id = undefined;

          factory.addNewPlaceholder(newPlaceholder);
        }
      };

      return factory;
    }
  ]);
