'use strict';
var ArtboardPage = function() {
  var artboardContainer = element(by.id('artboard'));
  var overlayContainer = element(by.css('#artboard > div > div'));
  var emptyState = element(by.id('artboardEmptyState'));

  this.getArtboardContainer = function() {
    return artboardContainer;
  };

  this.getOverlayContainer = function() {
    return overlayContainer;
  };

  this.getEmptyState = function() {
    return emptyState;
  }

  this.getPlaceholderContainers = function() {
  	return this.getArtboardContainer().all(by.css('artboard-placeholder'));
  };
  
  this.getPlaceholderContainer = function(id) {
    return this.getArtboardContainer().element(by.id(id));
  };

};

module.exports = ArtboardPage;
