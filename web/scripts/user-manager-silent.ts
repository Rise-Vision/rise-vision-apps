'use strict';

(function (Oidc, console) {
  if (!Oidc) {
    return;
  }

  Oidc.Log.logger = console;
  Oidc.Log.level = Oidc.Log.INFO;
  new Oidc.UserManager().signinSilentCallback();

})(window.Oidc, console);
