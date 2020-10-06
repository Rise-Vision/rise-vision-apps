'use strict';
describe('directive: batch-operations', function() {
  var $compile,
      $rootScope,
      $scope,
      element;
  var $modal, $state, userState;
  beforeEach(module('risevision.apps.directives'));
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

});
