import {expect} from 'chai';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LastModifiedComponent } from './last-modified.component';
import { UsernamePipe } from '../username.pipe';

describe('LastModifiedComponent', () => {
  let component: LastModifiedComponent;
  let fixture: ComponentFixture<LastModifiedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LastModifiedComponent, UsernamePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastModifiedComponent);
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
