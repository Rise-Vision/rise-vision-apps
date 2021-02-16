"use strict";
describe("directive: svg-icon", function() {
  var element;

  beforeEach(module("risevision.common.components.svg"));

  beforeEach(inject(function($compile, $rootScope){
    element = $compile("<svg-icon p='riseLogo'></svg-icon>")($rootScope);
    
    $rootScope.$digest();
  }));

  it("should initialize icons list", function(done) {
    inject(function($injector){
      var iconsList = $injector.get("iconsList");
      
      expect(iconsList).to.be.ok;
      expect(iconsList.icons1).to.be.ok;
      expect(iconsList.icons2).to.be.ok;
      
      expect(iconsList.icons1.riseLogo).to.be.ok;
      expect(iconsList.icons2.riseStore).to.be.ok;
      
      done();
    });
  });

  it("Replaces the element with the appropriate content", function() {
    expect(element.html()).to.contain("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\">");
  });

});
