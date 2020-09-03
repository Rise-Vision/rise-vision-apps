(function() {
  'use strict';

  var StorageSelectorScenarios = require('./cases/storage-selector.js');
  var NewFolderModalScenarios = require('./cases/new-folder.js');
  var UploadScenarios = require('./cases/upload.js');
  var HomeScenarios = require('./cases/home.js');
  var CopyUrlScenarios = require('./cases/copy-url.js');
  var DownloadScenarios = require('./cases/download.js');
  var TrashScenarios = require('./cases/trash.js');
  var IframeScenarios = require('./cases/iframe.js');
  var DismissModalScenarios = require('./cases/dismiss-modal.js');

  describe('Storage', function() {
    var storageSelectorScenarios = new StorageSelectorScenarios();
    var newFolderModalScenarios = new NewFolderModalScenarios();
    var uploadScenarios = new UploadScenarios();
    var homeScenarios = new HomeScenarios();
    var copyUrlScenarios = new CopyUrlScenarios();
    var downloadScenarios = new DownloadScenarios();
    var trashScenarios = new TrashScenarios();
    var iframeScenarios = new IframeScenarios();
    var dismissModalScenarios = new DismissModalScenarios();
  });

})();
