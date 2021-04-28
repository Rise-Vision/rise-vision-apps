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

    it('rise-branding-colors', function() {
      var directive = COMPONENTS_MAP['rise-branding-colors'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-branding-colors');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('palette');
      expect(directive.title).to.equal('Color Settings');
      expect(directive.panel).to.equal('.branding-colors-container');
    });

    it('rise-branding', function() {
      var directive = COMPONENTS_MAP['rise-branding'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-branding');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('ratingStar');
      expect(directive.title).to.equal('Brand Settings');
      expect(directive.panel).to.equal('.branding-component-container');
    });

    it('rise-override-brand-colors', function() {
      var directive = COMPONENTS_MAP['rise-override-brand-colors'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-override-brand-colors');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.exist;
    });

    it('rise-data-counter', function() {
      var directive = COMPONENTS_MAP['rise-data-counter'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-data-counter');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.exist;
    });

    it('rise-data-financial', function() {
      var directive = COMPONENTS_MAP['rise-data-financial'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-data-financial');
      expect(directive.icon).to.equal('financial');
      expect(directive.iconType).to.equal('streamline');
    });

    it('rise-html', function() {
      var directive = COMPONENTS_MAP['rise-html'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-html');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('html');
    });

    it('rise-image', function() {
      var directive = COMPONENTS_MAP['rise-image'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-image');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('image');
      expect(directive.panel).to.equal('.image-component-container');
    });

    it('rise-image-logo', function() {
      var directive = COMPONENTS_MAP['rise-image-logo'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-image-logo');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('circleStar');
      expect(directive.title).to.equal('Logo Settings');
      expect(directive.panel).to.equal('.image-component-container');
    });

    it('rise-playlist', function() {
      var directive = COMPONENTS_MAP['rise-playlist'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal("rise-playlist");
      expect(directive.iconType).to.equal("streamline");
      expect(directive.icon).to.exist;
      expect(directive.panel).to.equal(".rise-playlist-container");
    });

    it('rise-data-rss', function() {
      var directive = COMPONENTS_MAP['rise-data-rss'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-data-rss');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('rss');
    });

    it('rise-schedules', function() {
      var directive = COMPONENTS_MAP['rise-schedules'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-schedules');
      expect(directive.title).to.equal('Schedules');
    });

    it('rise-slides', function() {
      var directive = COMPONENTS_MAP['rise-slides'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-slides');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('slides');
    });

    it('rise-storage-selector', function() {
      var directive = COMPONENTS_MAP['rise-storage-selector'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-storage-selector');
      expect(directive.iconType).to.equal('riseSvg');
      expect(directive.icon).to.equal('riseStorage');
      expect(directive.panel).to.equal('.storage-selector-container');
      expect(directive.title).to.equal('Rise Storage');
    });

    it('rise-text', function() {
      var directive = COMPONENTS_MAP['rise-text'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-text');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.exist;
    });

    it('rise-time-date', function() {
      var directive = COMPONENTS_MAP['rise-time-date'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-time-date');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.exist;
    });

    it('rise-data-twitter', function() {
      var directive = COMPONENTS_MAP['rise-data-twitter'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-data-twitter');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.exist;
    });

    it('rise-video', function() {
      var directive = COMPONENTS_MAP['rise-video'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-video');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('video');
      expect(directive.panel).to.equal('.video-component-container');
    });

    it('rise-data-weather', function() {
      var directive = COMPONENTS_MAP['rise-data-weather'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-data-weather');
      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('sun');
    });

  });

  it('COMPONENTS_ARRAY', function() {
    expect(COMPONENTS_ARRAY).to.have.length(18);

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
