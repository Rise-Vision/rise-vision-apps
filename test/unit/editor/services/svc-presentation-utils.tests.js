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

    $provide.service('plansFactory', function() {
      return plansFactory = {
        showPlansModal: sinon.stub()
      }
    })
  }));

  var presentationUtils, HTML_TEMPLATE_TYPE, HTML_PRESENTATION_TYPE, $state, plansFactory;

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

  describe( 'openPresentation:', function() {
    it( "should route to editor workspace when not a HTML template", function() {
      presentationUtils.openPresentation({ id: 'test-id', presentationType: 'legacy' });

      expect($state.go).to.have.been.calledWith('apps.editor.workspace.artboard', {presentationId: 'test-id'});
    } );

    it( "should route to template editor when presentation type is HTML template", function(done) {
      presentationUtils.openPresentation({ id: 'test-id', presentationType: 'HTML Template', productCode: 'abc123' });

      setTimeout(function() {
        expect($state.go).to.have.been.calledWith('apps.editor.templates.edit', {presentationId: 'test-id'});
        done();
      }, 10);

    } );
  })
});
