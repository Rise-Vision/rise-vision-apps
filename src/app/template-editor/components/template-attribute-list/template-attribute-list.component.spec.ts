import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState, BrandingFactory, ScheduleSelectorFactory } from 'src/app/ajs-upgraded-providers';

import { TemplateEditorService } from '../../services/template-editor.service';
import { ComponentsService } from '../../services/components.service';
import { BlueprintService } from '../../services/blueprint.service';

import { TemplateAttributeListComponent } from './template-attribute-list.component';

describe('TemplateAttributeListComponent', () => {
  let component: TemplateAttributeListComponent;
  let fixture: ComponentFixture<TemplateAttributeListComponent>;
  let userState, blueprintFactory, brandingFactory, scheduleSelectorFactory;

  let components = [
    {id: 'cp1', nonEditable: true},
    {id: 'cp2', nonEditable: false},
    {id: 'cp3'}
  ];
  let hasBranding = true;

  beforeEach(async () => {
    userState = {
      hasRole: sinon.stub().returns(true)
    };

    blueprintFactory = {
      blueprintData: {
        components: components
      },
      hasBranding: function() {
        return hasBranding;
      }
    };

    brandingFactory = {
      getBrandingComponent: function() {
        return 'brandingComponent';
      }
    };

    scheduleSelectorFactory = {
      getSchedulesComponent: function() {
        return 'schedulesComponent';
      }
    };

    await TestBed.configureTestingModule({
      providers: [
        {provide: UserState, useValue: userState},
        {provide: TemplateEditorService, useValue: {
          presentation: 'presentation'
        }},
        {provide: ComponentsService, useValue: {
          getComponentIcon: sinon.stub().returns('')
        }},
        {provide: BlueprintService, useValue: blueprintFactory},
        {provide: BrandingFactory, useValue: brandingFactory},
        {provide: ScheduleSelectorFactory, useValue: scheduleSelectorFactory},
      ],
      declarations: [ TemplateAttributeListComponent ]
    })
    .compileComponents();
  });

  let compileDirective = () => {
    fixture = TestBed.createComponent(TemplateAttributeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(compileDirective);

  it('should exist', function() {
    expect(component).to.be.ok;
    expect(component.componentsFactory).to.be.ok;
    expect(component.components).to.be.ok;
  });

  it('should not list non-editable components', function() {
    expect(component.components.length).to.equal(2);
    expect(component.components).to.not.contain(components[0]);
    expect(component.components).to.contain(components[1]);
    expect(component.components).to.contain(components[2]);
  });

  it('should retrieve branding component', function() {
    expect(component.brandingComponent).to.equal('brandingComponent');
  });

  it('should set colors component if blueprint specifies branding', function() {
    expect(component.colorsComponent).to.deep.equal({type: 'rise-override-brand-colors'});
  });

  it('should not set colors component if blueprint does not specify branding', function() {
    hasBranding = false;

    compileDirective();

    expect(component.colorsComponent).to.not.be.ok;

    hasBranding = true;
  });

  describe('schedulesComponent', function() {
    it('should retrieve schedules component', function() {
      compileDirective();

      userState.hasRole.should.have.been.calledWith('cp');

      expect(component.schedulesComponent).to.equal('schedulesComponent');
    });

    it('should not retrieve schedules component if user does not have cp role', function() {
      userState.hasRole.returns(false);

      compileDirective();

      userState.hasRole.should.have.been.calledWith('cp');

      expect(component.schedulesComponent).to.not.be.ok;
    });
  });

});
