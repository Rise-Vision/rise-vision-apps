'use strict';

describe('service: presentationUtils:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() { return Q; });

    $provide.service('$state', function() {
      return {
        go: sinon.stub()
      };
    });

  }));

  var presentationUtils, HTML_TEMPLATE_TYPE, HTML_PRESENTATION_TYPE, $state;

  beforeEach(function() {
    inject(function($injector) {
      presentationUtils = $injector.get('presentationUtils');
      HTML_TEMPLATE_TYPE = $injector.get('HTML_TEMPLATE_TYPE');
      HTML_PRESENTATION_TYPE = $injector.get('HTML_PRESENTATION_TYPE');
      $state = $injector.get('$state');
    });
  });

  it('should exist', function() {
    expect(presentationUtils).to.be.truely;
    expect(presentationUtils.isHtmlTemplate).to.be.a('function');
    expect(presentationUtils.isHtmlPresentation).to.be.a('function');
  });

  describe('isHtmlTemplate:', function() {
    it('should return true if Product is an HTML Template', function() {
      expect(presentationUtils.isHtmlTemplate({ productTag: [HTML_TEMPLATE_TYPE] })).to.be.true;
    });

    it('should return false if Product is not an HTML Template', function() {
      expect(presentationUtils.isHtmlTemplate({})).to.be.falsey;
      expect(presentationUtils.isHtmlTemplate({ productTag: [] })).to.be.false;
      expect(presentationUtils.isHtmlTemplate({ productTag: ['Other Product'] })).to.be.false;
    });
  });

  describe('isHtmlPresentation:', function() {
    it('should return true if Presentation has HTML type', function() {
      expect(presentationUtils.isHtmlPresentation({ presentationType: HTML_PRESENTATION_TYPE })).to.be.true;
    });

    it('should return false if Presentation does not have HTML type', function() {
      expect(presentationUtils.isHtmlPresentation({})).to.be.falsey;
      expect(presentationUtils.isHtmlPresentation({ presentationType: 'Other Type' })).to.be.false;
    });
  });

});
