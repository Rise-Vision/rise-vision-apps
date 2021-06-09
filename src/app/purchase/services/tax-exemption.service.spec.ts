import {expect} from 'chai';
import { TestBed } from '@angular/core/testing';

import { TaxExemptionService } from './tax-exemption.service';
import { StoreService, UserState } from 'src/app/ajs-upgraded-providers';

describe('TaxExemptionService', () => {
  let taxExemptionFactory: TaxExemptionService;
  let mockUserState;
  let storeService;

  beforeEach(() => {
    mockUserState = {
      getSelectedCompanyId: sinon.stub().returns('selectedCompany')
    }
    storeService = {
      addTaxExemption: sinon.stub().resolves(Promise.resolve()),
      uploadTaxExemptionCertificate: sinon.stub().returns(Promise.resolve("url"))
    };
    TestBed.configureTestingModule({
      providers: [
        {provide: UserState, useValue: mockUserState},
        {provide: StoreService, useValue: storeService}        
      ]
    });
    taxExemptionFactory = TestBed.inject(TaxExemptionService);
  });

  it("should exist", function() {
    expect(taxExemptionFactory).to.be.ok;
    expect(taxExemptionFactory.init).to.be.a("function");
    expect(taxExemptionFactory.submitTaxExemption).to.be.a("function");
  });

  describe("init: ", function() {
    it ('should initialize', function() {
      taxExemptionFactory.init('callback');

      expect(taxExemptionFactory.taxExemption).to.be.ok;
      expect(taxExemptionFactory.taxExemption.callback).to.equal('callback');
    });

    it ('should stop spinner', function() {
      taxExemptionFactory.loading = true;

      taxExemptionFactory.init();

      expect(taxExemptionFactory.loading).to.be.false;
    });
  });

  describe("submitTaxExemption: ", function() {
    var callback;
    beforeEach(function() {
      callback = sinon.spy();

      taxExemptionFactory.taxExemption = {
        callback: callback,
        file: 'file'
      };
    });

    it("should return a promise", function() {
      expect(taxExemptionFactory.submitTaxExemption().then).to.be.a("function");
    });

    it("should clear errors and start spinner", function() {
      taxExemptionFactory.taxExemption = {
        error: "error"
      };

      taxExemptionFactory.submitTaxExemption();

      expect(taxExemptionFactory.taxExemption.error).to.not.be.ok;
      expect(taxExemptionFactory.loading).to.be.true;
    });

    it("should successfully submit", function (done) {
      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.not.be.ok;
        storeService.uploadTaxExemptionCertificate.should.have.been.calledWith('file');
        storeService.addTaxExemption.should.have.been.calledWith('selectedCompany', taxExemptionFactory.taxExemption, 'url');

        expect(taxExemptionFactory.taxExemption.sent).to.be.true;

        done();
      });
    });

    it("should refresh estimate on success", function (done) {
      taxExemptionFactory.submitTaxExemption().then(function () {
        callback.should.have.been.called;

        expect(taxExemptionFactory.loading).to.be.false;

        done();
      });
    });

    it("should fail to submit when uploading tax exemption certificate fails", function (done) {
      storeService.uploadTaxExemptionCertificate.returns(Promise.reject({}));

      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.equal('Something went wrong. Please try again.');
        storeService.uploadTaxExemptionCertificate.should.have.been.called;
        storeService.addTaxExemption.should.not.have.been.called;

        callback.should.not.have.been.called;

        expect(taxExemptionFactory.taxExemption.sent).to.not.be.ok;

        done();
      });
    });

    it("should stop spinner and show error on failure", function (done) {
      storeService.uploadTaxExemptionCertificate.returns(Promise.reject({message: 'error'}));

      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.equal('error');

        expect(taxExemptionFactory.loading).to.be.false;

        done();
      });
    });

    it("should fail to submit when sending tax exemption fails", function (done) {
      storeService.addTaxExemption.returns(Promise.reject({}));

      taxExemptionFactory.submitTaxExemption().then(function () {
        expect(taxExemptionFactory.taxExemption.error).to.be.ok;
        storeService.uploadTaxExemptionCertificate.should.have.been.called;
        storeService.addTaxExemption.should.have.been.called;

        callback.should.not.have.been.called;

        expect(taxExemptionFactory.taxExemption.sent).to.not.be.ok;

        done();
      });
    });

  });

});
