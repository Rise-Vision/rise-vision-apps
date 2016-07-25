'use strict';

angular.module('risevision.editor.services')
  .constant('IMAGE_ADDITIONAL_PARAMS', {
    selector: {
      selection: undefined,
      storageName: undefined,
      url: undefined
    },
    storage: {
      companyId: undefined,
      fileName: undefined,
      folder: undefined
    },
    resume: true,
    scaleToFit: true,
    position: 'middle-center',
    duration: 10,
    pause: 10,
    autoHide: false,
    url: '',
    background: {}
  })
  .constant('VIDEO_ADDITIONAL_PARAMS', {
    selector: {
      selection: undefined,
      storageName: undefined,
      url: undefined
    },
    url: '',
    storage: {
      companyId: undefined,
      fileName: undefined,
      folder: undefined
    },
    video: {
      scaleToFit: true,
      volume: 50,
      controls: true,
      autoplay: true,
      resume: true,
      pause: 5
    }
  })
  .factory('playlistItemFactory', ['$modal', '$log', 'userState',
    'gadgetFactory', 'editorFactory', 'placeholderPlaylistFactory',
    'fileSelectorFactory', 'presentationTracker', 'RENDER_WIDGETS',
    'VIDEO_WIDGET', 'SELECTOR_TYPES', 'IMAGE_ADDITIONAL_PARAMS',
    'VIDEO_ADDITIONAL_PARAMS',
    function ($modal, $log, userState, gadgetFactory, editorFactory,
      placeholderPlaylistFactory, fileSelectorFactory, presentationTracker,
      RENDER_WIDGETS, VIDEO_WIDGET, SELECTOR_TYPES,
      IMAGE_ADDITIONAL_PARAMS, VIDEO_ADDITIONAL_PARAMS) {
      var factory = {};

      var _newPlaylistItem = function () {
        return {
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null
        };
      };

      var _newWidget = function (widget) {
        var item = _newPlaylistItem();

        item.type = widget.gadgetType ?
          widget.gadgetType.toLowerCase() : 'widget';
        item.name = widget.name ? widget.name : 'Widget Item';

        item.objectData = widget.url;
        item.objectReference = widget.id;
        item.settingsUrl = widget.settingsUrl;

        return item;
      };

      var _addProduct = function (productDetails) {
        presentationTracker('Content Selected', editorFactory.presentation.id,
          editorFactory.presentation.name);
        gadgetFactory.getGadgetByProduct(productDetails.productCode)
          .then(function (gadget) {
            var item = _newWidget(gadget);

            factory.edit(item, true);
          });
      };

      factory.addContent = function () {
        presentationTracker('Add Content', editorFactory.presentation.id,
          editorFactory.presentation.name);
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/store-products-modal.html',
          size: 'lg',
          controller: 'storeProductsModal',
          resolve: {
            category: function () {
              return 'Content';
            }
          }
        });

        modalInstance.result.then(_addProduct);
      };

      var _getItemByWidgetId = function (widgetId) {
        return gadgetFactory.getGadget(widgetId)
          .then(function (gadget) {
            return (_newWidget(gadget));
          });
      };

      factory.addTextWidget = function () {
        presentationTracker('Add Text Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        _getItemByWidgetId(RENDER_WIDGETS.TEXT_WIDGET)
          .then(function (item) {
            factory.edit(item, true);
          });
      };

      var _populateAdditionalParams = function (additionalParams, fileUrl,
        file) {
        additionalParams = angular.copy(additionalParams);

        additionalParams.selector.storageName = file.name;
        additionalParams.selector.url = fileUrl;
        additionalParams.storage.companyId = userState.getSelectedCompanyId();
        if (file.kind === 'folder') {
          additionalParams.selector.selection = SELECTOR_TYPES.SINGLE_FOLDER;
          additionalParams.storage.folder = file.name;
        } else {
          additionalParams.selector.selection = SELECTOR_TYPES.SINGLE_FILE;
          additionalParams.storage.fileName = file.name;
        }

        return JSON.stringify(additionalParams);
      };

      var _addImage = function (fileUrl, file) {
        presentationTracker('Add Image Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        _getItemByWidgetId(RENDER_WIDGETS.IMAGE_WIDGET)
          .then(function (item) {
            item.name = file.name;

            item.additionalParams = _populateAdditionalParams(
              IMAGE_ADDITIONAL_PARAMS, fileUrl, file);
            placeholderPlaylistFactory.updateItem(item);
          });
      };

      var _addVideo = function (fileUrl, file) {
        presentationTracker('Add Video Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        _getItemByWidgetId(VIDEO_WIDGET)
          .then(function (item) {
            item.name = file.name;
            item.playUntilDone = true;

            item.additionalParams = _populateAdditionalParams(
              VIDEO_ADDITIONAL_PARAMS, fileUrl, file);
            placeholderPlaylistFactory.updateItem(item);
          });
      };

      factory.selectFiles = function (type) {
        fileSelectorFactory.openSelector(SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS)
          .then(function (files) {
            var fileObjects = fileSelectorFactory.getSelectedFiles();
            for (var i = 0; i < files.length; i++) {
              if (type === 'image') {
                _addImage(files[i], fileObjects[i]);
              } else if (type === 'video') {
                _addVideo(files[i], fileObjects[i]);
              }
            }
          });
      };

      factory.edit = function (item, showWidgetModal) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/playlist-item-modal.html',
          size: 'md',
          controller: 'PlaylistItemModalController',
          resolve: {
            item: function () {
              return item;
            },
            showWidgetModal: function () {
              return showWidgetModal;
            }
          }
        });
      };

      var _newWidgetByUrl = function (widgetDetails) {
        var item = _newPlaylistItem();
        item.type = 'widget';
        item.name = 'Widget from URL';
        item.objectData = widgetDetails.url;
        if (widgetDetails.settingsUrl) {
          item.settingsUrl = widgetDetails.settingsUrl;
        }
        factory.edit(item);
      };

      factory.addWidgetByUrl = function () {
        presentationTracker('Add Widget By URL', editorFactory.presentation
          .id, editorFactory.presentation.name);
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/widget-item-modal.html',
          controller: 'WidgetItemModalController',
          size: 'md'
        });
        modalInstance.result.then(function (result) {
          if (result && result.url) {
            _newWidgetByUrl(result);
          }
        });
      };

      return factory;
    }
  ]);
