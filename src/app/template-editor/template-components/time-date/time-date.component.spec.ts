import { expect } from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsService } from '../../services/components.service';
import { AttributeDataService } from '../../services/attribute-data.service';

import { TimeDateComponent } from './time-date.component';

describe('TimeDateComponent', () => {
  let sandbox = sinon.sandbox.create();

  let component: TimeDateComponent;
  let fixture: ComponentFixture<TimeDateComponent>;
  let componentsFactory, attributeDataFactory;

  beforeEach(async () => {
    componentsFactory = {
      selected: { id: "TEST-ID" },
      registerDirective: sinon.stub()
    };
    attributeDataFactory = {
      setAttributeData: sinon.stub()
    };

    await TestBed.configureTestingModule({
      providers: [
        {provide: ComponentsService, useValue: componentsFactory},
        {provide: AttributeDataService, useValue: attributeDataFactory},
      ],
      declarations: [ TimeDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    window.moment = window.moment || (() => {
      return {
        format: sinon.stub().returns('date')
      };
    });

    fixture = TestBed.createComponent(TimeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('registerDirective:', function() {
    it('should initialize', function() {
      componentsFactory.registerDirective.should.have.been.called;

      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-time-date');
      expect(directive.show).to.be.a('function');
    });

    it('show:', function() {
      sandbox.stub(component, 'load');

      componentsFactory.registerDirective.getCall(0).args[0].show();

      expect(component.componentId).to.equal('TEST-ID');

      component.load.should.have.been.called;
    });
  });

  it('should return the correct title', function () {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var timeDateInstance = { attributes: { type: { value: 'timedate' } } };
    var timeInstance = { attributes: { type: { value: 'time' } } };
    var dateInstance = { attributes: { type: { value: 'date' } } };

    expect(directive.getTitle(timeDateInstance)).to.equal('template.rise-time-date-timedate');
    expect(directive.getTitle(timeInstance)).to.equal('template.rise-time-date-time');
    expect(directive.getTitle(dateInstance)).to.equal('template.rise-time-date-date');
  });

  describe('load', function () {
    function _initLoad(type, time, date, timezone?) {
      attributeDataFactory.getBlueprintData = sandbox.stub().returns('timedate');
      attributeDataFactory.getAvailableAttributeData = sandbox.stub();
      attributeDataFactory.getAvailableAttributeData.onCall(0).returns(type);
      attributeDataFactory.getAvailableAttributeData.onCall(1).returns(time);
      attributeDataFactory.getAvailableAttributeData.onCall(2).returns(date);
      attributeDataFactory.getAvailableAttributeData.onCall(3).returns(timezone);
    }

    it('should load the correct list of date formats', function () {
      expect(component.dateFormats.length).to.equal(4);
    });

    it('should load the correct list of timezones', function () {
      expect(component.WORLD_TIMEZONES.length).to.be.above(0);
    });

    it('should initialize the time format from data', function () {
      _initLoad('time', 'Hours24', null, null);

      component.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect(component.defaultType).to.equal('timedate');
      expect(component.type).to.equal('time');
      expect(component.dateFormat).to.not.be.ok;
      expect(component.timeFormat).to.equal('Hours24');
      expect(component.timezoneType).to.equal('DisplayTz');
      expect(component.timezone).to.not.be.ok;
    });

    it('should initialize the date format from data', function () {
      _initLoad('date', null, 'DD/MM/YYYY', 'Atlantic/South_Georgia');

      component.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect(component.defaultType).to.equal('timedate');
      expect(component.type).to.equal('date');
      expect(component.timeFormat).to.not.be.ok;
      expect(component.dateFormat).to.equal('DD/MM/YYYY');
      expect(component.timezoneType).to.equal('SpecificTz');
      expect(component.timezone).to.equal('Atlantic/South_Georgia');
    });

    it('should initialize the date and time formats from data', function () {
      _initLoad('timedate', 'Hours24', 'MMM DD YYYY', null);

      component.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect(component.defaultType).to.equal('timedate');
      expect(component.type).to.equal('timedate');
      expect(component.timeFormat).to.equal('Hours24');
      expect(component.dateFormat).to.equal('MMM DD YYYY');
      expect(component.timezoneType).to.equal('DisplayTz');
      expect(component.timezone).to.not.be.ok;
    });

    it('should initialize time and date formats with default values', function () {
      _initLoad('timedate', null, null);

      component.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect(component.defaultType).to.equal('timedate');
      expect(component.type).to.equal('timedate');
      expect(component.timeFormat).to.equal('Hours12');
      expect(component.dateFormat).to.equal('MMMM DD, YYYY');
      expect(component.timezoneType).to.equal('DisplayTz');
      expect(component.timezone).to.not.be.ok;
    });
  });

  describe('save', function () {
    beforeEach(function () {
      component.defaultType = 'timedate';
      component.type = 'timedate';
      component.timeFormat = 'Hours12';
      component.dateFormat = 'MMMM DD, YYYY';
    });

    it('should only update type if defaultType is blank', function () {
      component.defaultType = undefined;
      component.type = 'time';

      component.save();
      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('time');
    });

    it('should only save time format and not save date format if type is "time"', function () {
      component.type = 'time';
      component.timeFormat = 'Hours24';

      component.save();
      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('time');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('Hours24');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[2]).to.not.be.ok;
    });

    it('should only save date format and not save time format if type is "date"', function () {
      component.type = 'date';
      component.dateFormat = 'DD/MM/YYYY';

      component.save();
      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('DD/MM/YYYY');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[2]).to.not.be.ok;
    });

    it('should save the time and date formats', function () {
      component.save();

      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('time');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('Hours12');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[1]).to.equal('date');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[2]).to.equal('MMMM DD, YYYY');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[2]).to.not.be.ok;
    });

    it('should save null timezone if Display timezone is selected', function () {
      component.timezoneType = 'DisplayTz';
      component.timezone = 'Not empty';

      component.save();

      expect(attributeDataFactory.setAttributeData.getCall(2).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[2]).to.not.be.ok;
    });

    it('should save the timezone if specific timezone is selected', function () {
      component.timezoneType = 'SpecificTz';
      component.timezone = 'Selected timezone';

      component.save();

      expect(attributeDataFactory.setAttributeData.getCall(2).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[2]).to.equal('Selected timezone');
    });
  });

});
