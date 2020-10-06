'use strict';

/*jshint expr:true */

describe('directive: response header validator', function() {
  var sandbox = sinon.sandbox.create();
  beforeEach(module('risevision.widget.common.url-field.response-header-validator'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });
    $provide.service('responseHeaderAnalyzer', function() {
      return {
        validate: sandbox.stub().returns(Q.resolve())
      };
    });
  }));

  afterEach(function() {
    sandbox.restore();
  });

  var $scope, form, responseHeaderAnalyzer;

  beforeEach(inject(function($compile, $rootScope, $injector) {
    responseHeaderAnalyzer = $injector.get('responseHeaderAnalyzer');
    $scope = $rootScope.$new();
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="url" name="url" response-header-validator />' +
      '</form>'
    );
    $scope.url = '';
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it('should pass with blank value', function(done) {
    form.url.$setViewValue('');
    $scope.$digest();
    setTimeout(function(){
      expect($scope.url).to.not.be.ok;
      expect(form.url.$valid).to.be.true;
      done();
    },10);
  });

  it('should pass if responseHeaderAnalyzer resolves', function(done) {
    form.url.$setViewValue('www.url.com');
    $scope.$digest();
    setTimeout(function(){
      responseHeaderAnalyzer.validate.should.have.been.called;
      expect(form.url.$valid).to.be.true;
      done();
    },10);
  });

  it('should fail if responseHeaderAnalyzer rejects', function(done) {
    responseHeaderAnalyzer.validate.returns(Q.reject('failureReason'));
    form.url.$setViewValue('www.url.com');
    $scope.$digest();
    setTimeout(function(){
      responseHeaderAnalyzer.validate.should.have.been.called;
      expect(form.url.$valid).to.be.false;
      expect(form.url.responseHeaderValidatorError).to.equal('failureReason');
      done();
    },10);
  });

  it('should pass and not make a request if form has errors', function(done) {
    form.url.$error = {'failed':true};
    $scope.$digest();
    setTimeout(function(){
      responseHeaderAnalyzer.validate.should.not.have.been.called;
      expect(form.url.$valid).to.be.false;
      done();
    },10);
  });
  
  it('should proceed with validation if form has errors but it is a previous response-header-validator error and clear previous error', function(done) {
    form.url.responseHeaderValidatorError = 'failureReason';
    form.url.$error = {'responseHeaderValidator':true};
    form.url.$setViewValue('www.url.com');
    $scope.$digest();
    setTimeout(function(){
      responseHeaderAnalyzer.validate.should.have.been.called;
      expect(form.url.$valid).to.be.true;
      expect(form.url.responseHeaderValidatorError).to.be.undefined;
      done();
    },10);
  });
  
});
