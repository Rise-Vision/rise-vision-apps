import {expect} from 'chai';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CanvaApiService } from '../../services/canva-api.service';

import { CanvaButtonComponent } from './canva-button.component';

describe('CanvaButtonComponent', () => {
  let component: CanvaButtonComponent;
  let fixture: ComponentFixture<CanvaButtonComponent>;
  let mockCanvaApi: any;

  beforeEach(waitForAsync(() => {
    mockCanvaApi = {
      createDesign: sinon.stub().resolves('canvaResult')
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
    expect(component).to.be.ok;
  });

  it('should render Canva button', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.firstElementChild.tagName.toLowerCase()).to.equal('button');
    expect(element.textContent).to.equal('Design With Canva');
  });

  describe('designWithCanva:',()=> {
    it('should call canvaApi and emit result', (done) => {
      sinon.spy(component.designPublished,'emit');
      component.designWithCanva();

      fixture.whenStable().then(() => {
        mockCanvaApi.createDesign.should.have.been.called;
        component.designPublished.emit.should.have.been.calledWith('canvaResult');
        
        done();
      });
      
    });
    
    it('should not emit result on canvaApi failure', (done)=>{
      sinon.spy(component.designPublished,'emit');
      mockCanvaApi.createDesign.rejects('closed');

      component.designWithCanva();
      
      fixture.whenStable().then(() => {
        mockCanvaApi.createDesign.should.have.been.called;
        component.designPublished.emit.should.not.have.been.called;

        done();
      });
    });
  });

  describe('disabled:', () => {
    it('should disable the button', () => {
      const element: HTMLElement = fixture.nativeElement;
      component.disabled = true;
      fixture.detectChanges();
      expect(element.firstElementChild['disabled']).to.be.true;
    });

    it('should enable the button', () => {
      const element: HTMLElement = fixture.nativeElement;
      component.disabled = false;
      fixture.detectChanges();
      expect(element.firstElementChild['disabled']).to.be.false;
    });
  });
});
