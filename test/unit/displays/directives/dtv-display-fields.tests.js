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
    $provide.service('messageBox', function() {
      return sinon.stub();
    });
    $provide.service('userState', function() {
      return {        
        _restoreState: sinon.stub()
      };
    });

    $provide.value("COUNTRIES", COUNTRIES);
    $provide.value("REGIONS_CA", [""]);
    $provide.value("REGIONS_US", [""]);
    $provide.value("TIMEZONES", [""]);
    $provide.value('SHARED_SCHEDULE_URL','https://preview.risevision.com/?type=sharedschedule&id=SCHEDULE_ID');
  }));
  
  var elm, $scope, $compile, $sce, playerProFactory, displayControlFactory, messageBox;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    $sce = $injector.get('$sce');
    playerProFactory = $injector.get('playerProFactory');
    displayControlFactory = $injector.get('displayControlFactory');
    messageBox = $injector.get('messageBox');

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
    expect($scope.userState).to.be.ok;
    expect($scope.countries).to.equal(COUNTRIES);
    expect($scope.isChromeOs).to.be.a('function');
    expect($scope.getEmbedUrl).to.be.a('function');
    expect($scope.openTimePicker).to.be.a('function');
    expect($scope.configureDisplayControl).to.be.a('function');
    expect($scope.installationInstructionsModal).to.be.a('function');
  });

  it("isChromeOs: ", function() {
    expect($scope.isChromeOs({os: "cros/x86-64"})).to.be.true;
    expect($scope.isChromeOs({os: "64-bit Microsoft Windows Embedded Standard"})).to.be.false;
  });
  
  describe('getEmbedUrl:', function() {
    beforeEach(function() {
      sinon.stub($sce, 'trustAsResourceUrl').returns('http://trustedUrl');
    });

    afterEach(function() {
      $sce.trustAsResourceUrl.restore();
    });

    it('should return a trusted embed URL', function() {     
      expect($scope.getEmbedUrl('ID')).to.equal('http://trustedUrl');
      $sce.trustAsResourceUrl.should.have.been.calledWith('https://preview.risevision.com/?type=sharedschedule&id=ID&env=apps_display');
    });

    it('should return null, to not render iframe, when scheduleId is not provided', function() {
      expect($scope.getEmbedUrl(null)).to.equal(null);
      $sce.trustAsResourceUrl.should.not.have.been.called;
    });
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

  it('installationInstructionsModal:', function() {
    $scope.installationInstructionsModal();

    messageBox.should.have.been.calledWith(null, null, null, 'madero-style centered-modal download-player-modal', 'partials/displays/download-player-modal.html', 'sm');
  });

});
