import {expect} from 'chai';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRevisedComponent } from './last-revised.component';
import { UsernamePipe } from '../../pipes/username.pipe';

describe('LastRevisedComponent', () => {
  let component: LastRevisedComponent;
  let fixture: ComponentFixture<LastRevisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastRevisedComponent, UsernamePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });

  it('should contain "N/A" by default', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).to.contain('N/A');
  });

  it('should update revision status', () => {
    component.revisionStatusName = 'Revised';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).to.contain('Revised');
  });

  it('should show change date', () => {
    component.changeDate = new Date(2021,1,1);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).to.contain('1-Feb-2021');
  });

  it('should show username', () => {
    component.changedBy = 'test@example.com';
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).to.contain('test');
    expect(element.textContent).to.not.contain('test@example.com');
  });

});
