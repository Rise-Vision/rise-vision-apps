import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LastRevisedComponent } from './last-revised.component.js'

describe('LastRevisedComponent', () => {
    let component: LastRevisedComponent;
    let fixture: ComponentFixture<LastRevisedComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ LastRevisedComponent ]
      })
      .compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(LastRevisedComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  