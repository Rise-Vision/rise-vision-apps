'use strict';
describe('directive: weekly-templates', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      selectedCompany,
      sessionStorage,
      presentationUtils,
      editorFactory,
      templateEditorFactory;
  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('productsFactory', function() {
      return {
      };
    }); 
    $provide.service('ScrollingListService', function() {
      return function() {
        return {
          search: {},
          loadingItems: false,
          doSearch: sinon.stub()
        };
      };
    });
    $provide.service('presentationUtils', function() {
      return presentationUtils
    }); 
    $provide.service('editorFactory', function() {
      return editorFactory;
    });  
    $provide.service('templateEditorFactory', function() {
      return templateEditorFactory;
    });   
    $provide.service('userState', function() {
      return {
        getCopyOfSelectedCompany: function() {
          return selectedCompany;
        }
      };
    });
    $provide.service('$sessionStorage', function() {
      return sessionStorage
    });   
    
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    selectedCompany = {companyIndustry: "PRIMARY_SECONDARY_EDUCATION"};
    sessionStorage = {
        $default: sinon.stub(),
        weeklyTemplatesFullView: true
    };
    presentationUtils = {isHtmlTemplate: sinon.stub()};
    editorFactory = {copyTemplate: sinon.stub()};
    templateEditorFactory = {createFromTemplate: sinon.stub()};

    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $templateCache.put('partials/launcher/weekly-templates.html', '<p>mock</p>');
  }));

  function compileDirective() {
    element = $compile('<weekly-templates></weekly-templates>')($scope);
    $scope.$digest();
  }

  describe('weekly-templates:', function () {
    beforeEach(function(){
      compileDirective();
    });

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<weekly-templates class="ng-scope"><p>mock</p></weekly-templates>');
    });

    it('should initialize scope', function() {
      expect($scope.fullView).to.be.true;
      expect($scope.search).to.deep.equal({
          query: 'templateOfTheWeek:1',
          category: 'Templates',
          count: 4
        }
      );
      expect($scope.factory).to.be.a.function;
      expect($scope.toggleView).to.be.a.function;
      expect($scope.select).to.be.a.function;
    });

    it('should use session storage value for fullView',function() {
      expect($scope.fullView).to.be.true;
      sessionStorage.weeklyTemplatesFullView = false;
      compileDirective();
      expect($scope.fullView).to.be.false;
    })

    it('should load Templates if Education',function() {
      expect($scope.factory).to.be.a.function;
      selectedCompany.companyIndustry =  "HIGHER_EDUCATION";
      compileDirective();
      expect($scope.factory).to.be.a.function;
    });

    it('should not load Templates if not Education',function() {
      selectedCompany.companyIndustry =  "OTHER";
      compileDirective();
      expect($scope.factory).to.not.be.a.function;
      selectedCompany.companyIndustry =  "AUTOMOTIVE";
      compileDirective();
      expect($scope.factory).to.not.be.a.function;
    });

  });

  describe('weekly-templates: toggleView()', function () {
    beforeEach(function(){
      compileDirective();
    });    

    it('should toggle fullView',function(){
      expect($scope.fullView).to.be.true;
      $scope.toggleView();
      expect($scope.fullView).to.be.false;
      $scope.toggleView();
      expect($scope.fullView).to.be.true;
    });

    it('should save state in session', function () {
      expect(sessionStorage.weeklyTemplatesFullView).to.be.true;
      $scope.toggleView();
      expect(sessionStorage.weeklyTemplatesFullView).to.be.false;
      $scope.toggleView();
      expect(sessionStorage.weeklyTemplatesFullView).to.be.true;
    });
  });

  describe('weekly-templates: select()',function(){
    beforeEach(function(){
      compileDirective();
    });  

    it('should open regular Editor if template is a regular Presentaion',function(){
      var product = {}
      presentationUtils.isHtmlTemplate.returns(false);
      $scope.select(product);
      editorFactory.copyTemplate.should.have.been.calledWith(product);
      templateEditorFactory.createFromTemplate.should.not.have.been.called;
    })

    it('should open template Editor if template is a HTML Presentaion',function(){
      var product = {}
      presentationUtils.isHtmlTemplate.returns(true);
      $scope.select(product);
      editorFactory.copyTemplate.should.not.have.been.called;
      templateEditorFactory.createFromTemplate.should.have.been.calledWith(product);
    })
  });

});
