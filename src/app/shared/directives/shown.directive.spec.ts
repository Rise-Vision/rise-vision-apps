import {expect} from 'chai';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShownDirective } from './shown.directive';

@Component({
  template: `
  <div id="shown" [shown]="true"></div>
  <div id="hidden" [shown]="false"></div>
  <div id="variable" [shown]="isShown"></div>
  <div id="function" [shown]="show()"></div>`
})
class TestComponent {
  public isShown = false;

  show() {
    return false;
  }
}

describe('ShownDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directives;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ ShownDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached ShownDirective
    directives = fixture.debugElement.queryAll(By.directive(ShownDirective));
  });

  // color tests
  it('should have three highlighted elements', () => {
    expect(directives).to.have.length(4);
  });

  it('should show first div', () => {
    const hidden = directives[0].nativeElement.hidden;
    expect(hidden).not.be.ok;
  });

  it('should hide second div', () => {
    const hidden = directives[1].nativeElement.hidden;
    expect(hidden).to.be.true;
  });

  it('should hide third div based on variable', () => {
    const hidden = directives[2].nativeElement.hidden;
    expect(hidden).to.be.true;
  });

  it('should hide third div based on function', () => {
    const hidden = directives[3].nativeElement.hidden;
    expect(hidden).to.be.true;
  });

});
