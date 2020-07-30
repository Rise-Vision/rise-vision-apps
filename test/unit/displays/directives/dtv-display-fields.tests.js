'use strict';
describe('directive: display fields', function() {
  var COUNTRIES = ["country1","country2"]
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
     $provide.value("COUNTRIES", COUNTRIES);
     $provide.value("REGIONS_CA", [""]);
     $provide.value("REGIONS_US", [""]);
     $provide.value("TIMEZONES", [""]);
     $provide.value("SHARED_SCHEDULE_URL", [""]);
  }));
  
  var elm, $scope, $compile;

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
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
  });

  it("isChromeOs: ", function() {
    expect($scope.isChromeOs({os: "cros/x86-64"})).to.be.true;
    expect($scope.isChromeOs({os: "64-bit Microsoft Windows Embedded Standard"})).to.be.false;
  });
  
});
