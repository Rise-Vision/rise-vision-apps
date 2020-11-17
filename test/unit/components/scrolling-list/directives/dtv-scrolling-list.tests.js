'use strict';
describe('directive: scrolling-list', function() {
  var $scope,
    element,
    loadList,
    sandbox = sinon.sandbox.create();

    beforeEach(module('risevision.common.components.scrolling-list'));

  beforeEach(inject(function($compile, $rootScope, $injector){
    $rootScope.loadList = loadList = sandbox.stub();

    element = $compile('<div scrolling-list="loadList()"></div>')($rootScope.$new());

    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect($scope).to.be.ok;
    expect($scope.handleScroll).to.be.a('function');
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<div class="ng-scope" rv-scroll-event="handleScroll($event, isEndEvent)"></div>');
  });

  describe('handleScroll:', function() {

    it('should load list if at the bottom', function() {
      sandbox.stub(element[0], 'contains').returns(true);

      $scope.handleScroll({
        target: {
          scrollTop: 10,
          scrollHeight: 0,
          clientHeight: 0
        }
      }, true);

      loadList.should.have.been.called;
    });

    it('should not load list if the container is not scrolled within 20px', function() {
      sandbox.stub(element[0], 'contains').returns(true);

      $scope.handleScroll({
        target: {
          scrollTop: 10,
          scrollHeight: 50,
          clientHeight: 0
        }
      }, true);

      loadList.should.not.have.been.called;
    });

    it('should not load list for non end event', function() {
      sandbox.stub(element[0], 'contains').returns(true);

      $scope.handleScroll({
        target: {
          scrollTop: 10,
          scrollHeight: 0,
          clientHeight: 0
        }
      }, false);

      loadList.should.not.have.been.called;
    });

    it('should not load list if event.target is not within the container', function() {
      sandbox.stub(element[0], 'contains').returns(false);

      $scope.handleScroll({
        target: {
          scrollTop: 10,
          scrollHeight: 0,
          clientHeight: 0
        }
      }, true);

      loadList.should.not.have.been.called;
    });


  });

});
