import { assert, expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { TwitterCredentialsValidationService } from './twitter-credentials-validation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';

describe('TwitterCredentialsValidationService', () => {
  let twitterCredentialsValidation: TwitterCredentialsValidationService;
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
    twitterCredentialsValidation = TestBed.inject(TwitterCredentialsValidationService);
  });

  it('should be created', () => {
    expect(twitterCredentialsValidation).to.exist;
    expect(twitterCredentialsValidation.verifyCredentials).to.be.a('function');
  });

  describe('verifyCredentials', function() {

    it("should return true if ok response and data indicates success", function( done ) {
      var companyId = 'abc123';

      
      twitterCredentialsValidation.verifyCredentials(companyId)
        .then(function (result) {
          expect(result).to.be.equal(true);

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });

        $httpBackend.expectOne('https://services-stage.risevision.com/twitter/verify-credentials?companyId=' + companyId)
          .flush({"success":true});
    });

    it("should return false if ok response and data indicates no success", function( done ) {
      var companyId = 'abc123';

      twitterCredentialsValidation.verifyCredentials(companyId)
        .then(function (result) {
          expect(result).to.be.equal(false);

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });

      $httpBackend.expectOne('https://services-stage.risevision.com/twitter/verify-credentials?companyId=' + companyId)
        .flush({"success":false, "message": "No credentials for: " + companyId + ":twitter"});
    });

  } );

});
