'use strict';
describe('directive: last revised', function() {
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('translateFilter', function(){
      return function(key){
        var status = '';
        switch (key) {
          case 'editor-app.details.published':
            status = 'Published';
            break;
          case 'editor-app.details.revised':
            status = 'Revised';
            break;
          case 'editor-app.details.saved':
            status = 'Saved';
            break;
        }
        return status;
      };
    });
  }));

  var elm, $scope, $compile;

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    $templateCache.put('partials/editor/last-revised.html', '<p id="status">{{status}}</p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  function compileDirective() {
    var tpl = '<last-revised revision-status-name="presentation.revisionStatusName" change-date="presentation.changeDate" changed-by="presentation.changedBy"></last-revised>';

    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });

    $scope.$digest();
  }

  it('should compile html', function() {
    compileDirective();

    expect(elm.html()).to.equal('<p id="status" class="ng-binding">Saved</p>');
  });
  
  describe('revisionStatus: ', function() {
    it('should show Revised', function() {
      $scope.presentation = {
        revisionStatusName: 'Revised'
      };

      compileDirective();
      
      expect(elm.html()).to.equal('<p id="status" class="ng-binding">Revised</p>');
    });

    it('should show Published', function() {
      $scope.presentation = {
        revisionStatusName: 'Published'
      };
      
      compileDirective();
      
      expect(elm.html()).to.equal('<p id="status" class="ng-binding">Published</p>');
    });

  });
  
  it('directive scope: ', function() {
    compileDirective();
    
    expect(elm.isolateScope().changedBy).to.equal(undefined);
    expect(elm.isolateScope().status).to.equal('Saved');
  });
});
