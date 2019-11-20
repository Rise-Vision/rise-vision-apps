'use strict';

angular.module('risevision.editor.services')
  .value('REVISION_STATUS_PUBLISHED', 'Published')
  .value('REVISION_STATUS_REVISED', 'Revised')
  .value('DEFAULT_LAYOUT',
    '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\r\n<html>\r\n\t<head>\r\n\t\t<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\r\n\t\t<title></title>\r\n\t</head>\r\n\r\n\t<body style=\"width:1920px;height:1080px; margin: 0; overflow: hidden;\" >\r\n\t</body>\r\n\r\n<!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly -->\r\n\t<script language=\"javascript\">\n\t<!--\n\tvar presentationData = {\n\t\"presentationData\": {\n\t\t\"id\": \"\",\n\t\t\"hidePointer\": true,\n\t\t\"donePlaceholder\": \"\",\n\t\t\"placeholders\": []\n\t}\n};\n\t//-->\n\t</script>\r\n<!-- No scripts after this point -->\r\n</html>'
  )
  .factory('editorFactory', ['$q', '$state', 'userState', 'userAuthFactory',
    'presentation', 'presentationParser', 'distributionParser',
    'presentationTracker', 'storeProduct', 'checkTemplateAccess', 'VIEWER_URL', 'REVISION_STATUS_REVISED',
    'REVISION_STATUS_PUBLISHED', 'DEFAULT_LAYOUT',
    '$modal', '$rootScope', '$window', 'scheduleFactory', 'processErrorCode', 'messageBox',
    '$templateCache', '$log', 'presentationUtils',
    function ($q, $state, userState, userAuthFactory, presentation,
      presentationParser, distributionParser, presentationTracker, storeProduct, checkTemplateAccess,
      VIEWER_URL, REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED,
      DEFAULT_LAYOUT, $modal, $rootScope, $window,
      scheduleFactory, processErrorCode, messageBox, $templateCache, $log,
      presentationUtils) {
      var factory = {};
      var JSON_PARSE_ERROR = 'JSON parse error';

      factory.openPresentationProperties = function () {
        $modal.open({
          templateUrl: 'partials/editor/presentation-properties-modal.html',
          size: 'md',
          controller: 'PresentationPropertiesModalController'
        });
      };

      var _clearMessages = function () {
        factory.loadingPresentation = false;
        factory.savingPresentation = false;

        factory.errorMessage = '';
        factory.apiError = '';
      };

      var _init = function () {
        factory.presentation = {
          layout: DEFAULT_LAYOUT,
          id: '',
          name: 'New Presentation',
          width: 1920,
          height: 1080,
          widthUnits: 'px',
          heightUnits: 'px',
          background: undefined,
          backgroundScaleToFit: false,
          backgroundStyle: '',
          hidePointer: true,
          donePlaceholder: '',
          isTemplate: false,
          isStoreProduct: false
        };
        factory.hasLegacyItems = false;
        presentationParser.parsePresentation(factory.presentation);

        _clearMessages();
      };

      _init();

      factory.newPresentation = function () {
        presentationTracker('New Presentation');

        checkTemplateAccess();

        _init();
      };

      var _updatePresentation = function (presentation) {
        factory.presentation = presentation;

        presentationParser.parsePresentation(factory.presentation);
        distributionParser.parseDistribution(factory.presentation);

        factory.hasLegacyItems = presentationParser.hasLegacyItems;
        $rootScope.$broadcast('presentationUpdated');
      };

      factory.getPresentation = function (presentationId) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.get(presentationId)
          .then(function (result) {
            _updatePresentation(result.item);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      var _arrayContains = function (items, obj) {
        var i = items.length;
        while (i--) {
          if (items[i] === obj) {
            return true;
          }
        }
        return false;
      };

      var _updateEmbeddedIds = function (presentation) {
        presentation.embeddedIds = [];
        var i = presentation.placeholders && presentation.placeholders.length;

        while (i--) {
          var j = presentation.placeholders[i].items &&
            presentation.placeholders[i].items.length;
          while (j--) {
            var item = presentation.placeholders[i].items[j];
            if (item && item.type === 'presentation' &&
              !_arrayContains(presentation.embeddedIds, item.objectData)) {
              presentation.embeddedIds.push(item.objectData);
            }
          }
        }
      };

      var _parseOrUpdatePresentation = function () {
        if ($state.is('apps.editor.workspace.htmleditor')) {
          presentationParser.parsePresentation(factory.presentation);
        } else {
          presentationParser.updatePresentation(factory.presentation);
        }

        distributionParser.updateDistribution(factory.presentation);

        _updateEmbeddedIds(factory.presentation);
      };

      factory.validatePresentation = function () {
        if (presentationParser.validatePresentation(factory.presentation)) {
          return $q.resolve();
        } else {
          messageBox('editor-app.json-error.title',
            'editor-app.json-error.message');

          return $q.reject({
            result: {
              error: {
                message: JSON_PARSE_ERROR
              }
            }
          });
        }
      };

      factory.addPresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        factory.validatePresentation()
          .then(function () {
            _parseOrUpdatePresentation();

            return presentation.add(factory.presentation);
          })
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              presentationTracker('Presentation Created', resp.item.id,
                resp.item.name);

              $rootScope.$broadcast('presentationCreated');

              $state.go('apps.editor.workspace.artboard', {
                presentationId: resp.item.id,
                copyOf: undefined
              }, {
                notify: false,
                location: 'replace'
              }).then(function () {
                scheduleFactory.createFirstSchedule(resp.item.id, resp.item.name, resp.item.presentationType);
              });
              deferred.resolve(resp.item.id);
            }
          })
          .then(null, function (e) {
            _showErrorMessage('add', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.updatePresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        factory.validatePresentation()
          .then(function () {
            _parseOrUpdatePresentation();

            return presentation.update(factory.presentation.id, factory.presentation);
          })
          .then(function (resp) {
            presentationTracker('Presentation Updated', resp.item.id,
              resp.item.name);

            _updatePresentation(resp.item);

            deferred.resolve(resp.item.id);
          })
          .then(null, function (e) {
            _showErrorMessage('update', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.save = function () {
        if (factory.presentation.id) {
          return factory.updatePresentation();
        } else {
          return factory.addPresentation();
        }
      };

      factory.deletePresentation = function () {
        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.delete(factory.presentation.id)
          .then(function () {
            presentationTracker('Presentation Deleted',
              factory.presentation.id, factory.presentation.name);

            $rootScope.$broadcast('presentationDeleted');

            factory.presentation = {};

            $state.go('apps.editor.list');
          })
          .then(null, function (e) {
            _showErrorMessage('delete', e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });
      };

      factory.isRevised = function () {
        return factory.presentation.revisionStatusName ===
          REVISION_STATUS_REVISED;
      };

      factory.publishPresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.publish(factory.presentation.id)
          .then(function (presentationId) {
            presentationTracker('Presentation Published',
              factory.presentation.id, factory.presentation.name);

            factory.presentation.revisionStatusName =
              REVISION_STATUS_PUBLISHED;
            factory.presentation.changeDate = new Date();
            factory.presentation.changedBy = userState.getUsername();

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('publish', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.confirmRestorePresentation = function () {
        var modalInstance = $modal.open({
          template: $templateCache.get(
            'partials/components/confirm-modal/confirm-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'editor-app.restore.confirm.title';
            },
            confirmationMessage: function () {
              return 'editor-app.restore.confirm.message';
            },
            confirmationButton: null,
            cancelButton: null
          }
        });

        modalInstance.result.then(function () {
          factory.restorePresentation();
        });

        return modalInstance;
      };

      factory.restorePresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.restore(factory.presentation.id)
          .then(function (result) {
            presentationTracker('Presentation Restored',
              factory.presentation.id, factory.presentation.name);

            _updatePresentation(result.item);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('restore', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      factory.copyPresentation = function () {
        var copyOf = factory.presentation.id;

        presentationTracker((factory.presentation.isTemplate ? 'Template' : 'Presentation') + ' Copied',
          factory.presentation.id, factory.presentation.name);

        factory.presentation.id = undefined;
        factory.presentation.name = 'Copy of ' + factory.presentation.name;
        factory.presentation.revisionStatusName = undefined;
        factory.presentation.isTemplate = false;
        factory.presentation.isStoreProduct = false;

        $state.go('apps.editor.workspace.artboard', {
          presentationId: 'new',
          copyOf: copyOf,
          isLoaded: true
        });
      };

      factory.addPresentationModal = function () {
        presentationTracker('Add Presentation');

        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/store-products-modal.html',
          size: 'lg',
          controller: 'storeProductsModal',
          resolve: {
            category: function () {
              return 'Templates';
            }
          }
        });

        modalInstance.result.then(factory.addFromProduct);
      };

      factory.addFromProductId = function (productId) {
        return storeProduct.get(productId)
          .then(function (productDetails) {
            if (productDetails.productCode) {
              return $q.resolve(productDetails);
            } else {
              return $q.reject({
                result: {
                  error: {
                    message: 'Invalid Product Id'
                  }
                }
              });
            }
          })
          .then(function (productDetails) {
            return factory.addFromProduct(productDetails);
          }, function (err) {
            _showErrorMessage('add', err);
            $state.go('apps.editor.list');
            return $q.reject(err);
          });
      };

      factory.addFromProduct = function (productDetails) {
        if (!productDetails || (!productDetails.rvaEntityId && !presentationUtils.isHtmlTemplate(
            productDetails))) {
          return;
        }

        if (!presentationUtils.isHtmlTemplate(productDetails)) {
          return factory.copyTemplate(productDetails.rvaEntityId);
        } else {
          return $state.go('apps.editor.templates.edit', {
            presentationId: 'new',
            productId: productDetails.productId,
            productDetails: productDetails
          });
        }
      };

      factory.copyTemplate = function (rvaEntityId) {
        if (!rvaEntityId) {
          return;
        }

        return factory.getPresentation(rvaEntityId)
          .then(factory.copyPresentation)
          .then(checkTemplateAccess)
          .catch(function (err) {
            $state.go('apps.editor.list');
            return $q.reject(err);
          });
      };

      factory.addFromSharedTemplateModal = function () {
        presentationTracker('Add Presentation from Shared Template');

        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/shared-templates-modal.html',
          size: 'md',
          controller: 'SharedTemplatesModalController'
        });

        modalInstance.result.then(factory.copyTemplate);
      };

      var _getPreviewUrl = function (presentationId) {
        if (presentationId) {
          return VIEWER_URL + '/?type=presentation&id=' + presentationId;
        }
        return null;
      };

      factory.preview = function (presentationId) {
        presentationTracker('Preview Presentation', factory.presentation.id,
          factory.presentation.name);

        $window.open(_getPreviewUrl(presentationId),
          'rvPresentationPreview');
      };

      factory.saveAndPreview = function () {
        return factory.validatePresentation()
          .then(function () {
            userAuthFactory.removeEventListenerVisibilityAPI();
            $window.open('/loading-preview.html', 'rvPresentationPreview');

            return factory.save().then(function (presentationId) {
              factory.preview(presentationId);
            }).finally(function () {
              userAuthFactory.addEventListenerVisibilityAPI();
            });
          });
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Presentation.';
        factory.apiError = processErrorCode('Presentation', action, e);

        $log.error(factory.errorMessage, e);

        messageBox(factory.errorMessage, factory.apiError);
      };

      return factory;
    }
  ]);
