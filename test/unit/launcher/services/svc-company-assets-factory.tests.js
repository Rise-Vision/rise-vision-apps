'use strict';

describe('service: company assets factory:', function() {
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('display', function() {
      return {
        list: 'displayList'
      };
    });

    $provide.service('schedule', function() {
      return {
        list: 'scheduleList'
      };
    });

    $provide.service('CachedRequest', function() {
      return sinon.stub().returns({
        execute: requestExecute = sinon.stub(),
        reset: requestReset = sinon.stub()
      });
    });

    $provide.service('productsFactory', function() {
      return {
        loadProducts: 'loadProducts'
      };
    }); 
    $provide.service('ScrollingListService', function() {
      return sinon.stub().returns({
        listService: 'listService'
      });
    });

  }));
  
  var companyAssetsFactory, CachedRequest, requestExecute, $rootScope, requestReset, ScrollingListService;
  beforeEach(function() {
    inject(function($injector) {
      companyAssetsFactory = $injector.get('companyAssetsFactory');
      CachedRequest = $injector.get('CachedRequest');
      ScrollingListService = $injector.get('ScrollingListService');
      $rootScope = $injector.get('$rootScope');
    });
  });

  it('should exist', function() {
    expect(companyAssetsFactory).to.be.ok;
    expect(companyAssetsFactory.hasSchedules).to.be.a('function');
    expect(companyAssetsFactory.getFirstDisplay).to.be.a('function');
    expect(companyAssetsFactory.hasDisplays).to.be.a('function');
  });

  it('should initialize CachedRequest services', function() {
    CachedRequest.should.have.been.calledTwice;
    CachedRequest.should.have.been.calledWith('scheduleList', {
      count: 1,
      reverse: true,
      sortBy: "changeDate"
    });

    CachedRequest.should.have.been.calledWith('displayList', {
      sortBy: 'changeDate',
      reverse: true,
      count: 20
    });
  });

  describe('hasSchedules:', function() {
    it('should resolve true if Company has schedules', function(done) {
      requestExecute.returns(Q.resolve({
        items: [1]
      }));

      companyAssetsFactory.hasSchedules()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response).to.be.true;

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should not make additional requests if Company has schedules', function(done) {
      requestExecute.returns(Q.resolve({
        items: [1]
      }));

      companyAssetsFactory.hasSchedules()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response).to.be.true;

          companyAssetsFactory.hasSchedules()
            .then(function(response){
              requestExecute.should.have.been.calledOnce;
              expect(response).to.be.true;
              done();
          });
        })
        .catch(function() {
          done('error');
        });
    });

    it('should resolve false if Company does not have schedules', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.hasSchedules()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response).to.be.false;

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should listen to "scheduleCreated" if Company does not have schedules and send "companyAssetsUpdated" event', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.hasSchedules().then(function(response) {
        requestExecute.should.have.been.calledOnce;
        expect(response).to.be.false;
        $rootScope.$emit('scheduleCreated');
        $rootScope.$digest();          
      });

      $rootScope.$on('companyAssetsUpdated',function() {
        done();
      });
    });

    it('should reject if request fails', function(done) {
      requestExecute.returns(Q.reject('error'));

      companyAssetsFactory.hasSchedules()
        .then(function() {
          done('failed');
        })
        .catch(function(error) {
          expect(error).to.equal('error');

          done();
        });
    });
  });

  describe('hasDisplays:', function() {
    it('should resolve if Company has displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: [
          {id:'display1'}
        ]
      }));

      companyAssetsFactory.hasDisplays()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response.hasDisplays).to.be.true;
          expect(response.hasActivatedDisplays).to.be.false;

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should force refresh list if flag is set to true', function() {
      requestExecute.returns(Q.resolve());

      companyAssetsFactory.hasDisplays(true);

      requestExecute.should.have.been.calledWith(true);
    });

    it('should indicate if Company has activated displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: [
          {id:'display1', onlineStatus: 'online'}
        ]
      }));

      companyAssetsFactory.hasDisplays()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response.hasDisplays).to.be.true;
          expect(response.hasActivatedDisplays).to.be.true;

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should not make additional requests if Company has activated displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: [
          {id:'display1', onlineStatus: 'online'}
        ]
      }));

      companyAssetsFactory.hasDisplays()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response.hasDisplays).to.be.true;
          expect(response.hasActivatedDisplays).to.be.true;
          companyAssetsFactory.hasDisplays()
            .then(function(response){
              requestExecute.should.have.been.calledOnce;
              expect(response.hasDisplays).to.be.true;
              expect(response.hasActivatedDisplays).to.be.true;
              done();
          });
        })
        .catch(function() {
          done('error');
        });
    });

    it('should resolve false if Company does not have displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.hasDisplays()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response.hasDisplays).to.be.false;
          expect(response.hasActivatedDisplays).to.be.false;
          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should listen to "displayCreated" if Company does not have displays and send "companyAssetsUpdated" event', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.hasDisplays().then(function(response) {
        requestExecute.should.have.been.calledOnce;
        expect(response.hasDisplays).to.be.false;
        expect(response.hasActivatedDisplays).to.be.false;
        $rootScope.$emit('displayCreated');
        $rootScope.$digest();          
      });

      $rootScope.$on('companyAssetsUpdated',function() {
        done();
      });
    });

    it('should reject if request fails', function(done) {
      requestExecute.returns(Q.reject('error'));

      companyAssetsFactory.hasDisplays()
        .then(function() {
          done('failed');
        })
        .catch(function(error) {
          expect(error).to.equal('error');

          done();
        });
    });
  });

  describe('getFirstDisplay:',function() {
    it('should resolve a display if Company has displays', function(done) {
      var display = {id:'display1'};
      requestExecute.returns(Q.resolve({
        items: [ display ]
      }));

      companyAssetsFactory.getFirstDisplay()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response).to.equal(display);
          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should resolve undefined if Company does not have displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.getFirstDisplay()
        .then(function(response) {
          requestExecute.should.have.been.calledOnce;
          expect(response).to.be.undefined;
          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should reject if request fails', function(done) {
      requestExecute.returns(Q.reject('error'));

      companyAssetsFactory.getFirstDisplay()
        .then(function() {
          done('failed');
        })
        .catch(function(error) {
          expect(error).to.equal('error');

          done();
        });
    });
  });

  describe('selectedCompanyChanged:', function() {
    it('should reset cache on company changed', function() {
      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      requestReset.should.have.been.calledTwice;
    });
  });

  it('weeklyTemplates:', function() {
    ScrollingListService.should.have.been.calledWith('loadProducts', {
      filter: 'templateOfTheWeek:1',
      category: 'Templates',
      count: 4
    });

    expect(companyAssetsFactory.weeklyTemplates).to.deep.equal({
      listService: 'listService'
    });
  });

});
