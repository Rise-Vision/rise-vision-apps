import { assert, expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { SlidesUrlValidationServiceService } from './slides-url-validation-service.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { HttpHeaders } from '@angular/common/http';

describe('SlidesUrlValidationServiceService', () => {
  let slidesUrlValidationService: SlidesUrlValidationServiceService;
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
    slidesUrlValidationService = TestBed.inject(SlidesUrlValidationServiceService);
  });
  
  it('should be created', () => {
    expect(slidesUrlValidationService).to.exist;
    expect(slidesUrlValidationService.validate).to.be.a('function');
  });


  describe('validate', function() {

    it("should return 'VALID' if url is empty", function( done ) {
      var urlToValidate = "";

      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });
    });

    it("should return 'VALID' if final url is equal to the url to validate", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";
      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });

      $httpBackend.expectOne('https://proxy.risevision.com/' + urlToValidate)
        .flush({}, {headers: new HttpHeaders({'x-final-url': urlToValidate})} );
    });

    it("should return 'NOT_PUBLIC' if final url is not equal to the url to validate", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";
      var authenticationUrl = "https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&continue=" + urlToValidate + "&followup=" + urlToValidate + "&ltmpl=slides";
      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('NOT_PUBLIC');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });

      $httpBackend.expectOne('https://proxy.risevision.com/' + urlToValidate)
        .flush({}, {headers: new HttpHeaders({'x-final-url': authenticationUrl})} );

    });

    it("should return 'DELETED' if response is error", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";
      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('DELETED');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });
        $httpBackend.expectOne('https://proxy.risevision.com/' + urlToValidate)
        .flush('error', {
          headers: new HttpHeaders({'x-final-url': urlToValidate}),
          status: 418,
          statusText: 'I\'m a teapot'
        });
    });

    it("should return 'NOT_PUBLIC' if response is unauthorized error", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";
      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('NOT_PUBLIC');

          done();
        })
        .catch(function(err) {
          assert.fail('Unexpected ' + err);
        });

        $httpBackend.expectOne('https://proxy.risevision.com/' + urlToValidate)
        .flush('error', {
          headers: new HttpHeaders({'x-final-url': urlToValidate}),
          status: 401,
          statusText: 'Unauthorized'
        });
    });
  });
});
