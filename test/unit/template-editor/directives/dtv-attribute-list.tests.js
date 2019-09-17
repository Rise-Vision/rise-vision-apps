'use strict';

describe('directive: attribute-list', function() {
  var element, $scope;
  var components = [
    {id: 'cp1', nonEditable: true},
    {id: 'cp2', nonEditable: false},
    {id: 'cp3'}
  ];

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranlate()));
    beforeEach(module(function ($provide) {
    $provide.service('blueprintFactory', function() {
      return {
        blueprintData: {
          components: components
        }
      };
    });

    $provide.service('brandingFactory', function() {
      return {
        getBrandingComponent: function() {
          return 'brandingComponent';
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/attribute-list.html', '<p>mock</p>');
    element = $compile('<template-attribute-list></template-attribute-list>')($rootScope.$new());
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.components).to.be.ok;
  });

  it('should not list non-editable components', function() {
    expect($scope.components.length).to.equal(2);
    expect($scope.components).to.not.contain(components[0]);
    expect($scope.components).to.contain(components[1]);
    expect($scope.components).to.contain(components[2]);
  });

  it('should retrieve branding component', function() {
    expect($scope.brandingComponent).to.equal('brandingComponent');
  });

});
