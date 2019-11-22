'use strict';
describe('service: widgetUtils:', function() {
  beforeEach(module('risevision.editor.services'));

  var widgetUtils, WIDGETS_INFO;
  var item;
  beforeEach(function(){
    item = {};
    inject(function($injector){
      widgetUtils = $injector.get('widgetUtils');
      WIDGETS_INFO = $injector.get('WIDGETS_INFO');
    });
  });

  it('should exist',function(){
    expect(widgetUtils).to.be.ok;
    expect(widgetUtils.isRenderingAllowed).to.be.a('function');
    expect(widgetUtils.isWebpageWidget).to.be.a('function');
    expect(widgetUtils.getInAppSettings).to.be.a('function');
    expect(widgetUtils.getIconClass).to.be.a('function');
    expect(widgetUtils.getSvgIcon).to.be.a('function');
    expect(widgetUtils.getWidgetId).to.be.a('function');
    expect(widgetUtils.getProfessionalWidgets).to.be.a('function');
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

  it('getInAppSettings: ', function() {
    expect(widgetUtils.getInAppSettings(WIDGETS_INFO.TWITTER.ids.TEST)).to.be.an('object');
    expect(widgetUtils.getInAppSettings(WIDGETS_INFO.TWITTER.ids.TEST)).to.have.property('partial');
    expect(widgetUtils.getInAppSettings(WIDGETS_INFO.TWITTER.ids.TEST)).to.have.property('type');

    expect(widgetUtils.getInAppSettings(WIDGETS_INFO.IMAGE.ids.PROD)).to.be.null;
    expect(widgetUtils.getInAppSettings('1234')).to.be.null;
  });
  
  it('getIconClass: ', function() {
    item.objectReference = WIDGETS_INFO.VIDEO.ids.PROD;
    expect(widgetUtils.getIconClass(item)).to.equal('ph-item-icon ph-video-item');    
    item.objectReference = WIDGETS_INFO.WEB_PAGE.ids.PROD;
    expect(widgetUtils.getIconClass(item)).to.equal('ph-item-icon');
    item.objectReference = '1234';
    expect(widgetUtils.getIconClass(item)).to.equal('ph-item-icon');
    expect(widgetUtils.getIconClass()).to.equal('ph-item-icon');
    item.type = 'presentation';
    expect(widgetUtils.getIconClass(item)).to.equal('ph-item-icon ph-embedded-item');
  });
  
  it('getSvgIcon: ', function() {
    item.objectReference = WIDGETS_INFO.VIDEO.ids.PROD;
    expect(widgetUtils.getSvgIcon(item)).to.equal('riseWidgetVideo');    
    item.objectReference = WIDGETS_INFO.WEB_PAGE.ids.PROD;
    expect(widgetUtils.getSvgIcon(item)).to.equal('riseWidgetMore');
    item.objectReference = '1234';
    expect(widgetUtils.getSvgIcon(item)).to.equal('riseWidgetMore');
    expect(widgetUtils.getSvgIcon()).to.equal('riseWidgetMore');
    item.type = 'presentation';
    expect(widgetUtils.getSvgIcon(item)).to.equal('iconPresentation');
  });

  it('getWidgetId: ', function() {
    expect(widgetUtils.getWidgetId('video')).to.equal(WIDGETS_INFO.VIDEO.ids.TEST);
    expect(widgetUtils.getWidgetId('web_page')).to.equal(WIDGETS_INFO.WEB_PAGE.ids.TEST);
    expect(widgetUtils.getWidgetId()).to.not.be.ok;    
    expect(widgetUtils.getWidgetId('1234')).to.not.be.ok;
  });

  it('getFileName: ',function () {
    expect(widgetUtils.getFileName('filename.txt')).to.equal('filename.txt');
    expect(widgetUtils.getFileName('folder/filename.txt')).to.equal('filename.txt');
    expect(widgetUtils.getFileName('/folder/filename.txt')).to.equal('filename.txt');
    expect(widgetUtils.getFileName('/folder')).to.equal('folder');
    expect(widgetUtils.getFileName('/')).to.equal('');
    expect(widgetUtils.getFileName()).to.equal('');
  });

  describe('getProfessionalWidgets: ', function() {
    it('should have expected properties', function() {
      var widgets = widgetUtils.getProfessionalWidgets();
      
      widgets.forEach(function(widget) {
        expect(widget.name).to.be.a('string');
        expect(widget.imageUrl).to.be.a('string');
        expect(widget.imageAlt).to.be.a('string');
        expect(widget.gadgetType).to.be.a('string');
        expect(widget.id).to.be.a('string');
      });      
    });

    it('should contain all Pro widgets', function() {
      var widgets = widgetUtils.getProfessionalWidgets();

      expect(widgets[0].name).to.contain('Twitter');
      expect(widgets[0].env).to.be.equal('TEST');

      expect(widgets[1].name).to.contain('Embedded');
      expect(widgets[1].env).to.be.undefined;
    });
  });

});
