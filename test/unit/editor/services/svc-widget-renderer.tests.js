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
    expect(widgetRenderer.notifyResize).to.be.a('function');
  });

  it('shuold register rpc on init',function(){
    rpcRegisterSpy.should.have.been.calledWith('rsevent_ready');
    rpcRegisterSpy.should.have.been.calledWith('rsparam_get');
  });


  describe('register:',function(){
    it('should register placeholder',function(){
      widgetRenderer.register(placeholder,element);
      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(1);
    });

    it('should create iframe and append to element',function(){
      var spy = sinon.spy(element,'append');
      widgetRenderer.register(placeholder,element);
      spy.should.have.been.called;

      var spyCall = element.append.getCall(0);
      expect(spyCall.args[0].nodeName).to.equal('IFRAME');
      expect(spyCall.args[0].getAttribute('src')).to.not.contain('http://');
    });

    it('should not register if it is not Text Widget',function(){
      placeholder.items[0].objectReference = 'otherId';
      var spy = sinon.spy(element,'append');

      widgetRenderer.register(placeholder,element);

      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(0);
      spy.should.not.have.been.called;
    });
  });

  describe('unregister:',function(){
    beforeEach(function(){
      widgetRenderer.register(placeholder,element);
    });

    it('should remove placeholder',function(){
      widgetRenderer.unregister(placeholder,element);
      expect(Object.keys(widgetRenderer._placeholders).length).to.equal(0);
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

  describe('notifyResize:',function(){
    it('should handle resize by refreshing the iframe',function(){
      widgetRenderer.register(placeholder,element);

      placeholder.width = 100;

      var registerSpy = sinon.spy(widgetRenderer,'register'); 
      var unregisterSpy = sinon.spy(widgetRenderer,'unregister'); 
      
      widgetRenderer.notifyResize(placeholder,element);

      registerSpy.should.have.been.calledWith(placeholder,element);
      unregisterSpy.should.have.been.calledWith(placeholder,element);
    });

    it('should not handle resize if placeholder is not registered',function(){
      var registerSpy = sinon.spy(widgetRenderer,'register'); 
      var unregisterSpy = sinon.spy(widgetRenderer,'unregister'); 
      
      widgetRenderer.notifyResize(placeholder,element);

      registerSpy.should.not.have.been.called;
      unregisterSpy.should.not.have.been.called;
    });
  });
  
});
