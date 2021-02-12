'use strict';

describe('filter: presentationLink', function() {
  beforeEach(module('risevision.editor.filters'));
  beforeEach(module(function ($provide) {
    $provide.service('presentationUtils', function() {
      return {
        isHtmlPresentation: function () {}
      };
    });
  }));

  var presentationUtils, presentationLink;

  beforeEach(function() {
    inject(function($injector, $filter) {
      presentationUtils = $injector.get('presentationUtils');
      presentationLink = $filter('presentationLink');      
    });
  });

  it('should exist',function(){
    expect(presentationLink).to.be.ok;
  });

  it('should return the correct ui-sref link for a Classic Presentation',function() {
    sinon.stub(presentationUtils, 'isHtmlPresentation').returns(false);

    expect(presentationLink({})).to.equal('apps.editor.workspace.artboard({ presentationId: presentation.id })');
  });

  it('should return the correct ui-sref link for an HTML Presentation',function() {
    sinon.stub(presentationUtils, 'isHtmlPresentation').returns(true);

    expect(presentationLink({})).to.equal('apps.editor.templates.edit({ presentationId: presentation.id })');
  });
});
