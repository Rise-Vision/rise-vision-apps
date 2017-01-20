'use strict';
describe('directive: rv-popover', function() {
  var $compile, $rootScope, $timeout,editorFactory;

  beforeEach(module('risevision.editor.directives'));
    beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {
        presentation: {}
      };
    });
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_,_$timeout_,_editorFactory_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    editorFactory = _editorFactory_
  }));

  it('should compile', function() {
    var element = $compile("<span rv-popover>mock</span>")($rootScope);
    $rootScope.$digest();
    expect(element[0].outerHTML).to.equal('<span rv-popover="" class="ng-scope ng-isolate-scope">mock</span>');
  });

  it('should show animated popover when watched event is fired and  event watch is enabled',function(done) {  
    var element = $compile('<span pop-on-event="presentationPropertiesDismissed" pop-on-event-enabled="true" rv-popover>mock</span>')($rootScope);
    //expects `show` event to be triggered
    element.on('show', function() {
      expect(element.scope().tooltipClasses).to.be.equal('animated bounce');
      done()
    });

    $rootScope.$apply();
    $rootScope.$broadcast('presentationPropertiesDismissed');
    $timeout.flush();    
  });

  it('should not show popover on evene if event watch is not enabled',function(done) {  
    var element = $compile('<span pop-on-event="presentationPropertiesDismissed" pop-on-event-enabled="false" rv-popover>mock</span>')($rootScope);

    element.on('show', function() {
      done('Error: it should not show');
    });

    $rootScope.$apply();
    $rootScope.$broadcast('presentationPropertiesDismissed');

    setTimeout(function(){
      done();
    },10);
  });

  it('should show not animated popover on mouse enter',function(done){
    var element = $compile("<span rv-popover>mock</span>")($rootScope);

    element.on('show', function() {
      expect(element.scope().tooltipClasses).to.be.undefined;
      done();
    });

    $rootScope.$digest();
    element.triggerHandler('mouseenter'); 
    $timeout.flush();    
  });

  it('should hide popover on mouse leave',function(done){
    var element = $compile("<span rv-popover>mock</span>")($rootScope);

    element.on('hide', function() {
      done();
    });

    $rootScope.$digest();
    element.triggerHandler('mouseleave'); 
  });

    it('should hide popover on mouse click',function(done){
    var element = $compile("<span rv-popover>mock</span>")($rootScope);

    element.on('hide', function() {
      done();
    });

    $rootScope.$digest();
    element.triggerHandler('click'); 
  });

  it('should not show popover for existing presentations',function(done){
    editorFactory.presentation.id = '123';
    var element = $compile('<span pop-on-event="presentationPropertiesDismissed" pop-on-event-enabled="true" rv-popover>mock</span>')($rootScope);

    element.on('show', function() {
      done('Error: it should not show');
    });

    $rootScope.$digest();
    element.triggerHandler('mouseenter'); 
    setTimeout(function(){
      done();
    },10);
  });
});
