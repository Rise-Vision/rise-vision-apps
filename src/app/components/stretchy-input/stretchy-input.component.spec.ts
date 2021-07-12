import {expect} from 'chai';

import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';

import { StreamlineIconComponent } from '../streamline-icon/streamline-icon.component';
import { StretchyInputComponent } from './stretchy-input.component';

describe('StretchyInputComponent', () => {
  let component: StretchyInputComponent;
  let inputElement: any;
  let fixture: ComponentFixture<StretchyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ StretchyInputComponent, StreamlineIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    window.Stretchy = window.Stretchy || {
      resize: sinon.spy()
    };

    fixture = TestBed.createComponent(StretchyInputComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css('input.input-stretchy'));

    fixture.detectChanges();
  });

  it('should create components', () => {
    expect(component).exist;
    expect(inputElement).exist;
  });

  it('should update ngModel', (done) => {
    component.ngModel = 'New Display';
    fixture.detectChanges();
    setTimeout(() => {
      expect(inputElement.nativeElement.value).equal('New Display');

      expect(component._getStretchyElement()).to.be.ok;
      expect(component._getStretchyElement().value).equal('New Display');

      done();
    });
  });

  it('_initStretchy:', () => {
    component._initStretchy();

    window.Stretchy.resize.should.have.been.called;

    expect(component.defaultInputWidth).to.contain('px');
  });

  describe('ngOnChanges:', () => {
    beforeEach(() => {
      component.defaultInputValue = 'Initial'
      sinon.stub(component, '_initStretchy');
    });

    it('should trigger init function, asynchronously if user is not editing', done => {
      component.isEditingInput = false;
      component.ngModel = 'Updated';

      component.ngOnChanges({
        ngModel: new SimpleChange(null, component.ngModel, true)
      });

      setTimeout(() => {
        expect(component.defaultInputValue).to.equal('Updated');

        component._initStretchy.should.have.been.called;

        done();
      });
    });

    it('should not trigger if user is editing', done => {
      component.isEditingInput = true;
      component.ngModel = 'Updated';

      component.ngOnChanges({
        ngModel: new SimpleChange(null, component.ngModel, true)
      });

      setTimeout(() => {
        expect(component.defaultInputValue).to.equal('Initial');

        component._initStretchy.should.not.have.been.called;

        done();
      });
    });

    it('should not trigger if there are no changes', done => {
      component.isEditingInput = true;
      component.ngModel = 'Updated';

      component.ngOnChanges(null);

      setTimeout(() => {
        expect(component.defaultInputValue).to.equal('Initial');

        component._initStretchy.should.not.have.been.called;

        done();
      });
    });

  });

  describe('_setFocus', () => {
    it('should handle null element', () => {
      component._setFocus(null);
    });

    it('should createTextRange', () => {
      var textRange = {
        move: sinon.spy(),
        select: sinon.spy()
      };
      var elem = {
        createTextRange: sinon.stub().returns(textRange)
      };
      component._setFocus(elem);

      textRange.move.should.have.been.calledWith('character', 0);
      textRange.select.should.have.been.called;
    });

    it('should setSelectionRange', () => {
      var elem = {
        value: 'Default',
        setSelectionRange: sinon.spy(),
        focus: sinon.spy()
      };
      component._setFocus(elem);

      elem.setSelectionRange.should.have.been.calledWith(0, elem.value.length);
      elem.focus.should.have.been.called;
    });

    it('should facus', () => {
      var elem = {
        focus: sinon.spy()
      };
      component._setFocus(elem);

      elem.focus.should.have.been.called;
    });

  });

  describe('setEditable', () => {
    beforeEach(() => {
      component.defaultInputValue = 'Initial';
      component.defaultInputWidth = '100px';

      sinon.stub(component, '_setFocus');
    });

    it('should start editing', (done) => {
      inputElement = component._getStretchyElement();
      component.isEditingInput = false;
      
      component.setEditable();

      expect(component.isEditingInput).to.be.true;

      component._setFocus.should.not.have.been.called;

      setTimeout(() => {
        component._setFocus.should.have.been.calledWith(inputElement);

        done();
      });
    });

    it('should not do anything if editing', (done) => {
      component.isEditingInput = true;
      
      component.setEditable();

      expect(component.isEditingInput).to.be.true;

      setTimeout(() => {
        component._setFocus.should.not.have.been.called;

        done();
      });
    });
  });

  describe('_setNonEditable', () => {
    beforeEach(() => {
      component.defaultInputValue = 'Initial';
      component.defaultInputWidth = '100px';

      sinon.spy(component.ngModelChange, 'emit');
    });

    it('should cancel editing', () => {
      inputElement = component._getStretchyElement();
      component.isEditingInput = true;
      
      inputElement.value = 'Updated';

      component._setNonEditable();

      component.ngModelChange.emit.should.not.have.been.called;

      expect(component.isEditingInput).to.be.false;

      expect(inputElement.value).to.equal('Updated');
    });

    it('should reset value if value is empty, and ignore whitespace', () => {
      inputElement = component._getStretchyElement();
      component.isEditingInput = true;
      
      inputElement.value = '   ';

      component._setNonEditable();

      expect(component.ngModel).to.equal('Initial');
      component.ngModelChange.emit.should.have.been.calledWith('Initial');

      expect(component.isEditingInput).to.be.false;

      expect(inputElement.style.width).to.equal('100px');
      expect(inputElement.value).to.equal('Initial');
    });

    it('should not do anything if not editing', () => {
      inputElement = component._getStretchyElement();
      component.isEditingInput = false;
      
      inputElement.value = '   ';

      component._setNonEditable();

      component.ngModelChange.emit.should.not.have.been.called;

      expect(component.isEditingInput).to.be.false;

      expect(inputElement.value).to.equal('   ');
    });
  });

  it('onInputBlur:', () => {
    sinon.stub(component, '_setNonEditable');

    component.onInputBlur();

    component._setNonEditable.should.have.been.called;
  });

  describe('inputKeyDown:', function() {
    it('should reset editing on enter', function() {
      var keyEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        key: 'Enter'
      });
      sinon.spy(keyEvent, 'preventDefault');
      sinon.stub(component, '_setNonEditable');

      component.isEditingInput = true;

      component.inputKeyDown(keyEvent);

      component._setNonEditable.should.have.been.called;
      keyEvent.preventDefault.should.have.been.called;
    });

    it('should not reset editing on other keys', function() {
      var keyEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        key: 'a'
      });
      sinon.spy(keyEvent, 'preventDefault');
      sinon.stub(component, '_setNonEditable');

      component.isEditingInput = true;

      component.inputKeyDown(keyEvent);

      component._setNonEditable.should.not.have.been.called;
      keyEvent.preventDefault.should.not.have.been.called;
    });
  });

});
