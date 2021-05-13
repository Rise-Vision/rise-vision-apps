import {expect} from 'chai';

import { TestBed } from '@angular/core/testing';
import { AnalyticsFactory, CanvaTypePicker } from 'src/app/ajs-upgraded-providers';
import { CanvaApiService } from './canva-api.service';

describe('CanvaApiService', () => {
  let service: CanvaApiService;
  let mockCanvaTypePicker: any;
  let mockAnalyticsFactory: any;

  let sandbox: any;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    mockCanvaTypePicker = sandbox.stub().resolves('Logo');
    mockAnalyticsFactory = {
      track: sandbox.spy()
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: CanvaTypePicker, useValue: mockCanvaTypePicker},
        {provide: AnalyticsFactory, useValue: mockAnalyticsFactory}        
      ]
    });
    service = TestBed.inject(CanvaApiService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be created', () => {
    expect(service).to.be.ok;
  });

  describe('loadCanvaApi:', () => {
    let el: any;
    beforeEach(() => {
      el = {};
      sandbox.stub(document,'createElement').returns(el);
      sandbox.stub(document.body,'appendChild');
    });

    it('should load canva script', (done) => {
      window.Canva = {
        DesignButton: {
          initialize: sandbox.spy()
        }
      };
      const promise = service.loadCanvaApi();

      document.createElement.should.have.been.calledWith('script');
      document.body.appendChild.should.have.been.calledWith(el);
      
      promise.then((api)=>{
        expect(api).to.equal(window.Canva);
        delete window.Canva;
        done();
      });

      el.onload(undefined);
    });

    it('should load the api only once', () => {
      const promise1 = service.loadCanvaApi();
      const promise2 = service.loadCanvaApi();  
      
      expect(promise2).to.equal(promise1);      
    });

    it('should reject on failure loading script', (done) => {
      const promise = service.loadCanvaApi();

      document.createElement.should.have.been.calledWith('script');
      document.body.appendChild.should.have.been.calledWith(el);
            
      promise.catch((err)=>{
        expect(err).to.equal('error')
        done();
      });

      el.onerror('error');
    });
  });

  describe('initializeDesignButtonApi:',()=>{
    let mockCanvaApi: any;
    beforeEach(() => {
      mockCanvaApi = {
        DesignButton : {
          initialize: sandbox.spy()
        }
      };
      sandbox.stub(service,'loadCanvaApi').resolves(mockCanvaApi);
    });
    
    it('should initialize button api',(done) => {
      service.initializeDesignButtonApi().then(() => {
        mockCanvaApi.DesignButton.initialize.should.have.been.calledWith({
          apiKey: 'EwLWFws4Qjpa-n_2ZJgBMQbz',
        });
        done();
      });
    });

    it('should initialize button only once',() => {
      const promise1 = service.initializeDesignButtonApi();
      const promise2 = service.initializeDesignButtonApi();  
      
      expect(promise2).to.equal(promise1);  
    });
  });

  describe('createDesign:', () => {
    let mockCanvaButtonApi: any;
    beforeEach(() => {
      mockCanvaButtonApi = {
        createDesign: sandbox.spy()
      };
      sandbox.stub(service,'initializeDesignButtonApi').resolves(mockCanvaButtonApi);
    });

    it('should use provided canva type and resolve on design published', (done) => {
      const promise = service.createDesign();

      setTimeout(() => {
        mockCanvaButtonApi.createDesign.should.have.been.called;;
        mockCanvaTypePicker.should.have.been.called;
        mockAnalyticsFactory.track.should.have.been.calledWith('Canva Design Started');

        const createDesignArgs = mockCanvaButtonApi.createDesign.getCall(0).args[0];
        expect(createDesignArgs.design.type).to.equal('Logo');
        expect(createDesignArgs.editor.publishLabel).to.equal('Save');
        
        const publishResult :any = {designId:'id', designTitle: 'title', exportUrl: 'url'}; 
        promise.then(result => {
          mockAnalyticsFactory.track.should.have.been.calledWith('Canva Design Published',{designId:'id', designTitle: 'title'});
          expect(result).to.equal(publishResult);
          done();
        });
        createDesignArgs.onDesignPublish(publishResult);
      });
    });

    it('should reject on design closed', (done) => {
      const promise = service.createDesign();
      setTimeout(() => {
        mockCanvaButtonApi.createDesign.should.have.been.called;;
        mockCanvaTypePicker.should.have.been.called;
        mockAnalyticsFactory.track.should.have.been.calledWith('Canva Design Started');

        promise.catch(err => {
          mockAnalyticsFactory.track.should.have.been.called.once;
          expect(err).to.equal('closed');
          done();
        });
        mockCanvaButtonApi.createDesign.getCall(0).args[0].onDesignClose();
      });
    });

    it('should reject on canva type picker closed', (done) => {
      mockCanvaTypePicker.rejects('dismissed');

      const promise = service.createDesign();
      
      mockCanvaTypePicker.should.have.been.called;
      promise.catch(err => {
        expect(err.name).to.equal('dismissed');
        done();
      });
    });
  });
});
