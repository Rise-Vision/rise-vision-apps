import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState, CompanySettingsFactory } from 'src/app/ajs-upgraded-providers';

import { ComponentsService } from '../../services/components.service';
import { AttributeDataService } from '../../services/attribute-data.service';

import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  var componentsFactory,
      attributeDataFactory,
      company,
      userState,
      companySettingsFactory,
      hasRole = true;


  beforeEach(async () => {
    componentsFactory = {
      selected: { id: "TEST-ID" },
      registerDirective: sinon.stub()
    };
    attributeDataFactory = {
      setAttributeData: sinon.stub()
    };
    companySettingsFactory = {};
    company = {
      postalCode: '12345'
    };
    userState = {
      getCopyOfSelectedCompany: function() { 
        return company;
      },
      hasRole: function(){
        return hasRole;
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ WeatherComponent ],
      providers: [
        {provide: ComponentsService, useValue: componentsFactory},
        {provide: AttributeDataService, useValue: attributeDataFactory},
        {provide: UserState, useValue: userState},
        {provide: CompanySettingsFactory, useValue: companySettingsFactory},
      ]
    })
    .compileComponents();
  });

  let compileDirective = () => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(compileDirective);

  it('should exist', function() {
    expect(component).to.be.ok;
    componentsFactory.registerDirective.should.have.been.called;
    expect(component.companySettingsFactory).to.be.ok;
    expect(component.hasValidAddress).to.be.ok;
    expect(component.canEditCompany).to.be.true;

    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-data-weather');
    expect(directive.show).to.be.a('function');
  });

  it('should load weather from attribute data', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    attributeDataFactory.getAttributeData = function() {
      return sampleValue;
    }

    directive.show();

    expect(component.componentId).to.equal("TEST-ID");
    expect(component.scale).to.equal(sampleValue);
  });

  it('should load weather from blueprint when the attribute data is missing', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    attributeDataFactory.getAttributeData = function() {
      return null;
    };

    attributeDataFactory.getBlueprintData = function() {
      return sampleValue;
    };

    directive.show();

    expect(component.componentId).to.equal("TEST-ID");
    expect(component.scale).to.equal(sampleValue);
  });

  it('should save weather to attribute data', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    attributeDataFactory.getAttributeData = function() {
      return sampleValue;
    }

    directive.show();

    component.scale = "updated weather";

    component.save();

    expect(attributeDataFactory.setAttributeData.calledWith(
      "TEST-ID", "scale", "updated weather"
    )).to.be.true;
  });

  describe('canEditCompany:',function(){
    it('should be true if user has required role',function(){
      hasRole = true;
      compileDirective();
      
      expect(component.canEditCompany).to.be.true;
    });

    it('should be false if user does not have required role',function(){
      hasRole = false;
      compileDirective();
      
      expect(component.canEditCompany).to.be.false;
    });
  });

  describe('hasValidAddress:',function(){
    it('should be valid if postalCode is provided',function(){
      company = {
        postalCode: '12345'
      };      
      compileDirective();
      
      expect(component.hasValidAddress).to.be.true;
    });

    it('should be valid if city and country provided',function(){
      company = {
        city: 'city',
        country: 'country'
      };      
      compileDirective();
      
      expect(component.hasValidAddress).to.be.true;
    });

    it('should be invalid if address is not provided',function(){
      company = {};      
      compileDirective();
      
      expect(component.hasValidAddress).to.be.false;
    });

    it('should be invalid if address is empty',function(){
      company = {
        postalCode: "",
        city: "",
        country: "",
      };      
      compileDirective();
      
      expect(component.hasValidAddress).to.be.false;
    });

    it('should be invalid if only city is provided but no country',function(){
      company = {
        city: "city",
      };      
      compileDirective();
      
      expect(component.hasValidAddress).to.be.false;
    });

    it('should be invalid if only country is provided but no city',function(){
      company = {
        country: 'country'
      };      
      compileDirective();
      
      expect(component.hasValidAddress).to.be.false;
    });

  });


});
