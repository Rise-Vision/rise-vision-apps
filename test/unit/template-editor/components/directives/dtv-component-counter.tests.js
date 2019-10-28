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

      expect($scope.targetDate).to.equal('2019-10-25');
      expect($scope.targetTime).to.equal(null);
      expect($scope.targetUnit).to.equal('targetDate');
    });

    it('should load the time', function () {
      _initLoad('down', null, '18:30');

      $scope.load();

      expect($scope.getAvailableAttributeData.getCall(0).args[1]).to.equal('type');
      expect($scope.getAvailableAttributeData.getCall(1).args[1]).to.equal('date');
      expect($scope.getAvailableAttributeData.getCall(2).args[1]).to.equal('time');

      expect($scope.targetDate).to.equal(null);
      expect($scope.targetTime).to.equal('18:30');
      expect($scope.targetUnit).to.equal('targetTime');
    });
  });

  describe('save', function () {
    beforeEach(function () {
      $scope.targetDate = '2019-10-25';
      $scope.targetTime = '18:30';
    });

    it('should only save the date', function () {
      $scope.targetUnit = 'targetDate';
      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal('2019-10-25');
      expect($scope.setAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(1).args[2]).to.equal(null);
    });

    it('should only save the time', function () {
      $scope.targetUnit = 'targetTime';
      $scope.save();
      expect($scope.setAttributeData.getCall(0).args[1]).to.equal('date');
      expect($scope.setAttributeData.getCall(0).args[2]).to.equal(null);
      expect($scope.setAttributeData.getCall(1).args[1]).to.equal('time');
      expect($scope.setAttributeData.getCall(1).args[2]).to.equal('18:30');
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
});
