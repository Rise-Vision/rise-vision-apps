'use strict';
describe('directive: resolution selector', function() {
  var $compile,
      $rootScope;

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));
  var presentationProperties, element;
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $templateCache.put('partials/editor/resolution-selector.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    presentationProperties = {
      width: 1024,
      height: 768
    }
    $rootScope.presentationProperties = presentationProperties;

    element = $compile("<resolution-selector></resolution-selector>")($rootScope);
    $rootScope.$digest();

  }));

  it('should replaces the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should load the resolution option', function() {
    var resolutionOptions = {
      'custom': 'Custom',
      '1280x720': '1280 x 720 Wide',
      '1280x768': '1280 x 768 Wide',
      '1360x768': '1360 x 768 Wide',
      '1366x768': '1366 x 768 Wide',
      '1440x900': '1440 x 900 Wide',
      '1680x1050': '1680 x 1050 Wide',
      '1920x1080': '1920 x 1080 Wide',
      '3840x2160': '3840 x 2160 Wide',
      '1024x768': '1024 x 768',
      '1280x1024': '1280 x 1024',
      '1600x1200': '1600 x 1200',
      '720x1280': '720 x 1280 Portrait',
      '768x1280': '768 x 1280 Portrait',
      '768x1360': '768 x 1360 Portrait',
      '768x1366': '768 x 1366 Portrait',
      '1080x1920': '1080 x 1920 Portrait',
      '2160x3840': '2160 x 3840 Portrait',
    };

    expect($rootScope.resolutionOptions).to.deep.equal(resolutionOptions);
  });

  it('should set the resolutionOption with the current presentation properties', function() {
    expect($rootScope.resolutionOption).to.equal('1024x768');
  });

  it('should update resolutions when an option is selected', function() {
    $rootScope.resolutionOption = '1600x1200';
    $rootScope.updateResolution();
    expect($rootScope.presentationProperties).to.deep.equal({width: 1600, height: 1200});
  });
});