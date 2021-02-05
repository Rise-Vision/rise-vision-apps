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
  .factory('playlistItemFactory', ['$q', '$modal', '$log', 'userState',
    'gadgetFactory', 'editorFactory', 'placeholderPlaylistFactory',
    'settingsFactory', 'widgetUtils', 'storageUtils', 'presentationTracker',
    'SELECTOR_TYPES', 'IMAGE_ADDITIONAL_PARAMS', 'VIDEO_ADDITIONAL_PARAMS',
    function ($q, $modal, $log, userState, gadgetFactory, editorFactory,
      placeholderPlaylistFactory, settingsFactory, widgetUtils, storageUtils,
      presentationTracker,
      SELECTOR_TYPES, IMAGE_ADDITIONAL_PARAMS, VIDEO_ADDITIONAL_PARAMS) {
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

        if (item.type !== 'presentation') {
          item.objectData = widget.url;
          item.objectReference = widget.id;
          item.settingsUrl = widget.settingsUrl;
        }

        return item;
      };

      var _addProduct = function (productDetails) {
        presentationTracker('Content Selected', editorFactory.presentation.id,
          editorFactory.presentation.name);

        var promise;

        if (productDetails.productCode) {
          promise = gadgetFactory.getGadgetByProduct(productDetails.productCode);
        } else {
          promise = $q.resolve(productDetails);
        }

        promise
          .then(function (gadget) {
            var item = _newWidget(gadget);

            if (item.type === 'widget' || item.type === 'presentation') {
              settingsFactory.showSettingsModal(item);
            } else {
              factory.edit(item);
            }
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
        return gadgetFactory.getGadgetById(widgetId)
          .then(function (gadget) {
            return (_newWidget(gadget));
          });
      };

      factory.addTextWidget = function () {
        presentationTracker('Add Text Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        _getItemByWidgetId(widgetUtils.getWidgetId('text'))
          .then(function (item) {
            settingsFactory.showSettingsModal(item);
          });
      };

      var _getFolder = function (file) {
        if (!file) {
          return '';
        }

        var index = file.lastIndexOf('/');
        if (index === -1) {
          return '';
        } else {
          return file.substr(0, index + 1);
        }
      };

      var _populateAdditionalParams = function (additionalParams, fileUrl,
        file) {
        additionalParams = angular.copy(additionalParams);

        if (fileUrl && file) {
          additionalParams.selector.storageName = file.name;
          additionalParams.selector.url = fileUrl;
          additionalParams.storage.companyId = userState.getSelectedCompanyId();
          if (file.kind === 'folder') {
            additionalParams.selector.selection = SELECTOR_TYPES.SINGLE_FOLDER;
            additionalParams.storage.folder = file.name;
          } else {
            additionalParams.selector.selection = SELECTOR_TYPES.SINGLE_FILE;
            additionalParams.storage.fileName = widgetUtils.getFileName(
              file.name);
            additionalParams.storage.folder = _getFolder(file.name);
          }
        } else {
          additionalParams.selector.selection = 'custom';
          additionalParams.storage = {};
        }

        return JSON.stringify(additionalParams);
      };

      var _addImage = function (fileUrl, file) {
        presentationTracker('Add Image Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        return _getItemByWidgetId(widgetUtils.getWidgetId('image'))
          .then(function (item) {
            item.name = file ? widgetUtils.getFileName(file.name) : item.name;

            item.additionalParams = _populateAdditionalParams(
              IMAGE_ADDITIONAL_PARAMS, fileUrl, file);

            return item;
          });
      };

      var _addVideo = function (fileUrl, file) {
        presentationTracker('Add Video Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        return _getItemByWidgetId(widgetUtils.getWidgetId('video'))
          .then(function (item) {
            item.name = file ? widgetUtils.getFileName(file.name) : item.name;
            item.playUntilDone = true;

            item.additionalParams = _populateAdditionalParams(
              VIDEO_ADDITIONAL_PARAMS, fileUrl, file);

            return item;
          });
      };

      factory.selectFiles = function (type) {
        storageUtils.openSelector(SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS,
            type, true)
          .then(function (fileObjects) {
            if (fileObjects) {
              var files = storageUtils.getFileUrls(fileObjects);
              for (var i = 0; i < files.length; i++) {
                if (type === 'images') {
                  _addImage(files[i], fileObjects[i])
                    .then(placeholderPlaylistFactory.updateItem);
                } else if (type === 'videos') {
                  _addVideo(files[i], fileObjects[i])
                    .then(placeholderPlaylistFactory.updateItem);
                }
              }
            } else {
              if (type === 'images') {
                _addImage().then(settingsFactory.showSettingsModal);
              } else if (type === 'videos') {
                _addVideo().then(settingsFactory.showSettingsModal);
              }
            }
          });
      };

      factory.edit = function (item) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/playlist-item-modal.html',
          size: 'md',
          controller: 'PlaylistItemModalController',
          resolve: {
            item: function () {
              return item;
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
