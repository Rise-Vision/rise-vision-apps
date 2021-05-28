import {expect} from 'chai';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TemplateEditorUtils } from 'src/app/ajs-upgraded-providers';
import { BlueprintService } from './blueprint.service';

describe('BlueprintService', () => {
  let blueprintFactory: BlueprintService;
  let templateEditorUtils;

  var SAMPLE_COMPONENTS = [
    {
      "type": "rise-image",
      "id": "rise-image-01",
      "label": "template.rise-image",
      "attributes": {
        "file": {
          "label": "template.file",
          "value": "risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/rise-image-demo/heatmap-icon.png"
        }
      }
    },
    {
      "type": "rise-data-financial",
      "id": "rise-data-financial-01",
      "label": "template.rise-data-financial",
      "attributes": {
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      }
    }
  ];

  var PRODUCT_CODE = "template123";

  let $httpBackend : HttpTestingController;

  beforeEach(() => {
    templateEditorUtils = {
      intValueFor: function(value) {
        return parseInt(value);
      }
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {provide: TemplateEditorUtils, useValue: templateEditorUtils}        
      ]
    });

    blueprintFactory = TestBed.inject(BlueprintService);
    $httpBackend = TestBed.inject(HttpTestingController);

  })
  
  afterEach(() => {
    $httpBackend.verify();
  });
 
  it('should exist',function(){
    expect(blueprintFactory).to.be.ok;
    expect(blueprintFactory.componentFor).to.be.a('function');
    expect(blueprintFactory.getBlueprintData).to.be.a('function');
    expect(blueprintFactory.getBlueprintCached).to.be.a('function');
    expect(blueprintFactory.isPlayUntilDone).to.be.a('function');
    expect(blueprintFactory.hasBranding).to.be.a('function');
    expect(blueprintFactory.isRiseInit).to.be.a('function');
  });

  describe('getBlueprintCached: ', function() {

    it('should call API and return blueprintData',function(done) {
      blueprintFactory.getBlueprintCached(PRODUCT_CODE)
        .then(function(resp) {
          expect(resp).to.equal('blueprintData');

          expect(blueprintFactory.loadingBlueprint).to.be.false;

          done();
        });
      expect(blueprintFactory.loadingBlueprint).to.be.true;
      $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').flush('blueprintData');
    });

    describe('_sanitizeBlueprint:', function() {
      it('should sanitize playlist item properties and attributes', function(done) {
        blueprintFactory.getBlueprintCached(PRODUCT_CODE)
          .then(function(resp) {
            expect(resp).to.be.an('object');
            expect(resp.components[0].attributes.items.value[0]).to.deep.equal({
              duration: 15,
              element: {
                attributes: {
                  minfontsize: 40,
                  maxfontsize: 200
                }                
              }
            });

            done();
          });

        $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').flush({
          components: [
            {
              type: 'rise-playlist',
              attributes: {
                items: {
                  value: [
                    {
                      duration: '15',
                      element: {
                        attributes: {
                          minfontsize: '40',
                          maxfontsize: '200'
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        });
      });

      it('should handle missing values', function(done) {
        blueprintFactory.getBlueprintCached(PRODUCT_CODE)
          .then(function(resp) {
            expect(resp).to.be.an('object');

            done();
          });

        $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').flush({
          components: [
            {
              type: 'rise-playlist',
              attributes: {
                items: {
                  value: [
                    {
                      duration: '15',
                      element: {
                        attributes: {}
                      }
                    }
                  ]
                }
              }
            },
            {
              type: 'rise-playlist',
              attributes: {
                items: {
                  value: [
                    {
                      duration: '15',
                      element: {}
                    }
                  ]
                }
              }
            },
            {
              type: 'rise-playlist',
              attributes: {
                items: {
                  value: [
                    {
                      duration: '15'
                    }
                  ]
                }
              }
            },
            {
              type: 'rise-playlist',
              attributes: {
                items: {}
              }
            },
            {
              type: 'rise-playlist',
              attributes: {}
            },
            {
              type: 'rise-playlist'
            },
            {
              type: 'rise-text'
            }
          ]
        });
      });
    });

    it('should populate factory object on api response',function(done) {

      blueprintFactory.getBlueprintCached(PRODUCT_CODE)
        .then(function(resp) {
          expect(blueprintFactory.blueprintData).to.equal('blueprintData');
          done();
        });
      $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').flush('blueprintData');

    });

    it('should cache api response',function(done) {      
      blueprintFactory.getBlueprintCached(PRODUCT_CODE)
        .then(function(resp) {
          expect(blueprintFactory.blueprintData).to.equal('blueprintData');

          blueprintFactory.getBlueprintCached(PRODUCT_CODE)
            .then(function(resp) {
              expect(blueprintFactory.blueprintData).to.equal('blueprintData');

              done();
            });
        });

      $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').flush('blueprintData');
    });

    it('should not update factory with cached api response',function(done) {      
      blueprintFactory.getBlueprintCached(PRODUCT_CODE, true)
        .then(function(resp) {
          expect(blueprintFactory.blueprintData).to.not.be.ok;

          blueprintFactory.getBlueprintCached(PRODUCT_CODE, true)
            .then(function(resp) {
              expect(blueprintFactory.blueprintData).to.not.be.ok;

              done();
            });
        });

      $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').flush('blueprintData');
    });

    it('should reject on http error',function(done) {
      blueprintFactory.getBlueprintCached(PRODUCT_CODE)
        .then(null,function(error) {
          expect(error).to.be.ok;

          expect(blueprintFactory.loadingBlueprint).to.be.false;

          done();
        });

      expect(blueprintFactory.loadingBlueprint).to.be.true;

      $httpBackend.expectOne('https://widgets.risevision.com/staging/templates/template123/blueprint.json').error(new ErrorEvent('Error'));
    });
  });

  describe('isPlayUntilDone: ', function() {

    it('should return a promise',function() {
      sinon.stub(blueprintFactory, 'getBlueprintCached').returns(Promise.resolve());
      expect(blueprintFactory.isPlayUntilDone('productCode').then).to.be.a('function');

      blueprintFactory.getBlueprintCached.should.have.been.calledWith('productCode', true);
    });

    it('should return false if blueprintData is not populated',function() {
      sinon.stub(blueprintFactory, 'getBlueprintCached').returns(Promise.resolve());

      return blueprintFactory.isPlayUntilDone().then(function(result) {
        expect(result).to.be.false;
      });
    });

    it('should return true if blueprintData exists and playUntilDone is true',function() {
      sinon.stub(blueprintFactory, 'getBlueprintCached').returns(Promise.resolve({playUntilDone: true}));

      return blueprintFactory.isPlayUntilDone().then(function(result) {
        expect(result).to.be.true;
      });
    });

    it('should return true if blueprintData exists and playUntilDone is not true',function() {
      sinon.stub(blueprintFactory, 'getBlueprintCached').returns(Promise.resolve({}));

      return blueprintFactory.isPlayUntilDone().then(function(result) {
        expect(result).to.be.false;
      });
    });
  });

  describe('hasBranding: ', function() {

    it('should return false if blueprintData is not populated',function() {
      expect(blueprintFactory.hasBranding()).to.be.false;
    });

    it('should return true if blueprintData.branding is true',function() {
      blueprintFactory.blueprintData = {
        branding: true
      };

      expect(blueprintFactory.hasBranding()).to.be.true;
    });

    it('should return false otherwise',function() {
      blueprintFactory.blueprintData = {
        branding: false
      };

      expect(blueprintFactory.hasBranding()).to.be.false;
    });
  });

  describe('isRiseInit: ', function() {

    it('should return false if blueprintData is not populated',function() {
      expect(blueprintFactory.isRiseInit()).to.be.false;
    });

    it('should return true if blueprintData.riseInit is true',function() {
      blueprintFactory.blueprintData = {
        riseInit: true
      };

      expect(blueprintFactory.isRiseInit()).to.be.true;
    });

    it('should return false otherwise',function() {
      blueprintFactory.blueprintData = {
        riseInit: false
      };

      expect(blueprintFactory.isRiseInit()).to.be.false;
    });
  });

  describe('componentFor', function () {

    it('should handle missing component',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var component = blueprintFactory.componentFor('rise-text-missing');

      expect(component).to.not.be.ok;
    });

    it('should get component if it exists',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var component = blueprintFactory.componentFor('rise-data-financial-01');

      expect(component).to.equal(SAMPLE_COMPONENTS[1]);
    });

  });

  describe('getBlueprintData', function () {

    it('should get blueprint data from factory',function() {
      blueprintFactory.blueprintData = { components: [] };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01');

      expect(data).to.be.null;
    });

    it('should get null blueprint data value',function() {
      blueprintFactory.blueprintData = { components: [] };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01', 'symbols');

      expect(data).to.be.null;
    });

    it('should get blueprint data attributes',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01');

      expect(data).to.deep.equal({
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      });
    });

    it('should get blueprint data value',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var data = blueprintFactory.getBlueprintData('rise-data-financial-01', 'symbols');

      expect(data).to.equal('CADUSD=X|MXNUSD=X|USDEUR=X');
    });

  });

  describe('getLogoComponents',function(){

    it('should handle empty data',function(){
      blueprintFactory.blueprintData = {};

      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);

      blueprintFactory.blueprintData = { components: []};
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);
    });

    it('should return is-logo images',function(){
      var logoComponent = { type: "rise-image", attributes: {'is-logo': {value:'true' } } };
      blueprintFactory.blueprintData = {
        components: [
          { "type": "rise-image", "id": "rise-image-01" },
          logoComponent
        ]
      };
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([logoComponent]);
    });

    it('should handle no logo',function(){
      blueprintFactory.blueprintData = {
        components: [
          { "type": "rise-image", "id": "rise-image-01" },
        ]
      };
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);
    });

    it('should handle is-logo false',function(){
      var logoComponent = { type: "rise-image", attributes: {'is-logo': {value:'false' } } };
      blueprintFactory.blueprintData = {
        components: [
          { "type": "rise-image", "id": "rise-image-01" },
        ]
      };
      expect(blueprintFactory.getLogoComponents()).to.deep.equal([]);
    });

  });

  describe('getHelpText', function() {
    it('should return component help text', function() {
      blueprintFactory.blueprintData = {
        components: [
          { type: 'rise-image', id: 'rise-image-01', helpText: 'help text' },
        ]
      };
      expect(blueprintFactory.getHelpText('rise-image-01')).to.equal('help text');
    });

    it('should return undefined if component does not have help text', function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };
      expect(blueprintFactory.getHelpText('rise-image-01')).to.be.undefined;
    });

    it('should return undefined if component does not exist', function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };
      expect(blueprintFactory.getHelpText('invalid-01')).to.be.undefined;
    });
  });

});
