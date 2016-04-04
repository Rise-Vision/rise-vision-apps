'use strict';
  
describe('service: fileRetriever:', function() {
  beforeEach(module('risevision.storage.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {
      return Q;
    });
  }));

  var fileRetriever, xhr;
  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();

    inject(function($injector){  
      fileRetriever = $injector.get('fileRetriever');
    });
  });

  it('should exist',function(){
    expect(fileRetriever).to.be.ok;

    expect(fileRetriever.retrieveFile).to.be.a('function');
  });
  
  it('should load request', function(done) {
    xhr.onCreate = function (request) {
      setTimeout(function() {
        expect(request.url).to.equal('someUrl');
        expect(request.method).to.equal('GET');
        expect(request.responseType).to.equal('arraybuffer');

        done();
      });
    };

    fileRetriever.retrieveFile('someUrl', {username: 'user'});    
  });
  
  it('should return response', function(done) {
    xhr.onCreate = function (request) {
      setTimeout(function() {
        request.respond(200, { 'Content-Length': 123 }, '{ "name": "file" }');        
      }, 10);
    };

    fileRetriever.retrieveFile('someUrl', {username: 'user'})
    .then(function(response) {
      expect(response.size).to.equal(123);
      expect(response.data).to.be.ok;
      expect(response.userData).to.deep.equal({username: 'user'});
      
      done();
    })
    .then(null, done);
  });
  
  it('should return error', function(done) {
    xhr.onCreate = function (request) {
      setTimeout(function() {
        request.dispatchEvent(new sinon.Event('error', {detail: 'error'}));
      }, 10);
    };

    fileRetriever.retrieveFile('someUrl', {username: 'user'})
    .then(function(response) {
      done(response);
    }, function(error) {
      expect(error).to.be.ok;

      done();
    });
  });
  
  afterEach(function() {
    xhr.restore();
  });

});
