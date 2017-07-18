'use strict';

angular.module('risevision.editor.services')
  .value('REVISION_STATUS_PUBLISHED', 'Published')
  .value('REVISION_STATUS_REVISED', 'Revised')
  .value('DEFAULT_LAYOUT',
    '<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\r\n<html>\r\n\t<head>\r\n\t\t<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\r\n\t\t<title></title>\r\n\t</head>\r\n\r\n\t<body style=\"width:1920px;height:1080px; margin: 0; overflow: hidden;\" >\r\n\t</body>\r\n\r\n<!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly -->\r\n\t<script language=\"javascript\">\n\t<!--\n\tvar presentationData = {\n\t\"presentationData\": {\n\t\t\"id\": \"\",\n\t\t\"hidePointer\": true,\n\t\t\"donePlaceholder\": \"\",\n\t\t\"placeholders\": []\n\t}\n};\n\t//-->\n\t</script>\r\n<!-- No scripts after this point -->\r\n</html>'
  )
  .factory('editorFactory', ['$q', '$state', 'userState', 'presentation',
    'presentationParser', 'distributionParser', 'presentationTracker',
    'store', 'VIEWER_URL', 'REVISION_STATUS_REVISED',
    'REVISION_STATUS_PUBLISHED', 'DEFAULT_LAYOUT', 'TEMPLATES_TYPE',
    '$modal', '$rootScope', '$window', 'scheduleFactory', 'messageBox',
    function ($q, $state, userState, presentation, presentationParser,
      distributionParser, presentationTracker, store, VIEWER_URL,
      REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED, DEFAULT_LAYOUT,
      TEMPLATES_TYPE, $modal, $rootScope, $window, scheduleFactory,
      messageBox) {
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
            _showErrorMessage('Get', e);

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
                presentationId: resp.item.id
              }).then(function () {
                scheduleFactory.createFirstSchedule(resp.item.id,
                    resp.item.name)
                  .then(function () {
                    var modalInstance = $modal.open({
                      templateUrl: 'partials/editor/auto-schedule-modal.html',
                      size: 'md',
                      controller: 'AutoScheduleModalController',
                      resolve: {
                        presentationName: function () {
                          return resp.item.name;
                        }
                      }
                    });
                  });
              });
              deferred.resolve(resp.item.id);
            }
          })
          .then(null, function (e) {
            _showErrorMessage('Add', e);

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
            _showErrorMessage('Update', e);

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
            _showErrorMessage('Delete', e);
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
            _showErrorMessage('Publish', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.restorePresentation = function (presentationId) {
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
            _showErrorMessage('Restore', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      factory.copyPresentation = function () {
        presentationTracker((factory.presentation.isTemplate ?
            'Template' : 'Presentation') + ' Copied',
          factory.presentation.id, factory.presentation.name);

        factory.presentation.id = undefined;
        factory.presentation.name = 'Copy of ' + factory.presentation.name;
        factory.presentation.revisionStatusName = undefined;
        factory.presentation.isTemplate = false;
        factory.presentation.isStoreProduct = false;

        $state.go('apps.editor.workspace.artboard', {
          presentationId: undefined,
          copyPresentation: true
        });
      };

      factory.newCopyOf = function (presentationId) {
        return factory.getPresentation(presentationId)
          .then(factory.copyPresentation);
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

        modalInstance.result.then(function (productDetails) {
          if (!productDetails || !productDetails.rvaEntityId) {
            return;
          }

          factory.copyTemplate(productDetails);
        });
      };

      var _goToStoreModal = function (product) {
        var goToStoreModalInstance = $modal.open({
          templateUrl: 'partials/editor/go-to-store-modal.html',
          size: 'md',
          controller: 'GoToStoreModalController',
          resolve: {
            product: function () {
              return product;
            }
          }
        });
      };

      factory.copyTemplate = function (productDetails, rvaEntityId) {
        rvaEntityId = productDetails ? productDetails.rvaEntityId :
          rvaEntityId;

        factory.newCopyOf(rvaEntityId)
          .then(null, function (e) {
            // 403 Status indicates Premium Template needs purchase
            if (e && e.status === 403) {
              if (productDetails) {
                _goToStoreModal(productDetails);
              } else {
                return store.product.list({
                    category: TEMPLATES_TYPE,
                    rvaEntityId: rvaEntityId
                  })
                  .then(function (products) {
                    if (products && products.items && products.items[0]) {
                      _goToStoreModal(products.items[0]);
                    }
                  });
              }
            }
          });
      };

      factory.addFromSharedTemplateModal = function () {
        presentationTracker('Add Presentation from Shared Template');
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/shared-templates-modal.html',
          size: 'md',
          controller: 'SharedTemplatesModalController'
        });

        modalInstance.result.then(function (templateId) {
          if (!templateId) {
            return;
          }
          factory.newCopyOf(templateId);
        });
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
            userState.removeEventListenerVisibilityAPI();
            $window.open('/loading-preview.html', 'rvPresentationPreview');

            return factory.save().then(function (presentationId) {
              factory.preview(presentationId);
            }).finally(function () {
              userState.addEventListenerVisibilityAPI();
            });
          });
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Presentation.';
        factory.apiError = e.result && e.result.error.message ?
          e.result.error.message : e.toString();

        messageBox(factory.errorMessage, factory.apiError);
      };

      return factory;
    }
  ]);
