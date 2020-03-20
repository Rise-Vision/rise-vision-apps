'use strict';

describe('directive: TemplateEditorPreviewHolder', function() {
  var sandbox = sinon.sandbox.create(),
      $scope,
      $timeout,
      element,
      templateEditorFactory,
      blueprintFactory,
      brandingFactory,
      iframe,
      userState,
      rootScope;

  beforeEach(function() {
    blueprintFactory = {
        blueprintData: { width: "1000", height: "1000" },
        getLogoComponents: sandbox.stub().returns([{id:'logo'}])
      };
    iframe = {
      setAttribute: sandbox.stub(),
      contentWindow: {
        postMessage: sandbox.stub()
      }
    };
    userState = {
      getCopyOfSelectedCompany: sandbox.stub().returns({}),
      _restoreState: sandbox.stub()
    }
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return {
        presentation: {
          id: 'xxxxyyyy',
          templateAttributeData: {
            components: [
              {id:'image', metadata: 'originalMetadata1'},
              {id:'logo', metadata: 'originalMetadata2'}
            ]
          }
        }
      };
    });
    $provide.service('blueprintFactory', function() {
      return blueprintFactory;
    });
    $provide.service('brandingFactory', function() {
      return {
        brandingSettings: {
          baseColor: 'baseColor',
          accentColor: 'accentColor',
          logoFileMetadata: 'logoMetadata'
        }
      };
    });
    $provide.service('userState', function() {
      return userState;
    });
    $provide.service('templateEditorFactory', function() {
      return {
        trustAsResourceUrl: function(url) {
          return url;
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $window, _$timeout_,$injector){
    rootScope = $rootScope;
    $timeout = _$timeout_;
    $templateCache.put('partials/template-editor/preview-holder.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    brandingFactory = $injector.get('brandingFactory');
    templateEditorFactory = $injector.get('templateEditorFactory');

    sandbox.stub($window.document, 'getElementById').callsFake(function(id) {
      if (id === 'template-editor-preview') return iframe;
      return {
          clientHeight: 500,
          setAttribute: function() {}
        }
    });
    sandbox.stub($window, 'matchMedia').returns({ matches: false });

    element = $compile("<template-editor-preview-holder></template-editor-preview-holder>")($scope);
    $scope.$digest();
  }));

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.blueprintFactory).to.be.ok;
  });

  it('should define component directive registry functions', function() {
    expect($scope.getEditorPreviewUrl).to.be.a('function');
    expect($scope.getTemplateAspectRatio).to.be.a('function');
  });

  describe('_postDisplayData: ', function() {
    it('posts display address when company is updated', function(done) {
      iframe.onload();
      iframe.contentWindow.postMessage.reset();
      $scope.$broadcast('risevision.company.updated');
      $scope.$digest();
      $timeout.flush();

      setTimeout(function(){
        iframe.contentWindow.postMessage.should.have.been.called;
        expect(iframe.contentWindow.postMessage.getCall(0).args).to.deep.equal(['{"type":"displayData","value":{"displayAddress":{},"companyBranding":{"baseColor":"baseColor","accentColor":"accentColor"}}}', 'https://widgets.risevision.com']);

        done();
      },10);
    });

    it('posts display address when selected company is changed', function(done) {
      iframe.onload();
      iframe.contentWindow.postMessage.reset();
      $scope.$broadcast('risevision.company.selectedCompanyChanged');
      $scope.$digest();
      $timeout.flush();

      setTimeout(function(){
        iframe.contentWindow.postMessage.should.have.been.called;
        expect(iframe.contentWindow.postMessage.getCall(0).args).to.deep.equal(['{"type":"displayData","value":{"displayAddress":{},"companyBranding":{"baseColor":"baseColor","accentColor":"accentColor"}}}', 'https://widgets.risevision.com']);

        done();
      },10);
    });

    it('posts display data when branding colors have changed', function(done) {
      iframe.onload();
      iframe.contentWindow.postMessage.reset();
      brandingFactory.brandingSettings.baseColor = "newBaseColor";
      brandingFactory.brandingSettings.accentColor = "newAccentColor";
      $scope.$digest();
      $timeout.flush();

      setTimeout(function(){
        iframe.contentWindow.postMessage.should.have.been.called;
        expect(iframe.contentWindow.postMessage.getCall(0).args).to.deep.equal(['{"type":"displayData","value":{"displayAddress":{},"companyBranding":{"baseColor":"newBaseColor","accentColor":"newAccentColor"}}}', 'https://widgets.risevision.com']);

        done();
      },10);
    });
  });

  describe('_updateLogoData', function() {
    it('posts logo data when metadata has changed', function(done) {
      iframe.onload();
      iframe.contentWindow.postMessage.reset();
      $scope.brandingFactory.brandingSettings.logoFileMetadata = 'newMetadata';
      $scope.$digest();
      $timeout.flush();

      setTimeout(function(){
        iframe.contentWindow.postMessage.should.have.been.called;
        expect(iframe.contentWindow.postMessage.getCall(0).args).to.deep.equal(['{"type":"attributeData","value":{"components":[{"id":"image","metadata":"originalMetadata1"},{"id":"logo","metadata":"newMetadata"}]}}', 'https://widgets.risevision.com']);

        done();
      },10);
    });

    it('should not post metadata if component is not a logo', function(done) {
      iframe.onload();
      iframe.contentWindow.postMessage.reset();
      templateEditorFactory.presentation.templateAttributeData.components[1].isLogo = false;
      $scope.brandingFactory.brandingSettings.logoFileMetadata = 'newMetadata';
      $scope.$digest();
      $timeout.flush();

      setTimeout(function(){
        iframe.contentWindow.postMessage.should.have.been.called;
        expect(iframe.contentWindow.postMessage.getCall(0).args).to.deep.equal(['{"type":"attributeData","value":{"components":[{"id":"image","metadata":"originalMetadata1"},{"id":"logo","metadata":"originalMetadata2","isLogo":false}]}}', 'https://widgets.risevision.com']);

        done();
      },10);
    });
  });

  describe('getTemplateAspectRatio', function() {
    it('should calculate the 100 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1000", height: "1000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("100.0000");
    });

    it('should calculate the 200 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1000", height: "2000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("200.0000");
    });

    it('should calculate the 50 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "2000", height: "1000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("50.0000");
    });

    it('should calculate the 16:9 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1920", height: "1080" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("56.2500");
    });

    it('should calculate the 4:3 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "800", height: "600" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("75.0000");
    });

    it('should calculate a 333.33 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "300", height: "1000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("333.3333");
    });
  });

  describe('getMobileWidth', function() {
    it('should calculate mobile width for 16:9 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1920", height: "1080" };

      var width = $scope.getMobileWidth();

      expect(width).to.equal("356");
    });

    it('should calculate mobile width for 9:16 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1080", height: "1920" };

      var width = $scope.getMobileWidth();

      expect(width).to.equal("113");
    });
  });

  describe('getDesktopWidth', function() {
    it('should calculate desktop width for 16:9 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1920", height: "1080" };

      var width = $scope.getDesktopWidth();

      expect(width).to.equal("889");
    });

    it('should calculate desktop width for 9:16 aspect ratio', function() {
      blueprintFactory.blueprintData = { width: "1080", height: "1920" };

      var width = $scope.getDesktopWidth();

      expect(width).to.equal("281");
    });
  });

  describe('iframe',function() {
    it('should setup components on load',function(){

      iframe.onload();

      //send attributes data
      expect(iframe.contentWindow.postMessage.getCall(0).args).to.deep.equal([ '{"type":"attributeData","value":{"components":[{"id":"image","metadata":"originalMetadata1"},{"id":"logo","metadata":"logoMetadata"}]}}', 'https://widgets.risevision.com' ]);
      //send start event
      expect(iframe.contentWindow.postMessage.getCall(1).args).to.deep.equal([ '{"type":"sendStartEvent"}', 'https://widgets.risevision.com' ]);
      //send display data
      expect(iframe.contentWindow.postMessage.getCall(2).args).to.deep.equal([ '{"type":"displayData","value":{"displayAddress":{},"companyBranding":{"baseColor":"baseColor","accentColor":"accentColor"}}}', 'https://widgets.risevision.com' ]);
    });
  });

  describe('getEditorPreviewUrl', function() {
    it('should include presentation id in template URL', function() {
      var url = $scope.getEditorPreviewUrl('AAAA');

      expect(url).to.equal('https://widgets.risevision.com/staging/templates/AAAA/src/template.html?presentationId=xxxxyyyy');
    });
  });

});
