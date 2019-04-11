'use strict';
describe('directive: name your display', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory',function(){
      return {
        display: {},
        addDisplay : function(){
          displayAdded = true;

          return Q.resolve();
        }
      }
    });

  }));
  
  var elm, $scope, $compile, displayAdded;

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    $templateCache.put('partials/displays/name-your-display.html', '<p></p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<name-your-display></name-your-display>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();

    $scope.setCurrentPage = sinon.spy();
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.factory).to.be.ok;
    expect($scope.display).to.be.an('object');
    expect($scope.display).to.deep.equal({});

    expect($scope.save).to.be.a('function');
  });

  it('should return early if the form is invalid',function(done){
    $scope.forms = {
      displayAdd: {
        $valid: false
      }  
    };

    $scope.save();

    setTimeout(function() {
      expect(displayAdded).to.not.be.ok;
      $scope.setCurrentPage.should.not.have.been.called;

      done();
    });
  });

  it('should save the display',function(done){
    $scope.forms = {
      displayAdd: {
        $valid: true
      }  
    };

    $scope.display = {id:123};
    $scope.save();

    setTimeout(function() {
      expect(displayAdded).to.be.true;
      $scope.setCurrentPage.should.have.been.calledWith('displayAdded');

      done();
    });
  });
  
});
