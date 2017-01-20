'use strict';

describe('directive: rv-sortable', function() {

  var $compile, $rootScope,
    mockedSortableObj;

  beforeEach(module('risevision.apps.directives'));
  beforeEach(function() {
    inject(function($injector, _$rootScope_, _$compile_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  beforeEach(function() {
    sinon.stub(Sortable, 'create', function() {
      return mockedSortableObj = {
        destroy: sinon.spy()
      }
    });
  });

  afterEach(function() {
    Sortable.create.restore();
  });

  it('should load and unload properly', function() {
    var $scope = $rootScope.$new();
    expect(Sortable.create).not.to.have.been.called;
    var element = $compile('<div rv-sortable></div>')($scope);
    expect(Sortable.create).to.have.been.called;
  });

  it('should unload properly', function() {
    var $scope = $rootScope.$new();
    var element = $compile('<div rv-sortable></div>')($scope);
    $rootScope.$digest();
    expect(mockedSortableObj.destroy).not.to.have.been.called;
    $scope.$destroy();
    expect(mockedSortableObj.destroy).to.have.been.called;
  });
});
