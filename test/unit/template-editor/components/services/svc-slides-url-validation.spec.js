'use strict';

describe('service: slidesUrlValidationService:', function() {
  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function () {
      return Q;
    });
  }));

  var slidesUrlValidationService, $httpBackend;

  beforeEach(function () {
    inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      slidesUrlValidationService = $injector.get('slidesUrlValidationService');
    });
  });

  it('should initialize', function () {
    expect(slidesUrlValidationService).to.be.truely;
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
          fail('Unexpected ' + err);
        });
    });

    it("should return 'VALID' if final url is equal to the url to validate", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";

      $httpBackend.when('GET', 'https://proxy.risevision.com/' + urlToValidate).respond(200, {}, {'x-final-url': urlToValidate});

      setTimeout(function() {
        $httpBackend.flush();
      });

      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('VALID');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'NOT_PUBLIC' if final url is not equal to the url to validate", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";

      var authenticationUrl = "https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&continue=" + urlToValidate + "&followup=" + urlToValidate + "&ltmpl=slides";

      $httpBackend.when('GET', 'https://proxy.risevision.com/' + urlToValidate).respond(200, {}, {'x-final-url': authenticationUrl});

      setTimeout(function() {
        $httpBackend.flush();
      });

      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('NOT_PUBLIC');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'DELETED' if response is error", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";

      $httpBackend.when('GET', 'https://proxy.risevision.com/' + urlToValidate).respond(418, {}, {'x-final-url': urlToValidate}, 'error');

      setTimeout(function() {
        $httpBackend.flush();
      });

      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('DELETED');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

    it("should return 'NOT_PUBLIC' if response is unauthorized error", function( done ) {
      var urlToValidate = "https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed";

      $httpBackend.when('GET', 'https://proxy.risevision.com/' + urlToValidate).respond(401, {}, {'x-final-url': urlToValidate}, 'error');

      setTimeout(function() {
        $httpBackend.flush();
      });

      slidesUrlValidationService.validate(urlToValidate)
        .then(function (result) {
          expect(result).to.be.equal('NOT_PUBLIC');

          done();
        })
        .catch(function(err) {
          fail('Unexpected ' + err);
        });
    });

  } );

});
