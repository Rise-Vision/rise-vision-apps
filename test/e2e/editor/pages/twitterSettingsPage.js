'use strict';
var TwitterSettingsPage = function() {
    var twitterSettingsModal = element(by.id('twitterSettingsModal'));
    var modalTitle = element(by.css('#addWidgetByUrlModal .modal-title'));
  
    var twitterScreenName = element(by.id('twitterScreenName'));

    var connectButton = element(by.id('connectButton'));
    var revokeLink = element(by.id('revokeLink'));

    var saveButton = element(by.id('save'));
    var cancelButton = element(by.id('cancel'));

    this.getTwitterSettingsModal = function() {
        return twitterSettingsModal;
    }

    this.getModalTitle = function() {
        return modalTitle;
    }

    this.getTwitterScreenName = function() {
        return twitterScreenName;
    }

    this.getConnectButton = function() {
        return connectButton;
    }

    this.getRevokeLink = function() {
        return revokeLink;
    }

    this.getSaveButton = function() {
        return saveButton;
    }

    this.getCancelButton = function() {
        return cancelButton;
    }
}

module.exports = TwitterSettingsPage;