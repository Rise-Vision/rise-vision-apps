(function(module) {
  'use strict';

  var MailListener2 = require("mail-listener2-updated");

  var MailListener = function (emailAddressToFilter, password) {
    var mailListener2 = new MailListener2({
      username: "jenkins.rise@gmail.com",
      password: password, 
      host: "imap.gmail.com",
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

    this.getLastEmail = function() {
      var deferred = protractor.promise.defer();
      console.log("Waiting for an email...");

      mailListener2.once("mail", function(mail, seqno, attributes){
        console.log("Mail received: " + mail.subject);

        mailListener2.imap.addFlags(attributes.uid, '\\Seen', function(err) {
          if (err) {
            console.log('Error marking message read/SEEN');
          } else {
            console.log('Marked message as SEEN');
          }
        });          
        deferred.fulfill(mail);
      });
      return deferred.promise;
    };   
  };

  module.exports = MailListener;
})(module);
