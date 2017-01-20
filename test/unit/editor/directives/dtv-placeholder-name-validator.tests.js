'use strict';
describe('directive: placeholder name validator', function() {
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('placeholdersFactory', function (){
      return {
        getPlaceholders: function() {
          return [{id: 'ph1'}, {id:'ph1', newId:'ph2'}];
        }
      };
    });
    $provide.service('placeholderFactory', function (){
      return {
        placeholder: {
          id: 'ph0'
        }
      };
    });

  }));

  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="placeholder.newId" name="name" placeholder-name-validator />' +
      '</form>'
    );
    $scope.placeholder = { 
      newId: 'ph1' 
    };
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it('should not pass with invalid characters', function() {
    form.name.$setViewValue('ph1#$');
    $scope.$digest();
    expect($scope.placeholder.newId).to.not.be.ok;
    expect(form.name.$valid).to.be.false;
  });

  it('should not pass with duplicate name', function() {
    form.name.$setViewValue('ph1');
    $scope.$digest();
    expect($scope.placeholder.newId).to.not.be.ok;
    expect(form.name.$valid).to.be.false;
  });

  it('should not pass with duplicate new name', function() {
    form.name.$setViewValue('ph2');
    $scope.$digest();
    expect($scope.placeholder.newId).to.not.be.ok;
    expect(form.name.$valid).to.be.false;
  });

  it('should pass with valid name', function() {
    form.name.$setViewValue('ph3');
    $scope.$digest();
    expect($scope.placeholder.newId).to.equal('ph3');
    expect(form.name.$valid).to.be.true;
  });
  
});
