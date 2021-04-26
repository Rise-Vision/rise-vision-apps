import { TestBed } from '@angular/core/testing';
import { AnalyticsFactory, CanvaTypePicker } from 'src/app/ajs-upgraded-providers';
import { CanvaApiService } from './canva-api.service';

describe('CanvaApiService', () => {
  let service: CanvaApiService;
  let mockCanvaTypePicker: any;
  let mockAnalyticsFactory: any;

  beforeEach(() => {
    mockCanvaTypePicker = jasmine.createSpy().and.resolveTo('Logo');
    mockAnalyticsFactory = jasmine.createSpyObj(['track']);

    TestBed.configureTestingModule({
      providers: [
        {provide: CanvaTypePicker, useValue: mockCanvaTypePicker},
        {provide: AnalyticsFactory, useValue: mockAnalyticsFactory}        
      ]
    });
    service = TestBed.inject(CanvaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCanvaApi:', () => {
    let el: HTMLElement;
    beforeEach(() => {
      el = jasmine.createSpyObj<HTMLElement>(['onload','onerror']);
      spyOn(document,'createElement').and.returnValue(el);
      spyOn(document.body,'appendChild');
    });

    it('should load canva script', (done) => {
      window.Canva = {
        DesignButton: {
          initialize: jasmine.createSpy()
        }
      };
      const promise = service.loadCanvaApi();

      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(document.body.appendChild).toHaveBeenCalledWith(el);
      
      promise.then((api)=>{
        expect(api).toEqual(window.Canva);
        delete window.Canva;
        done();
      });

      el.onload(undefined);
    });

    it('should load the api only once', () => {
      const promise1 = service.loadCanvaApi();
      const promise2 = service.loadCanvaApi();  
      
      expect(promise2).toEqual(promise1);      
    });

    it('should reject on failure loading script', (done) => {
      const promise = service.loadCanvaApi();

      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(document.body.appendChild).toHaveBeenCalledWith(el);
            
      promise.catch((err)=>{
        expect(err).toEqual('error')
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
          initialize: jasmine.createSpy()
        }
      };
      spyOn(service,'loadCanvaApi').and.resolveTo(mockCanvaApi);
    });
    
    it('should initialize button api',(done) => {
      service.initializeDesignButtonApi().then(() => {
        expect(mockCanvaApi.DesignButton.initialize).toHaveBeenCalledWith({
          apiKey: '_Ow6FgJpQ3S_k0Mgyo1UX2nM',
        });
        done();
      });
    });

    it('should initialize button only once',() => {
      const promise1 = service.initializeDesignButtonApi();
      const promise2 = service.initializeDesignButtonApi();  
      
      expect(promise2).toEqual(promise1);  
    });
  });

  describe('createDesign:', () => {
    let mockCanvaButtonApi: any;
    beforeEach(() => {
      mockCanvaButtonApi = jasmine.createSpyObj<CanvaButtonApi>(['createDesign']);
      spyOn(service,'initializeDesignButtonApi').and.resolveTo(mockCanvaButtonApi);
    });

    it('should use provided canva type and resolve on design published', (done) => {
      const promise = service.createDesign();

      setTimeout(() => {
        expect(mockCanvaButtonApi.createDesign).toHaveBeenCalled();
        expect(mockCanvaTypePicker).toHaveBeenCalled();
        expect(mockAnalyticsFactory.track).toHaveBeenCalledWith('Canva Design Started');

        const createDesignArgs = mockCanvaButtonApi.createDesign.calls.mostRecent().args[0];
        expect(createDesignArgs.design.type).toEqual('Logo');
        expect(createDesignArgs.editor.publishLabel).toEqual('Save');
        
        const publishResult :any = {designId:'id', designTitle: 'title', exportUrl: 'url'}; 
        promise.then(result => {
          expect(mockAnalyticsFactory.track).toHaveBeenCalledWith('Canva Design Published',{designId:'id', designTitle: 'title'});
          expect(result).toEqual(publishResult);
          done();
        });
        createDesignArgs.onDesignPublish(publishResult);
      });
    });

    it('should reject on design closed', (done) => {
      const promise = service.createDesign();
      setTimeout(() => {
        expect(mockCanvaButtonApi.createDesign).toHaveBeenCalled();
        expect(mockCanvaTypePicker).toHaveBeenCalled();
        expect(mockAnalyticsFactory.track).toHaveBeenCalledWith('Canva Design Started');

        promise.catch(err => {
          expect(mockAnalyticsFactory.track).toHaveBeenCalledTimes(1);
          expect(err).toEqual('closed');
          done();
        });
        mockCanvaButtonApi.createDesign.calls.mostRecent().args[0].onDesignClose();
      });
    });

    it('should reject on canva type picker closed', (done) => {
      (<jasmine.Spy> mockCanvaTypePicker).and.rejectWith('dismissed');

      const promise = service.createDesign();
      
      expect(mockCanvaTypePicker).toHaveBeenCalled();
      promise.catch(err => {
        expect(err).toEqual('dismissed');
        done();
      });
    });
  });
});
