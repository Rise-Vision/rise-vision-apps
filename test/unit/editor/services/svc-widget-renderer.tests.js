'use strict';
describe('service: widgetRenderer:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('gadgetsApi',function(){
      return {
        rpc: {
          call: function(){},
          setupReceiver: function(){},
          removeReceiver: function(){},
          register: function(){}          
        }
      };
    });
  }));
  var widgetRenderer, gadgetsApi, rpcRegisterSpy, placeholder,element;
  beforeEach(function(){  
    inject(function($injector){
      placeholder = {
        id: 'ph1',
        items: [
          {
            objectReference: 'ba0da120-7c67-437f-9caf-73585bd30c74',
            objectData: 'http://example.com/index.html'
          }
        ]
      };
      element = angular.element("<div/>").appendTo('body');
      gadgetsApi = $injector.get('gadgetsApi');
      rpcRegisterSpy = sinon.spy(gadgetsApi.rpc,'register');
      widgetRenderer = $injector.get('widgetRenderer');
    });
  });

  it('should exist',function(){
    expect(widgetRenderer).to.be.ok;
    expect(widgetRenderer.register).to.be.a('function');
    expect(widgetRenderer.unregister).to.be.a('function');
    expect(widgetRenderer.notifyChanges).to.be.a('function');
    expect(widgetRenderer.forceReload).to.be.a('function');
  });

  it('shuold register rpc on init',function(){
    rpcRegisterSpy.should.have.been.calledWith('rsevent_ready');
    rpcRegisterSpy.should.have.been.calledWith('rsparam_get');
  });


  describe('register:',function(){
    it('should register placeholder',function(){
      widgetRenderer.register(placeholder,element);
      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(1);
      expect(placeholder.className).to.equal('');
    });

    it('should create iframe and append to element',function(){
      var spy = sinon.spy(element,'append');
      widgetRenderer.register(placeholder,element);
      spy.should.have.been.called;

      var spyCall = element.append.getCall(0);
      expect(spyCall.args[0].nodeName).to.equal('IFRAME');
      expect(spyCall.args[0].getAttribute('src')).to.not.contain('http://');
      expect(spyCall.args[0].getAttribute('src')).to.contain('html?up_id=');
    });
    
    it('should not have two question marks (?) in queryString',function(){
      var spy = sinon.spy(element,'append');
      placeholder.items[0].objectData += '?param1=something';
      widgetRenderer.register(placeholder,element);
      spy.should.have.been.called;

      var spyCall = element.append.getCall(0);
      expect(spyCall.args[0].nodeName).to.equal('IFRAME');
      expect(spyCall.args[0].getAttribute('src')).to.contain('html?param1=something&up_id=');
    });

    it('should not register if it is not render enabled Widget',function(){
      placeholder.items[0].objectReference = 'otherId';
      var spy = sinon.spy(element,'append');

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(0);
      expect(placeholder.className).to.equal('ph-item-icon');
      spy.should.not.have.been.called;
    });

    it('should render Image Widget if image url is https',function(){
      placeholder.items[0].objectReference = '5233a598-35ce-41a4-805c-fd2147f144a3';
      placeholder.items[0].additionalParams = '{\"selector\":{\"url\":\"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\"}}';

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(1);
      expect(placeholder.className).to.equal('');
    });

    it('should render Image Widget if image url is not https',function(){
      placeholder.items[0].objectReference = '5233a598-35ce-41a4-805c-fd2147f144a3';
      placeholder.items[0].additionalParams = '{\"selector\":{\"url\":\"http://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\"}}';

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(1);
      expect(placeholder.className).to.equal(''); 
    });

    it('should render Image Widget with old params format',function(){
      placeholder.items[0].objectReference = '5233a598-35ce-41a4-805c-fd2147f144a3';
      placeholder.items[0].additionalParams = '{\"url\":\"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\"}';

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(1);
      expect(placeholder.className).to.equal('');
    });

    it('should render Web Page Widget if url is https',function(){
      placeholder.items[0].objectReference = 'df887785-3614-4f05-86c7-fce07b8745dc';
      placeholder.items[0].additionalParams = '{\"selector\":{\"url\":\"https://www.risevision.com\"}}';

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(1);
      expect(placeholder.className).to.equal('');
    });

    it('should not render Web Page Widget if url is not https',function(){
      placeholder.items[0].objectReference = 'aab933d7-ec65-499d-8c6f-e0081b8ea2ee';
      placeholder.items[0].additionalParams = '{\"selector\":{\"url\":\"http://www.risevision.com\"}}';

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(0);
      expect(placeholder.className).to.equal('ph-item-icon');
    });

    it('should not render Web Page Widget if additionalParams are not set',function(){
      placeholder.items[0].objectReference = 'aab933d7-ec65-499d-8c6f-e0081b8ea2ee';
      placeholder.items[0].additionalParams = null;

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(0);
      expect(placeholder.className).to.equal('ph-item-icon');
    });

    describe('icon:',function(){
      it('should show icon for widgets that are not rendered',function(){
        placeholder.items[0].objectReference = 'otherId';
        widgetRenderer.register(placeholder,element);
        expect(placeholder.className).to.equal('ph-item-icon');
      });

      it('should not show icon if placeholder is empty',function(){     
        delete placeholder.items;
        widgetRenderer.register(placeholder,element);
        expect(placeholder.className).to.equal('');
      });    

      it('shuold show custom icon for Video Widget',function(){
        placeholder.items[0].objectReference = '2d407395-d1ae-452c-bc27-78124a47132b';
        widgetRenderer.register(placeholder,element);
        expect(placeholder.className).to.equal('ph-item-icon ph-video-item');
      });
    });    
  });

  describe('unregister:',function(){
    beforeEach(function(){
      widgetRenderer.register(placeholder,element);
    });

    it('should remove placeholder',function(){
      widgetRenderer.unregister(placeholder,element);
      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(0);
      expect(placeholder.className).to.equal('ph-item-icon');
    });

    it('should remove iframe',function(){
      expect(element.find('iframe').length).to.equal(1);
      widgetRenderer.unregister(placeholder,element);
      expect(element.find('iframe').length).to.equal(0);
    });

    it('should remove from rpc',function(){
      var spy = sinon.spy(gadgetsApi.rpc,'removeReceiver');      
      widgetRenderer.unregister(placeholder,element);
      spy.should.have.been.called;
    });
  });

  describe('notifyChanges:',function(){
    it('should notify changes',function(){
      widgetRenderer.register(placeholder,element);

      var spy = sinon.spy(gadgetsApi.rpc,'call');
      widgetRenderer.notifyChanges(placeholder,element);
      spy.should.have.been.called;
    });

    it('should unregister placeholder if item[0] change to another Widget',function(){
      widgetRenderer.register(placeholder,element);

      placeholder.items[0].objectReference = 'otherId';
      var spy = sinon.spy(widgetRenderer,'unregister');
      widgetRenderer.notifyChanges(placeholder,element);

      spy.should.have.been.calledWith(placeholder,element);
    });

    it('should register placeholder if it is not registered',function(){
      var spy = sinon.spy(widgetRenderer,'register');      
      widgetRenderer.notifyChanges(placeholder,element);
      spy.should.have.been.calledWith(placeholder,element);
    });
  });

  describe('forceReload:',function(){
    it('should refreshing the iframe',function(){
      widgetRenderer.register(placeholder,element);

      placeholder.width = 100;

      var registerSpy = sinon.spy(widgetRenderer,'register'); 
      var unregisterSpy = sinon.spy(widgetRenderer,'unregister'); 
      
      widgetRenderer.forceReload(placeholder,element);

      registerSpy.should.have.been.calledWith(placeholder,element);
      unregisterSpy.should.have.been.calledWith(placeholder,element);
    });

    it('should not refresh if placeholder is not registered',function(){
      var registerSpy = sinon.spy(widgetRenderer,'register'); 
      var unregisterSpy = sinon.spy(widgetRenderer,'unregister'); 
      
      widgetRenderer.forceReload(placeholder,element);

      registerSpy.should.not.have.been.called;
      unregisterSpy.should.not.have.been.called;
    });
  });
  
});
