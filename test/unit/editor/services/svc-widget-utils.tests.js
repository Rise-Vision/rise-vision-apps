'use strict';
describe('service: widgetUtils:', function() {
  beforeEach(module('risevision.editor.services'));

  var widgetUtils, WIDGETS_INFO;
  beforeEach(function(){  
    inject(function($injector){
      widgetUtils = $injector.get('widgetUtils');
      WIDGETS_INFO = $injector.get('WIDGETS_INFO');
    });
  });

  it('should exist',function(){
    expect(widgetUtils).to.be.ok;
    expect(widgetUtils.isRenderingAllowed).to.be.a('function');
    expect(widgetUtils.isWebpageWidget).to.be.a('function');
    expect(widgetUtils.getIconClass).to.be.a('function');
    expect(widgetUtils.getSvgIcon).to.be.a('function');
    expect(widgetUtils.getWidgetId).to.be.a('function');
  });
  
  it('isRenderingAllowed: ', function() {
    expect(widgetUtils.isRenderingAllowed(WIDGETS_INFO.WEB_PAGE.ids.PROD)).to.be.true;
    expect(widgetUtils.isRenderingAllowed(WIDGETS_INFO.VIDEO.ids.PROD)).to.be.false;
    expect(widgetUtils.isRenderingAllowed('1234')).to.be.false;
  });

  it('isWebpageWidget: ', function() {
    expect(widgetUtils.isWebpageWidget(WIDGETS_INFO.WEB_PAGE.ids.PROD)).to.be.true;
    expect(widgetUtils.isWebpageWidget(WIDGETS_INFO.VIDEO.ids.PROD)).to.be.false;    
    expect(widgetUtils.isWebpageWidget('1234')).to.be.false;    
  });
  
  it('getIconClass: ', function() {
    expect(widgetUtils.getIconClass(WIDGETS_INFO.VIDEO.ids.PROD)).to.equal('ph-item-icon ph-video-item');    
    expect(widgetUtils.getIconClass(WIDGETS_INFO.WEB_PAGE.ids.PROD)).to.equal('ph-item-icon');
    expect(widgetUtils.getIconClass('1234')).to.equal('ph-item-icon');
  });
  
  it('getSvgIcon: ', function() {
    expect(widgetUtils.getSvgIcon(WIDGETS_INFO.VIDEO.ids.PROD)).to.equal('riseWidgetVideo');    
    expect(widgetUtils.getSvgIcon(WIDGETS_INFO.WEB_PAGE.ids.PROD)).to.equal('riseWidgetMore');
    expect(widgetUtils.getSvgIcon('1234')).to.equal('riseWidgetMore');
  });

  it('getWidgetId: ', function() {
    expect(widgetUtils.getWidgetId('video')).to.equal(WIDGETS_INFO.VIDEO.ids.TEST);
    expect(widgetUtils.getWidgetId('web_page')).to.equal(WIDGETS_INFO.WEB_PAGE.ids.TEST);
    expect(widgetUtils.getWidgetId()).to.not.be.ok;    
    expect(widgetUtils.getWidgetId('1234')).to.not.be.ok;
  });
});
