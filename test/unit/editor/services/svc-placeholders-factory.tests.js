'use strict';
  
describe('service: placeholdersFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    placeholder = {
      id: 'ph1',
      type: 'url',
      objectReference: 'http://www.risevision.com'
    };
    placeholder0 = {
      id: 'ph0'
    };
    placeholder2 = {
      id: 'ph2'
    };
    
    placeholders = [placeholder0, placeholder, placeholder2];

    editorFactory = {
      presentation: {
        placeholders: placeholders,
        width: 1920,
        height: 1080
      }
    };
    
    $provide.service('$q', function() {return Q;});

    $provide.service('editorFactory',function () {
      return editorFactory;
    });
    
    $provide.service('artboardFactory',function () {
      return artboardFactory = {};
    });

    $provide.service('presentationParser',function () {
      return {
        updatePresentation: function(presentation) {
          for (var i = 0; i < presentation.placeholders.length; i++) {
            // Assign ID to placeholder
            presentation.placeholders[i].id = presentation.placeholders[i].id ||
              'newId';
              
            // Remove placeholder from list
            if (presentation.placeholders[i].deleted) {
              presentation.placeholders.splice(i, 1);
              i--;
            };
          }
        }
      };
    });

    $provide.service('presentationTracker', function() {
      return function(eventName){
        trackedEvent = eventName;
      }
    });

    $provide.service('placeholderFactory', function() {
      return {
        setPlaceholder: function(placeholder) {}
      };
    });

  }));
  var placeholders, placeholder, placeholder0, placeholder2, placeholdersFactory, trackerCalled, updateSchedule, currentState;
  var editorFactory, artboardFactory, trackedEvent, setPlaceholderSpy;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updateSchedule = true;
    
    inject(function($injector){  
      var placeholderFactory = $injector.get('placeholderFactory');
      setPlaceholderSpy = sinon.spy(placeholderFactory, 'setPlaceholder');

      placeholdersFactory = $injector.get('placeholdersFactory');
    });
  });

  it('should exist',function(){
    expect(placeholdersFactory).to.be.truely;
    
    expect(placeholdersFactory.getPlaceholders).to.be.a('function');
    expect(placeholdersFactory.isNew).to.be.a('function');    
    expect(placeholdersFactory.addNewPlaceholder).to.be.a('function');    
    expect(placeholdersFactory.removePlaceholder).to.be.a('function');
    expect(placeholdersFactory.duplicatePlaceholder).to.be.a('function');    
    expect(placeholdersFactory.updatePlaceholder).to.be.a('function');
  });
  
  describe('getPlaceholders: ', function() {
    it('should get the placeholders', function() {
      expect(placeholdersFactory.getPlaceholders()).to.equal(placeholders);
    });
    
    it('should initialize placeholders if undefined', function() {
      editorFactory.presentation.placeholders = undefined;
      
      var _placeholders = placeholdersFactory.getPlaceholders();
      
      expect(_placeholders).to.be.a('array');
      expect(_placeholders.length).to.equal(0);
    });
  });
  
  it('isNew: ', function() {
    expect(placeholdersFactory.isNew(placeholder)).to.be.false;
    expect(placeholdersFactory.isNew({})).to.be.true;
  });
  
  it('addNewPlaceholder: ', function() {
    placeholdersFactory.addNewPlaceholder();
    expect(trackedEvent).to.equal('Add Placeholder');
    
    expect(placeholders).to.have.length(4);
    expect(placeholders[3].zIndex).to.equal(3);
    
    expect(placeholders[3].width).to.equal(400);
    expect(placeholders[3].widthUnits).to.equal('px');
    
    expect(placeholders[3].id).to.equal('newId');
    expect(placeholders[3].type).to.equal('playlist');
    expect(placeholders[3].timeDefined).to.equal(false);
    expect(placeholders[3].transition).to.equal('none');

    setPlaceholderSpy.should.have.been.calledWith(placeholders[3]);
  });
  
  describe('centerPlaceholder: ', function() {
    it('should default to 0,0', function() {
      placeholdersFactory.addNewPlaceholder();

      expect(placeholders[3].left).to.equal(0);
      expect(placeholders[3].top).to.equal(0);
    });
    
    it('should center placeholder', function() {
      artboardFactory.getWorkspaceElement = function() {
        return {
          clientWidth: 1000,
          clientHeight: 1000,
          scrollLeft: 0,
          scrollTop: 0
        };
      };
      
      placeholdersFactory.addNewPlaceholder();
      expect(placeholders[3].left).to.equal((1000 - 12 - 400)/2);
      expect(placeholders[3].top).to.equal((1000 - 60 - 12 - 200)/2);
    });
    
    it('should take scroll into account and center placeholder', function() {
      artboardFactory.getWorkspaceElement = function() {
        return {
          clientWidth: 1000,
          clientHeight: 1000,
          scrollLeft: 300,
          scrollTop: 300
        };
      };
      
      placeholdersFactory.addNewPlaceholder();
      expect(placeholders[3].left).to.equal((1000 - 12 - 400)/2 + 300);
      expect(placeholders[3].top).to.equal((1000 - 60 - 12 - 200)/2 + 300);
    });
    
    it('should use presentation resolution values if smaller than artboard', function() {
      editorFactory.presentation.height = 1000;
      editorFactory.presentation.width = 1000;
      artboardFactory.getWorkspaceElement = function() {
        return {
          clientWidth: 2000,
          clientHeight: 2000,
          scrollLeft: 0,
          scrollTop: 0
        };
      };
      
      placeholdersFactory.addNewPlaceholder();
      expect(placeholders[3].left).to.equal((1000 - 400)/2);
      expect(placeholders[3].top).to.equal((1000 - 200)/2);      
    });
    
    it('should not place placeholder past edge of artboard', function() {
      artboardFactory.getWorkspaceElement = function() {
        return {
          clientWidth: 500,
          clientHeight: 500,
          scrollLeft: 1700,
          scrollTop: 900
        };
      };
      
      placeholdersFactory.addNewPlaceholder();
      expect(placeholders[3].left).to.equal(1920 - 400);
      expect(placeholders[3].top).to.equal(1080 - 200);      
    });
    
    it('should place placeholder at top left corner for small artboard', function() {
      artboardFactory.getWorkspaceElement = function() {
        return {
          clientWidth: 200,
          clientHeight: 200,
          scrollLeft: 0,
          scrollTop: 0
        };
      };
      
      placeholdersFactory.addNewPlaceholder();
      expect(placeholders[3].left).to.equal(0);
      expect(placeholders[3].top).to.equal(0);
    });
    
    it('should reposition and readjust size of full screen placeholder', function() {
      artboardFactory.getWorkspaceElement = function() {
        return {
        };
      };
      
      placeholdersFactory.addNewPlaceholder({
        width: 5000,
        height: 5000,
        top: 50,
        left: 50
      });
      expect(placeholders[3].width).to.equal(1920);
      expect(placeholders[3].height).to.equal(1080);
      expect(placeholders[3].left).to.equal(0);
      expect(placeholders[3].top).to.equal(0);
    });
    
    describe('offsetPlaceholder: ', function() {
      describe('bottom first: ', function() {
        var top, left;
        beforeEach(function() {
          artboardFactory.getWorkspaceElement = function() {
            return {
              clientWidth: 600,
              clientHeight: 335,
              scrollLeft: 1350,
              scrollTop: 820
            };
          };
          
          placeholdersFactory.addNewPlaceholder();
          top = placeholders[3].top;
          left = placeholders[3].left;
        });
        
        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });
        
        it('should offset second placeholder', function(){
          expect(placeholders[4].left).to.equal(left + 20);
          expect(placeholders[4].top).to.equal(top + 20);
        });
        
        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });
        
        it('should offset third placeholder at the bottom', function(){
          expect(placeholders[5].left).to.equal(left + 40);
          expect(placeholders[5].top).to.equal(1080 - 200);
        });

        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });
        
        it('should move fourth placeholder sideways', function(){
          expect(placeholders[6].left).to.equal(left + 60);
          expect(placeholders[6].top).to.equal(1080 - 200);
        });
        
        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });

        it('should offset fifth placeholder to the right edge', function(){
          expect(placeholders[7].left).to.equal(1920 - 400);
          expect(placeholders[7].top).to.equal(1080 - 200);
        });
        
        it('should overlap placeholders at the bottom right', function(){
          placeholdersFactory.addNewPlaceholder();

          expect(placeholders[7].left).to.equal(1920 - 400);
          expect(placeholders[7].top).to.equal(1080 - 200);
        });
      });

      describe('right first: ', function() {
        var top, left;
        beforeEach(function() {
          artboardFactory.getWorkspaceElement = function() {
            return {
              clientWidth: 485,
              clientHeight: 1000,
              scrollLeft: 1460,
              scrollTop: 0
            };
          };
          
          placeholdersFactory.addNewPlaceholder();
          top = placeholders[3].top;
          left = placeholders[3].left;
        });
        
        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });

        it('should offset second placeholder', function(){
          expect(placeholders[4].left).to.equal(left + 20);
          expect(placeholders[4].top).to.equal(top + 20);
        });
        
        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });
        
        it('should offset third placeholder to the right edge', function(){
          expect(placeholders[5].left).to.equal(1920 - 400);
          expect(placeholders[5].top).to.equal(top + 40);
        });

        beforeEach(function() {        
          placeholdersFactory.addNewPlaceholder();
        });
        
        it('should move fourth placeholder downwards', function(){
          expect(placeholders[6].left).to.equal(1920 - 400);
          expect(placeholders[6].top).to.equal(top + 60);
        });

      });
    });
  });

  describe('removePlaceholder: ',function(){
    it('should remove the item',function(){
      placeholdersFactory.removePlaceholder(placeholder);

      expect(placeholders.length).to.equal(2);
    });
    
    it('should not remove missing item',function(){
      placeholdersFactory.removePlaceholder({});

      expect(placeholders.length).to.equal(3);
      expect(placeholders[1]).to.equal(placeholder);    
    });
  });

  describe('updatePlaceholder: ',function(){
    it('should add the item',function(){
      var newItem = {
        name: 'Item 2'
      };
      placeholdersFactory.updatePlaceholder(newItem);

      expect(placeholders.length).to.equal(4);
      expect(placeholders[3]).to.equal(newItem);    
    });
    
    it('should not add duplicate item',function(){
      placeholdersFactory.updatePlaceholder(placeholder);

      expect(placeholders.length).to.equal(3);
      expect(placeholders[1]).to.equal(placeholder);    
    });
  });
  
  describe('duplicatePlaceholder: ', function() {
    it('should duplicate the item', function() {
      placeholdersFactory.duplicatePlaceholder(placeholder);
      
      expect(placeholders.length).to.equal(4);
      expect(placeholders[3]).to.deep.equal({id:'newId',type:'url',objectReference:'http://www.risevision.com',zIndex:3});
    });
  });

});
