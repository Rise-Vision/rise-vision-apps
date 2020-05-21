'use strict';
describe('service: screenshotFactory:', function() {
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.factory('display', function() {
      return {
        requestScreenshot: sinon.spy(function() {
          if (success) {
            return Q.resolve();            
          } else {
            return Q.reject();            
          }
        })
      };
    });
    $provide.factory('imageBlobLoader', function() {
      return function() {
        return imageBlobLoaderMock();
      };
    });
    $provide.factory('displayFactory', function() {
      return {
        showUnlockDisplayFeatureModal: sinon.stub().returns(false),
        display: {
          id: '123'
        }
      };
    });

  }));
  var screenshotFactory, display, displayFactory;
  var imageBlobLoaderMock, success;

  beforeEach(function(){
    inject(function($injector){
      success = true;

      display = $injector.get('display');
      displayFactory = $injector.get('displayFactory');
      screenshotFactory = $injector.get('screenshotFactory');
    });
  });

  it('should exist',function(){
    expect(screenshotFactory).to.be.ok;
    expect(screenshotFactory.requestScreenshot).to.be.a('function');
    expect(screenshotFactory.loadScreenshot).to.be.a('function');
  });

  describe('requestScreenshot', function() {
    beforeEach(function() {
      sinon.stub(screenshotFactory, 'loadScreenshot', function() {
        return Q.resolve();
      });
    });

    it('should not proceed if Display is not licensed',function(){
      displayFactory.showUnlockDisplayFeatureModal.returns(true);

      screenshotFactory.requestScreenshot();

      display.requestScreenshot.should.not.have.been.called;
      expect(screenshotFactory.screenshotLoading).to.not.be.ok;
    });

    it('should start loading', function() {
      screenshotFactory.requestScreenshot();

      expect(screenshotFactory.screenshotLoading).to.be.true;
    });

    it('should successfully request a screenshot', function(done) {
      screenshotFactory.requestScreenshot()
        .then(function() {
          display.requestScreenshot.should.have.been.calledOnce;
          display.requestScreenshot.should.have.been.calledWith('123');
          screenshotFactory.loadScreenshot.should.have.been.calledOnce;

          done();
        });
    });

    it('should handled failed screenshot requests', function(done) {
      success = false;

      screenshotFactory.requestScreenshot()
        .then(function() {
          display.requestScreenshot.should.have.been.calledOnce;
          display.requestScreenshot.should.have.been.calledWith('123');
          screenshotFactory.loadScreenshot.should.not.have.been.called;

          expect(screenshotFactory.screenshot).to.deep.equal({error: 'requesting'});
          expect(screenshotFactory.screenshotLoading).to.be.false;

          done();
        });
    });
  });

  describe('loadScreenshot', function() {
    it('should successfully load a screenshot', function(done) {
      imageBlobLoaderMock = function() {
        return Q.resolve({ imageUrl: 'url' });
      };

      screenshotFactory.loadScreenshot()
        .then(function() {
          expect(screenshotFactory.screenshot.imageUrl).to.be.ok;
          expect(screenshotFactory.screenshot.error).to.be.undefined;

          expect(screenshotFactory.screenshotLoading).to.be.false;

          done();
        });
    });

    it('should handle failed screenshot requests', function(done) {
      imageBlobLoaderMock = function() {
        return Q.reject({ err: 'timeout' });
      };

      screenshotFactory.loadScreenshot()
        .then(function() {
          expect(screenshotFactory.screenshot.imageUrl).to.not.be.ok;
          expect(screenshotFactory.screenshot.error).to.equal('loading');

          expect(screenshotFactory.screenshotLoading).to.be.false;

          done();
        });
    });
  });
});
