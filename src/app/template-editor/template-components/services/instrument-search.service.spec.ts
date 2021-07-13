import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { InstrumentSearchService } from './instrument-search.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('InstrumentSearchService', () => {
  let instrumentSearchService: InstrumentSearchService;
  let $httpBackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    $httpBackend = TestBed.inject(HttpTestingController);
    instrumentSearchService = TestBed.inject(InstrumentSearchService);
  });

  it('should initialize', function () {
    expect(instrumentSearchService).to.exist;

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

      instrumentSearchService.popularSearch("stocks")
        .then(function (results) {
          expect(results).to.deep.equal(stocks.items);

          done();
        })
        .catch(function(err) {
          console.log("shouldn't be here", err);
        });

      $httpBackend.expectOne(InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + "instruments/common?category=stocks")
        .flush(stocks);
    });

    it("should filter out results with no symbols", function(done) {
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

      instrumentSearchService.popularSearch("stocks")
        .then(function (results) {
          expect(results).to.deep.equal([
            {
              symbol: "AAPL.O",
              name: "APPLE INC.",
              category: "STOCKS",
              logo: "https://risecontentlogos.s3.amazonaws.com/financial/AAPL.svg"
            }
          ]);
          done();
        });

        $httpBackend.expectOne(InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + "instruments/common?category=stocks")
          .flush(returnedStocks);
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
      instrumentSearchService.keywordSearch("stocks", "Amazon")
        .then(function (results) {
          expect(results).to.deep.equal(instruments.items);

          done();
        })
        .catch(function(err) {
          console.log("shouldn't be here", err);
        });

        $httpBackend.expectOne(InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + "instrument/search?category=Stocks&query=Amazon")
          .flush(instruments);
    });

    it("should return list of instruments by category and keyword", function(done) {     
      instrumentSearchService.keywordSearch("world indexes", "Amazon")
        .then(function (results) {
          expect(results).to.deep.equal(instruments.items);

          done();
        })
        .catch(function(err) {
          console.log("shouldn't be here", err);
        });

        $httpBackend.expectOne(InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + "instrument/search?category=World%20Indexes&query=Amazon")
          .flush(instruments);
    });

    it("should filter out results with no symbols", function(done) {
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

     instrumentSearchService.keywordSearch("stocks", "Amazon")
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
          done();
        });
      $httpBackend.expectOne(InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + "instrument/search?category=Stocks&query=Amazon")
        .flush(returnedInstruments);

    });

  });

});
