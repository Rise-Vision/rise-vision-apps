'use strict';
describe('filter: status', function() {
  beforeEach(module('risevision.displays.filters'));
  var resolution;
  beforeEach(function(){
    inject(function($filter){
      resolution = $filter('resolution');
    });
  });

  it('should exist',function(){
    expect(resolution).to.be.truely;
  });

  it('should default to N/A if width and height are null',function(){
    expect(resolution()).to.equal('N/A');
  });

  it('should default to N/A if width is empty',function(){
    expect(resolution("","1")).to.equal('N/A');
  });

  it('should default to N/A if height is empty',function(){
    expect(resolution("1","")).to.equal('N/A');
  });

  it('should return the concatenation of a width and hight',function(){
    var width = 1;
    var height = 1;
    var expectation = "1x1";
    expect(resolution(width,height)).to.equal(expectation);
  });

});
