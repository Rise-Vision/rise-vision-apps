'use strict';
describe('service: widgetModalFactory:', function() {
  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return 'someId';
        },
        _restoreState: function() {}
      }
    });
    $provide.service('placeholderFactory', function() {
      return {
        placeholder: {
          width: 100,
          height: 200
        }
      }
    });
    $provide.service('gadgetFactory', function() {
      return {
        getGadget: function() {
          var deferred = Q.defer();
                    
          deferred.resolve({
            url: 'http://www.risevision.com/widget.html',
            uiUrl: 'http://somewidget/settings.html'
          });
          
          return deferred.promise;
        }
      }
    });
    $provide.service('$modal',function(){
      return $modal = {
        open : function(obj){
          var deferred = Q.defer();

          expect(obj).to.be.truely;
          widgetObj = obj.resolve.widget();

          if(updateParams){
            deferred.resolve({additionalParams: 'updatedParams', params: returnedParams});
          }else{
            deferred.reject();
          }
          
          return {
            result: deferred.promise
          };
        }
      }
    });
    $provide.service('placeholderPlaylistFactory', function() {
      var items = [];
      
      return placeholderPlaylistFactory = {
        updateItem: function(item) {
          placeholderPlaylistFactory.items.push(item);
        },
        items: items
      };
    });
    $provide.service('$sce', function() {
      return {
        trustAsResourceUrl: function(url) {return url;}
      }
    });
  }));
  
  var widgetModalFactory, $modal, placeholderPlaylistFactory, item, updateParams, widgetObj, returnedParams;
  beforeEach(function(){
    item = {
      objectData: 'http://www.risevision.com/widget.html',
      objectReference: '123',
      additionalParams: 'params'
    };
    updateParams = true;
    returnedParams = null;

    inject(function($injector){
      widgetModalFactory = $injector.get('widgetModalFactory');
    });
  });

  it('should exist',function(){
    expect(widgetModalFactory).to.be.truely;
    expect(widgetModalFactory.showWidgetModal).to.be.a('function');
  });

  it('should return if item is null or missing parameters', function(done) {
    var $modalSpy = sinon.spy($modal, 'open');

    widgetModalFactory.showWidgetModal();
    widgetModalFactory.showWidgetModal({});
    
    setTimeout(function() {
      $modalSpy.should.not.have.been.called;

      done();        
    }, 10);
  });

  describe('settings url: ', function() {
    it('should initialize url correctly and remove protocol (http)', function(done) {
      widgetModalFactory.showWidgetModal(item);

      setTimeout(function() {
        expect(widgetObj).to.be.ok;

        // TODO: Should find a better way to access value
        expect(widgetObj.$$state.value).to.be.ok;

        expect(widgetObj.$$state.value.additionalParams).to.equal('params');
        expect(widgetObj.$$state.value.url).to.equal('//somewidget/settings.html?up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');
        
        done();        
      }, 10);  
    });
    
    it('should append previous params to url', function(done) {
      item.objectData = 'http://www.risevision.com/widget.html?up_fileType=43&up_list=0'
      widgetModalFactory.showWidgetModal(item);

      setTimeout(function() {
        expect(widgetObj).to.be.ok;

        expect(widgetObj.$$state.value).to.be.ok;
        expect(widgetObj.$$state.value.url).to.equal('//somewidget/settings.html?up_fileType=43&up_list=0&up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');
        
        done();        
      }, 10);  
    });

    it('should use url from settingsUrl if available', function(done) {
      item.settingsUrl = 'http://www.risevision.com/settings.html';
      widgetModalFactory.showWidgetModal(item);

      setTimeout(function() {
        expect(widgetObj).to.be.ok;

        expect(widgetObj.$$state.value).to.be.ok;
        expect(widgetObj.$$state.value.url).to.equal('//www.risevision.com/settings.html?up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');

        done();        
      }, 10);  
    });
  });
  
  it('should update additionalParams and add item',function(done){
    widgetModalFactory.showWidgetModal(item);
    
    setTimeout(function() {
      expect(item.additionalParams).to.equal('updatedParams');
      
      expect(placeholderPlaylistFactory.items).to.have.length(1);
      expect(placeholderPlaylistFactory.items[0]).to.have.property('additionalParams');
      expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('updatedParams');
      
      done();
    }, 10);
  });

  it('should update item but nort Playlist if soft update',function(done){
    widgetModalFactory.showWidgetModal(item,true);
    
    setTimeout(function() {
      expect(item.additionalParams).to.equal('updatedParams');
      
      expect(placeholderPlaylistFactory.items).to.have.length(0);
      
      done();
    }, 10);
  });
  
  it('should cancel',function(done){
    updateParams = false;
    
    widgetModalFactory.showWidgetModal(item);
    
    setTimeout(function() {
      expect(item.additionalParams).to.equal('params')
      done();
    }, 10);

  });

  describe('objectData params:',function() {
    describe('custom widget url: ', function() {
      it('should detect url with params',function(done){
        returnedParams = 'http://www.risevision.com/custom-widget.html?up_fileType=43&up_list=0';
        widgetModalFactory.showWidgetModal(item);
        
        setTimeout(function() {      
          expect(item.objectData).to.equal('http://www.risevision.com/custom-widget.html?up_fileType=43&up_list=0');
          done();
        }, 10);

      });

      it('should detect blank url',function(done){
        returnedParams = 'http://www.risevision.com/custom-widget.html';
        widgetModalFactory.showWidgetModal(item);
        
        setTimeout(function() {      
          expect(item.objectData).to.equal('http://www.risevision.com/custom-widget.html');
          done();
        }, 10);

      });

    });

    it('should append params to item objectData',function(done){
      returnedParams = 'up_fileType=43&up_list=0';
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=43&up_list=0');
        done();
      }, 10);

    });  

    it('should append params to item objectData and replace &',function(done){
      returnedParams = '&up_fileType=43&up_list=0';
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=43&up_list=0');
        done();
      }, 10);

    });  

    it('should append params to item objectData and replace ?',function(done){
      returnedParams = '?up_fileType=43&up_list=0';
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=43&up_list=0');
        done();
      }, 10);

    }); 

    it('should remove existing params and append new ones',function(done){
      returnedParams = '?up_fileType=3&up_list=1';
      item.objectData = 'http://www.risevision.com/widget.html?up_fileType=43&up_list=0'
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=3&up_list=1');
        done();
      }, 10);

    }); 

    it('should handle null params',function(done){
      returnedParams = null;
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html');
        done();
      }, 10);

    }); 

    it('should handle null objectData',function(done){
      returnedParams = '?up_fileType=3&up_list=1';
      item.objectData = null
      widgetModalFactory.showWidgetModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=3&up_list=1');
        done();
      }, 10);

    }); 

  });

});
