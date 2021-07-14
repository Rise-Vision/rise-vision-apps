import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { BlueprintService } from '../../services/blueprint.service';
import { TemplateEditorService } from '../../services/template-editor.service';
import { PresentationService, ScrollingListService } from 'src/app/ajs-upgraded-providers';

@Injectable({
  providedIn: 'root'
})
export class PlaylistComponentService {

  public search :any = {
    sortBy: 'changeDate',
    reverse: true
  };
  public templates;
  public loading;
  public onAddHandler;

  constructor(
    private ScrollingListService: ScrollingListService,
    private presentation: PresentationService,
    private templateEditorFactory: TemplateEditorService,
    private blueprintFactory: BlueprintService) { }

  
    load() {
      this.search.query = '';
      this.search.filter = ' presentationType:"HTML Template"';
      //exclude the template that is being edited
      this.search.filter += ' AND NOT id:' + this.templateEditorFactory.presentation.id;

      if (!this.templates) {
        this.templates = this.ScrollingListService(this.presentation.list, this.search);
      } else {
        this.templates.doSearch();
      }
    };

    loadPresentationNames(presentations) {
      var presentationIds = _.uniq(
        _.map(presentations, (item) => {
          return 'id:' + item.id;
        })
      );

      var search = {
        filter: presentationIds.join(' OR ')
      };

      this.loading = true;

      this.presentation.list(search)
        .then( (res) => {
          _.forEach(presentations, (presentation) => {
            var found = false;

            if (res.items) {
              _.forEach(res.items, (item) => {
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
        .finally( () => {
          this.loading = false;
        });
    };

    addTemplates () {
      var itemsToAdd = this.templates.getSelected();

      //if template supports PUD, then set it to PUD automatically
      var promises = [];
      _.forEach(itemsToAdd, (item) => {
        promises.push(this.blueprintFactory.isPlayUntilDone(item.productCode));
      });

      this.loading = true;

      Promise.all(promises)
        .then( (playUntilDoneValues) => {
          for (var i = 0; i < playUntilDoneValues.length; i++) {
            itemsToAdd[i]['play-until-done'] = playUntilDoneValues[i];
          }

          if (this.onAddHandler) {
            this.onAddHandler(itemsToAdd);              
          }
        })
        .finally(() => {
          this.loading = false;
        });
    };
}

angular.module('risevision.template-editor.services')
  .factory('playlistComponentFactory', downgradeInjectable(PlaylistComponentService));