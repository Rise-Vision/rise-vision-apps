'use strict';
describe('directive: display fields', function() {
  var COUNTRIES = ["country1","country2"]
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('playerProFactory', function() {
      return {        
        isDisplayControlCompatiblePlayer: sinon.stub().returns(true)
      };
    });
    $provide.service('displayControlFactory', function() {
      return {        
        openDisplayControlModal: sinon.stub()
      };
    });

    $provide.value("COUNTRIES", COUNTRIES);
    $provide.value("REGIONS_CA", [""]);
    $provide.value("REGIONS_US", [""]);
    $provide.value("TIMEZONES", [""]);
    $provide.value("SHARED_SCHEDULE_URL", [""]);
  }));
  
  var elm, $scope, $compile, playerProFactory, displayControlFactory;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    playerProFactory = $injector.get('playerProFactory');
    displayControlFactory = $injector.get('displayControlFactory');

    $templateCache.put('partials/displays/display-fields.html', '<p>Fields</p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<display-fields></display-fields>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p>Fields</p>');
    expect($scope.countries).to.equal(COUNTRIES);
    expect($scope.isChromeOs).to.be.a('function');
    expect($scope.openTimePicker).to.be.a('function');
    expect($scope.configureDisplayControl).to.be.a('function');
  });

  it("isChromeOs: ", function() {
    expect($scope.isChromeOs({os: "cros/x86-64"})).to.be.true;
    expect($scope.isChromeOs({os: "64-bit Microsoft Windows Embedded Standard"})).to.be.false;
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

  describe('configureDisplayControl:', function() {
    it('should show error message if unsupported', function() {
      playerProFactory.isDisplayControlCompatiblePlayer.returns(false);

      $scope.configureDisplayControl();

      displayControlFactory.openDisplayControlModal.should.not.have.been.called;
      expect($scope.displayControlError).to.be.true;
    });

    it('should open configure modal', function() {
      $scope.configureDisplayControl();

      displayControlFactory.openDisplayControlModal.should.have.been.called;
      expect($scope.displayControlError).to.not.be.ok;
    });

  });

});
