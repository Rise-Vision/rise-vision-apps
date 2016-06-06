'use strict';

angular.module('risevision.editor.services')
  .factory('placeholdersFactory', ['editorFactory', 'presentationParser',
    'presentationTracker', 'placeholderFactory',
    function (editorFactory, presentationParser, presentationTracker,
      placeholderFactory) {
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

      factory.addNewPlaceholder = function (placeholder) {
        presentationTracker('Add Placeholder', editorFactory.presentation.id,
          editorFactory.presentation.name);
        placeholder = placeholder || _newPlaceholder();

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
