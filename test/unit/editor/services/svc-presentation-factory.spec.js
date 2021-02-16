'use strict';
describe('service: presentationFactory: ', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        _presentation: {
          id: 'presentationId',
          name: 'some presentation',
          revisionStatus: 0
        },
        get: function(presentationId) {
          var deferred = Q.defer();
          if(returnPresentation){
            apiCalls++;
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject('ERROR; could not get presentation');
          }
          return deferred.promise;
        }
      };
    });
  }));
  var presentationFactory, returnPresentation, apiCalls;
  beforeEach(function(){
    returnPresentation = true;
    apiCalls = 0;
    
    inject(function($injector){
      presentationFactory = $injector.get('presentationFactory');
    });
  });

  it('should exist',function(){
    expect(presentationFactory).to.be.ok;
    
    expect(presentationFactory.setPresentation).to.be.a('function');
    expect(presentationFactory.getPresentationCached).to.be.a('function');
    expect(presentationFactory.loadingPresentation).to.be.false;
  });
  
  describe('setPresentation:', function() {
    it('should return cached presentation', function(done) {
      var presentation = {
        id: 'presentationId',
        name: 'some presentation',
        revisionStatus: 0
      };

      presentationFactory.setPresentation(presentation);

      presentationFactory.getPresentationCached('presentationId')
        .then(function(result) {
          expect(result).to.equal(presentation);

          expect(apiCalls).to.equal(0);

          done();
        });
    });

    it('should not add presentation if already exists', function(done) {
      var presentation = {
        id: 'presentationId',
        name: 'some presentation',
        revisionStatus: 0
      };

      presentationFactory.setPresentation(presentation);
      presentationFactory.setPresentation({id: 'presentationId'});

      presentationFactory.getPresentationCached('presentationId')
        .then(function(result) {
          expect(result).to.equal(presentation);

          done();
        });
    });

  });

  describe('getPresentationCached: ', function() {
    it('should get the presentation',function(done){
      presentationFactory.getPresentationCached('presentationId')
      .then(function(presentation) {
        expect(presentation).to.be.ok;
        expect(presentation.name).to.equal('some presentation');

        setTimeout(function() {
          expect(presentationFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done('error');
      })
      .then(null,done);
    });
    
    it('should handle failure to get presentation correctly',function(done){
      returnPresentation = false;
      
      presentationFactory.getPresentationCached()
      .then(function(result) {
        done(result);
      })
      .then(null, function() {
        expect(presentationFactory.apiError).to.be.ok;
        expect(presentationFactory.apiError).to.equal('ERROR; could not get presentation');

        setTimeout(function() {
          expect(presentationFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });
    
    it('should only call API once', function(done) {
      presentationFactory.getPresentationCached('presentationId');
      
      setTimeout(function() {
        presentationFactory.getPresentationCached('presentationId');
        
        setTimeout(function() {
          expect(apiCalls).to.equal(1);
          
          done();
        }, 10);
      }, 10);
    });
  });

});
