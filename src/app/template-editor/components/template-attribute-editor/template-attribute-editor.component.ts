import { Component, OnDestroy } from '@angular/core';

import { ComponentsService } from '../../services/components.service';

@Component({
  selector: 'template-attribute-editor',
  templateUrl: './template-attribute-editor.component.html',
  styleUrls: ['./template-attribute-editor.component.scss']
})
export class TemplateAttributeEditorComponent implements OnDestroy {
  private handleMessageBind;

  constructor(public componentsFactory: ComponentsService) {
    this.componentsFactory.reset();

    this.handleMessageBind = this._handleMessageFromTemplate.bind(this);

    window.addEventListener('message', this.handleMessageBind);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handleMessageBind);
  }

  _handleMessageFromTemplate(event) {
    var data = event.data;

    if ('string' === typeof event.data) {
      try {
        data = JSON.parse(event.data);
      } catch (e) {}
    }

    if (data.type === 'editComponent') {
      this.componentsFactory.editHighlightedComponent(data.value);
    }
  }
}
