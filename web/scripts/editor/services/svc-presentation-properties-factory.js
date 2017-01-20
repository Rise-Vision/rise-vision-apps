'use strict';

angular.module('risevision.editor.services')
  .factory('presentationPropertiesFactory', ['editorFactory',
    'presentationParser', 'backgroundParser',
    function (editorFactory, presentationParser, backgroundParser) {
      var factory = {};

      var _newPresentationProperties = function () {
        return {
          id: '',
          name: 'New Presentation',
          width: 1920,
          height: 1080,
          widthUnits: 'px',
          heightUnits: 'px',
          background: undefined,
          hidePointer: true,
          donePlaceholder: '',
          isTemplate: false,
          isStoreProduct: false
        };
      };

      factory.getPresentationProperties = function () {
        var presentationProperties = _newPresentationProperties();

        if (editorFactory.presentation && editorFactory.presentation.name) {
          presentationProperties.id = editorFactory.presentation.id;
          presentationProperties.name = editorFactory.presentation.name;
          presentationProperties.width = editorFactory.presentation.width;
          presentationProperties.height = editorFactory.presentation.height;
          presentationProperties.widthUnits = editorFactory.presentation.widthUnits;
          presentationProperties.heightUnits = editorFactory.presentation.heightUnits;
          presentationProperties.background = backgroundParser.parseBackground(
            editorFactory.presentation.backgroundStyle,
            editorFactory.presentation.backgroundScaleToFit
          );
          presentationProperties.hidePointer = editorFactory.presentation.hidePointer;
          presentationProperties.donePlaceholder = editorFactory.presentation
            .donePlaceholder;
          presentationProperties.isTemplate = editorFactory.presentation.isTemplate;
          presentationProperties.isStoreProduct = editorFactory.presentation
            .isStoreProduct;
        }

        return presentationProperties;
      };

      factory.setPresentationProperties = function (presentationProperties) {
        if (presentationProperties) {
          editorFactory.presentation.id = presentationProperties.id;
          editorFactory.presentation.name = presentationProperties.name;
          editorFactory.presentation.width = presentationProperties.width;
          editorFactory.presentation.height = presentationProperties.height;
          editorFactory.presentation.widthUnits = presentationProperties.widthUnits;
          editorFactory.presentation.heightUnits = presentationProperties.heightUnits;
          editorFactory.presentation.backgroundStyle = backgroundParser.getStyle(
            presentationProperties.background);
          editorFactory.presentation.backgroundScaleToFit =
            backgroundParser.getScaleToFit(presentationProperties.background);
          editorFactory.presentation.hidePointer = presentationProperties.hidePointer;
          editorFactory.presentation.donePlaceholder =
            presentationProperties.donePlaceholder;
          editorFactory.presentation.isTemplate = presentationProperties.isTemplate;
          editorFactory.presentation.isStoreProduct =
            presentationProperties.isStoreProduct;

          presentationParser.updatePresentation(editorFactory.presentation);
        }
      };

      return factory;
    }
  ]);
