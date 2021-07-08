import { expect } from 'chai';
import { Component } from '@angular/core';
import { CommonHeaderHeightDirective } from './common-header-height.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';
import { By } from '@angular/platform-browser';


@Component({
  template: `
  <div id="commonHeaderDiv" style="height: 30px"></div>
  <h1 common-header-height></h1>`
})
class TestComponent { }
describe('CommonHeaderHeightDirective', () => {

  let fixture: ComponentFixture<TestComponent>;
  let element;
  let commonHeaderDiv;
  let broadcaster;

  beforeEach(() => {
    broadcaster = new BroadcasterService({
      $broadcast: sinon.stub()
    });
    sinon.spy(broadcaster,'subscribe');

    fixture = TestBed.configureTestingModule({
      providers: [
        {provide: BroadcasterService, useValue: broadcaster}
      ],
      declarations: [ CommonHeaderHeightDirective, TestComponent ]
    })
    .createComponent(TestComponent);
  
    fixture.detectChanges();
  
    element = fixture.nativeElement.querySelector('h1');
    commonHeaderDiv = fixture.nativeElement.querySelector('#commonHeaderDiv');
  });

  it('should initialize', (done) => {
    fixture.whenStable().then(()=>{
      console.log('e',element)
      expect(element.style.getPropertyValue('--common-header-height')).to.equal('30px');
      done();
    });
  });


  it('should populate html', function(done) {
    fixture.whenStable().then(()=>{
      expect(element.outerHTML).to.equal('<h1 common-header-height="" style="--common-header-height:30px;"></h1>');
      done()
    });
    
  });

  describe('event handlers', function() {
    it('should refresh value on company change', function(done) {
      commonHeaderDiv.style.setProperty('height', '100px');

      broadcaster.emit('risevision.company.selectedCompanyChanged');

      fixture.whenStable().then(()=>{
        expect(element.style.getPropertyValue('--common-header-height')).to.equal('100px');
        done();
      });
    });

    it('should refresh value on company update', function(done) {
      commonHeaderDiv.style.setProperty('height', '105px');

      broadcaster.emit('risevision.company.updated');

      fixture.whenStable().then(()=>{
        expect(element.style.getPropertyValue('--common-header-height')).to.equal('105px');
        done();
      });
    });

  });

  describe('ngOnDestroy', () => {
    it('should unregister from broadcaster', () => {
      const subscription = broadcaster.subscribe.returnValues[0];
      sinon.spy(subscription,'unsubscribe');

      const debugElement = fixture.debugElement.query(By.directive(CommonHeaderHeightDirective));
      const directive = debugElement.injector.get(CommonHeaderHeightDirective);
      directive.ngOnDestroy();

      subscription.unsubscribe.should.have.been.called;
    });
  });

});
