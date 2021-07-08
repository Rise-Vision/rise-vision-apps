import { Component, ElementRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';

@Component({
  selector: 'stretchy-input',
  templateUrl: './stretchy-input.component.html',
  styleUrls: ['./stretchy-input.component.scss']
})
export class StretchyInputComponent implements OnInit, OnChanges, DoCheck {
  public isEditingInput = false;
  private wasEditingInput = true;
  private defaultInputValue: string;
  private defaultInputWidth = '';

  @Input() ngModel: string;
  @Output() ngModelChange = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this._initStretchy();      
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // resize input if model was externally modified/updated
    if (changes && !this.isEditingInput) {
      this.defaultInputValue = this.ngModel;
      setTimeout(() => {
        this._initStretchy();      
      });
    }
  }

  ngDoCheck(): void {
    if (this.isEditingInput === this.wasEditingInput) {
      return;
    }

    let stretchyInputElement = this.elementRef.nativeElement.querySelector('input.input-stretchy');
    this.wasEditingInput = this.isEditingInput;
    
    if (this.isEditingInput) {
      setTimeout(() => {
        this._setFocus(stretchyInputElement);
      });
    } else {
      var nameVal = stretchyInputElement.value.replace(/\s/g, '');
    
      if (!nameVal) {
        // user deleted entire name, set the name and width values to the defaults
        this.ngModel = this.defaultInputValue;
        this.ngModelChange.emit(this.ngModel);

        stretchyInputElement.style.width = this.defaultInputWidth;
      }
    }
  }

  _initStretchy = () => {
    var stretchyInputElement = this.elementRef.nativeElement.querySelector('input.input-stretchy');

    if (window.Stretchy) {
      window.Stretchy.resize(stretchyInputElement);
    }

    this.defaultInputWidth = window.getComputedStyle(stretchyInputElement).getPropertyValue('width');
  };

  onInputBlur() {
    this.isEditingInput = false;
  };

  inputKeyDown(keyEvent: KeyboardEvent) {
    // handle enter key
    if (keyEvent.which === 13 && this.isEditingInput) {
      this.isEditingInput = false;

      keyEvent.preventDefault();
    }
  };

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

}

angular.module('risevision.common.components')
  .directive(
    'stretchyInput', 
    downgradeComponent({
      component: StretchyInputComponent
    }) as angular.IDirectiveFactory
  );
