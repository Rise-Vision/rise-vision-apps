'use strict';
describe('controller: schedules list', function() {
  beforeEach(module('risevision.schedules.controllers'));
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('userState',userState);
    $provide.service('schedule',function(){
      return {
        list : function(search, cursor){
          apiCount++;
          var deferred = Q.defer();
          if(returnSchedules){
            deferred.resolve(result);
          }else{
            deferred.reject('ERROR; could not retrieve list');
          }
          return deferred.promise;
        }
      }
    });
    $provide.service('$location',function(){
      return {
        _path : '',
        path : function(path){
          if (path){
            this._path = path;
          }
          return this._path;
        },
        search: function() {
          return {};
        },
        url: function() {
          return {};
        }
      }
    });

    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });
    
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
  }));
  var $scope, userState, $location, returnSchedules, companyId, apiCount, scrollEvent, result, $loading,$loadingStartSpy, $loadingStopSpy;
  beforeEach(function(){
    scrollEvent = {target: {scrollHeight: 0, clientHeight: 0, scrollTop: 0}};
    result = {
      items: [],
      cursor: 'asdf'
    };

    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }

    apiCount = 0;
    companyId = 'some_company_id';
    returnSchedules = true;
    userState = function(){
      return {
        getSelectedCompanyId : function(){
          return companyId;
        },
        _restoreState : function(){

        },
        isSubcompanySelected : function(){
          return true;
        }
      }
    };
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $location = $injector.get('$location');
      $controller('schedulesList', {
        $scope : $scope,
        userState : $injector.get('userState'),
        schedule:$injector.get('schedule'),
        $location : $location,
        $log : $injector.get('$log'),
        $loading: $loading});
      $scope.$digest();  
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.sortBy).to.be.a('function');
    expect($scope.doSearch).to.be.a('function');
    expect($scope.load).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect($scope.schedules).to.be.truely;
    expect($scope.schedules).to.have.property('list');
    expect($scope.schedules).to.have.property('add');
    expect($scope.schedules).to.have.property('clear');
    expect($scope.schedules).to.have.property('endOfList');
    
    expect($scope.search).to.be.truely;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search.count).to.equal(5);
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingSchedules).to.be.false;
      expect(apiCount).to.equal(1);
      expect($scope.error).to.not.be.ok;
      
      done();
    },10);
  });
  
  it('should load the list',function(){
    expect($scope.loadingSchedules).to.be.false;
    expect($scope.schedules).to.be.truely;
    expect($scope.schedules.list).to.have.length(40);
    expect($scope.schedules.cursor).to.be.truely;
    expect($scope.schedules.endOfList).to.be.false;

  });
  
  describe('list functions: ',function(){
    returnSchedules = true;
    
    describe('load: ',function(){
      it('should re-load if there are more items',function(done){
        result = {
          items: [21],
        };
        $scope.load();
        $scope.$digest();
        
        expect($scope.loadingSchedules).to.be.true;
        $loadingStartSpy.should.have.been.calledWith('schedules-list-loader');
        setTimeout(function(){
          expect($scope.loadingSchedules).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.schedules.list).to.have.length(41);
          expect($scope.schedules.cursor).to.not.be.truely;
          expect($scope.schedules.endOfList).to.be.true;
          $scope.$digest();
          $loadingStopSpy.should.have.been.calledWith('schedules-list-loader');
          done();
        },10);
      });
      
      it('should not re-load if there are no more items',function(done){
        result = {
          items: [41],
        };
        $scope.load();
        $scope.$digest();
        
        expect($scope.loadingSchedules).to.be.true;
        setTimeout(function(){
          $scope.load();
          
          expect($scope.loadingSchedules).to.be.false;
                    
          done();
        },10);
      });
    });
    
    describe('sortBy: ',function(){
      it('should reset list and reverse sort by changeDate',function(done){
        $scope.sortBy('name');
        $scope.$digest();
        
        expect($scope.loadingSchedules).to.be.true;
        setTimeout(function(){
          expect($scope.loadingSchedules).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.schedules.list).to.have.length(40);

          expect($scope.search.sortBy).to.equal('name');
          expect($scope.search.reverse).to.be.true;
          
          done();
        },10);
      
      });
      
      it('should reset list and sort by name',function(done){
        $scope.sortBy('name');
        $scope.$digest();
        
        expect($scope.loadingSchedules).to.be.true;
        setTimeout(function(){
          expect($scope.loadingSchedules).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.schedules.list).to.have.length(40);
          
          expect($scope.search.sortBy).to.equal('name');
          expect($scope.search.reverse).to.be.true;
          
          done();
        },10);
      });
    });
    
    it('should reset list and doSearch',function(done){
      $scope.doSearch();
      $scope.$digest();
      
      expect($scope.loadingSchedules).to.be.true;
      setTimeout(function(){
        expect($scope.loadingSchedules).to.be.false;
        expect($scope.error).to.not.be.ok;
        expect(apiCount).to.equal(2);
        
        expect($scope.schedules.list).to.have.length(40);
        
        expect($scope.search.sortBy).to.equal('changeDate');
        expect($scope.search.reverse).to.be.true;
        
        done();
      },10);
    });
    
    it('should set error if list fails to load',function(done){
      returnSchedules = false;
      $scope.doSearch();
      $scope.$digest();
      
      expect($scope.loadingSchedules).to.be.true;
      setTimeout(function(){
        expect($scope.loadingSchedules).to.be.false;
        expect($scope.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect($scope.schedules.list).to.have.length(0);
        
        done();
      },10);
    });
  });

});
