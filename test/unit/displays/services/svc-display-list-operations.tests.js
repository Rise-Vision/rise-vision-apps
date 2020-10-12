'use strict';
describe('service: DisplayListOperations:', function() {
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('displayFactory', function() {
      return {
        deleteDisplayByObject: 'deleteDisplayByObject'
      };
    });

    $provide.service('playerLicenseFactory', function() {
      return {
        licenseDisplaysByCompanyId: sinon.stub().returns(Q.resolve()),
        getProAvailableLicenseCount: sinon.stub().returns(2)
      };
    });
    
    $provide.service('plansFactory', function() {
      return {
        confirmAndPurchase: sinon.spy()
      };
    });

    $provide.service('confirmModal', function() {
      return sinon.stub().returns(Q.resolve());
    });

    $provide.service('messageBox', function() {
      return sinon.stub().returns(Q.resolve());
    });

  }));
  var displayListOperations, displayFactory, playerLicenseFactory, plansFactory,
    confirmModal, messageBox;
  beforeEach(function(){
    inject(function($injector){
      var DisplayListOperations = $injector.get('DisplayListOperations');
      displayFactory = $injector.get('displayFactory');
      playerLicenseFactory = $injector.get('playerLicenseFactory');
      plansFactory = $injector.get('plansFactory');
      confirmModal = $injector.get('confirmModal');
      messageBox = $injector.get('messageBox');
      displayListOperations = new DisplayListOperations();
    });
  });
  
  it('should exist',function(){
    expect(displayListOperations).to.be.ok;
    expect(displayListOperations.name).to.equal('Display');
    expect(displayListOperations.operations).to.have.length(4);
  });

  it('Delete:', function() {
    expect(displayListOperations.operations[2].name).to.equal('Delete');
    expect(displayListOperations.operations[2].actionCall).to.equal('deleteDisplayByObject');
    expect(displayListOperations.operations[2].requireRole).to.equal('da');    
  });

  describe('License:', function() {
    it('should exist:', function() {
      expect(displayListOperations.operations[3].name).to.equal('License');
      expect(displayListOperations.operations[3].actionCall).to.be.a('function');
      expect(displayListOperations.operations[3].beforeBatchAction).to.be.a('function');
      expect(displayListOperations.operations[3].groupBy).to.equal('companyId');
      expect(displayListOperations.operations[3].filter).to.deep.equal({
        playerProAuthorized: false
      });
      expect(displayListOperations.operations[3].requireRole).to.equal('da');
    });

    describe('actionCall:', function() {
      var selected;

      beforeEach(function() {
        selected = {
          companyId: 'companyId',
          items: [
            { id: 'display1' },
            { id: 'display2' }
          ]
        };        
      });

      it('should license displays', function() {
        displayListOperations.operations[3].actionCall(selected);

        playerLicenseFactory.licenseDisplaysByCompanyId.should.have.been.calledWith('companyId', ['display1', 'display2']);
      });

      it('should update display playerProAuthorized', function(done) {
        displayListOperations.operations[3].actionCall(selected)
          .then(function() {
            expect(selected.items[0].playerProAuthorized).to.be.true;
            expect(selected.items[1].playerProAuthorized).to.be.true;

            done();
          });
      });

      it('should not update displays on error', function(done) {
        playerLicenseFactory.licenseDisplaysByCompanyId.returns(Q.reject());
        
        displayListOperations.operations[3].actionCall(selected)
          .catch(function() {
            expect(selected.items[0].playerProAuthorized).to.not.be.ok;
            expect(selected.items[1].playerProAuthorized).to.not.be.ok;

            done();
          });
      });
    });

    describe('beforeBatchAction:', function() {
      var selected;

      beforeEach(function() {
        selected = [
          { id: 'display1' },
          { id: 'display2' }
        ];
      });

      it('should show error if selected list is empty', function(done) {
        displayListOperations.operations[3].beforeBatchAction([])
          .catch(function() {
            messageBox.should.have.been.calledWith(
              'Already licensed!',
              'Please select some unlicensed displays to license.',
              null, 
              'madero-style centered-modal', 
              'partials/template-editor/message-box.html',
              'sm');

            done();
          });
      });

      it('should trigger purchase if license count is not enough', function(done) {
        playerLicenseFactory.getProAvailableLicenseCount.returns(1);

        displayListOperations.operations[3].beforeBatchAction(selected)
          .catch(function() {
            plansFactory.confirmAndPurchase.should.have.been.called;

            done();
          });        
      });

      it('should show license confirmation and proceed', function(done) {
        displayListOperations.operations[3].beforeBatchAction(selected)
          .then(function() {
            confirmModal.should.have.been.calledWith(
              'Assign license?',
              'Do you want to assign licenses to the selected displays?',
              'Yes',
              'No',
              'madero-style centered-modal',
              'partials/components/confirm-modal/madero-confirm-modal.html',
              'sm');

            done();
          });
      });    });

  });

});
