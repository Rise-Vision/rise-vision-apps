'use strict';
describe('service: displayControlFactory:', function() {
  var sandbox;

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('displayFactory', function() {
      return {
        display: { id: 'testId' }
      };
    });
    $provide.service('display', function() {
      return {
          uploadControlFile: function() {}
      };
    });
    $provide.service('$modal', function() {
      return {
        open: sinon.stub().returns({result: Q.resolve()})
      }
    });
    $provide.value('STORAGE_FILE_URL', 'https://storage.googleapis.com/')
  
  }));
  var displayControlFactory, $rootScope, $http, $modal, displayFactory, displayService;
  beforeEach(function(){
    sandbox = sinon.sandbox.create();

    inject(function($injector){
      displayControlFactory = $injector.get('displayControlFactory');
      $rootScope = $injector.get('$rootScope');
      $http = $injector.get('$http');
      displayFactory = $injector.get('displayFactory');
      displayService = $injector.get('display');
      $modal = $injector.get('$modal');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist',function(){
    expect(displayControlFactory).to.be.ok;

    expect(displayControlFactory.getConfiguration).to.be.a('function');
    expect(displayControlFactory.updateConfiguration).to.be.a('function');
    expect(displayControlFactory.getDefaultConfiguration).to.be.a('function');

    expect(displayControlFactory.openDisplayControlModal).to.be.a('function');
  });

  describe('getConfiguration: ', function() {
    it('should load remote configuration', function() {
      sandbox.stub($http, 'get').returns(Q.resolve({ data: 'contents' }));
      
      return displayControlFactory.getConfiguration()
      .then(function(data) {
        expect(data).to.equal('contents');
        expect($http.get.getCall(0).args[0]).to.have.string('testId/screen-control.txt');
      });
    });

    it('should fail to load remote configuration', function() {
      sandbox.stub($http, 'get').returns(Q.reject({ code: 'InvalidBucketName' }));
      
      return displayControlFactory.getConfiguration()
      .catch(function(err) {
        expect(err.code).to.equal('InvalidBucketName');
      });
    });
  });

  describe('updateConfiguration: ', function() {
    it('should update remote configuration', function() {
      sandbox.stub(displayService, 'uploadControlFile').returns(Q.resolve({}));
      
      return displayControlFactory.updateConfiguration('contents')
      .then(function() {
        expect(displayService.uploadControlFile.getCall(0).args[0]).to.equal('testId');
        expect(displayService.uploadControlFile.getCall(0).args[1]).to.equal('contents');
      });
    });

    it('should fail to load remote configuration', function() {
      sandbox.stub(displayService, 'uploadControlFile').returns(Q.reject({ code: 'Failed' }));
      
      return displayControlFactory.updateConfiguration()
      .catch(function(err) {
        expect(err.code).to.equal('Failed');
      });
    });
  });

  describe('updateConfigurationByObject: ', function() {
    it('should update remote configuration', function() {
      sandbox.stub(displayService, 'uploadControlFile').returns(Q.resolve({}));
      
      var display = {id: 'displayId'};

      return displayControlFactory.updateConfigurationByObject(display,'contents')
      .then(function() {
        expect(displayService.uploadControlFile.getCall(0).args[0]).to.equal('displayId');
        expect(displayService.uploadControlFile.getCall(0).args[1]).to.equal('contents');
      });
    });

    it('should fail to load remote configuration', function() {
      sandbox.stub(displayService, 'uploadControlFile').returns(Q.reject({ code: 'Failed' }));

      var display = {id: 'displayId'};
      
      return displayControlFactory.updateConfigurationByObject(display, 'contents')
      .catch(function(err) {
        expect(err.code).to.equal('Failed');
      });
    });
  });

  describe('getDefaultConfiguration: ', function() {
    it('should return default configuration', function() {
      expect(displayControlFactory.getDefaultConfiguration()).to.have.string('interface');
    });
  });

  it('openDisplayControlModal:', function() {
    displayControlFactory.openDisplayControlModal();

    $modal.open.should.have.been.calledWithMatch({
      templateUrl: 'partials/displays/display-control-modal.html',
      size: 'lg',
      controller: 'DisplayControlModalCtrl'
    });

  });

});
