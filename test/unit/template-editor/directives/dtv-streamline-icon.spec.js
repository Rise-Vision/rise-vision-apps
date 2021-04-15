'use strict';

describe('directive: streamline-icon', function() {
  var element;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(inject(function($compile, $rootScope){
    element = $compile('<streamline-icon name="checkmark" width="64" height="64"></streamline-icon>')($rootScope);
    
    $rootScope.$digest();
  }));

  it('should have a valid icons list', function(done) {
    inject(function($injector){
      var iconsList = $injector.get('streamlineIconsList');
      
      expect(iconsList).to.be.ok;
      expect(iconsList.checkmark).to.be.ok;
      expect(iconsList.sun).to.be.ok;
      expect(iconsList.close).to.be.ok;
      expect(iconsList.ratingStar).to.be.ok;
      expect(iconsList.palette).to.be.ok;
      expect(iconsList.circleStar).to.be.ok;
      expect(iconsList.html).to.be.ok;
      
      _.map(iconsList, function (value) {
        expect(value.viewBox).to.be.a('string');
        expect(value.paths).to.be.an('array');
      });

      done();
    });
  });

  it('Replaces the element with the appropriate content', function() {
    expect(element.html()).to.contain('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 14 12">');
  });
});
