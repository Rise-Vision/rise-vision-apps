describe("Services: FastPass", function() {
  var loadFastpass, $httpBackend, authRequestHandler, $rootScope;
  var script = {};

  beforeEach(module("risevision.common.fastpass"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.value("GSFP_URL", "/fp");
    $provide.value("$document", [{createElement: function () {
      return script;
    }, body: {appendChild: function () {
      if(script.onload) {
        script.onload.call(null, {});
        delete script.onload;
      }
    }}}]);
  }));

  beforeEach(function(){
    inject(function($injector){
      loadFastpass = $injector.get("loadFastpass");
      $httpBackend = $injector.get("$httpBackend");
      $rootScope = $injector.get("$rootScope");
      authRequestHandler = $httpBackend.when("GET", /^\/fp\/(.)+$/)
        .respond("fakescript.js");
    });
  });

  it("should exist",function(){
    expect(loadFastpass).to.be.truely;
    expect(loadFastpass).to.be.a.function;
  });

  it("should correctly load fastpass script",function(done){
    $httpBackend.expectGET("/fp/geturl?userEmail=hello@hello.com&userName=hello");
    loadFastpass("hello", "hello@hello.com")
    .then(function () {
      expect(script.src).to.equal("fakescript.js");
      done();
    }, done);
    $httpBackend.flush();
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
