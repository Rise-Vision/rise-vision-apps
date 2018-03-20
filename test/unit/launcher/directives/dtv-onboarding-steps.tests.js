'use strict';
describe('directive: onboarding steps', function() {
  var element, $rootScope, $scope, launcherFactory, launcherFactoryDeferred;

  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('launcherFactory', function() {
      return launcherFactory = {
        load: sinon.spy(function() {
          launcherFactoryDeferred = Q.defer();

          return launcherFactoryDeferred.promise;
        }),
        presentations: {
          list: []
        },
        displays: {
          list: []
        }
      };
    });

    $provide.service('editorFactory', function() {
      return {};
    });
    $provide.service('displayFactory', function() {
      return {};
    });
    $provide.service('$state', function() {
      return { current: { name: 'home' } };
    });
  }));
  beforeEach(inject(function($compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;
    $templateCache.put('partials/launcher/onboarding-steps.html', '<p>mock</p>');

    element = $compile("<onboarding-steps></onboarding-steps>")($rootScope.$new());
    $rootScope.$digest();
    
    $scope = element.scope();
  }));

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<onboarding-steps class="ng-scope"><p>mock</p></onboarding-steps>');
  });
  
  it('should initialize scope', function() {
    expect($scope.launcherFactory).to.be.ok;
    expect($scope.editorFactory).to.be.ok;
    expect($scope.displayFactory).to.be.ok;
    expect($rootScope.showOnboarding).to.be.false;
  });
  
  describe('on selectedCompanyChanged: ', function() {
    it('should add selectedCompanyChanged listener', function() {
      expect($scope.$$listeners['risevision.company.selectedCompanyChanged'][0]).to.be.a('function');
    });

    it('should reset showOnboarding, add a displays listener and load the launcherFactory', function() {
      $rootScope.showOnboarding = true;

      $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
      $scope.$digest();
      
      expect($rootScope.showOnboarding).to.be.false;
      
      expect($scope.$$listeners['displaysLoaded'][0]).to.be.a('function');
      
      launcherFactory.load.should.have.been.called;
    });

    describe('_checkPresentationCreated: ', function() {
      beforeEach(function() {
        $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
        $scope.$digest();
      });

      it('should set addPresentationCompleted to false and add event listener', function(done) {
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          expect($scope.addPresentationCompleted).to.not.be.true;
          expect($scope.$$listeners['presentationCreated']).to.be.ok;

          expect($scope.stepCount).to.equal(3);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });

      it('should set addPresentationCompleted to true if a presentation exists', function(done) {
        launcherFactory.presentations.list = [{id: 123}];
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          expect($scope.addPresentationCompleted).to.be.true;
          expect($scope.$$listeners['presentationCreated']).to.not.be.ok;

          expect($scope.stepCount).to.equal(2);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });
      
      it('should set addPresentationCompleted to true if a presentation is created', function(done) {
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          $rootScope.$broadcast('presentationCreated');

          $scope.$digest();

          expect($scope.addPresentationCompleted).to.be.true;
          
          // Check that handler is destroyed
          expect($scope.$$listeners['presentationCreated'][0]).to.not.be.ok;

          expect($scope.stepCount).to.equal(2);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });
    });
    
    describe('_checkDisplayCreated: ', function() {
      beforeEach(function() {
        $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
        $scope.$digest();
        
        launcherFactory.presentations.list = [{id: 123}];
      });

      it('should set addDisplayCompleted to false and add event listener', function(done) {
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          expect($scope.addDisplayCompleted).to.not.be.true;
          expect($scope.$$listeners['displayCreated'][0]).to.be.a('function');

          expect($scope.stepCount).to.equal(2);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });

      it('should set addDisplayCompleted to true if a display exists', function(done) {
        launcherFactory.displays.list = [{id: 123}];
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          expect($scope.addDisplayCompleted).to.be.true;
          expect($scope.$$listeners['displayCreated']).to.not.be.ok;

          expect($scope.stepCount).to.equal(1);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });
      
      it('should set activateDisplayCompleted to true if a player is installed', function(done) {
        launcherFactory.displays.list = [{id: 123, playerVersion: 'v1'}];
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          expect($scope.addDisplayCompleted).to.be.true;
          expect($scope.activateDisplayCompleted).to.be.true;
          expect($scope.$$listeners['displayCreated']).to.not.be.ok;
          expect($scope.$$listeners['displaysLoaded'][0]).to.be.null;

          expect($scope.stepCount).to.equal(0);
          expect($rootScope.showOnboarding).to.be.false;

          done();
        }, 10);
      });

      it('should set addDisplayCompleted to true if a display is created', function(done) {
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          launcherFactory.displays.list = [{id: 123}];
          $rootScope.$broadcast('displayCreated', {id: 345});

          $scope.$digest();

          expect($scope.addDisplayCompleted).to.be.true;
          
          // Check that handler is destroyed
          expect($scope.$$listeners['displayCreated'][0]).to.not.be.ok;
          expect(launcherFactory.displays.list[0]).to.deep.equal({id: 123});

          expect($scope.stepCount).to.equal(1);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });
      
      it('should push new Display to the list if empty', function(done) {
        launcherFactoryDeferred.resolve();
        
        setTimeout(function() {
          $rootScope.$broadcast('displayCreated', {id: 345});

          $scope.$digest();

          expect($scope.addDisplayCompleted).to.be.true;
          
          // Check that handler is destroyed
          expect($scope.$$listeners['displayCreated'][0]).to.not.be.ok;
          expect(launcherFactory.displays.list[0]).to.deep.equal({id: 345});

          expect($scope.stepCount).to.equal(1);
          expect($rootScope.showOnboarding).to.be.true;

          done();
        }, 10);
      });
    });
    
    describe('_checkDisplaysLoaded', function() {
      beforeEach(function(done) {
        $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
        $scope.$digest();
        
        launcherFactory.presentations.list = [{id: 123}];
        launcherFactory.displays.list = [{id: 123}];

        launcherFactoryDeferred.resolve();
        setTimeout(done, 10);
      });

      it('should not do anything if no Displays are provided', function() {
        $rootScope.$broadcast('displaysLoaded', []);
        
        $scope.$digest();

        expect($scope.addDisplayCompleted).to.be.true;
        expect($scope.activateDisplayCompleted).to.not.be.true;
        expect($scope.$$listeners['displaysLoaded'][0]).to.be.a('function');

        expect($scope.stepCount).to.equal(1);
        expect($rootScope.showOnboarding).to.be.true;
      });
      
      it('should not do anything if Displays are not online', function() {
        $rootScope.$broadcast('displaysLoaded', [{id: 345}]);
        
        $scope.$digest();

        expect($scope.addDisplayCompleted).to.be.true;
        expect($scope.activateDisplayCompleted).to.not.be.true;
        expect($scope.$$listeners['displaysLoaded'][0]).to.be.a('function');

        expect($scope.stepCount).to.equal(1);
        expect($rootScope.showOnboarding).to.be.true;
      });
      
      it('should complete onboarding and remove handler', function() {
        $rootScope.$broadcast('displaysLoaded', [{id: 345, playerVersion: '123'}]);

        $scope.$digest();

        expect($scope.addDisplayCompleted).to.be.true;
        expect($scope.activateDisplayCompleted).to.be.true;
        expect($scope.$$listeners['displaysLoaded'][0]).to.not.be.ok;

        expect($scope.stepCount).to.equal(0);
        expect($rootScope.showOnboarding).to.be.false;
      });

      it('should also look at lastConnectionTime', function() {
        $rootScope.$broadcast('displaysLoaded', [{id: 345, lastConnectionTime: new Date()}]);

        $scope.$digest();

        expect($scope.addDisplayCompleted).to.be.true;
        expect($scope.activateDisplayCompleted).to.be.true;
        expect($scope.$$listeners['displaysLoaded'][0]).to.not.be.ok;

        expect($scope.stepCount).to.equal(0);
        expect($rootScope.showOnboarding).to.be.false;
      });
    });
    
    it('should restart onboarding a second time if a new company is selected', function(done) {
      $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
      $scope.$digest();

      launcherFactory.presentations.list = [{id: 123}];
      launcherFactory.displays.list = [{id: 123, playerVersion: 'v1'}];
      launcherFactoryDeferred.resolve();

      setTimeout(function() {
        expect($scope.addPresentationCompleted).to.be.true;
        expect($scope.addDisplayCompleted).to.be.true;
        expect($scope.activateDisplayCompleted).to.be.true;

        expect($rootScope.showOnboarding).to.be.false;

        $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
        $scope.$digest();

        launcherFactory.presentations.list = [];
        launcherFactory.displays.list = [];
        launcherFactoryDeferred.resolve();

        setTimeout(function() {
          expect($scope.addPresentationCompleted).to.be.false;
          expect($scope.addDisplayCompleted).to.be.false;
          expect($scope.activateDisplayCompleted).to.be.false;

          expect($rootScope.showOnboarding).to.be.true;

          expect($scope.$$listeners['presentationCreated'][0]).to.be.a('function');
          expect($scope.$$listeners['displayCreated'][0]).to.be.a('function');
          expect($scope.$$listeners['displaysLoaded'][0]).to.be.null;
          expect($scope.$$listeners['displaysLoaded'][1]).to.be.a('function');

          done();
        }, 10)
      }, 10);
    });

    it('should always clear old handlers', function(done) {
      $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
      $scope.$digest();

      launcherFactoryDeferred.resolve();

      setTimeout(function() {
        expect($scope.addPresentationCompleted).to.be.false;
        expect($scope.addDisplayCompleted).to.be.false;
        expect($scope.activateDisplayCompleted).to.be.false;

        expect($rootScope.showOnboarding).to.be.true;
        
        $rootScope.$broadcast('risevision.company.selectedCompanyChanged');
        $scope.$digest();

        launcherFactoryDeferred.resolve();

        setTimeout(function() {
          expect($scope.addPresentationCompleted).to.be.false;
          expect($scope.addDisplayCompleted).to.be.false;
          expect($scope.activateDisplayCompleted).to.be.false;

          expect($rootScope.showOnboarding).to.be.true;

          expect($scope.$$listeners['presentationCreated'][0]).to.be.null;
          expect($scope.$$listeners['presentationCreated'][1]).to.be.a('function');
          expect($scope.$$listeners['displayCreated'][0]).to.be.null;
          expect($scope.$$listeners['displayCreated'][1]).to.be.a('function');
          expect($scope.$$listeners['displaysLoaded'][0]).to.be.null;
          expect($scope.$$listeners['displaysLoaded'][1]).to.be.a('function');

          done();
        }, 10)
      }, 10);
    });
  });

  describe('currentStep: ', function() {
    it('should select addPresentation: ', function() {
      $scope.addPresentationCompleted = false;
      $scope.addDisplayCompleted = false;
      $scope.activateDisplayCompleted = false;
      
      expect($scope.currentStep('addPresentation')).to.be.true;
      expect($scope.currentStep('addDisplay')).to.be.false;
      expect($scope.currentStep('activateDisplay')).to.be.false;      

      $scope.addDisplayCompleted = true;
      $scope.activateDisplayCompleted = true;

      expect($scope.currentStep('addPresentation')).to.be.true;
      expect($scope.currentStep('addDisplay')).to.be.false;
      expect($scope.currentStep('activateDisplay')).to.be.false;      
    });
    
    it('should select addDisplay: ', function() {
      $scope.addPresentationCompleted = true;
      $scope.addDisplayCompleted = false;
      $scope.activateDisplayCompleted = false;
      
      expect($scope.currentStep('addPresentation')).to.be.false;
      expect($scope.currentStep('addDisplay')).to.be.true;
      expect($scope.currentStep('activateDisplay')).to.be.false;      

      $scope.activateDisplayCompleted = true;

      expect($scope.currentStep('addPresentation')).to.be.false;
      expect($scope.currentStep('addDisplay')).to.be.true;
      expect($scope.currentStep('activateDisplay')).to.be.false;      
    });
    
    it('should select activateDisplay: ', function() {
      $scope.addPresentationCompleted = true;
      $scope.addDisplayCompleted = true;
      $scope.activateDisplayCompleted = false;
      
      expect($scope.currentStep('addPresentation')).to.be.false;
      expect($scope.currentStep('addDisplay')).to.be.false;
      expect($scope.currentStep('activateDisplay')).to.be.true;      

      $scope.activateDisplayCompleted = true;

      expect($scope.currentStep('addPresentation')).to.be.false;
      expect($scope.currentStep('addDisplay')).to.be.false;
      expect($scope.currentStep('activateDisplay')).to.be.false;      
    });
  });

  describe('on logout: ', function() {
    it('should reset showOnboarding', function() {
      $rootScope.showOnboarding = true;

      $rootScope.$broadcast('$stateChangeStart', { name: 'common.auth.logout' });
      $scope.$digest();

      expect($rootScope.showOnboarding).to.be.false;
    });
  });
});
