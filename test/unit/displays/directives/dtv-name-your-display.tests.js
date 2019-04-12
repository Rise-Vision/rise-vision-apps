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
  
  var elm, $scope, displayAdded;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    var tpl = '<name-your-display></name-your-display>';
    $templateCache.put('partials/displays/name-your-display.html', '<p></p>');

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.scope();

    $scope.setCurrentPage = sinon.spy();

  }));

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.factory).to.be.ok;

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
