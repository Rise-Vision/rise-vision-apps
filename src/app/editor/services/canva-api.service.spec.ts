import { TestBed } from '@angular/core/testing';

import { CanvaApiService } from './canva-api.service';

describe('CanvaApiService', () => {
  let service: CanvaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
          apiKey: 'EwLWFws4Qjpa-n_2ZJgBMQbz',
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

    it('should resolve on design published', (done) => {
      const promise = service.createDesign();

      setTimeout(() => {
        expect(mockCanvaButtonApi.createDesign).toHaveBeenCalled;
        promise.then(result => {
          expect(result).toEqual('result');
          done();
        });
        mockCanvaButtonApi.createDesign.calls.mostRecent().args[0].onDesignPublish('result');
      });
    });

    it('should reject on design closed', (done) => {
      const promise = service.createDesign();
      setTimeout(() => {
        expect(mockCanvaButtonApi.createDesign).toHaveBeenCalled;
        promise.catch(err => {
          expect(err).toEqual('closed');
          done();
        });
        mockCanvaButtonApi.createDesign.calls.mostRecent().args[0].onDesignClose();
      });
    });
  });
});
