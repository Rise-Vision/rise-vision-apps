import { assert, expect } from 'chai';
import { TestBed } from '@angular/core/testing';
import { RssFeedValidationService } from './rss-feed-validation.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';

describe('RssFeedValidationService', () => {
  let rssFeedValidation: RssFeedValidationService;

  let $httpBackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: PromiseUtilsService, useValue: new PromiseUtilsService()}        
      ]
    });

    $httpBackend = TestBed.inject(HttpTestingController);
    rssFeedValidation = TestBed.inject(RssFeedValidationService);
  });

  it('should be created', () => {
    expect(rssFeedValidation).to.exist;
    expect(rssFeedValidation.isParsable).to.be.a('function');
    expect(rssFeedValidation.isValid).to.be.a('function');
  });

  describe('isParsable', function() {

    it("should return '' if url is empty", function( done ) {
      var url = "";

      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });
    });

    it("should return 'VALID' if response does not contain error", function( done ) {
      var url = "http://rss.cnn.com/rss/cnn_topstories.rss";
      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });
      $httpBackend.expectOne('https://feed-parser.risevision.com/' + url)
        .flush([{"test":"rss"}]);
    });

    it("should return 'UNAUTHORIZED' if feed requires authentication", function( done ) {
      var url = "http://feeds.reuters.com/reuters/topNews";
      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('UNAUTHORIZED');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });
      $httpBackend.expectOne('https://feed-parser.risevision.com/' + url)
      .flush({ Error: '401 Unauthorized' });
    });

    it("should return 'NON_FEED' if url provided is not a RSS feed", function( done ) {
      var url = "http://tsn.ca";
      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('NON_FEED');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });
      $httpBackend.expectOne('https://feed-parser.risevision.com/' + url)
      .flush({ Error: 'Not a feed' });
    });

    it("should return 'NOT_FOUND' if url provided does not have a recognizable domain", function( done ) {
      var url = "http://ffasfsaa.com";
      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('NOT_FOUND');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });      
      $httpBackend.expectOne('https://feed-parser.risevision.com/' + url)
      .flush({ Error: 'getaddrinfo ENOTFOUND safasfsafsa.com safasfsafsa.com:80' });
    });

    it("should return 'VALID' if response has error not pertaining to the feed", function( done ) {
      var url = "http://rss.cnn.com/rss/cnn_topstories.rss";
      rssFeedValidation.isParsable(url)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });    
      $httpBackend.expectOne('https://feed-parser.risevision.com/' + url)
      .flush({ Error: 'ETIMEDOUT' });
    });
  } );
});
