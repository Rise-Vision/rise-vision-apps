'use strict';
describe('directive: display address', function() {
  var COUNTRIES = ["country1","country2"]
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.value("COUNTRIES", COUNTRIES);
    $provide.value("REGIONS_CA", [""]);
    $provide.value("REGIONS_US", [""]);
    $provide.value("TIMEZONES", [""]);
  }));
  
  var elm, $scope, $compile, display;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    display = {id: 123};
    $rootScope.myDisplay = display;
    $templateCache.put('partials/displays/display-address.html', '<p>Fields</p>');
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<display-address display="myDisplay"></display-address>';
    inject(function($compile, $rootScope) {
      elm = $compile(tpl)($rootScope.$new());
      $rootScope.$digest();
      $scope = elm.isolateScope();
    });
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('Fields');
    expect($scope.countries).to.equal(COUNTRIES);
    expect($scope.regionsCA).to.be.ok;
    expect($scope.regionsUS).to.be.ok;
    expect($scope.timezones).to.be.ok;
    expect($scope.display).to.equal(display);
  });

});
