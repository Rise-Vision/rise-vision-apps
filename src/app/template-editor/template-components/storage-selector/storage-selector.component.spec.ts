import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageSelectorComponent } from './storage-selector.component';

xdescribe('StorageSelectorComponent', () => {
  let component: StorageSelectorComponent;
  let fixture: ComponentFixture<StorageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
