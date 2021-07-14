import { Component } from '@angular/core';

import { StorageManagerFactory } from 'src/app/ajs-upgraded-providers';

import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'template-component',
  templateUrl: './template-component.component.html',
  styleUrls: ['./template-component.component.scss']
})
export class TemplateComponentComponent {

  constructor(public componentsFactory: ComponentsService,
    public storageManagerFactory: StorageManagerFactory) {}

}
