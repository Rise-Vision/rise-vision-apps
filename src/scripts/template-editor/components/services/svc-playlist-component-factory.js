'use strict';

angular.module('risevision.template-editor.services')
  .constant('FILTER_HTML_TEMPLATES', 'presentationType:"HTML Template"')
  .factory('playlistComponentFactory', ['$q', 'ScrollingListService', 'presentation',
  'templateEditorFactory', 'blueprintFactory',
    function ($q, ScrollingListService, presentation, templateEditorFactory, blueprintFactory) {
      var factory = {};

      factory.search = {
        sortBy: 'changeDate',
        reverse: true
      };

      factory.load = function() {
        factory.search.query = '';
        factory.search.filter = ' presentationType:"HTML Template"';
        //exclude the template that is being edited
        factory.search.filter += ' AND NOT id:' + templateEditorFactory.presentation.id;

        if (!factory.templates) {
          factory.templates = new ScrollingListService(presentation.list, factory.search);
        } else {
          factory.templates.doSearch();
        }
      };

      factory.loadPresentationNames = function(presentations) {
        var presentationIds = _.map(presentations, function (item) {
          return 'id:' + item.id;
        });

        var search = {
          filter: presentationIds.join(' OR ')
        };

        factory.loading = true;

        presentation.list(search)
          .then(function (res) {
            _.forEach(presentations, function (presentation) {
              var found = false;

              if (res.items) {
                _.forEach(res.items, function (item) {
                  if (presentation.id === item.id) {
                    found = true;
                    presentation.name = item.name;
                    presentation.revisionStatusName = item.revisionStatusName;
                    presentation.removed = false;
                  }
                });
              }

              if (!found) {
                presentation.name = 'Unknown';
                presentation.revisionStatusName = 'Presentation not found.';
                presentation.removed = true;
              }
            });
          })
          .finally(function () {
            factory.loading = false;
          });
      };

      factory.addTemplates = function () {
        var itemsToAdd = factory.templates.getSelected();

        //if template supports PUD, then set it to PUD automatically
        var promises = [];
        _.forEach(itemsToAdd, function (item) {
          promises.push(blueprintFactory.isPlayUntilDone(item.productCode));
        });

        factory.loading = true;

        $q.all(promises)
          .then(function (playUntilDoneValues) {
            for (var i = 0; i < playUntilDoneValues.length; i++) {
              itemsToAdd[i]['play-until-done'] = playUntilDoneValues[i];
            }

            if (factory.onAddHandler) {
              factory.onAddHandler(itemsToAdd);              
            }
          })
          .finally(function (e) {
            factory.loading = false;
          });
      };

      return factory;
    }
  ]);
