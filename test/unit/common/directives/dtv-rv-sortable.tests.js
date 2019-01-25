'use strict';

describe('directive: rv-sortable', function() {

  var $compile, $rootScope,
    mockedSortableObj;

  window.Draggable = {
    Sortable: function () {
    }
  };

  beforeEach(module('risevision.apps.directives'));
  beforeEach(function() {
    inject(function($injector, _$rootScope_, _$compile_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  beforeEach(function() {
    sinon.stub(Draggable, 'Sortable', function() {
      return mockedSortableObj = {
        on: sinon.spy(),
        destroy: sinon.spy()
      }
    });
  });

  afterEach(function() {
    Draggable.Sortable.restore();
  });

  it('should load and unload properly', function() {
    var $scope = $rootScope.$new();
    expect(Draggable.Sortable).not.to.have.been.called;
    var element = $compile('<div rv-sortable></div>')($scope);
    expect(Draggable.Sortable).to.have.been.called;
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
