'use strict';

describe('service: outside click handler:', function() {
  beforeEach(module('risevision.apps.services'));

  var outsideClickHandler, $document, $timeout;
  beforeEach(function() {
    inject(function($injector) {
      outsideClickHandler = $injector.get('outsideClickHandler');
      $document = $injector.get('$document');
      $timeout = $injector.get('$timeout');

      sinon.spy($document,'bind');
      sinon.spy($document,'unbind');
    });
  });

  it('should exist', function() {
    expect(outsideClickHandler).to.be.ok;
    expect(outsideClickHandler.bind).to.be.a('function');
    expect(outsideClickHandler.unbind).to.be.a('function');
  });

  describe('bind', function() {
    it('should bind to click and touch start', function() {
      var callback = sinon.stub();
      var bindId = 'bindId';
      outsideClickHandler.bind(bindId, 'body', callback);

      $document.bind.should.have.been.calledWith('click.'+bindId+' touchstart.'+bindId, sinon.match.func);
    });

    it('should call callback when clicking outside', function() {
      var callback = sinon.stub();
      outsideClickHandler.bind('bindId', 'body', callback);

      //click outside
      $document.trigger('click');

      $timeout.flush();

      callback.should.have.been.called;
    });

    it('should not call callback when clicking inside', function() {
      var parentElement = angular.element('<div id="parent"><div id="child"></div></div>');
      parentElement.appendTo(document.body);

      var callback = sinon.stub();
      outsideClickHandler.bind('bindId', 'html', callback);

      //click inside element
      var event = new CustomEvent('click');
      var target = angular.element('#child');
      target.trigger('click');
      
      $timeout.flush();

      callback.should.not.have.been.called;
    });
  });

  describe('unbind', function() {
    it('should unbind from click and touch start', function() {
      var callback = sinon.stub();
      var bindId = 'bindId';
      outsideClickHandler.unbind(bindId);

      $document.unbind.should.have.been.calledWith('click.'+bindId+' touchstart.'+bindId);
    });
  });
});
