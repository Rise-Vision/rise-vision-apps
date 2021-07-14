import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateComponentComponent } from './template-component.component';

describe('TemplateComponentComponent', () => {
  let component: TemplateComponentComponent;
  let fixture: ComponentFixture<TemplateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
