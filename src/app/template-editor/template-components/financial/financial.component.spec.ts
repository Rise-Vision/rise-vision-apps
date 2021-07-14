import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialComponent } from './financial.component';

xdescribe('FinancialComponent', () => {
  let component: FinancialComponent;
  let fixture: ComponentFixture<FinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
