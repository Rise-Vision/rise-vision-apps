'use strict';

describe('directive: templateComponentTimeDate', function() {
  var $scope,
    element,
    factory,
    sandbox = sinon.sandbox.create();

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-time-date.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();

    element = $compile("<template-component-time-date></template-component-time-date>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } });
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-time-date');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
  });

  it('should return the correct title', function () {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var timeDateInstance = { attributes: { type: { value: 'timedate' } } };
    var timeInstance = { attributes: { type: { value: 'time' } } };
    var dateInstance = { attributes: { type: { value: 'date' } } };

    expect(directive.getTitle(timeDateInstance)).to.equal('template.rise-time-date-timedate');
    expect(directive.getTitle(timeInstance)).to.equal('template.rise-time-date-time');
    expect(directive.getTitle(dateInstance)).to.equal('template.rise-time-date-date');
  });

  describe('load', function () {
    function _initLoad(type, time, date) {
      $scope.getAvailableAttributeData = sandbox.stub();
      $scope.getAvailableAttributeData.onCall(0).returns(type);
      $scope.getAvailableAttributeData.onCall(1).returns(time);
      $scope.getAvailableAttributeData.onCall(2).returns(date);
    }

    it('should load the correct list of date formats', function () {
      expect($scope.dateFormats.length).to.equal(4);
    });

    it('should load the correct list of timezones', function () {
      expect($scope.timezones.length).to.be.above(0);
    });

    it('should initialize the time format from data', function () {
      _initLoad('time', 'Hours24', null);

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');

      expect($scope.type).to.equal('time');
      expect($scope.dateFormat).to.not.be.ok;
      expect($scope.timeFormat).to.equal('Hours24');
    });

    it('should initialize the date format from data', function () {
      _initLoad('date', null, 'DD/MM/YYYY');

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');

      expect($scope.type).to.equal('date');
      expect($scope.timeFormat).to.not.be.ok;
      expect($scope.dateFormat).to.equal('DD/MM/YYYY');
    });

    it('should initialize the date and time formats from data', function () {
      _initLoad('timedate', 'Hours24', 'MMM DD YYYY');

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');

      expect($scope.type).to.equal('timedate');
      expect($scope.timeFormat).to.equal('Hours24');
      expect($scope.dateFormat).to.equal('MMM DD YYYY');
    });

    it('should initialize time and date formats with default values', function () {
      _initLoad('timedate', null, null);

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('date');

      expect($scope.type).to.equal('timedate');
      expect($scope.timeFormat).to.equal('Hours12');
      expect($scope.dateFormat).to.equal('MMMM DD, YYYY');
    });
  });

  describe('save', function () {
    beforeEach(function () {
      $scope.type = 'timedate';
      $scope.timeFormat = 'Hours12';
      $scope.dateFormat = 'MMMM DD, YYYY';
    });

    it('should only save time format and not save date format if type is "time"', function () {
      $scope.type = 'time';
      $scope.timeFormat = 'Hours24';

      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal('Hours24');
      expect($scope.setAttributeData.getCall(1)).to.not.be.ok;
    });

    it('should only save date format and not save time format if type is "date"', function () {
      $scope.type = 'date';
      $scope.dateFormat = 'DD/MM/YYYY';

      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal('DD/MM/YYYY');
      expect($scope.setAttributeData.getCall(1)).to.not.be.ok;
    });

    it('should save the time and date formats', function () {
      $scope.save();

      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal('Hours12');
      expect($scope.setAttributeData.getCall(1).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(1).args[2]).to.equal('MMMM DD, YYYY');
    });

  });

});
