'use strict';

describe('service: honeBackdropFactory:', function() {
  beforeEach(module('risevision.apps.services'));

  var $window, $body, honeBackdropFactory, hone;
  var originalHone;

  beforeEach(function(){
    inject(function($injector){
      $window = $injector.get('$window');
      var $document = $injector.get('$document');

      $body = angular.element($document[0].body);

      honeBackdropFactory = $injector.get('honeBackdropFactory');

      hone = {
        setOptions: sinon.stub(),
        position: sinon.stub(),
        show: sinon.stub(),
        hide: sinon.stub(),
        status: 'HIDDEN'
      };

      originalHone = $window.Hone;
      $window.Hone = sinon.stub().returns(hone);
      $window.Hone.status = {
        VISIBLE: 'VISIBLE'
      };
    });
  });

  afterEach(function() {
    $window.Hone = originalHone;
  });

  it('should exist',function(){
    expect(honeBackdropFactory).to.be.ok;
    expect(honeBackdropFactory.createForElement).to.be.a('function');
    expect(honeBackdropFactory.hide).to.be.a('function');
    expect(honeBackdropFactory.shouldPreventScrolling).to.be.a('function');
    expect(honeBackdropFactory.reposition).to.be.a('function');
  });

  describe('createForElement:', function() {
    it('should initialize hone object', function() {
      honeBackdropFactory.createForElement(['element'], 'options');
      
      $window.Hone.should.have.been.calledWith({
        classPrefix: 'madero-style tooltip-backdrop',
        borderRadius: 4,
        padding: '10px'
      });

    });

    it('should show overlay', function() {
      honeBackdropFactory.createForElement(['element'], 'options');
      
      hone.setOptions.should.have.been.calledWith('options');
      hone.position.should.have.been.calledWith('element');
      hone.show.should.have.been.called;
    });

    describe('scrolling:', function() {
      beforeEach(function() {
        sinon.stub(honeBackdropFactory, 'shouldPreventScrolling');
      });

      afterEach(function() {
        honeBackdropFactory.shouldPreventScrolling.restore();
      });

      it('should prevent scrolling', function() {
        honeBackdropFactory.createForElement(['element'], {
          preventScrolling: true
        });
        
        honeBackdropFactory.shouldPreventScrolling.should.have.been.calledWith(true);
      });

      it('should allow scrolling by default', function() {
        honeBackdropFactory.createForElement(['element'], {});
        
        honeBackdropFactory.shouldPreventScrolling.should.have.been.calledWith(false);
      });    

      it('should allow scrolling', function() {
        honeBackdropFactory.createForElement(['element'], {
          preventScrolling: false
        });
        
        honeBackdropFactory.shouldPreventScrolling.should.have.been.calledWith(false);
      });    

    });

  });

  describe('hide:', function() {
    beforeEach(function() {
      sinon.stub(honeBackdropFactory, 'shouldPreventScrolling');
    });

    afterEach(function() {
      honeBackdropFactory.shouldPreventScrolling.restore();
    });

    it('should hide and remove scrolling', function() {
      honeBackdropFactory.hide()
      
      hone.hide.should.have.been.called;
      honeBackdropFactory.shouldPreventScrolling.should.have.been.calledWith(false);
    });    

  });

  describe('shouldPreventScrolling:', function() {
    var e;

    beforeEach(function() {
      e = new Event('touchmove');
      sinon.stub(e, 'preventDefault');      
    });

    afterEach(function() {
      honeBackdropFactory.shouldPreventScrolling(false);
    });

    it('should prevent scrolling', function() {
      honeBackdropFactory.shouldPreventScrolling(true);

      expect($body.hasClass('no-scrolling')).to.be.true;
      $body.trigger(e);

      e.preventDefault.should.have.been.called;
    });

    it('should remove class and handler if scroll is enabled', function() {
      // Add class and event
      honeBackdropFactory.shouldPreventScrolling(true);

      // Remove class and event
      honeBackdropFactory.shouldPreventScrolling(false);

      expect($body.hasClass('no-scrolling')).to.be.false;

      $body.trigger(e);

      e.preventDefault.should.not.have.been.called;
    });
    
  });

  describe('reposition:', function() {
    it('should reposition if showing', function() {
      hone.status = 'VISIBLE';

      honeBackdropFactory.reposition();

      hone.position.should.have.been.called;
    });

    it('should not reposition if hidden', function() {
      honeBackdropFactory.reposition();

      hone.position.should.not.have.been.called;
    });
  });

});
