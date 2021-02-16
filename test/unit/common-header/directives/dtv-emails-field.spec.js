/*jshint expr:true */

'use strict';
describe('directive: emails field', function() {
  beforeEach(module('ngTagsInput'));
  beforeEach(module('risevision.common.header.directives'));

  var $scope, form, elem, elemScope, $timeout;

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector) {
    $timeout = $injector.get('$timeout');
    $templateCache.put('partials/common-header/emails-field.html', '<tags-input ng-model="emailsList" placeholder="{{placeholderText}}"></tags-input>');
    $scope = $rootScope.$new();
    var validHTML = 
      '<form name="form">' +
      '  <emails-field name="monitoringEmails" ng-model="display.monitoringEmails" require-emails-on-change="true" />' +
      '</form>';
    $scope.display = { 
    };
    elem = $compile(validHTML)($scope);
    elemScope = elem.children().isolateScope();
    form = $scope.form;

    $scope.$digest();
  }));

  function _findBySelector(selector) {
    var queryResult = elem[0].querySelector(selector);
    return angular.element(queryResult);
  }

  it('should initialize', function(done) {
    $scope.display.monitoringEmails = ['email1@test.com', 'email2@test.com'];
    $scope.$digest();
    $timeout.flush();

    setTimeout(function() {
      expect(elemScope.emailsList.length).to.equal(2);
      expect(elemScope.emailsList[0].text).to.equal('email1@test.com');

      expect(elemScope.placeholderText).to.equal('example1@email.com, example2@email.com');
      var spanField = _findBySelector('tags-input > div > div > span');
      expect(spanField.text()).to.equal(elemScope.placeholderText);

      done();
    });
  });

  describe('requireEmailsOnChange:', function(){
    it('should set error on empty emails list',function(){
      $scope.display.monitoringEmails = [];
      $scope.$digest();
      elemScope.updateModel();
      expect(form.monitoringEmails.$error['require-emails']).to.be.true;
    });

    it('should set error on undefined list',function(){
      $scope.display.monitoringEmails = undefined;
      $scope.$digest();
      elemScope.updateModel();
      expect(form.monitoringEmails.$error['require-emails']).to.be.true;
    });

    it('should not set error when at least one email is provided',function(){
      $scope.display.monitoringEmails = ['email1@test.com'];
      $scope.$digest();
      elemScope.updateModel();
      expect(form.monitoringEmails.$error['require-emails']).to.be.undefined;
    });
  });

  describe('keyUp:', function() {
    beforeEach(function() {
      $scope.display.monitoringEmails = [];
      $scope.$digest();
      elemScope.updateModel();
      $timeout.flush();
      expect(form.monitoringEmails.$error['require-emails']).to.be.true;

      $scope.display.monitoringEmails = ['email1@test.com'];
      $scope.$digest();
    });

    it('should validate on key up', function() {
      var inputField = _findBySelector('tags-input > div > div > input');

      inputField.keyup();

      $timeout.flush();
      expect(form.monitoringEmails.$error['require-emails']).to.be.undefined;
    });

    it('should not trigger validation on key up if span text is not placeholder', function() {
      var spanField = _findBySelector('tags-input > div > div > span');
      spanField.text('anotherText');

      var inputField = _findBySelector('tags-input > div > div > input');
      inputField.keyup();

      $timeout.flush();
      expect(form.monitoringEmails.$error['require-emails']).to.be.true;
    });
  });

  describe('isValidEmail:', function() {
    it('should return true if it is a valid email', function () {
      expect(elemScope.isValidEmail()).to.be.false;
      expect(elemScope.isValidEmail({})).to.be.false;
      expect(elemScope.isValidEmail({ text: '' })).to.be.false;
      expect(elemScope.isValidEmail({ text: 'aaaa' })).to.be.false;
      expect(elemScope.isValidEmail({ text: 'aaaa@' })).to.be.false;
      expect(elemScope.isValidEmail({ text: 'aaaa@a' })).to.be.false;
      expect(elemScope.isValidEmail({ text: 'aaaa@a.' })).to.be.false;
      expect(elemScope.isValidEmail({ text: 'aaaa@a.b.c' })).to.be.true;
      expect(elemScope.isValidEmail({ text: 'aaaa@a.com' })).to.be.true;
    });
  });
  
});
