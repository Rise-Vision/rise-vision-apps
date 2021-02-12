'use strict';
describe('service: settingsFactory:', function() {
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
    $provide.service('widgetModalFactory',function(){
      return widgetModalFactory = {
        showSettingsModal: sinon.spy(function() { return Q.resolve(); })
      }
    });
    $provide.service('placeholderPlaylistFactory', function() {
      return placeholderPlaylistFactory = {
        updateItem: sinon.spy()
      };
    });
  }));
  
  var settingsFactory, $modal, widgetModalFactory, placeholderPlaylistFactory, item, updateParams;
  beforeEach(function(){
    item = {
      type: 'presentation'
    };
    updateParams = true;

    inject(function($injector){
      settingsFactory = $injector.get('settingsFactory');
    });
  });

  it('should exist',function(){
    expect(settingsFactory).to.be.ok;
    expect(settingsFactory.showSettingsModal).to.be.a('function');
  });
  
  it('should return if item is null or missing parameters', function(done) {
    settingsFactory.showSettingsModal();
    settingsFactory.showSettingsModal({});
    
    setTimeout(function() {
      $modal.open.should.not.have.been.called;

      done();        
    }, 10);
  });

  it('should open presentation settings', function(done) {
    settingsFactory.showSettingsModal(item);
    
    setTimeout(function() {
      $modal.open.should.have.been.called;
      expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/editor/presentation-item-settings.html');
      expect($modal.open.getCall(0).args[0].controller).to.equal('PresentationItemModalController');
      expect($modal.open.getCall(0).args[0].resolve.item).to.be.a('function');

      done();        
    }, 10);
  });  

  it('should update item',function(done){
    settingsFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.have.been.called;
      
      done();
    }, 10);
  });

  it('should not update item if soft update',function(done){
    settingsFactory.showSettingsModal(item, true);
    
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.not.have.been.called;
      
      done();
    }, 10);
  });
  
  it('should open widget settings', function() {
    item.type = 'widget';

    settingsFactory.showSettingsModal(item);
  
    expect(widgetModalFactory.showSettingsModal).to.have.been.calledWith(item);
  });

  it('should update widget settings', function(done) {
    item.type = 'widget';

    settingsFactory.showSettingsModal(item);
  
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.have.been.called;
      
      done();
    }, 10);
  });

  it('should not update widget settings if soft update', function(done) {
    item.type = 'widget';

    settingsFactory.showSettingsModal(item, true);
  
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.not.have.been.called;
      
      done();
    }, 10);
  });

  it('should not open any modal', function() {
    item.type = 'asdf';
    
    settingsFactory.showSettingsModal(item);
    
    expect(widgetModalFactory.showSettingsModal).to.not.have.been.called;
    expect($modal.open).to.not.have.been.called;
  });
  
  it('should cancel',function(done){
    updateParams = false;
    
    settingsFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(placeholderPlaylistFactory.updateItem).to.not.have.been.called;

      done();
    }, 10);

  });

});
