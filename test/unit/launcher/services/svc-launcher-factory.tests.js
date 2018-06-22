'use strict';
describe('service: launcher factory:', function() {
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('canAccessApps', function() {
      return function() {
        canAccessDeferred = Q.defer();

        return canAccessDeferred.promise;
      };
    });
    $provide.service('presentation', function() {
      return presentation = {
        list: sinon.spy(function() {
          if (showError) {
            return Q.reject({result: {error: { message: 'ERROR; could not load list'}}});
          } else {
            return Q.resolve({
              items: [{id: '123'}]
            });            
          }
        })
      };
    });
    $provide.service('schedule', function() {
      return schedule = {
        list: sinon.spy(function() {
          return Q.resolve({
            items: [{id: '123'}]
          });
        })
      };
    });
    $provide.service('display', function() {
      return display = {
        list: sinon.spy(function() {
          return Q.resolve({
            items: [{id: '123'}]
          });
        })
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });

  }));
  
  var launcherFactory, canAccessDeferred, presentation, schedule, display, processErrorCode, showError;
  beforeEach(function() {
    showError = false;

    inject(function($injector) {
      launcherFactory = $injector.get('launcherFactory');
    });
  });

  it('should exist', function() {
    expect(launcherFactory).to.be.ok;
    expect(launcherFactory.load).to.be.a('function');
  });
  
  it('should set defaults', function() {
    expect(launcherFactory.presentations).to.be.a('object');
    expect(launcherFactory.presentations.loadingItems).to.be.true;
    expect(launcherFactory.presentations.list).to.be.a('array');

    expect(launcherFactory.schedules).to.be.a('object');
    expect(launcherFactory.schedules.loadingItems).to.be.true;
    expect(launcherFactory.schedules.list).to.be.a('array');

    expect(launcherFactory.displays).to.be.a('object');
    expect(launcherFactory.displays.loadingItems).to.be.true;
    expect(launcherFactory.displays.list).to.be.a('array');
  });
  
  it('should reset defaults on load calls', function() {
    launcherFactory.presentations = 123;
    launcherFactory.schedules = 123;
    launcherFactory.displays = 123;

    launcherFactory.load();

    expect(launcherFactory.presentations).to.be.a('object');
    expect(launcherFactory.presentations.loadingItems).to.be.true;
    expect(launcherFactory.presentations.list).to.be.a('array');

    expect(launcherFactory.schedules).to.be.a('object');
    expect(launcherFactory.schedules.loadingItems).to.be.true;
    expect(launcherFactory.schedules.list).to.be.a('array');

    expect(launcherFactory.displays).to.be.a('object');
    expect(launcherFactory.displays.loadingItems).to.be.true;
    expect(launcherFactory.displays.list).to.be.a('array');
  });
  
  it('should return a promise', function() {
    expect(launcherFactory.load().then).to.be.a('function');
  });

  it('should wait for user to be authenticated', function(done) {
    launcherFactory.load().then(function() {
      done();
    });
    
    canAccessDeferred.resolve();
  });

  it('should only call APIs once on concurrent calls', function(done) {
    launcherFactory.load();
    launcherFactory.load().then(function() {
      presentation.list.should.have.been.calledOnce;
      schedule.list.should.have.been.calledOnce;
      display.list.should.have.been.calledOnce;
      
      done();
    });
    
    canAccessDeferred.resolve();
  });

  it('should call APIs again on subsequent calls', function(done) {
    launcherFactory.load();
    launcherFactory.load().then(function() {
      presentation.list.should.have.been.calledOnce;
      schedule.list.should.have.been.calledOnce;
      display.list.should.have.been.calledOnce;
      
      launcherFactory.load().then(function() {
        presentation.list.should.have.been.calledTwice;
        schedule.list.should.have.been.calledTwice;
        display.list.should.have.been.calledTwice;

        done();
      });

      canAccessDeferred.resolve();

    });
    
    canAccessDeferred.resolve();
  });
  
  it('should user correct search parameter', function(done) {
    var search = {
      sortBy: 'name',
      count: 20,
      reverse: false,
    };

    launcherFactory.load().then(function() {
      presentation.list.should.have.been.calledWith(search);
      schedule.list.should.have.been.calledWith(search);
      display.list.should.have.been.calledWith(search);
      
      done();
    });

    canAccessDeferred.resolve();
  });

  it('should resolve each call individually, and only return when all calls are completed', function(done) {
    var presentationListDeferred;

    launcherFactory.load().then(function() {
      expect(launcherFactory.presentations).to.deep.equal({loadingItems: false, list: [{id: '234'}]});
      
      done();
    });

    presentation.list = sinon.spy(function() {
      presentationListDeferred = Q.defer();

      return presentationListDeferred.promise;
    });

    canAccessDeferred.resolve();
    
    setTimeout(function() {
      expect(launcherFactory.presentations).to.deep.equal({loadingItems: true, list: []});
      expect(launcherFactory.schedules).to.deep.equal({loadingItems: false, list: [{id: '123'}]});
      expect(launcherFactory.displays).to.deep.equal({loadingItems: false, list: [{id: '123'}]});
      
      presentationListDeferred.resolve({items: [{id: '234'}]});
    }, 10);
  });

  it('should log errors and return when all calls are completed', function(done) {
    showError = true;

    launcherFactory.load().then(function() {
      expect(launcherFactory.presentations).to.deep.equal({loadingItems: false, list: [], errorMessage: 'Failed to load Presentations.', apiError: 'error'});
      expect(launcherFactory.schedules).to.deep.equal({loadingItems: false, list: [{id: '123'}]});
      expect(launcherFactory.displays).to.deep.equal({loadingItems: false, list: [{id: '123'}]});
      
      done();
    });

    canAccessDeferred.resolve();
  });

});
