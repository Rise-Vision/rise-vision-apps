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
    $templateCache.put('partials/common/batch-operations.html', '<p>mock</p>');

    $rootScope.listObject = {
      getSelected: sinon.stub().returns('selectedItems'),
      getSelectedAction: sinon.stub().returns('selectedAction')
    };

  }));

  function compileDirective() {
    element = $compile('<batch-operations list-object="listObject" list-operations="listOperations"></batch-operations>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }

  describe('batch-operations:', function () {
    beforeEach(function() {
      $rootScope.listOperations = 'listOperations';

      compileDirective();
    });

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<batch-operations list-object="listObject" list-operations="listOperations" class="ng-scope ng-isolate-scope"><p>mock</p></batch-operations>');
    });

    it('should initialize scope', function() {
      expect($scope.listObject).to.equal($rootScope.listObject);
      expect($scope.listOperations).to.equal('listOperations');
    });

  });

  describe('operations:', function() {
    
    describe('requireRole:', function() {
      it('should filter out operations the user doesnt have access to', function() {
        $rootScope.listOperations = {
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

        expect($scope.listOperations.operations).to.have.length(2);
        expect($scope.listOperations.operations[0].name).to.equal('Operation1');
        expect($scope.listOperations.operations[1].name).to.equal('Operation3');
      });

    });

    describe('_updateListActions:', function() {
      it('should update regular actions', function() {
        $rootScope.listOperations = {
          name: 'Items',
          operations: [{
            name: 'Operation',
            actionCall: 'actionCall'
          }]
        };

        compileDirective();        

        $scope.listObject.getSelectedAction.should.have.been.calledWith('actionCall', 'Operation');

        expect($scope.listOperations.operations[0].actionCall).to.equal('selectedAction');
      });
      
      describe('Delete:', function() {
        var deleteAction;

        beforeEach(function() {
          deleteAction = sinon.stub();

          $rootScope.listObject.getSelectedAction.returns(deleteAction);
          $rootScope.listOperations = {
            name: 'Items',
            operations: [{
              name: 'Delete',
              actionCall: 'actionCall'
            }]
          };

          compileDirective();        
        });

        it('should find and update delete operation', function() {
          expect($scope.listOperations.operations[0].actionCall).to.be.a('function');
        });

        it('should get delete action', function() {
          $scope.listObject.getSelectedAction.should.have.been.calledWith('actionCall', 'Delete', true);
        });

        it('should open confirmation modal', function() {
          $scope.listOperations.operations[0].actionCall();

          $modal.open.should.have.been.calledWithMatch({
            templateUrl: 'partials/common/bulk-delete-confirmation-modal.html',
            controller: 'BulkDeleteModalCtrl',
            windowClass: 'madero-style centered-modal',
            size: 'sm'
          });        

          var params = $modal.open.getCall(0).args[0];
          expect(params.resolve.selectedItems()).to.equal('selectedItems');
          expect(params.resolve.itemName()).to.equal('Items');

        });

        it('should perform operation if user confirms', function(done) {
          $scope.listOperations.operations[0].actionCall();

          setTimeout(function() {
            deleteAction.should.have.been.called;

            done();
          }, 10);
        });

      });
    });

  });

  describe('detect navigation:', function() {
    beforeEach(function() {
      $rootScope.listOperations = 'listOperations';
      $rootScope.listObject = {
        operations: {
          activeOperation: '',
          cancel: sinon.spy()
        }
      };

      compileDirective();
    });

    describe('$stateChangeStart:', function() {
      it('should notify when changing URL if an operation is active',function() {
        $scope.listObject.operations.activeOperation = 'Operation';

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
        $rootScope.$broadcast('$stateChangeStart',{name:'newState'});
        $scope.$apply();

        $modal.open.should.not.have.been.called;
      });

      it('should cancel operation and redirect if user accepts',function(done){
        var state = {name:'newState'};
        $scope.listObject.operations.activeOperation = 'Operation';

        $rootScope.$broadcast('$stateChangeStart', state);
        $scope.$apply();

        $modal.open.should.have.been.called;

        setTimeout(function() {
          $scope.listObject.operations.cancel.should.have.been.called;

          $state.go.should.have.been.calledWith({name:'newState'}, undefined);

          $modal.open.should.have.been.calledOnce;

          done();
        }, 10);
      });

      it('should bypass check on navigation confirm',function(done){
        var state = {name:'newState'};
        $scope.listObject.operations.activeOperation = 'Operation';

        $rootScope.$broadcast('$stateChangeStart', state);
        $scope.$apply();

        $modal.open.should.have.been.called;

        setTimeout(function() {
          $scope.listObject.operations.cancel.should.have.been.called;

          $state.go.should.have.been.calledWith({name:'newState'}, undefined);

          $modal.open.should.have.been.calledOnce;

          $rootScope.$broadcast('$stateChangeStart', state);
          $scope.$apply();

          $modal.open.should.have.been.calledOnce;

          setTimeout(function() {
            $scope.listObject.operations.cancel.should.have.been.calledOnce;

            $state.go.should.have.been.calledOnce;

            $modal.open.should.have.been.calledOnce;

            done();
          }, 10);
        }, 10);
      });

      it('should proceed with the operation if the users cancels',function(done){
        $modal.open.returns({result: Q.reject()});
        var state = {name:'newState'};
        $scope.listObject.operations.activeOperation = 'Operation';

        $rootScope.$broadcast('$stateChangeStart', state);
        $scope.$apply();

        $modal.open.should.have.been.called;

        setTimeout(function() {
          $scope.listObject.operations.cancel.should.not.have.been.called;

          $state.go.should.not.have.been.called;

          $modal.open.should.have.been.calledOnce;

          done();
        }, 10);
      });

    });

    describe('onbeforeunload:', function() {
      it('should notify unsaved changes when closing window',function(){
        $scope.listObject.operations.activeOperation = 'Operation';
        $scope.$apply();

        var result = $window.onbeforeunload();
        expect(result).to.equal('Cancel bulk action?');
      });

      it('should not notify unsaved changes when closing window if there are no changes',function(){    
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
