import { Component } from '@angular/core';

import { UserState, BrandingFactory, ScheduleSelectorFactory } from 'src/app/ajs-upgraded-providers';

import { TemplateEditorService } from '../../services/template-editor.service';
import { ComponentsService } from '../../services/components.service';
import { BlueprintService } from '../../services/blueprint.service';

@Component({
  selector: 'template-attribute-list',
  templateUrl: './template-attribute-list.component.html',
  styleUrls: ['./template-attribute-list.component.scss']
})
export class TemplateAttributeListComponent {
  public brandingComponent;
  public schedulesComponent;
  public colorsComponent;
  public components;

  constructor(private userState: UserState,
    private templateEditorFactory: TemplateEditorService,
    public componentsFactory: ComponentsService,
    private blueprintFactory: BlueprintService,
    private brandingFactory: BrandingFactory,
    private scheduleSelectorFactory: ScheduleSelectorFactory) {

    this.brandingComponent = this.brandingFactory.getBrandingComponent();

    if (this.userState.hasRole('cp')) {
      this.schedulesComponent = this.scheduleSelectorFactory.getSchedulesComponent(this.templateEditorFactory
        .presentation);
    }

    if (this.blueprintFactory.hasBranding()) {
      this.colorsComponent = {
        type: 'rise-override-brand-colors'
      };
    }

    this.components = this.blueprintFactory.blueprintData.components
      .filter(c => {
        return !c.nonEditable;
      });

  }

}
