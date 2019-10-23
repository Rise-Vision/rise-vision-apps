(function(module) {
  'use strict';

  var MailListener2 = require("mail-listener2-updated");

  var MailListener = function (emailAddressToFilter, password) {
    var mailListener2 = new MailListener2({
      username: "jenkins.rise@hotmail.com",
      password: password, 
      host: "outlook.office365.com",
      port: 993,
      searchFilter: ["UNSEEN",['TO', emailAddressToFilter]],
      tls: true,
      fetchUnreadOnStart: true
    });
      
    this.start = function() {
      mailListener2.on("server:connected", function(){
        console.log("Mail listener connected");
      });
      mailListener2.on("server:disconnected", function(){
        console.log("Mail listener disconnected");
      });
      console.log('Starting MailListener for ' + emailAddressToFilter);
      mailListener2.start();      
    };

    this.stop = function() {
      console.log('Stopping MailListener');
      mailListener2.stop();
    };

    this.getLastEmail = function(subjectFilter) {
      var deferred = protractor.promise.defer();
      console.log("Waiting for an email...");
      if (!subjectFilter) {
        mailListener2.once("mail", function(mail, seqno, attributes){
          console.log("Mail received: " + mail.subject);
          deferred.fulfill(mail);
        });
      } else {
        mailListener2.on("mail", function(mail, seqno, attributes){
          console.log("Mail received: " + mail.subject);
          if (mail.subject === subjectFilter) {
            mailListener2.removeAllListeners("mail");
            deferred.fulfill(mail);
          }
        });
      }
      return deferred.promise;
    };   
  };

  module.exports = MailListener;
})(module);
