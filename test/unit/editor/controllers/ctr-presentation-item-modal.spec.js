'use strict';
describe('controller: presentation item modal', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    itemProperties = {
      name: '',
      type: 'presentation',
      objectData: ''
    };
    $provide.service('$q', function() {return Q;});
    $provide.service('$modalInstance',function(){
      return {
        close : sinon.stub(),
        dismiss : sinon.stub()
      }
    });
    $provide.service('$modal', function(){
      return $modal = {
        open : sinon.spy(function(obj){
          return {
            result: Q.resolve(['newId', 'newName'])
          };
        })
      }
    });

    $provide.service('presentationFactory', function(){
      return {
        getPresentationCached: sinon.spy(function(item) {
          var deferred = Q.defer();
          
          if (returnPresentation) {
            deferred.resolve({
              name: 'presentationName'
            });
          } else {
            deferred.reject();
          }
          
          return deferred.promise;
        })
      };
    });
    $provide.value('HTML_PRESENTATION_TYPE', 'HTML Template');


  }));
  var $scope, $modalInstance, $modal, $timeout, presentationFactory, returnPresentation, itemProperties, itemType, PRESENTATION_SEARCH;

  beforeEach(function() {
    inject(function($injector, $rootScope){
      returnPresentation = true;

      presentationFactory = $injector.get('presentationFactory');
      $modalInstance = $injector.get('$modalInstance');
      $modal = $injector.get('$modal');
      $timeout = $injector.get('$timeout');
      PRESENTATION_SEARCH = $injector.get('PRESENTATION_SEARCH');
      
      $scope = $rootScope.$new();
      $scope.presentationItemFields = {
        presentationId: {
          $error: {},
          $setValidity: sinon.stub()
        }
      };
    });
  });

  afterEach(function() {
    try {
      $timeout.flush();
    } catch (e) {}
  });

  describe('Blank item: ', function () {
    beforeEach(function(){
      inject(function($controller){
        $controller('PresentationItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          $modal : $modal,
          item: itemProperties,
          presentationFactory: presentationFactory
        });
        $scope.$digest();
        sinon.spy($scope, 'selectPresentation');
      });
    });
    it('should exist',function(){
      expect($scope).to.be.ok;

      expect($scope.selectPresentation).to.be.a('function');
      expect($scope.clearSelection).to.be.a('function');
      expect($scope.save).to.be.a('function');
      expect($scope.dismiss).to.be.a('function');
    });

    it('should copy the item properties',function(){
      expect($scope.item).to.not.equal(itemProperties);
      expect($scope.item).to.deep.equal(itemProperties);
    });

    it('should update item id & name to presentation name', function(done) {
      $scope.presentationId = 'newId';

      $scope.$digest();

      expect($scope.item.objectData).to.equal('newId');

      setTimeout(function() {
        $scope.$digest();

        expect($scope.presentationName).to.equal('presentationName');
        expect($scope.item.name).to.equal('presentationName');

        done();
      }, 10);
    });

    it('should show template error for HTML Templates', function(done) {
      presentationFactory.getPresentationCached = sinon.spy(function() {
        return Q.resolve({
          name: 'presentationName',
          presentationType: 'HTML Template'
        });
      });

      $scope.presentationId = 'newId';

      $scope.$digest();

      expect($scope.item.objectData).to.equal('newId');

      setTimeout(function() {
        $scope.$digest();

        $scope.presentationItemFields.presentationId.$setValidity.should.have.been.calledWith('template', false);

        done();
      }, 10);
    });

    it('should not load Id if blank or invalid', function() {
      $scope.presentationItemFields.presentationId.$error.guid = true;
      $scope.presentationId = 'newId';
      
      $scope.$digest();
      
      presentationFactory.getPresentationCached.should.not.have.been.called;
      
      $scope.presentationItemFields.presentationId.$error.guid = false;
      $scope.presentationId = '';
      
      $scope.$digest();

      presentationFactory.getPresentationCached.should.not.have.been.called;
    });

    it('should show presentation Id and warning if it cant load presentation', function(done) {
      returnPresentation = false;
      $scope.presentationId = 'newId';
      
      $scope.$digest();

      setTimeout(function() {
        expect($scope.presentationName).to.not.be.ok
        expect($scope.showPresentationId).to.be.true;
        expect($scope.apiWarning).to.be.true;

        done();
      }, 10);
    });
    
    it('should reset warnings when Id is changed', function(done) {
      returnPresentation = false;
      $scope.presentationId = 'newId';
      
      $scope.$digest();

      $scope.presentationItemFields.presentationId.$setValidity.should.have.been.calledWith('template', true);

      setTimeout(function() {
        $scope.presentationId = '';
        
        $scope.$digest();
        
        expect($scope.apiWarning).to.be.false;
        
        done();
      }, 10);
    });
    
    it('should open presentation selector on open', function(done) {
      $modal.open.should.have.been.called;
      expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/editor/presentation-selector-modal.html');
      expect($modal.open.getCall(0).args[0].controller).to.equal('PresentationSelectorModal');
      
      setTimeout(function() {
        expect($scope.presentationId).to.equal('newId');
        expect($scope.presentationName).to.equal('newName');
        
        done();
      }, 10);
    });

    it('clearSelection: ', function() {
      $scope.item.objectData = 'test';
      $scope.presentationId = 'test';
      $scope.presentationName = 'test';
      $scope.apiWarning = true;
      
      $scope.clearSelection();

      expect($scope.item.objectData).to.not.be.ok;
      expect($scope.presentationId).to.not.be.ok;
      expect($scope.presentationName).to.not.be.ok;
      expect($scope.apiWarning).to.not.be.ok;
    });

    it('should update item properties on apply',function(){
      itemProperties.name = 'updatedName';

      $scope.save();

      expect($scope.item).to.deep.equal(itemProperties);

      $modalInstance.close.should.have.been.called;
    });

    it('should dismiss modal when cancel',function(){
      itemProperties.name = 'updatedName';
      
      $scope.dismiss();

      expect($scope.item).to.not.deep.equal(itemProperties);

      $modalInstance.dismiss.should.have.been.called;
    });

  });

  describe('Existing item: ', function () {
    beforeEach(function() {
      itemProperties.name = 'presentation';
      itemProperties.objectData = 'presentationId';

      inject(function($controller){
        $controller('PresentationItemModalController', {
          $scope: $scope,
          $modalInstance : $modalInstance,
          $modal : $modal,
          item: itemProperties,
          presentationFactory: presentationFactory
        });
        $scope.$digest();
      });
    });
    
    it('should load presentation name', function(done) {
      setTimeout(function() {
        expect($scope.presentationName).to.equal('presentationName');

        done();
      }, 10);
    });
    
    it('selectPresentation: ', function(done) {
      $scope.selectPresentation();

      $modal.open.should.have.been.called;
      expect($modal.open.getCall(0).args[0].templateUrl).to.equal('partials/editor/presentation-selector-modal.html');
      expect($modal.open.getCall(0).args[0].controller).to.equal('PresentationSelectorModal');
      
      setTimeout(function() {
        expect($scope.presentationId).to.equal('newId');
        expect($scope.presentationName).to.equal('presentationName');
        
        done();
      }, 10);
    });
    
    it('should not update item name', function(done) {
      setTimeout(function() {
        expect($scope.item.name).to.equal('presentation');

        done();
      }, 10);
    });

    it('should filter out HTML Templates from Presentation Selector', function() {
      expect(PRESENTATION_SEARCH.filter).to.equal('');

      $scope.selectPresentation();

      expect(PRESENTATION_SEARCH.filter).to.equal(' NOT presentationType:\"HTML Template\"');

      $timeout.flush();

      expect(PRESENTATION_SEARCH.filter).to.equal('');
    });

  });
});
