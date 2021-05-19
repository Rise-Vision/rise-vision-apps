'use strict';

describe('service: componentsFactory:', function() {
  var sandbox = sinon.sandbox.create();
  var componentsFactory, COMPONENTS_MAP, COMPONENTS_ARRAY, PLAYLIST_COMPONENTS;
  var element,
    $timeout,
    $window,
    blueprintFactory,
    templateEditorUtils;

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    var elementStub = {
      hide: sandbox.stub(),
      show: sandbox.stub(),
      addClass: sandbox.stub(),
      removeClass: sandbox.stub()
    };

    $provide.service('templateEditorUtils', function() {
      return {
        elementStub: elementStub,
        findElement: sandbox.stub().returns(elementStub)
      };
    });

    $provide.service('blueprintFactory', function() {
      return {};
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');

      templateEditorUtils = $injector.get('templateEditorUtils');
      blueprintFactory = $injector.get('blueprintFactory');

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

    it('rise-playlist-item', function() {
      var directive = COMPONENTS_MAP['rise-playlist-item'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal("rise-playlist-item");
      expect(directive.iconType).to.equal("streamline");
      expect(directive.icon).to.exist;
      expect(directive.panel).to.equal(".playlist-item-container");
    });

    it('rise-presentation-selector', function() {
      var directive = COMPONENTS_MAP['rise-presentation-selector'];

      expect(directive).to.be.ok;
      expect(directive.type).to.equal("rise-presentation-selector");
      expect(directive.iconType).to.equal("streamline");
      expect(directive.icon).to.exist;
      expect(directive.panel).to.equal(".presentation-selector-container");
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
    expect(COMPONENTS_ARRAY).to.have.length(20);

    for (var i = 0; i < COMPONENTS_ARRAY.length; i++) {
      expect(COMPONENTS_ARRAY[i].type).to.be.ok;
      expect(COMPONENTS_ARRAY[i].title).to.be.ok;
    }
  });

  it('PLAYLIST_COMPONENTS', function() {
    expect(PLAYLIST_COMPONENTS).to.have.length(5);
  });

  it('should initialize', function() {
    expect(componentsFactory).to.be.ok;

    expect(componentsFactory.selected).to.be.null;
    expect(componentsFactory.showAttributeList).to.be.true;
    expect(componentsFactory.directives).to.deep.equal({});
    expect(componentsFactory.pages).to.deep.equal([]);
  });

  it('should define functions', function() {
    expect(componentsFactory.registerDirective).to.be.a('function');
    expect(componentsFactory.editComponent).to.be.a('function');
    expect(componentsFactory.onBackButton).to.be.a('function');
    expect(componentsFactory.backToList).to.be.a('function');
    expect(componentsFactory.getComponentIcon).to.be.a('function');
  });

  it('reset:', function() {
    componentsFactory.selected = 'selected';
    componentsFactory.showAttributeList = false;
    componentsFactory.directives = {
      first: {}
    };
    componentsFactory.pages = ['page'];

    componentsFactory.reset();

    expect(componentsFactory.selected).to.be.null;
    expect(componentsFactory.showAttributeList).to.be.true;
    expect(componentsFactory.directives).to.deep.equal({});
    expect(componentsFactory.pages).to.deep.equal([]);
  });

  describe('registerDirective:', function() {
    it('Registers a component', function() {
      var component = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub()
        },
        show: function() {}
      };

      componentsFactory.registerDirective(component);

      expect(componentsFactory.directives["rise-test"]).to.be.ok;
      expect(componentsFactory.directives["rise-test"].type).to.equal("rise-test");

      expect(component.element.hide).to.have.been.called;
    });

    it('Runs the open presentation handler', function() {
      var component = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: function() {},
          show: function() {}
        },
        onPresentationOpen: sandbox.stub()
      };

      componentsFactory.registerDirective(component);

      expect(component.onPresentationOpen).to.have.been.called;
    });

    it('should populate directive properties', function() {
      var directive = {
        type: 'rise-text',
        element: {
          hide: function() {},
          show: function() {}
        }
      };

      componentsFactory.registerDirective(directive);

      expect(directive.iconType).to.equal('streamline');
      expect(directive.icon).to.equal('text');
      expect(directive.title).to.equal('Text');
    });

    describe('panel:', function() {
      it('should set default panel', function() {
        var component = {
          type: 'rise-test',
          icon: 'fa-test',
          element: {
            hide: sandbox.stub()
          }
        };

        componentsFactory.registerDirective(component);

        expect(componentsFactory.directives["rise-test"]).to.be.ok;
        expect(componentsFactory.directives["rise-test"].panel).to.equal('.attribute-editor-component');
      });

      it('should not override directive panel', function() {
        var component = {
          type: 'rise-test',
          icon: 'fa-test',
          panel: '.component-panel',
          element: {
            hide: sandbox.stub()
          }
        };

        componentsFactory.registerDirective(component);

        expect(componentsFactory.directives["rise-test"]).to.be.ok;
        expect(componentsFactory.directives["rise-test"].panel).to.equal('.component-panel');
      });

      it('should not override default directive panel', function() {
        var component = {
          type: 'rise-video',
          element: {
            hide: sandbox.stub()
          }
        };

        componentsFactory.registerDirective(component);

        expect(componentsFactory.directives["rise-video"]).to.be.ok;
        expect(componentsFactory.directives["rise-video"].panel).to.equal('.video-component-container');
      });

    });
  });

  describe('editComponent:', function() {
    describe('_getDirective:', function() {
      beforeEach(function() {
        sandbox.stub(componentsFactory, 'showNextPage');
      });

      it('should handle missing component', function() {
        componentsFactory.editComponent();

        expect(componentsFactory.selected).to.not.be.ok;
      });

      it('should use component directive', function() {
        var component = {
          directive: {
            type: 'rise-text',
            show: sandbox.stub()
          }
        };

        componentsFactory.editComponent(component);

        expect(componentsFactory.selected).to.equal(component);

        expect(component.directive.show).to.have.been.called;

        componentsFactory.showNextPage.should.have.been.calledWith(component);
      });

      it('should get directive from registered list', function() {
        var directive = {
          type: 'rise-text',
          element: {
            hide: function() {},
          },
          show: sandbox.stub()
        };

        var component = {
          type: 'rise-text'
        }

        componentsFactory.registerDirective(directive);
        componentsFactory.editComponent(component);

        expect(componentsFactory.selected).to.equal(component);

        expect(directive.show).to.have.been.called;

        componentsFactory.showNextPage.should.have.been.calledWith(component);
      });

    });

    it('Edits a component', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: function() {},
          show: sandbox.stub()
        },
        show: sandbox.stub()
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);

      expect(componentsFactory.selected).to.deep.equal(component);

      expect(directive.element.show).to.have.been.called;
      expect(directive.show).to.have.been.called;

      expect(componentsFactory.showAttributeList).to.be.true;

      $timeout.flush();
      expect(componentsFactory.showAttributeList).to.be.false;
    });    
  });
  
  describe('getComponentIcon:', function() {
    it('should return empty if null', function() {
      expect(componentsFactory.getComponentIcon()).to.equal('');
    });

    it('should return empty if directive is not found', function() {
      var component = {};

      expect(componentsFactory.getComponentIcon(component)).to.equal('');
    });

    it('should return directive icon', function() {
      var component = {
        directive: {
          icon: 'sampleIcon'
        }
      };

      expect(componentsFactory.getComponentIcon(component)).to.equal('sampleIcon');
    });

  });

  describe('getComponentIconType:', function() {
    it('should return empty if null', function() {
      expect(componentsFactory.getComponentIconType()).to.equal('');
    });

    it('should return empty if directive is not found', function() {
      var component = {};

      expect(componentsFactory.getComponentIconType(component)).to.equal('');
    });

    it('should return directive icontype', function() {
      var component = {
        directive: {
          iconType: 'iconType'
        }
      };

      expect(componentsFactory.getComponentIconType(component)).to.equal('iconType');
    });

  });

  describe('getComponentTitle:', function() {
    it('should return empty if null', function() {
      expect(componentsFactory.getComponentTitle()).to.equal('');
    });

    it('should return empty if directive is not found', function() {
      var component = {};

      expect(componentsFactory.getComponentTitle(component)).to.equal('');
    });

    it('should return panel title', function() {
      componentsFactory.panelTitle = 'panelTitle';
      var component = {
        label: 'directiveLabel',
        directive: {
          title: 'directiveTitle'
        }
      };

      expect(componentsFactory.getComponentTitle(component)).to.equal('panelTitle');
    });

    it('should return component label', function() {
      var component = {
        label: 'directiveLabel',
        directive: {
          title: 'directiveTitle'
        }
      };

      expect(componentsFactory.getComponentTitle(component)).to.equal('directiveLabel');
    });

    it('should return directive title if label is missing', function() {
      var component = {
        directive: {
          title: 'directiveTitle'
        }
      };

      expect(componentsFactory.getComponentTitle(component)).to.equal('directiveTitle');
    });

  });

  describe('editHighlightedComponent:', function() {
    it('Edits a highlighted component', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: function() {},
          show: sandbox.stub()
        },
        show: sandbox.stub()
      };

      var component = {
        id: 'test',
        type: 'rise-test'
      }

      blueprintFactory.blueprintData = {
        components: [component]
      };

      componentsFactory.registerDirective(directive);
      componentsFactory.editHighlightedComponent(component.id);

      expect(componentsFactory.selected).to.deep.equal(component);

      expect(directive.element.show).to.have.been.called;
      expect(directive.show).to.have.been.called;

      expect(componentsFactory.showAttributeList).to.be.true;

      $timeout.flush();
      expect(componentsFactory.showAttributeList).to.be.false;
    });

    it('Resets selected pages when editing a highlighted component', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: function() {},
          show: sandbox.stub()
        },
        show: sandbox.stub()
      };

      var component = {
        id: 'test',
        type: 'rise-test'
      }
      
      componentsFactory.registerDirective(directive);

      blueprintFactory.blueprintData = {
        components: [component]
      };

      componentsFactory.selected = component;
      componentsFactory.pages = [{}, {}, {}];
      componentsFactory.setPanelIcon('previous-icon', 'streamline');
      componentsFactory.setPanelTitle('Previous Title');
      
      componentsFactory.editHighlightedComponent(component.id);

      expect(componentsFactory.selected).to.deep.equal(component);

      expect(componentsFactory.pages).to.have.length(1);
      expect(componentsFactory.pages[0]).to.equal(component);
      expect(componentsFactory.panelIcon).to.be.null;
      expect(componentsFactory.panelIconType).to.be.null;
      expect(componentsFactory.panelTitle).to.be.null;

      expect(directive.element.show).to.have.been.called;
      expect(directive.show).to.have.been.called;

      expect(componentsFactory.showAttributeList).to.be.true;

      $timeout.flush();
      expect(componentsFactory.showAttributeList).to.be.false;
    });
  });

  describe('backToList:', function() {
    it('Goes back to list', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {}
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      componentsFactory.backToList();

      expect(componentsFactory.selected).to.be.null;
      expect(directive.element.hide).to.have.been.called.twice;

      expect(componentsFactory.showAttributeList).to.be.false;

      $timeout.flush();
      expect(componentsFactory.showAttributeList).to.be.true;
    });
  });

  describe('onBackButton:', function() {
    it('Goes back to list if there is no back handler', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {}
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.highlightComponent = sandbox.stub();
      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      componentsFactory.onBackButton();

      expect(componentsFactory.selected).to.be.null;
      expect(directive.element.hide).to.have.been.called.twice;
      expect(componentsFactory.highlightComponent).to.have.been.called.once;

      expect(componentsFactory.showAttributeList).to.be.false;

      $timeout.flush();
      expect(componentsFactory.showAttributeList).to.be.true;
    });

    it('Goes back to list if back handler returns false', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {},
        onBackHandler: function() { return false; }
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.highlightComponent = sandbox.stub();
      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      componentsFactory.onBackButton();

      expect(componentsFactory.selected).to.be.null;
      expect(directive.element.hide).to.have.been.called.twice;
      expect(componentsFactory.highlightComponent).to.have.been.called.once;

      expect(componentsFactory.showAttributeList).to.be.false;

      $timeout.flush();
      expect(componentsFactory.showAttributeList).to.be.true;
    });

    it('Does not go back to list if back handler returns true', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {},
        onBackHandler: function() { return true; }
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.highlightComponent = sandbox.stub();
      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      componentsFactory.onBackButton();

      expect(componentsFactory.selected).to.not.be.null;
      expect(directive.element.hide).to.have.been.called.once;
      expect(componentsFactory.highlightComponent).to.have.been.called.once;
      expect(componentsFactory.showAttributeList).to.be.false;
    });
  });

  describe('isHeaderBottomRuleVisible:', function() {
    it('Shows header bottom rule if isHeaderBottomRuleVisible is not defined for directive', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {},
        onBackHandler: function() { return true; }
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      var visible = componentsFactory.isHeaderBottomRuleVisible(component);

      expect(visible).to.be.true;
    });

    it('Shows header bottom rule if isHeaderBottomRuleVisible allows it', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {},
        isHeaderBottomRuleVisible: function() { return true; },
        onBackHandler: function() { return true; }
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      var visible = componentsFactory.isHeaderBottomRuleVisible(component);

      expect(visible).to.be.true;
    });

    it('Does not show header bottom rule if isHeaderBottomRuleVisible not allows it', function() {
      var directive = {
        type: 'rise-test',
        icon: 'fa-test',
        element: {
          hide: sandbox.stub(),
          show: function() {}
        },
        show: function() {},
        isHeaderBottomRuleVisible: function() { return false; },
        onBackHandler: function() { return true; }
      };

      var component = {
        type: 'rise-test'
      }

      componentsFactory.registerDirective(directive);
      componentsFactory.editComponent(component);
      $timeout.flush();

      var visible = componentsFactory.isHeaderBottomRuleVisible(component);

      expect(visible).to.be.false;
    });    
  });

  describe('showNextPage:', function () {
    it('should show a new page', function () {
      expect(componentsFactory.pages).to.have.length(0);

      componentsFactory.showNextPage('selector1');

      expect(componentsFactory.pages).to.have.length(1);
      expect(componentsFactory.pages[0]).to.equal('selector1');
    });

    it('should show a second page', function () {
      componentsFactory.showNextPage('selector1');
      componentsFactory.showNextPage('selector2');

      expect(componentsFactory.pages).to.deep.equal(['selector1', 'selector2']);
    });

    describe('_swapToLeft:', function() {
      var directive1, directive2;
      var component1, component2;

      beforeEach(function() {
        directive1 = {
          type: 'rise-test-1',
          panel: 'panel1',
          element: {
            hide: sandbox.stub(),
            show: sandbox.stub()
          },
          show: sandbox.stub()
        };
        directive2 = {
          type: 'rise-test-2',
          panel: 'panel2',
          element: {
            hide: sandbox.stub(),
            show: sandbox.stub()
          },
          show: sandbox.stub()
        };

        component1 = {
          type: 'rise-test-1'
        };
        component2 = {
          type: 'rise-test-2'
        };

        componentsFactory.registerDirective(directive1);
        componentsFactory.registerDirective(directive2);

        directive1.element.hide.reset();
        directive2.element.hide.reset();
      });

      it('should swap left', function(done) {
        componentsFactory.pages.push(component1);
        componentsFactory.selected = component2;

        componentsFactory.showNextPage(component2);

        directive1.element.hide.should.have.been.called;
        templateEditorUtils.findElement.should.have.been.calledWith('panel1', directive1.element);

        directive2.element.show.should.have.been.called;
        templateEditorUtils.findElement.should.have.been.calledWith('panel2', directive2.element);

        templateEditorUtils.elementStub.removeClass.should.have.been.calledWith('attribute-editor-show-from-right');
        templateEditorUtils.elementStub.removeClass.should.have.been.calledWith('attribute-editor-show-from-left');

        templateEditorUtils.elementStub.addClass.should.have.been.calledWith('attribute-editor-show-from-right');

        setTimeout(function() {
          templateEditorUtils.elementStub.hide.should.have.been.called;
          templateEditorUtils.elementStub.show.should.have.been.called;

          done();
        }, 10);
      });
      
      it('should not hide the element if its the same', function() {
        directive2.element = directive1.element;
        componentsFactory.selected = component2;

        componentsFactory.pages.push(component1);

        componentsFactory.showNextPage(component2);

        directive1.element.hide.should.not.have.been.called;
        directive1.element.show.should.have.been.called;
      });

      it('should handle missing page', function(done) {
        componentsFactory.showNextPage(component2);

        directive2.element.show.should.have.been.called;
        templateEditorUtils.findElement.should.have.been.calledWith('panel2', directive2.element);

        templateEditorUtils.elementStub.addClass.should.have.been.calledWith('attribute-editor-show-from-right');

        setTimeout(function() {
          templateEditorUtils.elementStub.show.should.have.been.called;

          done();
        }, 10);
      });

    });

  });

  describe('showPreviousPage:', function () {
    beforeEach(function() {
      sandbox.stub(componentsFactory, 'backToList');
    });

    it('should hide the first page', function () {
      componentsFactory.showNextPage('selector1');

      componentsFactory.showPreviousPage();

      componentsFactory.backToList.should.have.been.called;

      expect(componentsFactory.pages).to.have.length(0);
    });

    it('should hide the second page', function () {
      componentsFactory.showNextPage('selector1');
      componentsFactory.showNextPage('selector2');

      componentsFactory.showPreviousPage();

      componentsFactory.backToList.should.not.have.been.called;

      expect(componentsFactory.selected).to.equal('selector1');

      expect(componentsFactory.pages).to.deep.equal(['selector1']);
    });

    describe('_swapToRight:', function() {
      var directive1, directive2;
      var component1, component2;

      beforeEach(function() {
        directive1 = {
          type: 'rise-test-1',
          panel: 'panel1',
          element: {
            hide: sandbox.stub(),
            show: sandbox.stub()
          },
          show: sandbox.stub()
        };
        directive2 = {
          type: 'rise-test-2',
          panel: 'panel2',
          element: {
            hide: sandbox.stub(),
            show: sandbox.stub()
          },
          show: sandbox.stub()
        };

        component1 = {
          type: 'rise-test-1'
        };
        component2 = {
          type: 'rise-test-2'
        };

        componentsFactory.registerDirective(directive1);
        componentsFactory.registerDirective(directive2);

        directive1.element.hide.reset();
        directive2.element.hide.reset();
      });

      it('should swap right', function(done) {
        componentsFactory.pages.push(component1);
        componentsFactory.pages.push(component2);

        componentsFactory.showPreviousPage();

        directive1.element.show.should.have.been.called;
        templateEditorUtils.findElement.should.have.been.calledWith('panel1', directive1.element);

        directive2.element.hide.should.have.been.called;
        templateEditorUtils.findElement.should.have.been.calledWith('panel2', directive2.element);

        templateEditorUtils.elementStub.removeClass.should.have.been.calledWith('attribute-editor-show-from-right');
        templateEditorUtils.elementStub.removeClass.should.have.been.calledWith('attribute-editor-show-from-left');

        templateEditorUtils.elementStub.addClass.should.have.been.calledWith('attribute-editor-show-from-left');

        setTimeout(function() {
          templateEditorUtils.elementStub.hide.should.have.been.called;
          templateEditorUtils.elementStub.show.should.have.been.called;

          done();
        }, 10);
      });

      it('should not hide the element if its the same', function() {
        directive2.element = directive1.element;

        componentsFactory.pages.push(component1);
        componentsFactory.pages.push(component2);

        componentsFactory.showPreviousPage();

        directive1.element.hide.should.not.have.been.called;
        directive1.element.show.should.have.been.called;
      });

    });

  });

});
