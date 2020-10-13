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
        confirmAndPurchase: sinon.spy(),
        showPurchaseOptions: sinon.stub()
      };
    });

    $provide.service('confirmModal', function() {
      return sinon.stub().returns(Q.resolve());
    });

    $provide.service('messageBox', function() {
      return sinon.stub().returns(Q.resolve());
    });

    $provide.service('playerActionsFactory', function() {
      return {
        restartByObject: 'restartByObject',
        rebootByObject: 'rebootByObject'
      };
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

  var _getOperationByName = function(name) {
    return _.find(displayListOperations.operations, function(o) { return o.name === name; });
  };
  
  it('should exist',function(){
    expect(displayListOperations).to.be.ok;
    expect(displayListOperations.name).to.equal('Display');
    expect(displayListOperations.operations).to.have.length(7);
  });

  it('Delete:', function() {
    var deleteOperation = _getOperationByName('Delete');
    expect(deleteOperation.name).to.equal('Delete');
    expect(deleteOperation.actionCall).to.equal('deleteDisplayByObject');
    expect(deleteOperation.requireRole).to.equal('da');    
  });

  describe('License:', function() {
    var licenseOperation;

    beforeEach(function() {
      licenseOperation = _getOperationByName('License');
    })

    it('should exist:', function() {
      expect(licenseOperation.name).to.equal('License');
      expect(licenseOperation.actionCall).to.be.a('function');
      expect(licenseOperation.beforeBatchAction).to.be.a('function');
      expect(licenseOperation.groupBy).to.equal('companyId');
      expect(licenseOperation.filter).to.deep.equal({
        playerProAuthorized: false
      });
      expect(licenseOperation.requireRole).to.equal('da');
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
        licenseOperation.actionCall(selected);

        playerLicenseFactory.licenseDisplaysByCompanyId.should.have.been.calledWith('companyId', ['display1', 'display2']);
      });

      it('should update display playerProAuthorized', function(done) {
        licenseOperation.actionCall(selected)
          .then(function() {
            expect(selected.items[0].playerProAuthorized).to.be.true;
            expect(selected.items[1].playerProAuthorized).to.be.true;

            done();
          });
      });

      it('should not update displays on error', function(done) {
        playerLicenseFactory.licenseDisplaysByCompanyId.returns(Q.reject());
        
        licenseOperation.actionCall(selected)
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
        licenseOperation.beforeBatchAction([])
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

        licenseOperation.beforeBatchAction(selected)
          .catch(function() {
            plansFactory.confirmAndPurchase.should.have.been.called;

            done();
          });        
      });

      it('should show license confirmation and proceed', function(done) {
        licenseOperation.beforeBatchAction(selected)
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
      });    
    });
  });

  describe('Restart Rise Player:', function() {
    var restartOperation;

    beforeEach(function() {
      restartOperation = _getOperationByName('Restart Rise Player');
    })

    it('should exist:', function() {
      expect(restartOperation.name).to.equal('Restart Rise Player');
      expect(restartOperation.actionCall).to.equal('restartByObject');
      expect(restartOperation.beforeBatchAction).to.be.a('function');      
      expect(restartOperation.requireRole).to.equal('da');
    });

    describe('beforeBatchAction:', function() {
      var selected;

      beforeEach(function() {
        selected = [
          { id: 'display1', playerProAuthorized: true },
          { id: 'display2', playerProAuthorized: true }
        ];
      });

      it('should confirm before restarting players', function(done) {
        restartOperation.beforeBatchAction(selected).then(function() {
          confirmModal.should.have.been.calledWith(
            'Restart Rise Players?', 
            'Rise Players will restart and the content showing on your displays will be interrupted. Do you wish to proceed?',
            'Yes', 'No', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');
          done();
        });
      });

      it('should show confirmation with singular message', function(done) {
        selected = [{ id: 'display1', playerProAuthorized: true }];
        restartOperation.beforeBatchAction(selected).then(function() {
          confirmModal.should.have.been.calledWith(
            'Restart Rise Player?', 
            'Rise Player will restart and the content showing on your display will be interrupted. Do you wish to proceed?',
            'Yes', 'No', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');
          done();
        });
      });

      describe('License Required:', function() {
        var licenseOperation;

        beforeEach(function() {
          licenseOperation = _getOperationByName('License');
          licenseOperation.onClick = sinon.stub().returns(Q.resolve());        

          selected = [
            { id: 'display1', playerProAuthorized: true },
            { id: 'display2', playerProAuthorized: false },
            { id: 'display3', playerProAuthorized: false }
          ];
        });

        it('should prompt to license unlicensed displays and continue on acceptance', function(done) {
          restartOperation.beforeBatchAction(selected);

          setTimeout(function() {
            confirmModal.should.have.been.calledWith('Almost there!',
              '2 of your selected displays are not licensed and to perform this action they need to be. You have 2 available licenses. Do you want to assign 2 to these displays?',
              'Yes', 'No', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');

            expect(confirmModal.getCall(0).args[0]).to.equal('Almost there!');
            licenseOperation.onClick.should.have.been.calledWith(true);

            expect(confirmModal.getCall(1).args[0]).to.equal('Restart Rise Players?');
            done();
          },10);
        });

        it('should prompt to license unlicensed displays and cancel operation on reject', function(done) {
          confirmModal.returns(Q.reject());

          restartOperation.beforeBatchAction(selected);

          setTimeout(function() {
            confirmModal.should.have.been.calledWith('Almost there!');
            confirmModal.should.have.been.calledOnce;

            licenseOperation.onClick.should.not.have.been.called;

            done();
          },10);
        });

        it('should prompt to subscribe if there are not enough available licenses', function(done){
          playerLicenseFactory.getProAvailableLicenseCount.returns(1);

          restartOperation.beforeBatchAction(selected);

          setTimeout(function() {
            confirmModal.should.have.been.calledWith('Almost there!',
              '2 of your selected displays are not licensed and to perform this action they need to be. You have 1 available license and you need to subscribe for 1 more to license these displays.',
              'Subscribe', 'Cancel', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');

            plansFactory.showPurchaseOptions.should.have.been.called;

            done();
          },10);
        });
      });
    });
  });

describe('Reboot Media Player:', function() {
    var operation;

    beforeEach(function() {
      operation = _getOperationByName('Reboot Media Player');
    })

    it('should exist:', function() {
      expect(operation.name).to.equal('Reboot Media Player');
      expect(operation.actionCall).to.equal('rebootByObject');
      expect(operation.beforeBatchAction).to.be.a('function');      
      expect(operation.requireRole).to.equal('da');
    });

    describe('beforeBatchAction:', function() {
      var selected;

      beforeEach(function() {
        selected = [
          { id: 'display1', playerProAuthorized: true },
          { id: 'display2', playerProAuthorized: true }
        ];
      });

      it('should confirm before rebooting players', function(done) {
        operation.beforeBatchAction(selected).then(function() {
          confirmModal.should.have.been.calledWith(
            'Reboot media players?', 
            'The media players will reboot and the content showing on your displays will be interrupted. Do you wish to proceed?',
            'Yes', 'No', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');
          done();
        });
      });

      it('should show confirmation with singular message', function(done) {
        selected = [{ id: 'display1', playerProAuthorized: true }];
        operation.beforeBatchAction(selected).then(function() {
          confirmModal.should.have.been.calledWith(
            'Reboot media player?', 
            'The media player will reboot and the content showing on your display will be interrupted. Do you wish to proceed?',
            'Yes', 'No', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');
          done();
        });
      });

      it('should prompt to license unlicensed displays and continue on acceptance', function(done) {
        var licenseOperation = _getOperationByName('License');
        licenseOperation.onClick = sinon.stub().returns(Q.resolve());        
        selected = [
          { id: 'display1', playerProAuthorized: true },
          { id: 'display2', playerProAuthorized: false },
          { id: 'display3', playerProAuthorized: false }
        ];

        operation.beforeBatchAction(selected);

        setTimeout(function() {
          confirmModal.should.have.been.calledWith('Almost there!',
            '2 of your selected displays are not licensed and to perform this action they need to be. You have 2 available licenses. Do you want to assign 2 to these displays?',
            'Yes', 'No', 'madero-style centered-modal','partials/components/confirm-modal/madero-confirm-modal.html','sm');

          expect(confirmModal.getCall(0).args[0]).to.equal('Almost there!');
          licenseOperation.onClick.should.have.been.calledWith(true);

          expect(confirmModal.getCall(1).args[0]).to.equal('Reboot media players?');
          done();
        },10);
      });
    });
  });

});
