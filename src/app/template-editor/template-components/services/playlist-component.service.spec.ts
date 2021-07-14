import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { PlaylistComponentService } from './playlist-component.service';
import { PresentationService, ScrollingListService } from 'src/app/ajs-upgraded-providers';
import { BlueprintService } from '../../services/blueprint.service';
import { TemplateEditorService } from '../../services/template-editor.service';

describe('PlaylistComponentService', () => {
  let playlistComponentFactory: PlaylistComponentService;
  let sandbox = sinon.sandbox.create(),
    templateEditorFactory,
    blueprintFactory,
    presentation,
    scrollingListService;


  beforeEach(() => {
    templateEditorFactory = {
      presentation: { id: 'TEST-ID' }
    };
    scrollingListService = sandbox.stub().returns({
      service: 'stub'
    });
    presentation = {
      list: sandbox.stub().resolves({
        items:[
          {id: 'presentation-id-1', name: 'some name', revisionStatusName: 'revised'},
          {id: 'presentation-id-2', name: 'some name 2', revisionStatusName: 'published'}
        ]
      })
    };
    blueprintFactory = {
      isPlayUntilDone: sandbox.stub().resolves(true)
    };

    TestBed.configureTestingModule({
      providers: [
        { useValue: scrollingListService, provide: ScrollingListService},
        { useValue: presentation, provide: PresentationService},
        { useValue: templateEditorFactory, provide: TemplateEditorService},
        { useValue: blueprintFactory, provide: BlueprintService}
      ]
    });
    playlistComponentFactory = TestBed.inject(PlaylistComponentService);
  });

  afterEach(() => {
    sandbox.restore();
  })

  it('should be created', () => {
    expect(playlistComponentFactory).to.exist;
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

      scrollingListService.should.have.been.calledWith(presentation.list, playlistComponentFactory.search);

      expect(playlistComponentFactory.templates).to.deep.equal({
        service: 'stub'
      });
    });

    it('should reload list if service already exists', function() {
      playlistComponentFactory.templates = {
        doSearch: sandbox.stub()
      };

      playlistComponentFactory.load();

      scrollingListService.should.not.have.been.called;
      playlistComponentFactory.templates.doSearch.should.have.been.called;
    });

  });

  describe('loadPresentationNames:', function() {
    it('should load presentations from api', function(done) {
      var presentations  :any= [
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
      var presentations :any= [
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

    it('should load presentation names once for repeated ids', function(done) {
      var presentations :any= [
        {
          id: 'presentation-id-1'
        },
        {
          id: 'presentation-id-2'
        },
        {
          id: 'presentation-id-2'
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
