beforeEach(module(function ($provide) {
    $provide.service('ngModalService',function() {
      return {
        showMessage: sinon.stub(),
        confirm: sinon.stub().resolves(),
        confirmDanger: sinon.stub().resolves()
      };
    });
  }));