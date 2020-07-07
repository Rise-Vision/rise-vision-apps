'use strict';

describe('directive: attribute-list', function() {
  var element, compileDirective, $scope, userState;
  var components = [
    {id: 'cp1', nonEditable: true},
    {id: 'cp2', nonEditable: false},
    {id: 'cp3'}
  ];

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));
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

    $provide.service('scheduleSelectorFactory', function() {
      return {
        getSchedulesComponent: function() {
          return 'schedulesComponent';
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    userState = $injector.get('userState');

    $templateCache.put('partials/template-editor/attribute-list.html', '<p>mock</p>');
    compileDirective = function() {
      element = $compile('<template-attribute-list></template-attribute-list>')($rootScope.$new());
      $scope = element.scope();
      $scope.$digest();      
    };
    compileDirective();
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

  describe('schedulesComponent', function() {
    beforeEach(function() {
      sinon.stub(userState, 'hasRole').returns(true);
    });

    afterEach(function() {
      userState.hasRole.restore();
    });

    it('should retrieve schedules component', function() {
      compileDirective();

      userState.hasRole.should.have.been.calledWith('cp');

      expect($scope.schedulesComponent).to.equal('schedulesComponent');
    });

    it('should not retrieve schedules component if user does not have cp role', function() {
      userState.hasRole.returns(false);

      compileDirective();

      userState.hasRole.should.have.been.calledWith('cp');

      expect($scope.schedulesComponent).to.not.be.ok;
    });
  });

});
