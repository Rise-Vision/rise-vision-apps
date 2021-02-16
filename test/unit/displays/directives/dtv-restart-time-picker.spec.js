'use strict';
describe('directive: restart time picker', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('timeParser', function() {
      return {        
        parseMilitary: sinon.stub().returns('ampm'),
        parseAmpm: sinon.stub().returns('military')
      };
    });

  }));
  
  var elm, $scope, timeParser;

  beforeEach(inject(function($rootScope, $injector, $compile, $templateCache) {
    timeParser = $injector.get('timeParser');

    $rootScope.restartTime = 'restartTime';
    $templateCache.put('partials/displays/restart-time-picker.html', '<p>Fields</p>');
    var tpl = '<restart-time-picker ng-model="restartTime"></restart-time-picker>';
    inject(function($compile) {
      elm = $compile(tpl)($rootScope.$new());
    });
    $rootScope.$digest();

    $scope = elm.isolateScope();
  }));

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p>Fields</p>');
    $scope.timeString = 'restartTime';
    expect($scope.openTimePicker).to.be.a('function');
  });

  it('should watch time and parse', function() {
    $scope.time = 'newTime';
    $scope.$digest();

    timeParser.parseAmpm.should.have.been.calledWith('newTime');
    expect($scope.timeString).to.equal('military');
  });

  it('should watch timeString and parse', function() {
    $scope.timeString = 'newTime';
    $scope.$digest();

    timeParser.parseMilitary.should.have.been.calledWith('newTime');
    expect($scope.time).to.equal('ampm');
  });

  it('openTimePicker:', function() {
    var e = {
      preventDefault: sinon.stub(),
      stopPropagation: sinon.stub()
    };

    $scope.openTimePicker(e, 'timePickerKey');

    e.preventDefault.should.have.been.called;
    e.stopPropagation.should.have.been.called;

    expect($scope.timePickerKey).to.be.true;

    $scope.openTimePicker(e, 'timePickerKey');

    expect($scope.timePickerKey).to.be.false;
  });

});
