'use strict';

describe('filter: encodeLink', function() {
  beforeEach(module('risevision.template-editor.filters'));

  var encodeLink;

  beforeEach(function() {
    inject(function($injector, $filter) {
      encodeLink = $filter('encodeLink');
    });
  });

  it('should exist',function(){
    expect(encodeLink).to.be.ok;
  });

  it('should return the correct encoded link for a given url',function() {
    expect(encodeLink('http://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU')).to.equal('http%3A%2F%2Fapi.foxsports.com%2Fv1%2Frss%3FpartnerKey%3DzBaFxRyGKCfxBagJG9b8pqLyndmvo7UU');
  });
});
