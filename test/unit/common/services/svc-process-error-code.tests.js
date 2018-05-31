'use strict';
describe('service: process error code:', function() {
  var processErrorCode;

  beforeEach(module('risevision.apps.services'));
  beforeEach(module(function ($provide) {
    $provide.value('translateFilter', function(key){
      return key;
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      processErrorCode = $injector.get('processErrorCode');
    });
  });

  var itemName = 'Presentation';
  var action = 'Add';
  
  it('should process empty error objects', function() {
    expect(processErrorCode(itemName, action)).to.equal('An Error has Occurred');
    expect(processErrorCode(itemName, action, {})).to.equal('An Error has Occurred');
  });

  it('should process 400 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 400
    })).to.equal('apps-common.errors.actionFailed apps-common.errors.tryAgain');

    expect(processErrorCode(itemName, action, {
      status: 400,
      result: { error: { message: 'Field name is not editable.' } }
    })).to.equal('apps-common.errors.actionFailed Field name is not editable.');

    expect(processErrorCode(itemName, action, {
      status: 400,
      result: { error: { message: 'Field name is required.' } }
    })).to.equal('apps-common.errors.actionFailed Field name is required.');
  });

  it('should process 401 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 401
    })).to.equal('apps-common.errors.notAuthenticated');
  });

  it('should process 403 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 403
    })).to.equal('apps-common.errors.actionFailed apps-common.errors.generalAccess');

    expect(processErrorCode(itemName, action, {
      status: 403,
      result: { error: { message: 'User is not allowed access' } }
    })).to.equal('apps-common.errors.actionFailed apps-common.errors.parentCompanyAction');

    expect(processErrorCode(itemName, action, {
      status: 403,
      result: { error: { message: 'User does not have the necessary rights' } }
    })).to.equal('apps-common.errors.actionFailed apps-common.errors.permissionRequired');

    expect(processErrorCode(itemName, action, {
      status: 403,
      result: { error: { message: 'Premium Template requires Purchase' } }
    })).to.equal('apps-common.errors.actionFailed apps-common.errors.premiumTemplate');
  });

  it('should process 404 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 404
    })).to.equal('apps-common.errors.notFound');
  });

  it('should process 409 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 409,
      result: { error: { message: 'The Schedule is not valid.' } }
    })).to.equal('apps-common.errors.actionFailed The Schedule is not valid.');
  });

  it('should process 500 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 500
    })).to.equal('apps-common.errors.serverError apps-common.errors.tryAgain');
  });

  it('should process 503 error codes', function() {
    expect(processErrorCode(itemName, action, {
      status: 503
    })).to.equal('apps-common.errors.serverError apps-common.errors.tryAgain');
  });

});
