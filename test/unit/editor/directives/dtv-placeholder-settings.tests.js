'use strict';
describe('directive: placeholder settings', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function ($provide) {
    placeholderFactory = {
      placeholder: {
        id: 'ph1'
      }
    };
    $provide.service('placeholderFactory', function (){
      return placeholderFactory;
    });
    $provide.service('editorFactory', function() {
      return function() {
        
      };
    });
    $provide.service('backgroundParser', function() {
      return {
        parseBackground: function() {
          return {};
        },
        getStyle: function(background) {
          return background.style || 'style';
        },
        getScaleToFit: function() {
          return true;
        }
      };
    });
    $provide.service('presentationParser', function() {
      return {
        updatePresentation: function() {
          updatePresentationCalled = true;
        }
      };
    });
    $provide.service('userState', function() {
      return {
        _restoreState: function() {
        },
        getSelectedCompanyId: function() {
          
        }
      };
    });
  }));

  var elm, $scope, $compile;
  
  var placeholderFactory, updatePresentationCalled;

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    $templateCache.put('partials/editor/placeholder-settings.html', '<p>{{s}}</p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<placeholder-settings></placeholder-settings>';

    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });

    $scope.$digest();
  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p class="ng-binding"></p>');
  });
  
  it('directive scope: ', function() {
    expect(elm.scope().placeholder).to.deep.equal({id: 'ph1', backgroundStyle: 'style', backgroundScaleToFit: true});
    expect(elm.scope().background).to.deep.equal({});
  });
  
  it('should update placeholder', function() {
    placeholderFactory.placeholder = {
      id: 'ph2'
    };
    
    $scope.$digest();
    
    expect(elm.scope().placeholder.id).to.equal('ph2');
    expect(elm.scope().placeholder).to.equal(placeholderFactory.placeholder);
  });

  it('should update background', function() {
    elm.scope().background.style = 'newStyle';
    
    $scope.$digest();
    
    expect(elm.scope().placeholder.backgroundStyle).to.equal('newStyle');
  });
  
  describe('updatePlaceholderName: ', function() {
    beforeEach(function() {
      updatePresentationCalled = false;
      
      elm.scope().placeholderFields = {
        newId: {}
      };
    });
    
    it('should not allow edit', function() {
      elm.scope().updatePlaceholderName();
      
      expect(updatePresentationCalled).to.be.false;
    });
    
    it('should not allow edit on invalid newId', function() {
      elm.scope().editingName = true;
      elm.scope().placeholderFields.newId.$invalid = true;
      
      elm.scope().updatePlaceholderName();
      
      expect(updatePresentationCalled).to.be.false;
    });
    
    it('should not allow edit same newId', function() {
      elm.scope().editingName = true;
      elm.scope().placeholder.newId = 'ph1';
      
      elm.scope().updatePlaceholderName();
      
      expect(updatePresentationCalled).to.be.false;
    });

    it('should allow edit on valid newId', function() {
      elm.scope().editingName = true;
      
      elm.scope().updatePlaceholderName();
      
      expect(updatePresentationCalled).to.be.true;
      expect(elm.scope().editingName).to.be.false;
    });
    
  });

});
