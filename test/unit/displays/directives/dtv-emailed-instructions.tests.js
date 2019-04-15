'use strict';
describe('directive: emailed instructions', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('userState',function(){
      return {
        getUserEmail: function() {
          return 'user@email.com'
        }
      };
    });

  }));
  
  var elm, $scope;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    var tpl = '<emailed-instructions></emailed-instructions>';
    $templateCache.put('partials/displays/emailed-instructions.html', '<p></p>');

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.scope();
  }));

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
  });

  it('should populate user email', function() {
    expect($scope.userEmail).to.equal('user@email.com');
  });
  
});
