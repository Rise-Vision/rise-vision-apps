import {expect} from 'chai';

import { TestBed } from '@angular/core/testing';
import { BlueprintFactory, TemplateEditorFactory } from 'src/app/ajs-upgraded-providers';

import { AttributeDataService } from './attribute-data.service';

describe('AttributeDataService', () => {
  let sandbox = sinon.sandbox.create();

  let attributeDataFactory: AttributeDataService;
  let blueprintFactory;
  let templateEditorFactory;

  beforeEach(() => {
    blueprintFactory = {
      getBlueprintData: sandbox.stub().returns('blueprintData')
    }
    templateEditorFactory = {
      presentation: {}
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: BlueprintFactory, useValue: blueprintFactory},
        {provide: TemplateEditorFactory, useValue: templateEditorFactory}        
      ]
    });
    attributeDataFactory = TestBed.inject(AttributeDataService);
  });
  
  afterEach(function() {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect(attributeDataFactory).to.be.ok;

    expect(attributeDataFactory.getBlueprintData).to.be.a('function');
    expect(attributeDataFactory.getAttributeData).to.be.a('function');
    expect(attributeDataFactory.getAvailableAttributeData).to.be.a('function');
    expect(attributeDataFactory.setAttributeData).to.be.a('function');

    expect(attributeDataFactory.getAttributeDataGlobal).to.be.a('function');
    expect(attributeDataFactory.setAttributeDataGlobal).to.be.a('function');

    expect(attributeDataFactory.getComponentIds).to.be.a('function');
  });

  describe('getBlueprintData:', function () {

    it('should get blueprint data from factory',function() {
      var data = attributeDataFactory.getBlueprintData('test-id');

      blueprintFactory.getBlueprintData.should.have.been.calledWith('test-id');
      expect(data).to.equal('blueprintData');
    });

  });

  describe('getAttributeData:', function () {

    beforeEach(function(){
      templateEditorFactory.presentation = { templateAttributeData: {} };
    });

    describe('_componentFor', function() {
      it('should get component if it exists', function() {
        templateEditorFactory.presentation.templateAttributeData.components = [{id: 'test-id'}];

        expect(attributeDataFactory.getAttributeData('test-id')).to.equal(templateEditorFactory.presentation.templateAttributeData.components[0]);
      });

      it('should get return a playlist item by index', function() {
        templateEditorFactory.presentation.templateAttributeData.components = [
          {
            id: 'test-id'
          },
          {
            id: 'playlist-1',
            items: [
              'playlistitem1',
              'playlistitem2'
            ]
          }
        ];

        expect(attributeDataFactory.getAttributeData('playlist-1 0')).to.equal('playlistitem1');
        expect(attributeDataFactory.getAttributeData('playlist-1 1')).to.equal('playlistitem2');
      });
    });

    it('should return null if componentId is missing',function() {
      var data = attributeDataFactory.getAttributeData(null);

      expect(data).to.be.null;
    });

    it('should get empty attribute data',function() {
      var data = attributeDataFactory.getAttributeData('test-id');

      expect(data).to.deep.equal({ id: 'test-id' });
    });

    it('should not update templateAttributeData on get',function() {
      attributeDataFactory.getAttributeData('test-id');

      expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
    });

    it('should get undefined attribute data value',function() {
      var data = attributeDataFactory.getAttributeData('test-id', 'symbols');

      expect(data).to.not.be.ok;
    });

    it('should get component property if it exists', function() {
      templateEditorFactory.presentation.templateAttributeData.components = [{id: 'test-id', property: 'value'}];

      expect(attributeDataFactory.getAttributeData('test-id', 'property')).to.equal('value');
    });

    it('should get playlist item attributes', function() {
      templateEditorFactory.presentation.templateAttributeData.components = [
        {
          id: 'test-id'
        },
        {
          id: 'playlist-1',
          items: [
            {
              element: {
                attributes: {
                  property1: 'value'
                }
              }
            },
            'playlistitem2'
          ]
        }
      ];

      expect(attributeDataFactory.getAttributeData('playlist-1 0')).to.deep.equal({
        property1: 'value'
      });
    });

    it('should get playlist item attribute if it exists', function() {
      templateEditorFactory.presentation.templateAttributeData.components = [
        {
          id: 'test-id'
        },
        {
          id: 'playlist-1',
          items: [
            {
              element: {
                attributes: {
                  property1: 'value'
                }
              }
            },
            'playlistitem2'
          ]
        }
      ];

      expect(attributeDataFactory.getAttributeData('playlist-1 0', 'property1')).to.equal('value');
    });

  });

  describe('setAttributeData', function () {

    beforeEach(function(){
      templateEditorFactory.presentation = { templateAttributeData: {} };
    });

    it('should return null if componentId is missing',function() {
      var data = attributeDataFactory.setAttributeData(null,null,null);

      expect(data).to.be.null;
    });

    it('should set an attribute data value',function() {
      attributeDataFactory.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({
        components: [
          {
            id: 'test-id',
            symbols: 'CADUSD=X|MXNUSD=X'
          }
        ]
      });
    });

    it('should get an attribute data value',function() {
      attributeDataFactory.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      var data = attributeDataFactory.getAttributeData('test-id', 'symbols');

      expect(data).to.equal('CADUSD=X|MXNUSD=X');
    });

    it('should get attribute data',function() {
      attributeDataFactory.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      var data = attributeDataFactory.getAttributeData('test-id');

      expect(data).to.deep.equal({
        id: 'test-id',
        symbols: 'CADUSD=X|MXNUSD=X'
      });
    });

    it('should set playlist item attribute', function() {
      templateEditorFactory.presentation.templateAttributeData.components = [
        {
          id: 'playlist-1',
          items: [
            {
              element: {
                attributes: {
                  property1: 'value'
                }
              }
            }
          ]
        }
      ];

      attributeDataFactory.setAttributeData('playlist-1 0', 'property2', 'value2');

      expect(attributeDataFactory.getAttributeData('playlist-1 0', 'property2')).to.equal('value2');
    });

    it('should initialize attributes', function() {
      templateEditorFactory.presentation.templateAttributeData.components = [
        {
          id: 'playlist-1',
          items: [
            {
              element: {}
            }
          ]
        }
      ];

      attributeDataFactory.setAttributeData('playlist-1 0', 'property2', 'value2');

      expect(attributeDataFactory.getAttributeData('playlist-1 0')).to.deep.equal({
        property2: 'value2'
      });
    });

  });
  
  describe('getAttributeDataGlobal / setAttributeDataGlobal', function () {

    beforeEach(function(){
      templateEditorFactory.presentation = { templateAttributeData: {} };
    });

    it('should set an attribute data value',function() {
      attributeDataFactory.setAttributeDataGlobal('brandingOverride', {baseColor: 'red', accentColor: 'green'});

      expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({
        brandingOverride: {baseColor: 'red', accentColor: 'green'}
      });
    });

    it('should get an attribute data value',function() {
      attributeDataFactory.setAttributeDataGlobal('brandingOverride', {baseColor: 'red', accentColor: 'green'});

      var data = attributeDataFactory.getAttributeDataGlobal('brandingOverride');

      expect(data).to.deep.equal({baseColor: 'red', accentColor: 'green'});
    });

  });

  describe('getComponentIds:', function () {
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

    it('should get the component ids of rise-image components',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var ids = attributeDataFactory.getComponentIds({ type: 'rise-image' });

      expect(ids).to.deep.equal(['rise-image-01']);
    });

    it('should get the component ids of all rise components',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var ids = attributeDataFactory.getComponentIds();

      expect(ids).to.deep.equal(['rise-image-01', 'rise-data-financial-01']);
    });

  });
});
