'use strict';
xdescribe('directive: display address', function() {
  var COUNTRIES = ["country1","country2"]
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory', function() {
      return {};
    });
    $provide.value("COUNTRIES", COUNTRIES);
    $provide.value("REGIONS_CA", [""]);
    $provide.value("REGIONS_US", [""]);
    $provide.value("TIMEZONES", [""]);
  }));
  
  var elm, $scope, $compile;

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    $templateCache.put('partials/displays/display-address.html', '<p>Fields</p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<display-address></display-address>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('Fields');
    expect($scope.countries).to.equal(COUNTRIES);
    expect($scope.regionsCA).to.be.ok;
    expect($scope.regionsUS).to.be.ok;
    expect($scope.timezones).to.be.ok;
  });

});
