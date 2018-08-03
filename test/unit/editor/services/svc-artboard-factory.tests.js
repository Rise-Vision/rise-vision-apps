'use strict';
describe('service: artboardFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('$state', function() {
      return {
        go: function(state) {
          currentState = state;
        },
        current: {
          name: 'apps.editor.workspace.htmleditor'
        }
      };
    });
    $provide.service('editorFactory', function() {
      return {
        presentation: {
          width: 1920,
          height: 1080
        },
        validatePresentation: function() {
          return validatePresentationResp;
        }
      };
    });
    $provide.service('placeholderFactory', function() {
      return placeholderFactory = {
        placeholder: {},
        clearPlaceholder: sinon.stub()
      }
    });

    $provide.value('PRESENTATION_BORDER_SIZE', 12);
    $provide.value('PRESENTATION_MARGIN_TOP', 60);
  }));
  var artboardFactory,
    placeholderFactory,
    currentState,
    validatePresentationResp;

  beforeEach(function(){
    inject(function($injector){
      artboardFactory = $injector.get('artboardFactory');
      validatePresentationResp = Q.resolve();
    });
  });

  it('should exist',function(){
    expect(artboardFactory).to.be.ok;    
    expect(artboardFactory.zoomLevel).to.be.ok;
    
    expect(artboardFactory.showArtboard).to.be.a('function');
    expect(artboardFactory.showHtmlEditor).to.be.a('function');
    
    expect(artboardFactory.compressArtboard).to.be.a('function');
    expect(artboardFactory.expandArtboard).to.be.a('function');
    expect(artboardFactory.isFullArtboard).to.be.a('function');
    expect(artboardFactory.hideSidebar).to.be.a('function');

    expect(artboardFactory.zoomIn).to.be.a('function');
    expect(artboardFactory.zoomOut).to.be.a('function');
    expect(artboardFactory.canZoomIn).to.be.a('function');
    expect(artboardFactory.canZoomOut).to.be.a('function');
    expect(artboardFactory.zoomFit).to.be.a('function');
    expect(artboardFactory.zoomPercent).to.be.a('function');
  });

  it('should set designMode to false if current state is htmleditor', function() {
    expect(artboardFactory.designMode).to.be.false;
  });

  describe('showArtboard:',function(){
    it('should show artboard',function(done){
      artboardFactory.showArtboard()
        .then(function() {
          expect(artboardFactory.designMode).to.be.true;
          done();
        });
    });

    it('should not show artboard because JSON is not valid',function(done){
      validatePresentationResp = Q.reject();

      artboardFactory.showArtboard()
        .catch(function() {
          expect(artboardFactory.designMode).to.be.false;
          done();
        });
    });
  });
  
  it('compressArtboard: ', function() {
    artboardFactory.fullArtboard = true;
    
    artboardFactory.compressArtboard();
    expect(artboardFactory.fullArtboard).to.be.false;
  });

  it('expandArtboard: ', function() {
    artboardFactory.fullArtboard = false;
    
    artboardFactory.expandArtboard();
    expect(artboardFactory.fullArtboard).to.be.true;
    placeholderFactory.clearPlaceholder.should.have.been.called;
  });

  it('isFullArtboard: ', function() {
    artboardFactory.fullArtboard = true;
    expect(artboardFactory.isFullArtboard()).to.be.false;

    artboardFactory.fullArtboard = false;
    expect(artboardFactory.isFullArtboard()).to.be.false;

    placeholderFactory.placeholder = undefined;
    artboardFactory.fullArtboard = true;
    expect(artboardFactory.isFullArtboard()).to.be.true;

    artboardFactory.fullArtboard = false;
    expect(artboardFactory.isFullArtboard()).to.be.false;
  });
  
  it('hideSidebar: ', function() {
    sinon.spy(artboardFactory, 'isFullArtboard');

    artboardFactory.designMode = false;
    expect(artboardFactory.hideSidebar()).to.be.true;
    artboardFactory.isFullArtboard.should.not.have.been.called;

    artboardFactory.designMode = true;
    artboardFactory.fullArtboard = false;
    expect(artboardFactory.hideSidebar()).to.be.false;
    artboardFactory.isFullArtboard.should.have.been.called;
  });
  

  describe('showHtmlEditor:',function(){
    it('should show html editor',function(){
      artboardFactory.designMode = true;
      artboardFactory.showHtmlEditor();
      expect(artboardFactory.designMode).to.be.false;
    });
  });

  describe('zoom ', function() {
    it('should default to 50%', function() {
      expect(artboardFactory.zoomLevel).to.equal(0.5);
    });

    it('canZoomIn: ', function() {
      artboardFactory.zoomLevel = 0.1;
      expect(artboardFactory.canZoomIn()).to.be.true;
      artboardFactory.zoomLevel = 1;
      expect(artboardFactory.canZoomIn()).to.be.true;
      artboardFactory.zoomLevel = 2;
      expect(artboardFactory.canZoomIn()).to.be.false;
    });
    
    it('canZoomOut: ', function() {
      artboardFactory.zoomLevel = 0.1;
      expect(artboardFactory.canZoomOut()).to.be.false;
      artboardFactory.zoomLevel = 1;
      expect(artboardFactory.canZoomOut()).to.be.true;
      artboardFactory.zoomLevel = 2;
      expect(artboardFactory.canZoomOut()).to.be.true;
    });

    describe('zoomIn: ', function() {
      it('should zoom in', function() {
        artboardFactory.zoomIn();
        expect(artboardFactory.zoomLevel).to.equal(0.6);
      });

      it('should limit zoom in', function() {
        artboardFactory.zoomLevel = 2;
        artboardFactory.zoomIn();
        expect(artboardFactory.zoomLevel).to.equal(2);
      });
      
      it('should round correctly', function() {
        artboardFactory.zoomLevel = 0.5;
        artboardFactory.zoomIn();
        expect(artboardFactory.zoomLevel).to.equal(0.6);

        artboardFactory.zoomLevel = 0.543;
        artboardFactory.zoomIn();
        expect(artboardFactory.zoomLevel).to.equal(0.6);
      });
    });

    describe('zoomOut: ', function() {
      it('should zoom out', function() {
        artboardFactory.zoomOut();
        expect(artboardFactory.zoomLevel).to.equal(0.4);
      });

      it('should limit zoom out', function() {
        artboardFactory.zoomLevel = 0.1;
        artboardFactory.zoomOut();
        expect(artboardFactory.zoomLevel).to.equal(0.1);
      });

      it('should round correctly', function() {
        artboardFactory.zoomLevel = 0.4;
        artboardFactory.zoomOut();
        expect(artboardFactory.zoomLevel).to.equal(0.3);
        
        artboardFactory.zoomLevel = 0.454;
        artboardFactory.zoomOut();
        expect(artboardFactory.zoomLevel).to.equal(0.4);
      });
    });

    describe('zoomFit: ', function() {
      it('should abort if there is no getWorkspaceElement', function() {
        artboardFactory.zoomFit();
        expect(artboardFactory.zoomLevel).to.equal(0.5);
      });

      it('should zoomFit based on width', function() {
        artboardFactory.getWorkspaceElement = function() {
          return {
            clientWidth: 1920,
            clientHeight: 1180
          };
        };
        
        artboardFactory.zoomFit();
        var ratio = 1920 / (1920 + 12 * 2);
        expect(artboardFactory.zoomLevel).to.equal(ratio);
      });
      
      it('should take sidebar into account on switch from html editor', function(done) {
        artboardFactory.getWorkspaceElement = function() {
          return {
            clientWidth: 1920,
            clientHeight: 1180
          };
        };
        artboardFactory.showHtmlEditor();
        artboardFactory.showArtboard();
        
        setTimeout(function() {
          artboardFactory.zoomFit();
          var ratio = (1920 - 290) / (1920 + 12 * 2);
          expect(artboardFactory.zoomLevel).to.equal(ratio);

          done();
        }, 10);
      });
      
      it('should ignore sidebar when hidden on switch from html editor', function(done) {
        artboardFactory.getWorkspaceElement = function() {
          return {
            clientWidth: 1920,
            clientHeight: 1180
          };
        };
        artboardFactory.expandArtboard();
        artboardFactory.showHtmlEditor();
        artboardFactory.showArtboard();
        
        setTimeout(function() {
          artboardFactory.zoomFit();
          var ratio = 1920 / (1920 + 12 * 2);
          expect(artboardFactory.zoomLevel).to.equal(ratio);

          done();
        }, 10);
      });
      
      it('should zoomFit based on height', function() {
        artboardFactory.getWorkspaceElement = function() {
          return {
            clientWidth: 2220,
            clientHeight: 1080
          };
        };
        
        artboardFactory.zoomFit();
        var ratio = (1080 - 0) / (1080 + 12 * 2);
        expect(artboardFactory.zoomLevel).to.equal(ratio);
      });
      
      it('should resepect min zoom level', function() {
        artboardFactory.getWorkspaceElement = function() {
          return {
            clientWidth: 220,
            clientHeight: 1080
          };
        };
        
        artboardFactory.zoomFit();
        expect(artboardFactory.zoomLevel).to.equal(0.2);
      });
      
      it('should respect max zoom level', function() {
        artboardFactory.getWorkspaceElement = function() {
          return {
            clientWidth: 22200,
            clientHeight: 10800
          };
        };
        
        artboardFactory.zoomFit();
        expect(artboardFactory.zoomLevel).to.equal(2);
      });
    });
    
    it('zoomPercent: ', function() {
      artboardFactory.zoomPercent(30);
      expect(artboardFactory.zoomLevel).to.equal(0.3);

      artboardFactory.zoomPercent(130);
      expect(artboardFactory.zoomLevel).to.equal(1.3);
    });
  });

});
