'use strict';
describe('directive: batch-operations', function() {
  var $compile,
      $rootScope,
      $scope,
      element;
  var $window, $modal, $state, userState;
  beforeEach(module('risevision.common.components.scrolling-list'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
        open: sinon.stub().returns({result: Q.resolve()})
      }
    });

    $provide.service('$state', function() {
      return {
        go: sinon.spy()
      }
    });

    $provide.service('userState', function() {
      return {
        hasRole: sinon.stub().returns(true)
      }
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector, $templateCache){
    $window = $injector.get('$window');
    $modal = $injector.get('$modal');
    $state = $injector.get('$state');
    userState = $injector.get('userState');

    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache.put('partials/components/scrolling-list/batch-operations.html', '<p>mock</p>');

    $rootScope.listObject = {
      getSelected: sinon.stub().returns('selectedItems')
    };

  }));

  function compileDirective() {
    element = $compile('<batch-operations list-object="listObject"></batch-operations>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }

  describe('batch-operations:', function () {
    beforeEach(function() {
      compileDirective();
    });

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<batch-operations list-object="listObject" class="ng-scope ng-isolate-scope"><p>mock</p></batch-operations>');
    });

    it('should initialize scope', function() {
      expect($scope.listObject).to.equal($rootScope.listObject);
    });

  });

  describe('operations:', function() {
    
    describe('requireRole:', function() {
      it('should filter out operations the user doesnt have access to', function() {
        $rootScope.listObject.batchOperations = {
          name: 'Items',
          operations: [{
            name: 'Operation1',
            actionCall: 'actionCall'
          },
          {
            name: 'Operation2',
            actionCall: 'actionCall',
            requireRole: 'badRole'
          },
          {
            name: 'Operation3',
            actionCall: 'actionCall',
            requireRole: 'goodRole'
          }]
        };

        userState.hasRole.withArgs('badRole').returns(false);

        compileDirective();

        userState.hasRole.should.have.been.calledTwice;

        expect($scope.listObject.batchOperations.operations).to.have.length(2);
        expect($scope.listObject.batchOperations.operations[0].name).to.equal('Operation1');
        expect($scope.listObject.batchOperations.operations[1].name).to.equal('Operation3');
      });

    });

    describe('_updateDeleteAction:', function() {
      it('should not update regular actions', function() {
        $rootScope.listObject.batchOperations = {
          name: 'Items',
          operations: [{
            name: 'Operation',
            actionCall: 'actionCall'
          }]
        };

        compileDirective();        

        expect($scope.listObject.batchOperations.operations[0].actionCall).to.equal('actionCall');
      });
      
      describe('Delete:', function() {
        var deleteAction;

        beforeEach(function() {
          deleteAction = sinon.spy();
          $rootScope.listObject.batchOperations = {
            name: 'Items',
            operations: [{
              name: 'Delete',
              actionCall: deleteAction,
              isDelete: true
            }]
          };

          compileDirective();        
        });

        it('should find and update delete operation', function() {
          expect($scope.listObject.batchOperations.operations[0].beforeBatchAction).to.be.a('function');
        });

        it('should open confirmation modal', function() {
          $scope.listObject.batchOperations.operations[0].beforeBatchAction();

          $modal.open.should.have.been.calledWithMatch({
            templateUrl: 'partials/components/scrolling-list/bulk-delete-confirmation-modal.html',
            controller: 'BulkDeleteModalCtrl',
            windowClass: 'madero-style centered-modal',
            size: 'sm'
          });        

          var params = $modal.open.getCall(0).args[0];
          expect(params.resolve.selectedItems()).to.equal('selectedItems');
          expect(params.resolve.itemName()).to.equal('Items');
        });

        it('should perform operation if user confirms', function(done) {
          $scope.listObject.batchOperations.operations[0].beforeBatchAction()
            .then(function() {
              done();              
            });
        });

      });
    });

  });

  describe('detect navigation:', function() {
    beforeEach(function() {
      $rootScope.listObject.batchOperations = {
        activeOperation: {
          name: 'Operation'
        },
        cancel: sinon.spy()
      };

      compileDirective();
    });

    describe('$stateChangeStart:', function() {
      it('should notify when changing URL if an operation is active',function() {
        $rootScope.$broadcast('$stateChangeStart',{name:'newState'});
        $scope.$apply();

        $modal.open.should.have.been.calledWithMatch({
          templateUrl: 'partials/components/confirm-modal/madero-confirm-modal.html',
          controller: 'confirmModalController',
          windowClass: 'madero-style centered-modal',
          size: 'sm',
        });        

        var params = $modal.open.getCall(0).args[0];
        expect(params.resolve.confirmationTitle()).to.contain('operation');
        expect(params.resolve.confirmationMessage()).to.contain('operation');
        expect(params.resolve.confirmationButton()).to.be.ok;
        expect(params.resolve.cancelButton()).to.be.ok;
      });

      it('should not notify when changing URL if is no active operation',function(){
        $scope.listObject.batchOperations.activeOperation = null;

        $rootScope.$broadcast('$stateChangeStart',{name:'newState'});
        $scope.$apply();

        $modal.open.should.not.have.been.called;
      });

      it('should cancel operation and redirect if user accepts',function(done){
        var state = {name:'newState'};

        $rootScope.$broadcast('$stateChangeStart', state);
        $scope.$apply();

        $modal.open.should.have.been.called;

        setTimeout(function() {
          $scope.listObject.batchOperations.cancel.should.have.been.called;

          $state.go.should.have.been.calledWith({name:'newState'}, undefined);

          $modal.open.should.have.been.calledOnce;

          done();
        }, 10);
      });

      it('should bypass check on navigation confirm',function(done){
        var state = {name:'newState'};

        $rootScope.$broadcast('$stateChangeStart', state);
        $scope.$apply();

        $modal.open.should.have.been.called;

        setTimeout(function() {
          $scope.listObject.batchOperations.cancel.should.have.been.called;

          $state.go.should.have.been.calledWith({name:'newState'}, undefined);

          $modal.open.should.have.been.calledOnce;

          $rootScope.$broadcast('$stateChangeStart', state);
          $scope.$apply();

          $modal.open.should.have.been.calledOnce;

          setTimeout(function() {
            $scope.listObject.batchOperations.cancel.should.have.been.calledOnce;

            $state.go.should.have.been.calledOnce;

            $modal.open.should.have.been.calledOnce;

            done();
          }, 10);
        }, 10);
      });

      it('should proceed with the operation if the users cancels',function(done){
        $modal.open.returns({result: Q.reject()});
        var state = {name:'newState'};

        $rootScope.$broadcast('$stateChangeStart', state);
        $scope.$apply();

        $modal.open.should.have.been.called;

        setTimeout(function() {
          $scope.listObject.batchOperations.cancel.should.not.have.been.called;

          $state.go.should.not.have.been.called;

          $modal.open.should.have.been.calledOnce;

          done();
        }, 10);
      });

    });

    describe('onbeforeunload:', function() {
      it('should notify unsaved changes when closing window',function(){
        $scope.$apply();

        var result = $window.onbeforeunload();
        expect(result).to.equal('Cancel bulk action?');
      });

      it('should not notify unsaved changes when closing window if there is no active operation',function(){    
        $scope.listObject.batchOperations.activeOperation = null;

        var result = $window.onbeforeunload();
        expect(result).to.be.undefined;
      });

      it('should stop listening for window close on $destroy',function(){
        expect($window.onbeforeunload).to.be.a('function');
        $rootScope.$broadcast('$destroy');
        $scope.$apply();
        expect($window.onbeforeunload).to.be.null;
      });

    });
    
  });

});
