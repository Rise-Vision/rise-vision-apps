beforeEach(module(function ($provide) {
    $provide.service('ngModalService',function() {
      return {
        showMessage: sinon.stub(),
        confirm: sinon.stub().resolves(),
        confirmDanger: sinon.stub().resolves()
      };
    });

    $provide.service('broadcaster',function() {
      return {
        emit: sinon.stub(),
        emitWithParams: sinon.stub(),
        subscribe: sinon.stub()
      };
    });

  }));
