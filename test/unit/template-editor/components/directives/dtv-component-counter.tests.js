'use strict';

describe('directive: templateComponentCounter', function() {
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
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-counter.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sandbox.stub();
    $scope.setAttributeData = sandbox.stub();

    element = $compile('<template-component-counter></template-component-counter>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } });
    expect($scope.registerDirective).to.have.been.called;

    expect($scope.dateOptions).to.be.an.object;
    expect($scope.targetDatePicker).to.be.an.object;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-data-counter');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
  });

  it('should return the correct title', function () {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var component = { attributes: { type: { value: 'down' } } };

    expect(directive.getTitle(component)).to.equal('template.rise-data-counter-down');
  });

  describe('load', function () {
    function _initLoad(type, date, time) {
      $scope.getAvailableAttributeData = sandbox.stub();
      $scope.getAvailableAttributeData.onCall(0).returns(type);
      $scope.getAvailableAttributeData.onCall(1).returns(date);
      $scope.getAvailableAttributeData.onCall(2).returns(time);
    }

    it('should load the date', function () {
      _initLoad('down', '2019-10-25', null);

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('date');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('time');

      var expectedDate = new Date('2019-10-25');
      expectedDate.setMinutes(expectedDate.getMinutes() + expectedDate.getTimezoneOffset());

      expect($scope.targetDate).to.deep.equal(expectedDate);
      expect($scope.targetDateTime).to.equal(null);
      expect($scope.targetUnit).to.equal('targetDate');
    });

    it('should load the date and time', function () {
      _initLoad('down', '2019-10-25', '15:27');

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('date');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('time');

      var expectedDate = new Date('2019-10-25');
      expectedDate.setMinutes(expectedDate.getMinutes() + expectedDate.getTimezoneOffset());

      expect($scope.targetDate).to.deep.equal(expectedDate);
      expect($scope.targetDateTime).to.equal('03:27 PM');
      expect($scope.targetUnit).to.equal('targetDate');
    });

    it('should load the time', function () {
      _initLoad('down', null, '18:30');

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('date');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('time');

      expect($scope.targetDate).to.not.be.ok;
      expect($scope.targetTime).to.equal('06:30 PM');
      expect($scope.targetUnit).to.equal('targetTime');
    });

    it('should not load anything', function () {
      _initLoad('down', null, null);

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('date');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('time');

      expect($scope.targetDate).to.not.be.ok;
      expect($scope.targetDateTime).to.not.be.ok;
      expect($scope.targetUnit).to.not.be.ok;
    });
  });

  describe('save', function () {
    beforeEach(function () {
      $scope.targetDate = 'October 25, 2019';
      $scope.targetTime = '06:30 PM';
    });

    it('should not save date if null', function () {
      $scope.targetDate = null;
      $scope.targetTime = null;
      $scope.targetUnit = 'targetDate';

      $scope.save();
      expect($scope.setAttributeData).to.have.not.been.called;
    });

    it('should not save time if null', function () {
      $scope.targetDate = null;
      $scope.targetTime = null;
      $scope.targetUnit = 'targetTime';

      $scope.save();
      expect($scope.setAttributeData).to.have.not.been.called;
    });

    it('should only save the date', function () {
      $scope.targetUnit = 'targetDate';
      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal('2019-10-25');
      expect($scope.setAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(1).args[2]).to.equal(null);
    });

    it('should save the date and time', function () {
      $scope.targetDateTime = '03:27 PM';
      $scope.targetUnit = 'targetDate';
      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal('2019-10-25');
      expect($scope.setAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(1).args[2]).to.equal('15:27');
    });

    it('should only save the time', function () {
      $scope.targetUnit = 'targetTime';
      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal(null);
      expect($scope.setAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(1).args[2]).to.equal('18:30');
    });

    it('should save completion if type === "down"', function () {
      $scope.targetUnit = 'targetDate';
      $scope.counterType = 'down';
      $scope.completionMessage = 'Test message';
      $scope.save();
      expect($scope.setAttributeData.getCall(2).args[1]).to.equal('completion');
      expect($scope.setAttributeData.getCall(2).args[2]).to.equal('Test message');
    });

    it('should save completion if type === "down"', function () {
      $scope.targetUnit = 'targetTime';
      $scope.counterType = 'up';
      $scope.completionMessage = 'Test message';
      $scope.save();
      expect($scope.setAttributeData.getCall(2)).to.be.null;
    });
  });

  describe('datePicker', function () {
    it('datePicker should toggle visibility', function () {
      var event = {
        preventDefault: sandbox.stub(),
        stopPropagation: sandbox.stub()
      };

      expect($scope.targetDatePicker.isOpen).to.be.falsey;

      $scope.openDatePicker(event);
      expect($scope.targetDatePicker.isOpen).to.be.true;
      expect(event.preventDefault).to.have.been.called;
      expect(event.stopPropagation).to.have.been.called;

      $scope.openDatePicker(event);
      expect($scope.targetDatePicker.isOpen).to.be.false;
    });
  });

  describe('timePicker', function () {
    it('timePicker should toggle visibility', function () {
      var event = {
        preventDefault: sandbox.stub(),
        stopPropagation: sandbox.stub()
      };

      expect($scope.targetTimePicker.isOpen).to.be.falsey;

      $scope.openTimePicker(event);
      expect($scope.targetTimePicker.isOpen).to.be.true;
      expect(event.preventDefault).to.have.been.called;
      expect(event.stopPropagation).to.have.been.called;

      $scope.openTimePicker(event);
      expect($scope.targetTimePicker.isOpen).to.be.false;
    });
  });
});
