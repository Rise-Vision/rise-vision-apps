'use strict';

describe('directive: componentPresentationSelector', function() {
  var sandbox = sinon.sandbox.create(),
      $scope,
      $loading,
      element,
      componentsFactory,
      playlistComponentFactory,
      editorFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        registerDirective: sandbox.stub(),
        showPreviousPage: sandbox.stub()
      };
    });

    $provide.service('playlistComponentFactory', function() {
      return {
        load: sandbox.stub(),
        addTemplates: sandbox.stub(),
        templates: {}
      };
    });

    $provide.service('$loading', function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service('editorFactory', function() {
      return {
        addPresentationModal: sandbox.stub()
      };
    });

  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache){
    $loading = $injector.get('$loading');
    componentsFactory = $injector.get('componentsFactory');
    playlistComponentFactory = $injector.get('playlistComponentFactory');
    editorFactory = $injector.get('editorFactory');

    $templateCache.put('partials/template-editor/components/component-presentation-selector.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile('<component-presentation-selector></component-presentation-selectort>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;

    expect($scope.playlistComponentFactory).to.equal(playlistComponentFactory);

    expect($scope.filterConfig).to.deep.equal({
      placeholder: 'Search Presentations',
      id: 'te-playlist-search'
    });
    
    expect($scope.addTemplates).to.be.a('function');
    expect($scope.createNewTemplate).to.be.a('function');
  });

  it('should generate the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('registerDirective:', function() {
    it('should initialize', function() {
      componentsFactory.registerDirective.should.have.been.called;

      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      expect(directive).to.be.ok;
      expect(directive.type).to.equal('rise-presentation-selector');
      expect(directive.show).to.be.a('function');
    });

    it('show:', function() {
      componentsFactory.registerDirective.getCall(0).args[0].show();

      playlistComponentFactory.load.should.have.been.called;
    });
  });

  it('addTemplates:', function() {
    $scope.addTemplates();

    playlistComponentFactory.addTemplates.should.have.been.called;
    componentsFactory.showPreviousPage.should.have.been.called;
  });

  it('createNewTemplate:', function() {
    $scope.createNewTemplate();

    editorFactory.addPresentationModal.should.have.been.called;
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('presentation-selector-loader');
    });

    it('should start spinner', function(done) {
      playlistComponentFactory.templates.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('presentation-selector-loader');

        done();
      }, 10);
    });
  });

});
