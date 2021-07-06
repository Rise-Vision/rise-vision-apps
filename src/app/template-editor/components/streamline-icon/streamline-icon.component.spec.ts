import {expect} from 'chai';
import * as _ from 'lodash';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamlineIconComponent } from './streamline-icon.component';

describe('StreamlineIconComponent', () => {
  let component: StreamlineIconComponent;
  let fixture: ComponentFixture<StreamlineIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamlineIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.exist;
  });

  it('should have a valid icons list', function(done) {
    var iconsList = StreamlineIconComponent.ICONS_LIST;

    expect(iconsList).to.be.ok;
    expect(iconsList.checkmark).to.be.ok;
    expect(iconsList.sun).to.be.ok;
    expect(iconsList.forbidden).to.be.ok;
    expect(iconsList.close).to.be.ok;
    expect(iconsList.exclamation).to.be.ok;
    expect(iconsList.help).to.be.ok;
    expect(iconsList.video).to.be.ok;
    expect(iconsList.pencil).to.be.ok;
    expect(iconsList.trash).to.be.ok;
    expect(iconsList.text).to.be.ok;
    expect(iconsList.image).to.be.ok;
    expect(iconsList.financial).to.be.ok;
    expect(iconsList.slides).to.be.ok;
    expect(iconsList.magnifier).to.be.ok;
    expect(iconsList.rss).to.be.ok;
    expect(iconsList.ratingStar).to.be.ok;
    expect(iconsList.folder).to.be.ok;
    expect(iconsList.palette).to.be.ok;
    expect(iconsList.circleStar).to.be.ok;
    expect(iconsList.hourglass).to.be.ok;
    expect(iconsList.clock).to.be.ok;
    expect(iconsList.time).to.be.ok;
    expect(iconsList.twitter).to.be.ok;
    expect(iconsList['embedded-template']).to.be.ok;
    expect(iconsList.edit).to.be.ok;
    expect(iconsList.lock).to.be.ok;
    expect(iconsList.html).to.be.ok;
    expect(iconsList.playlist).to.be.ok;
    expect(iconsList.schedule).to.be.ok;
    expect(iconsList.copy).to.be.ok;
    expect(iconsList['navigation-menu-vertical']).to.be.ok;    

    _.map(iconsList, function (value) {
      expect(value.viewBox).to.be.a('string');
      expect(value.paths).to.be.an('array');
    });

    done();
  });

  describe('ngOnInit', () => {
    it('should render icon if name is present', () => {
      component.name = 'copy';
      component.ngOnInit();
      
      expect(component.viewBox).to.equal('0 0 52 60');
      expect(component.paths.changingThisBreaksApplicationSecurity).to.equal('<path d="M38.1818182,0 L5.45454545,0 C2.45454545,0 0,2.45454545 0,5.45454545 L0,43.6363636 L5.45454545,43.6363636 L5.45454545,5.45454545 L38.1818182,5.45454545 L38.1818182,0 Z M46.3636364,10.9090909 L16.3636364,10.9090909 C13.3636364,10.9090909 10.9090909,13.3636364 10.9090909,16.3636364 L10.9090909,54.5454545 C10.9090909,57.5454545 13.3636364,60 16.3636364,60 L46.3636364,60 C49.3636364,60 51.8181818,57.5454545 51.8181818,54.5454545 L51.8181818,16.3636364 C51.8181818,13.3636364 49.3636364,10.9090909 46.3636364,10.9090909 Z M46.3636364,54.5454545 L16.3636364,54.5454545 L16.3636364,16.3636364 L46.3636364,16.3636364 L46.3636364,54.5454545 Z" />');
    });

    it('should not render if name is missing', () => {
      component.ngOnInit();
      
      expect(component.viewBox).to.be.undefined;
    });
  });

  describe('ngOnChanges', () => {
    it('should render icon if name is present', () => {
      component.name = 'copy';
      component.ngOnChanges(null);
      
      expect(component.viewBox).to.equal('0 0 52 60');
      expect(component.paths.changingThisBreaksApplicationSecurity).to.equal('<path d="M38.1818182,0 L5.45454545,0 C2.45454545,0 0,2.45454545 0,5.45454545 L0,43.6363636 L5.45454545,43.6363636 L5.45454545,5.45454545 L38.1818182,5.45454545 L38.1818182,0 Z M46.3636364,10.9090909 L16.3636364,10.9090909 C13.3636364,10.9090909 10.9090909,13.3636364 10.9090909,16.3636364 L10.9090909,54.5454545 C10.9090909,57.5454545 13.3636364,60 16.3636364,60 L46.3636364,60 C49.3636364,60 51.8181818,57.5454545 51.8181818,54.5454545 L51.8181818,16.3636364 C51.8181818,13.3636364 49.3636364,10.9090909 46.3636364,10.9090909 Z M46.3636364,54.5454545 L16.3636364,54.5454545 L16.3636364,16.3636364 L46.3636364,16.3636364 L46.3636364,54.5454545 Z" />');
    });

    it('should not render if name is missing', () => {
      component.ngOnChanges(null);
      
      expect(component.viewBox).to.be.undefined;
      expect(component.paths).to.be.undefined;
    });
  });
});
