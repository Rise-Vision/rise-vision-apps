'use strict';

describe('directive: TemplateComponentFinancial', function() {
  var $scope,
      element,
      factory,
      timeout;

  var popularResults = [
    {
      "symbol": "CADUSD=X",
      "name": "CANADIAN DOLLAR",
      "category": "currencies",
      "logo": "https://risecontentlogos.s3.amazonaws.com/financial/CAD-USD.svg"
    },
    {
      "symbol": "CHFUSD=X",
      "name": "SWISS FRANC",
      "category": "currencies",
      "logo": "https://risecontentlogos.s3.amazonaws.com/financial/CHF-USD.svg"
    },
    {
      "symbol": "HKDUSD=X",
      "name": "HONG KONG DOLLAR",
      "category": "currencies",
      "logo": "https://risecontentlogos.s3.amazonaws.com/financial/HKD-USD.svg"
    }
  ],
    keywordResults = [
      {
        "symbol": "SXFc1",
        "name": "Montreal Exchange S&P/TSX 60 Index Future Continuation 1",
        "category": "Stocks"
      },
      {
        "symbol": "FCSc1",
        "name": "Montreal Exchange S&P/TSX CompositeTM Mini Index Future Continuation 1",
        "category": "Stocks"
      },
      {
        "symbol": "LLY",
        "name": "Eli Lilly and Co",
        "category": "Stocks"
      }
    ],
    noResults = false;

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });

    $provide.service('instrumentSearchService', function($q) {
      return {
        popularSearch: function() {
          return $q.when(popularResults);
        },
        keywordSearch: function() {
          return noResults ? $q.when({}) : $q.when(keywordResults)
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout){
    $templateCache.put('partials/template-editor/components/component-financial.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();

    timeout = $timeout;
    element = $compile("<template-component-financial></template-component-financial>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } })
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-data-financial');
    expect(directive.icon).to.equal('financial');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  it('should reset all state flags on enter', function() {
    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringInstrumentSelector).to.be.false;
    expect($scope.exitingInstrumentSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.false;
  });

  it('should define navigation functions', function() {
    expect($scope.showSymbolSearch).to.be.a('function');
    expect($scope.selectInstruments).to.be.a('function');
  });

  it('should show symbol search', function() {
    $scope.showSymbolSearch();

    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.true;
    expect($scope.exitingSymbolSelector).to.be.false;

    timeout.flush();

    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.true;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.false;
  });

  it('should go back to instrument list', function() {
    $scope.showSymbolSearch();
    timeout.flush();

    $scope.selectInstruments();

    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.true;

    timeout.flush();

    expect($scope.showInstrumentList).to.be.true;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.false;
  });

  it('should set instrument lists when available as attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleInstruments = [
      { name: "CANADIAN DOLLAR", symbol: "CADUSD=X" }
    ];

    $scope.getAttributeData = function() {
      return sampleInstruments;
    }
    $scope.getBlueprintData = function () {
      return "currencies";
    }

    directive.show();

    expect($scope.category).to.equal("currencies");
    expect($scope.instruments).to.deep.equal(sampleInstruments);

    timeout.flush();
  });

  it('should download instruments when not available as attribute data', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function() {
      return null;
    }
    $scope.getBlueprintData = function() {
      return "SXFc1";
    }

    directive.show();
    timeout.flush();

    setTimeout(function() {
      var expectedInstruments = [
        {
          "symbol": "SXFc1",
          "name": "Montreal Exchange S&P/TSX 60 Index Future Continuation 1",
          "category": "Stocks"
        }
      ];

      expect($scope.instruments).to.deep.equal(expectedInstruments);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        "TEST-ID", "instruments", expectedInstruments
      )).to.be.true;

      expect($scope.setAttributeData.calledWith(
        "TEST-ID", "symbols", "SXFc1"
      )).to.be.true;

      done();
    }, 100);
  });

  it('should not set instruments when they are not available in the search', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function () {
      return null;
    }
    $scope.getBlueprintData = function () {
      return "invalid_symbol";
    }

    directive.show();
    timeout.flush();

    setTimeout(function () {
      expect($scope.instruments).to.deep.equal([]);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        "TEST-ID", "instruments", []
      )).to.be.true;

      expect($scope.setAttributeData.calledWith(
        "TEST-ID", "symbols", ""
      )).to.be.true;

      done();
    }, 100);
  });

  it('should remove an instrument by symbol', function() {
    $scope.instruments = keywordResults;

    // normally set up by start() function
    $scope.componentId = "TEST-ID";

    $scope.removeInstrument('LLY');

    var expectedInstruments = [
      {
        "symbol": "SXFc1",
        "name": "Montreal Exchange S&P/TSX 60 Index Future Continuation 1",
        "category": "Stocks"
      },
      {
        "symbol": "FCSc1",
        "name": "Montreal Exchange S&P/TSX CompositeTM Mini Index Future Continuation 1",
        "category": "Stocks"
      }
    ];

    expect($scope.instruments).to.deep.equal(expectedInstruments);

    expect($scope.setAttributeData).to.have.been.called.twice;

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "instruments", expectedInstruments
    )).to.be.true;

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "symbols", "SXFc1|FCSc1"
    )).to.be.true;
  });

  it('should reset instrument selector list to show popular instruments when showing instrument list', function() {
    $scope.selectInstruments();
    timeout.flush();
    $scope.$digest();

    expect($scope.instrumentSearch).to.deep.equal(popularResults);
  });

  it('should populate instrument selector list with search results when search returns results', function() {
    $scope.showSymbolSearch();
    timeout.flush();

    $scope.searchKeyword = "test";
    $scope.searchInstruments();

    $scope.$digest();
    expect($scope.instrumentSearch).to.deep.equal(keywordResults);
  });

  it('should allow for UI to handle empty results from search', function() {
    $scope.showSymbolSearch();
    timeout.flush();

    noResults = true;
    $scope.searchKeyword = "test";
    $scope.searchInstruments();

    $scope.$digest();
    expect($scope.instrumentSearch).to.deep.equal({});
    noResults = false;
  });

  it('should reset instrument selector list to show popular instruments when search input cleared', function() {
    $scope.showSymbolSearch();
    timeout.flush();
    $scope.$digest();

    $scope.searchKeyword = "test";
    $scope.searchInstruments();
    $scope.$digest();

    expect($scope.instrumentSearch).to.deep.equal(keywordResults);

    $scope.resetSearch();
    $scope.$digest();

    expect($scope.searchKeyword).to.equal("");
    expect($scope.instrumentSearch).to.deep.equal(popularResults);
  });

  it("should disable adding instruments until at least one instrument is selected", function() {
    $scope.selectInstruments();
    timeout.flush();
    $scope.$digest();
    $scope.showSymbolSearch();

    expect($scope.canAddInstrument).to.be.false;

    $scope.selectInstrument(1);

    expect($scope.canAddInstrument).to.be.true;

    $scope.selectInstrument(1);

    expect($scope.canAddInstrument).to.be.false;
  });

  it('should add selected instruments to instruments list and prioritize them to top of list', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var instruments = [
      {
        "symbol": "CADUSD=X",
        "name": "CANADIAN DOLLAR",
        "category": "currencies",
        "logo": "https://risecontentlogos.s3.amazonaws.com/financial/CAD-USD.svg"
      }
    ];

    $scope.getAttributeData = function() {
      return instruments;
    };
    $scope.getBlueprintData = function () {
      return "currencies";
    }

    directive.show();

    expect($scope.instruments).to.deep.equal(instruments);

    timeout.flush();

    $scope.showSymbolSearch();
    timeout.flush();
    $scope.$digest();

    $scope.selectInstrument(1);
    $scope.selectInstrument(2);

    $scope.addInstrument();

    expect($scope.instruments).to.deep.equal([
      {
        "symbol": "CHFUSD=X",
        "name": "SWISS FRANC",
        "category": "currencies",
        "logo": "https://risecontentlogos.s3.amazonaws.com/financial/CHF-USD.svg"
      },
      {
        "symbol": "HKDUSD=X",
        "name": "HONG KONG DOLLAR",
        "category": "currencies",
        "logo": "https://risecontentlogos.s3.amazonaws.com/financial/HKD-USD.svg"
      },
      {
        "symbol": "CADUSD=X",
        "name": "CANADIAN DOLLAR",
        "category": "currencies",
        "logo": "https://risecontentlogos.s3.amazonaws.com/financial/CAD-USD.svg"
      }
    ]);
  });

  it('should not add duplicate instruments', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var instruments = [
      {
        "symbol": "CADUSD=X",
        "name": "CANADIAN DOLLAR",
        "category": "currencies",
        "logo": "https://risecontentlogos.s3.amazonaws.com/financial/CAD-USD.svg"
      },
      {
        "symbol": "HKDUSD=X",
        "name": "HONG KONG DOLLAR",
        "category": "currencies",
        "logo": "https://risecontentlogos.s3.amazonaws.com/financial/HKD-USD.svg"
      }
    ];

    $scope.getAttributeData = function() {
      return instruments;
    };
    $scope.getBlueprintData = function () {
      return "currencies";
    }

    directive.show();

    expect($scope.instruments).to.deep.equal(instruments);

    timeout.flush();

    $scope.showSymbolSearch();
    timeout.flush();
    $scope.$digest();

    $scope.selectInstrument(2);
    $scope.addInstrument();

    expect($scope.instruments).to.deep.equal(instruments);
  });

  it('should get the open symbol button label', function() {
    $scope.category = 'currencies';

    var label = $scope.getOpenSymbolSelectorButtonLabel();

    expect(label).to.equal('template.financial.add-category.currencies');
  });

  it('should get the open symbol button label on categories with space', function() {
    $scope.category = 'world indexes';

    var label = $scope.getOpenSymbolSelectorButtonLabel();

    expect(label).to.equal('template.financial.add-category.world-indexes');
  });


  it('should get the empty list suggestion text', function() {
    $scope.category = 'currencies';

    var label = $scope.getEmptyListSuggestionText();

    expect(label).to.equal('template.financial.empty-list.suggestion.currencies');
  });

  it('should get the empty list suggestion text on categories with space', function() {
    $scope.category = 'world indexes';

    var label = $scope.getEmptyListSuggestionText();

    expect(label).to.equal('template.financial.empty-list.suggestion.world-indexes');
  });



});
