/*jshint expr:true */

"use strict";
describe("directive: common header", function() {
  beforeEach(module("risevision.common.header"));

  var sandbox = sinon.sandbox.create();
  var $scope, initCommonHeader, elem, $modalStack, modalElements, modalContent, modalTop;

  beforeEach(module(function ($provide) {
    modalTop = {
      value:  {
        backdrop: true
      }
    };
    $provide.service("$http", function() {
      return {
        get: sandbox.stub().returns(Q.resolve())
      };
    });
    $provide.service("$modalStack", function() {
      return {
        getTop: sandbox.spy(function() {
          return modalTop;
        })
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, $rootScope) {
    var $document = $injector.get("$document");
    $modalStack = $injector.get("$modalStack");
    modalElements = [{
      addEventListener: sandbox.spy(),
      querySelector: sandbox.stub().returns(modalContent = {
        contains: sandbox.stub().returns(false)
      })
    }];

    sandbox.stub($document[0], "querySelectorAll").callsFake(function() {
      return modalElements;
    });

    initCommonHeader = function() {
      $scope = $rootScope.$new();
      var validHTML = 
        "<common-header>mock</common-header>";
      elem = $compile(validHTML)($scope);

      $rootScope.$digest();      
    };

  }));

  afterEach(function() {
    sandbox.restore();
  });

  describe("modal closing fix", function() {
    it("should not do anything if no modals are present", function () {
      modalElements = [];
      initCommonHeader();

      $modalStack.getTop.should.have.been.called;
      expect(modalTop.value.backdrop).to.be.true;
    });

    it("should add event listeners for the click events", function () {
      initCommonHeader();

      $modalStack.getTop.should.have.been.called;
      modalElements[0].addEventListener.should.have.been.calledWith("mousedown", sinon.match.func);

      expect(modalTop.value.backdrop).to.equal("static");
    });

    it("should not attach events for static modals", function () {
      modalTop.value.backdrop = "static";
      initCommonHeader();

      $modalStack.getTop.should.have.been.called;
      modalElements[0].addEventListener.should.not.have.been.called;

      expect(modalTop.value.backdrop).to.equal("static");
    });

    describe("event handlers", function() {
      beforeEach(function() {
        initCommonHeader();
      });

      it("should close modal on click", function() {
        var eventHandler = modalElements[0].addEventListener.getCall(0).args[1];
        var event = {
          which: 1,
          target: 'eventTarget'
        };
        modalTop.key = {
          dismiss: sandbox.stub()
        };

        eventHandler(event);

        modalElements[0].querySelector.should.have.been.calledWith(".modal-content");

        modalContent.contains.should.have.been.calledWith('eventTarget');

        modalTop.key.dismiss.should.have.been.called;
      });

      it("should ignore other events on the element", function() {
        var eventHandler = modalElements[0].addEventListener.getCall(0).args[1];
        var event = {
          which: 2
        };
        modalTop.key = {
          dismiss: sandbox.stub()
        };

        eventHandler(event);

        modalTop.key.dismiss.should.not.have.been.called;
      });

      it("should ignore events within .modal-content", function() {
        var eventHandler = modalElements[0].addEventListener.getCall(0).args[1];
        var event = {
          which: 1
        };
        modalTop.key = {
          dismiss: sandbox.stub()
        };

        modalContent.contains.returns(true);

        eventHandler(event);

        modalContent.contains.should.have.been.called;

        modalTop.key.dismiss.should.not.have.been.called;
      });
    });
  });

});
