'use strict';
describe('service: presentationItemFactory:', function() {
  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$modal',function(){
      return $modal = {
        open : sinon.spy(function(obj){
          var deferred = Q.defer();

          expect(obj).to.be.ok;
          obj.resolve.item();

          if(updateParams){
            deferred.resolve();
          }else{
            deferred.reject();
          }
          
          return {
            result: deferred.promise
          };
        })
      }
    });
    $provide.service('placeholderPlaylistFactory', function() {
      return placeholderPlaylistFactory = {
        updateItem: sinon.spy()
      };
    });
  }));
  
  var presentationItemFactory, $modal, placeholderPlaylistFactory, item, updateParams;
  beforeEach(function(){
    item = {
      type: 'presentation'
    };
    updateParams = true;

    inject(function($injector){
      presentationItemFactory = $injector.get('presentationItemFactory');
    });
  });

  it('should exist',function(){
    expect(presentationItemFactory).to.be.ok;
    expect(presentationItemFactory.showSettingsModal).to.be.a('function');
  });
  
  it('should return if item is null or missing parameters', function(done) {
    presentationItemFactory.showSettingsModal();
    presentationItemFactory.showSettingsModal({});
    
    setTimeout(function() {
      $modal.open.should.not.have.been.called;

      done();        
    }, 10);
  });

  it('should open modal', function(done) {
    presentationItemFactory.showSettingsModal(item);
    
    setTimeout(function() {
      $modal.open.should.have.been.called;
      expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/editor/presentation-item-settings.html');
      expect($modal.open.getCall(0).args[0].controller).to.equal('PresentationItemModalController');
      expect($modal.open.getCall(0).args[0].resolve.item).to.be.a('function');

      done();        
    }, 10);
  });  

  it('should update item',function(done){
    presentationItemFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.have.been.called;
      
      done();
    }, 10);
  });

  it('should not update item if soft update',function(done){
    presentationItemFactory.showSettingsModal(item,true);
    
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.not.have.been.called;
      
      done();
    }, 10);
  });
  
  it('should cancel',function(done){
    updateParams = false;
    
    presentationItemFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.not.have.been.called;

      done();
    }, 10);

  });

});
