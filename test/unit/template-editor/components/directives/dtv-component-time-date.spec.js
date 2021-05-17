'use strict';

describe('directive: templateComponentTimeDate', function() {
  var $scope,
    element,
    componentsFactory,
    attributeDataFactory,
    sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sandbox.stub()
      };
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sandbox.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    componentsFactory = $injector.get('componentsFactory');
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-time-date.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile("<template-component-time-date></template-component-time-date>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
  });

  describe('registerDirective:', function() {
    it('should initialize', function() {
      expect(componentsFactory.registerDirective).to.have.been.called;

      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-time-date');
      expect(directive.show).to.be.a('function');
    });

    it('show:', function() {
      sandbox.stub($scope, 'load');

      componentsFactory.registerDirective.getCall(0).args[0].show();

      expect($scope.componentId).to.equal('TEST-ID');

      $scope.load.should.have.been.called;
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
    function _initLoad(type, time, date, timezone) {
      attributeDataFactory.getBlueprintData = sandbox.stub().returns('timedate');
      attributeDataFactory.getAvailableAttributeData = sandbox.stub();
      attributeDataFactory.getAvailableAttributeData.onCall(0).returns(type);
      attributeDataFactory.getAvailableAttributeData.onCall(1).returns(time);
      attributeDataFactory.getAvailableAttributeData.onCall(2).returns(date);
      attributeDataFactory.getAvailableAttributeData.onCall(3).returns(timezone);
    }

    it('should load the correct list of date formats', function () {
      expect($scope.dateFormats.length).to.equal(4);
    });

    it('should load the correct list of timezones', function () {
      expect($scope.timezones.length).to.be.above(0);
    });

    it('should initialize the time format from data', function () {
      _initLoad('time', 'Hours24', null, null);

      $scope.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect($scope.defaultType).to.equal('timedate');
      expect($scope.type).to.equal('time');
      expect($scope.dateFormat).to.not.be.ok;
      expect($scope.timeFormat).to.equal('Hours24');
      expect($scope.timezoneType).to.equal('DisplayTz');
      expect($scope.timezone).to.not.be.ok;
    });

    it('should initialize the date format from data', function () {
      _initLoad('date', null, 'DD/MM/YYYY', 'Atlantic/South_Georgia');

      $scope.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect($scope.defaultType).to.equal('timedate');
      expect($scope.type).to.equal('date');
      expect($scope.timeFormat).to.not.be.ok;
      expect($scope.dateFormat).to.equal('DD/MM/YYYY');
      expect($scope.timezoneType).to.equal('SpecificTz');
      expect($scope.timezone).to.equal('Atlantic/South_Georgia');
    });

    it('should initialize the date and time formats from data', function () {
      _initLoad('timedate', 'Hours24', 'MMM DD YYYY', null);

      $scope.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect($scope.defaultType).to.equal('timedate');
      expect($scope.type).to.equal('timedate');
      expect($scope.timeFormat).to.equal('Hours24');
      expect($scope.dateFormat).to.equal('MMM DD YYYY');
      expect($scope.timezoneType).to.equal('DisplayTz');
      expect($scope.timezone).to.not.be.ok;
    });

    it('should initialize time and date formats with default values', function () {
      _initLoad('timedate', null, null);

      $scope.load();

      attributeDataFactory.getBlueprintData.should.have.been.calledWith(sinon.match.any, 'type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');
      expect(attributeDataFactory.getAvailableAttributeData.getCall(3).args[1]).to.equal('timezone');

      expect($scope.defaultType).to.equal('timedate');
      expect($scope.type).to.equal('timedate');
      expect($scope.timeFormat).to.equal('Hours12');
      expect($scope.dateFormat).to.equal('MMMM DD, YYYY');
      expect($scope.timezoneType).to.equal('DisplayTz');
      expect($scope.timezone).to.not.be.ok;
    });
  });

  describe('save', function () {
    beforeEach(function () {
      $scope.defaultType = 'timedate';
      $scope.type = 'timedate';
      $scope.timeFormat = 'Hours12';
      $scope.dateFormat = 'MMMM DD, YYYY';
    });

    it('should only update type if defaultType is blank', function () {
      $scope.defaultType = undefined;
      $scope.type = 'time';

      $scope.save();
      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('type');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('time');
    });

    it('should only save time format and not save date format if type is "time"', function () {
      $scope.type = 'time';
      $scope.timeFormat = 'Hours24';

      $scope.save();
      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('time');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('Hours24');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[2]).to.not.be.ok;
    });

    it('should only save date format and not save time format if type is "date"', function () {
      $scope.type = 'date';
      $scope.dateFormat = 'DD/MM/YYYY';

      $scope.save();
      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('DD/MM/YYYY');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[2]).to.not.be.ok;
    });

    it('should save the time and date formats', function () {
      $scope.save();

      expect(attributeDataFactory.setAttributeData.getCall(0).args[1]).to.equal('time');
      expect(attributeDataFactory.setAttributeData.getCall(0).args[2]).to.equal('Hours12');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[1]).to.equal('date');
      expect(attributeDataFactory.setAttributeData.getCall(1).args[2]).to.equal('MMMM DD, YYYY');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[2]).to.not.be.ok;
    });

    it('should save null timezone if Display timezone is selected', function () {
      $scope.timezoneType = 'DisplayTz';
      $scope.timezone = 'Not empty';

      $scope.save();

      expect(attributeDataFactory.setAttributeData.getCall(2).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[2]).to.not.be.ok;
    });

    it('should save the timezone if specific timezone is selected', function () {
      $scope.timezoneType = 'SpecificTz';
      $scope.timezone = 'Selected timezone';

      $scope.save();

      expect(attributeDataFactory.setAttributeData.getCall(2).args[1]).to.equal('timezone');
      expect(attributeDataFactory.setAttributeData.getCall(2).args[2]).to.equal('Selected timezone');
    });
  });

});
