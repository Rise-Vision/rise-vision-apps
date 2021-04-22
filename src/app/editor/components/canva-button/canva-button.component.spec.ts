import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvaApiService } from '../../services/canva-api.service';

import { CanvaButtonComponent } from './canva-button.component';

describe('CanvaButtonComponent', () => {
  let component: CanvaButtonComponent;
  let fixture: ComponentFixture<CanvaButtonComponent>;
  let mockCanvaApi: any;

  beforeEach(async(() => {
    mockCanvaApi = {
      createDesign: jasmine.createSpy().and.resolveTo('canvaResult')
    };

    TestBed.configureTestingModule({
      declarations: [ CanvaButtonComponent ],
      providers: [
        {provide: CanvaApiService, useValue: mockCanvaApi}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Canva button', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.firstElementChild.tagName.toLowerCase()).toEqual('button');
    expect(element.textContent).toEqual('Design With Canva');
  });

  describe('designWithCanva:',()=> {
    it('should call canvaApi and emit result', (done) => {
      spyOn(component.designPublished,'emit');
      component.designWithCanva();

      fixture.whenStable().then(() => {
        expect(mockCanvaApi.createDesign).toHaveBeenCalled();
        expect(component.designPublished.emit).toHaveBeenCalledWith('canvaResult');
        
        done();
      });
      
    });
    
    it('should not emit result on canvaApi failure', (done)=>{
      spyOn(component.designPublished,'emit');
      mockCanvaApi.createDesign.and.rejectWith('closed');

      component.designWithCanva();
      
      fixture.whenStable().then(() => {
        expect(mockCanvaApi.createDesign).toHaveBeenCalled();
        expect(component.designPublished.emit).not.toHaveBeenCalledWith('canvaResult');
        done();
      });
    });
  });

  describe('disabled:', () => {
    it('should disable the button', () => {
      const element: HTMLElement = fixture.nativeElement;
      component.disabled = true;
      fixture.detectChanges();
      expect(element.firstElementChild['disabled']).toBeTrue();
    });

    it('should enable the button', () => {
      const element: HTMLElement = fixture.nativeElement;
      component.disabled = false;
      fixture.detectChanges();
      expect(element.firstElementChild['disabled']).toBeFalse();
    });
  });
});
