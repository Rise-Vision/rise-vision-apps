import { Component, ElementRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';

@Component({
  selector: 'stretchy-input',
  templateUrl: './stretchy-input.component.html',
  styleUrls: ['./stretchy-input.component.scss']
})
export class StretchyInputComponent implements OnChanges {
  public isEditingInput = false;
  public defaultInputValue: string;
  public defaultInputWidth = '';

  @Input() ngModel: string;
  @Output() ngModelChange = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) { }

  _getStretchyElement() {
    return this.elementRef.nativeElement.querySelector('input.input-stretchy');
  }

  _initStretchy() {
    let stretchyInputElement = this._getStretchyElement();

    if (window.Stretchy) {
      window.Stretchy.resize(stretchyInputElement);
    }

    this.defaultInputWidth = window.getComputedStyle(stretchyInputElement).getPropertyValue('width');
  };

  ngOnChanges(changes: SimpleChanges) {
    // resize input if model was externally modified/updated
    if (changes && !this.isEditingInput) {
      this.defaultInputValue = this.ngModel;

      setTimeout(this._initStretchy.bind(this));
    }
  }

  _setFocus(elem: any) {
    if (elem !== null) {
      if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.move('character', 0);
        range.select();
      } else {
        if (elem.setSelectionRange) {
          elem.focus();
          elem.setSelectionRange(0, elem.value.length);
        } else {
          elem.focus();
        }
      }
    }
  }

  setEditable() {
    if (this.isEditingInput) {
      return;
    }

    let stretchyInputElement = this._getStretchyElement();

    setTimeout(this._setFocus.bind(this, stretchyInputElement));

    this.isEditingInput = true;
  }

  _setNonEditable() {
    if (!this.isEditingInput) {
      return;
    }

    let stretchyInputElement = this._getStretchyElement();
    let nameVal = stretchyInputElement.value.replace(/\s/g, '');
    
    if (!nameVal) {
      // user deleted entire name, set the name and width values to the defaults
      this.ngModel = this.defaultInputValue;
      this.ngModelChange.emit(this.ngModel);

      stretchyInputElement.value = this.ngModel;
      stretchyInputElement.style.width = this.defaultInputWidth;
    }

    this.isEditingInput = false;
  }

  onInputBlur() {
    this._setNonEditable();
  };

  inputKeyDown(keyEvent: KeyboardEvent) {
    // handle enter key
    if (keyEvent.key === 'Enter' && this.isEditingInput) {
      this._setNonEditable();

      keyEvent.preventDefault();
    }
  };

}

angular.module('risevision.common.components')
  .directive(
    'stretchyInput', 
    downgradeComponent({
      component: StretchyInputComponent
    }) as angular.IDirectiveFactory
  );
