'use strict';
describe('service: widgetModalFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
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
        getGadgetById: function() {
          return Q.resolve({
            url: 'http://www.risevision.com/widget.html',
            uiUrl: 'http://somewidget/settings.html'
          });
        }
      }
    });
    $provide.service('$modal',function(){
      return $modal = {
        open : sinon.spy(function(obj){
          var deferred = Q.defer();

          expect(obj).to.be.ok;
          expect(obj.resolve).to.be.ok;
          expect(obj.resolve.widget).to.be.a('function');
          widgetObj = obj.resolve.widget();

          if (widgetObj.then) {
            widgetObj.then(function(result) {
              widgetObj = result;
            });
          }

          if(updateParams){
            deferred.resolve({additionalParams: returnedAdditionalParams, params: returnedParams});
          }else{
            deferred.reject();
          }
          
          return {
            result: deferred.promise
          };
        })
      }
    });
    $provide.service('$sce', function() {
      return {
        trustAsResourceUrl: function(url) {return url;}
      }
    });
  }));
  
  var widgetModalFactory, $modal, item, updateParams, widgetObj,
  returnedParams, widgetUtils, returnedAdditionalParams;
  beforeEach(function(){
    item = {
      objectData: 'http://www.risevision.com/widget.html',
      objectReference: '123',
      additionalParams: 'params',
      type: 'widget'
    };
    updateParams = true;
    returnedParams = null;
    returnedAdditionalParams = 'updatedParams';

    inject(function($injector){
      widgetModalFactory = $injector.get('widgetModalFactory');
      widgetUtils = $injector.get('widgetUtils');
    });
  });

  it('should exist',function(){
    expect(widgetModalFactory).to.be.ok;
    expect(widgetModalFactory.showSettingsModal).to.be.a('function');
    expect(widgetModalFactory.showSettingsModal().then).to.be.a('function');
  });

  it('should return if item is null', function(done) {
    widgetModalFactory.showSettingsModal().then(function() {
      done('fail');
    })
    .then(null, function(error) {
      expect(error).to.equal('Invalid Playlist Item');
      done();
    });
  });

  it('should return if item is missing parameters', function(done) {
    widgetModalFactory.showSettingsModal({}).then(function() {
      done('fail');
    })
    .then(null, function(error) {
      expect(error).to.equal('Invalid Playlist Item');
      done();
    });
  });

  describe('iframe widget settings: ', function() {
    it('should open correct settings modal', function() {
      widgetModalFactory.showSettingsModal(item);

      $modal.open.should.have.been.calledWith({
        windowTemplateUrl: 'partials/editor/simple-modal.html',
        templateUrl: 'partials/editor/widget-modal.html',
        controller: 'widgetModal',
        size: 'lg',
        backdrop: true,
        resolve: sinon.match.object
      });
    });

    it('should initialize url correctly and remove protocol (http)', function(done) {
      widgetModalFactory.showSettingsModal(item);

      setTimeout(function() {
        expect(widgetObj).to.be.ok;

        expect(widgetObj.additionalParams).to.equal('params');
        expect(widgetObj.url).to.equal('//somewidget/settings.html?up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');

        done();
      }, 10);
    });
    
    it('should append previous params to url', function(done) {
      item.objectData = 'http://www.risevision.com/widget.html?up_fileType=43&up_list=0'
      widgetModalFactory.showSettingsModal(item);

      setTimeout(function() {
        expect(widgetObj).to.be.ok;

        expect(widgetObj.url).to.equal('//somewidget/settings.html?up_fileType=43&up_list=0&up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');
        
        done();        
      }, 10);
    });

    it('should use url from settingsUrl if available', function(done) {
      item.settingsUrl = 'http://www.risevision.com/settings.html';

      widgetModalFactory.showSettingsModal(item);

      setTimeout(function() {
        expect(widgetObj).to.be.ok;

        expect(widgetObj.url).to.equal('//www.risevision.com/settings.html?up_id=widget-modal-frame&parent=http%3A%2F%2Fserver%2F&up_rsW=100&up_rsH=200&up_companyId=someId');

        done();        
      }, 10);
    });
  });

  describe('inApp widget settings: ', function() {
    beforeEach(function() {
      item.objectReference = '2707fc05-5051-4d7b-bcde-01fafd6eaa5e';

      sinon.stub(widgetUtils, 'getInAppSettings', function(id) {
        if (id === item.objectReference) {
          return {
            partial: 'partials/widgets/image-settings.html',
            type: 'imageWidget'
          };
        }
        return null;
      });
    });
    
    afterEach(function() {
      widgetUtils.getInAppSettings.restore();
    });

    it('should open correct settings modal', function() {
      widgetModalFactory.showSettingsModal(item);

      $modal.open.should.have.been.calledWith({
        templateUrl: 'partials/widgets/image-settings.html',
        controller: 'WidgetSettingsModalController',
        size: 'lg',
        backdrop: true,
        resolve: sinon.match.object
      });
    });

    it('should set correct parameter values', function(done) {
      widgetModalFactory.showSettingsModal(item)
        .then(function(){
          expect(widgetObj).to.be.ok;

          expect(widgetObj.type).to.equal('imageWidget');
          expect(widgetObj.additionalParams).to.equal('params');
          expect(widgetObj.params).to.equal('up_rsW=100&up_rsH=200&up_companyId=someId');
          
          done();
        })
        .then(null,done);
    });
  });

  it('should update additionalParams and resolve',function(done){
    widgetModalFactory.showSettingsModal(item)
      .then(function(){
        expect(item.additionalParams).to.equal('updatedParams');
        
        done();
      })
      .then(null,done);
  });

  it('should update item name if same as filename',function(done){
    item.name = 'filename.png';
    item.objectReference = widgetUtils.getWidgetId('image');
    item.additionalParams = JSON.stringify({selector:{storageName:'filename.png'}});
    returnedAdditionalParams = JSON.stringify({selector:{storageName:'newfile.jpg'}});

    widgetModalFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(item.name).to.equal('newfile.jpg');

      done();
    }, 10);
  });

  it('should not update item name if name is not the same as filename',function(done){
    item.name = 'name';
    item.objectReference = widgetUtils.getWidgetId('image');
    item.additionalParams = JSON.stringify({selector:{storageName:'filename.png'}});
    returnedAdditionalParams = JSON.stringify({selector:{storageName:'newfile.jpg'}});

    widgetModalFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(item.name).to.not.equal('newfile.jpg');
      expect(item.name).to.equal('name');
      done();
    }, 10);
  });

  it('should not update item name on error',function(done){
    item.name = 'filename.png';
    item.objectReference = widgetUtils.getWidgetId('image');
    item.additionalParams = JSON.stringify({selector:{storageName:'otherfilename.png'}});
    returnedAdditionalParams = JSON.stringify({selector:null});

    widgetModalFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(item.name).to.equal('filename.png');
      done();
    }, 10);
  });

  it('should cancel',function(done){
    updateParams = false;
    
    widgetModalFactory.showSettingsModal(item);
    
    setTimeout(function() {
      expect(item.additionalParams).to.equal('params')
      done();
    }, 10);

  });

  describe('objectData params:',function() {
    describe('custom widget url: ', function() {
      it('should detect url with params',function(done){
        returnedParams = 'http://www.risevision.com/custom-widget.html?up_fileType=43&up_list=0';
        widgetModalFactory.showSettingsModal(item);
        
        setTimeout(function() {      
          expect(item.objectData).to.equal('http://www.risevision.com/custom-widget.html?up_fileType=43&up_list=0');
          done();
        }, 10);

      });

      it('should detect blank url',function(done){
        returnedParams = 'http://www.risevision.com/custom-widget.html';
        widgetModalFactory.showSettingsModal(item);
        
        setTimeout(function() {      
          expect(item.objectData).to.equal('http://www.risevision.com/custom-widget.html');
          done();
        }, 10);

      });

    });

    it('should append params to item objectData',function(done){
      returnedParams = 'up_fileType=43&up_list=0';
      widgetModalFactory.showSettingsModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=43&up_list=0');
        done();
      }, 10);

    });  

    it('should append params to item objectData and replace &',function(done){
      returnedParams = '&up_fileType=43&up_list=0';
      widgetModalFactory.showSettingsModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=43&up_list=0');
        done();
      }, 10);

    });  

    it('should append params to item objectData and replace ?',function(done){
      returnedParams = '?up_fileType=43&up_list=0';
      widgetModalFactory.showSettingsModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=43&up_list=0');
        done();
      }, 10);

    }); 

    it('should remove existing params and append new ones',function(done){
      returnedParams = '?up_fileType=3&up_list=1';
      item.objectData = 'http://www.risevision.com/widget.html?up_fileType=43&up_list=0'
      widgetModalFactory.showSettingsModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=3&up_list=1');
        done();
      }, 10);

    }); 

    it('should handle null params',function(done){
      returnedParams = null;
      widgetModalFactory.showSettingsModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html');
        done();
      }, 10);

    }); 

    it('should handle null objectData',function(done){
      returnedParams = '?up_fileType=3&up_list=1';
      item.objectData = null
      widgetModalFactory.showSettingsModal(item);
      
      setTimeout(function() {      
        expect(item.objectData).to.equal('http://www.risevision.com/widget.html?up_fileType=3&up_list=1');
        done();
      }, 10);

    }); 

  });

});
