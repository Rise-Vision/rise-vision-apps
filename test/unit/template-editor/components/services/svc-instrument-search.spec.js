'use strict';

describe('service: instrumentSearchService:', function() {
  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function () {
      return Q;
    });
  }));

  var instrumentSearchService, INSTRUMENT_SEARCH_BASE_URL, $httpBackend;

  beforeEach(function () {
    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      INSTRUMENT_SEARCH_BASE_URL = $injector.get('INSTRUMENT_SEARCH_BASE_URL');
      instrumentSearchService = $injector.get('instrumentSearchService');
    });
  });

  it('should initialize', function () {
    expect(instrumentSearchService).to.be.truely;

    expect(instrumentSearchService.keywordSearch).to.be.a('function');
    expect(instrumentSearchService.popularSearch).to.be.a('function');
  });

  describe( 'popularSearch', function() {
    it("should return most popular instruments by category", function( done ) {
      var stocks = {
        items: [
          {
            symbol: "AAPL.O",
            name: "APPLE INC.",
            category: "STOCKS",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AAPL.svg"
          },
          {
            symbol: "AMZN.O",
            name: "AMAZON.COM",
            category: "STOCKS",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AMZN.svg"
          },
          {
            symbol: "AZO.N",
            name: "AUTOZONE INC",
            category: "STOCKS",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AZO.svg"
          }
        ]
      };

      $httpBackend.when('GET', INSTRUMENT_SEARCH_BASE_URL + "instruments/common?category=stocks").respond(200, stocks);

      setTimeout(function() {
        $httpBackend.flush();
      });

      instrumentSearchService.popularSearch("stocks")
        .then(function (results) {
          expect(results).to.deep.equal(stocks.items);

          done();
        })
        .catch(function(err) {
          console.log("shouldn't be here", err);
        });
    });

    it("should filter out results with no symbols", function() {
      var returnedStocks = {
        items: [
          {
            symbol: "AAPL.O",
            name: "APPLE INC.",
            category: "STOCKS",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AAPL.svg"
          },
          {
            name: "AMAZON.COM",
            category: "STOCKS",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AMZN.svg"
          },
          {
            name: "AUTOZONE INC",
            category: "STOCKS",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AZO.svg"
          }
        ]
      };

      $httpBackend.when('GET', INSTRUMENT_SEARCH_BASE_URL + "instruments/common?category=stocks").respond(200, returnedStocks);

      setTimeout(function() {
        $httpBackend.flush();
      });

      return instrumentSearchService.popularSearch("stocks")
        .then(function (results) {
          expect(results).to.deep.equal([
            {
              symbol: "AAPL.O",
              name: "APPLE INC.",
              category: "STOCKS",
              logo: "https://risecontentlogos.s3.amazonaws.com/financial/AAPL.svg"
            }
          ]);
        });
    });

  });

  describe( 'keywordSearch', function() {
    var instruments = {
      items: [
        {
          symbol: "AMZN.O",
          name: "Amazon.com Inc",
          category: "Stocks",
          logo: "https://risecontentlogos.s3.amazonaws.com/financial/AMZN.svg"
        },
        {
          symbol: "0#AMZF:",
          name: "Eurex Amazon Equity Future Chain Contract",
          category: "Stocks"
        },
        {
          symbol: "0#AMZNDFW:OX",
          name: "One Chicago LLC Amazon Com No Dividend Friday Weekly Equity Future Chain Contracts",
          category: "Stocks"
        }
      ]
    };

    it("should return list of instruments by category and keyword", function(done) {
      $httpBackend.when('GET', INSTRUMENT_SEARCH_BASE_URL + "instrument/search?category=Stocks&query=Amazon").respond(200, instruments);
      setTimeout(function() {
        $httpBackend.flush();
      });

      instrumentSearchService.keywordSearch("stocks", "Amazon")
        .then(function (results) {
          expect(results).to.deep.equal(instruments.items);

          done();
        })
        .catch(function(err) {
          console.log("shouldn't be here", err);
        });
    });

    it("should return list of instruments by category and keyword", function(done) {
      $httpBackend.when('GET', INSTRUMENT_SEARCH_BASE_URL +
        "instrument/search?category=World%20Indexes&query=Amazon")
      .respond(200, instruments);

      setTimeout(function() {
        $httpBackend.flush();
      });

      instrumentSearchService.keywordSearch("world indexes", "Amazon")
        .then(function (results) {
          expect(results).to.deep.equal(instruments.items);

          done();
        })
        .catch(function(err) {
          console.log("shouldn't be here", err);
        });
    });

    it("should filter out results with no symbols", function() {
      var returnedInstruments = {
        items: [
          {
            name: "Amazon.com Inc",
            category: "Stocks",
            logo: "https://risecontentlogos.s3.amazonaws.com/financial/AMZN.svg"
          },
          {
            symbol: "0#AMZF:",
            name: "Eurex Amazon Equity Future Chain Contract",
            category: "Stocks"
          },
          {
            symbol: "0#AMZNDFW:OX",
            name: "One Chicago LLC Amazon Com No Dividend Friday Weekly Equity Future Chain Contracts",
            category: "Stocks"
          }
        ]
      };

      $httpBackend.when('GET', INSTRUMENT_SEARCH_BASE_URL + "instrument/search?category=Stocks&query=Amazon").respond(200, returnedInstruments);
      setTimeout(function() {
        $httpBackend.flush();
      });

      return instrumentSearchService.keywordSearch("stocks", "Amazon")
        .then(function (results) {
          expect(results).to.deep.equal([
            {
              symbol: "0#AMZF:",
              name: "Eurex Amazon Equity Future Chain Contract",
              category: "Stocks"
            },
            {
              symbol: "0#AMZNDFW:OX",
              name: "One Chicago LLC Amazon Com No Dividend Friday Weekly Equity Future Chain Contracts",
              category: "Stocks"
            }
          ]);
        });
    });

  });

});
