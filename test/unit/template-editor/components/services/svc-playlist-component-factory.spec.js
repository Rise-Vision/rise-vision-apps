'use strict';

describe('service: playlistComponentFactory:', function() {
  beforeEach(module('risevision.template-editor.services'));

  var sandbox = sinon.sandbox.create(),
    playlistComponentFactory,
    blueprintFactory,
    presentation,
    ScrollingListService;

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('templateEditorFactory', function() {
      return {
        presentation: { id: 'TEST-ID' }
      };
    });

    $provide.service('ScrollingListService', function() {
      return sandbox.stub().returns({
        service: 'stub'
      });
    });

    $provide.service('presentation', function() {
      return {
        list: sandbox.stub().resolves({
          items:[
            {id: 'presentation-id-1', name: 'some name', revisionStatusName: 'revised'},
            {id: 'presentation-id-2', name: 'some name 2', revisionStatusName: 'published'}
          ]
        })
      };
    });

    $provide.service('blueprintFactory', function() {
      return {
        isPlayUntilDone: sandbox.stub().resolves(true)
      };
    });
  }));

  beforeEach(function () {
    inject(function ($injector) {
      playlistComponentFactory = $injector.get('playlistComponentFactory');
      blueprintFactory = $injector.get('blueprintFactory');
      presentation = $injector.get('presentation');
      ScrollingListService = $injector.get('ScrollingListService');
    });
  });

  it('should initialize', function () {
    expect(playlistComponentFactory).to.be.ok;

    expect(playlistComponentFactory.search).to.deep.equal({
      sortBy: 'changeDate',
      reverse: true
    });

    expect(playlistComponentFactory.load).to.be.a('function');
    expect(playlistComponentFactory.loadPresentationNames).to.be.a('function');
    expect(playlistComponentFactory.addTemplates).to.be.a('function');
  });

  describe('load:', function() {
    it('should initialize search query', function() {
      playlistComponentFactory.search.query = 'old query';

      playlistComponentFactory.load();

      expect(playlistComponentFactory.search.query).to.equal('');
      expect(playlistComponentFactory.search.filter).to.equal(' presentationType:"HTML Template" AND NOT id:TEST-ID');
    });


    it('should initialize list service', function() {
      playlistComponentFactory.load();

      ScrollingListService.should.have.been.calledWith(presentation.list, playlistComponentFactory.search);

      expect(playlistComponentFactory.templates).to.deep.equal({
        service: 'stub'
      });
    });

    it('should reload list if service already exists', function() {
      playlistComponentFactory.templates = {
        doSearch: sandbox.stub()
      };

      playlistComponentFactory.load();

      ScrollingListService.should.not.have.been.called;
      playlistComponentFactory.templates.doSearch.should.have.been.called;
    });

  });

  describe('loadPresentationNames:', function() {
    it('should load presentations from api', function(done) {
      var presentations = [
        {
          id: 'presentation-id-1'
        },
        {
          id: 'presentation-id-2'
        }
      ];

      playlistComponentFactory.loadPresentationNames(presentations);

      expect(playlistComponentFactory.loading).to.be.true;

      presentation.list.should.have.been.calledWith({
        filter: 'id:presentation-id-1 OR id:presentation-id-2'
      });

      setTimeout(function() {
        expect(presentations[0].name).to.equal('some name');
        expect(presentations[0].revisionStatusName).to.equal('revised');
        expect(presentations[0].removed).to.be.false;

        expect(presentations[1].name).to.equal('some name 2');
        expect(presentations[1].revisionStatusName).to.equal('published');
        expect(presentations[1].removed).to.be.false;

        expect(playlistComponentFactory.loading).to.be.false;

        done();
      }, 10);

    });

    it('should indicate any templates that are now "Unknown" from being deleted', function(done) {
      var presentations = [
        {
          id: 'presentation-id-3'
        }
      ];

      playlistComponentFactory.loadPresentationNames(presentations);

      setTimeout(function() {
        expect(presentations[0].name).to.equal('Unknown');
        expect(presentations[0].revisionStatusName).to.equal('Presentation not found.');
        expect(presentations[0].removed).to.be.true;

        done();
      }, 10);
    });

  });

  describe('addTemplates:', function() {
    it('should assign default PUD value', function(done) {
      var selectedTemplates = [
        {productCode: 'product-1'},
        {productCode: 'product-2'}
      ];
      playlistComponentFactory.templates = {
        getSelected: sandbox.stub().returns(selectedTemplates)
      };

      playlistComponentFactory.addTemplates();

      expect(playlistComponentFactory.loading).to.be.true;

      blueprintFactory.isPlayUntilDone.should.have.been.calledTwice;
      blueprintFactory.isPlayUntilDone.should.have.been.calledWith('product-1');
      blueprintFactory.isPlayUntilDone.should.have.been.calledWith('product-2');

      setTimeout(function() {
        expect(selectedTemplates[0]['play-until-done']).to.equal(true);
        expect(selectedTemplates[1]['play-until-done']).to.equal(true);

        expect(playlistComponentFactory.loading).to.be.false;

        done();
      }, 10);
    });

    it('should call handler if available', function(done) {
      var selectedTemplates = [
        {productCode: 'product-1'}
      ];
      playlistComponentFactory.templates = {
        getSelected: sandbox.stub().returns(selectedTemplates)
      };
      playlistComponentFactory.onAddHandler = sandbox.stub();

      playlistComponentFactory.addTemplates();

      setTimeout(function() {
        playlistComponentFactory.onAddHandler.should.have.been.called;

        done();
      }, 10);
    });
  });

});
