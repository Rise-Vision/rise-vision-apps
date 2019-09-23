/**
 * Created by rodrigopavezi on 11/28/14.
 */
describe("Unit testing angular google analytics", function() {
  var $compile, $rootScope;

  // Load the myApp module, which contains the directive
  beforeEach(module("risevision.common.components.google-analytics"));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it("should create an element with analyticsAccountId set on the scope", function() {
    // Compile a piece of HTML containing the directive
    var element = $compile("<analytics analytics-account-id=\"'UA-82239-1'\"></analytics>")($rootScope);
    // fire all the watches, so the scope expression will be evaluated
    $rootScope.$digest();
    // Check that the compiled element contains the analyticsAccountId content
    assert.equal(element.isolateScope().analyticsAccountId, "UA-82239-1", "analyticsAccountId == UA-82239-1");
  });
});
