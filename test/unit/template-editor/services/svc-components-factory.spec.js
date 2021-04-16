'use strict';

describe('service: componentsFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  var componentsFactory, COMPONENTS_MAP, COMPONENTS_ARRAY, PLAYLIST_COMPONENTS;

  beforeEach(function() {
    inject(function($injector) {
      componentsFactory = $injector.get('componentsFactory');
      COMPONENTS_MAP = $injector.get('COMPONENTS_MAP');
      COMPONENTS_ARRAY = $injector.get('COMPONENTS_ARRAY');
      PLAYLIST_COMPONENTS = $injector.get('PLAYLIST_COMPONENTS');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('COMPONENTS_MAP', function() {
    it('should exist', function() {
      expect(COMPONENTS_MAP).to.be.an('object');
    });

    it('should configure component objects', function() {
      expect(COMPONENTS_MAP['rise-text']).to.be.ok;
    });
  });

  it('COMPONENTS_ARRAY', function() {
    expect(COMPONENTS_ARRAY).to.have.length(17);

    for (var i = 0; i < COMPONENTS_ARRAY.length; i++) {
      expect(COMPONENTS_ARRAY[i].type).to.be.ok;
      expect(COMPONENTS_ARRAY[i].title).to.be.ok;
    }
  });

  it('PLAYLIST_COMPONENTS', function() {
    expect(PLAYLIST_COMPONENTS).to.have.length(6);
  });

  it('should initialize', function() {
    expect(componentsFactory).to.be.ok;
  });

});
