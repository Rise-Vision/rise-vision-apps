'use strict';

describe('Services: displaySummaryFactory', function() {
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('display', function () {
      return {
        summary: sandbox.stub().returns(Q.resolve({online: 1}))
      };
    });
    $provide.factory('processErrorCode', function() {
      return sandbox.stub().returns('processedError');
    });
  }));

  var sandbox, display, factory;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function($injector) {
      display =  $injector.get('display');
      factory = $injector.get('displaySummaryFactory');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect(factory).to.be.ok;

    expect(factory.loadSummary).to.be.a('function');
  });

  describe('loadSummary:', function() {
    it('should load display summary and populate variable', function (done) {
      factory.loadSummary().then(function() {
        display.summary.should.have.been.called;

        expect(factory.summary).to.deep.equal({online: 1});
        expect(factory.apiError).to.be.undefined;
        done();
      });
    });

    it('should handle failures', function (done) {
      display.summary.returns(Q.reject());

      factory.loadSummary().then(function() {
        display.summary.should.have.been.called;

        expect(factory.apiError).to.equal('processedError');
        expect(factory.summary).to.be.undefined;
        done();
      });
    });
  });
});
