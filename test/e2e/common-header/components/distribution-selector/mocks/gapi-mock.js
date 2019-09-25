(function() {

  "use strict";

  /*global gapi,handleClientJSLoad: false */

  window.gapi = {};
  gapi.client = {
    load: function(path, version, cb) {
      cb();
    },
    storage: {
      tagdef: {
        list: function () {
          return {
            result: {
              nextPageToken: 1,
              items: [
                {
                  name: "tag1",
                  values: [
                    "value1"
                  ],
                  type: "LOOKUP"
                },
                {
                  name: "tag2",
                  values: [
                    "value2"
                  ],
                  type: "LOOKUP"
                },
                {
                  name: "tag3",
                  values: [
                    "value3"
                  ],
                  type: "FREEFORM"
                }
              ]
            }
          };
        }
      }
    },
    core: {
      display: {
        list: function () {
          return {
            result: {
              nextPageToken: 1,
              items: [
                {
                  id: "id1",
                  name: "display1",
                  address: "1 display 1 street"
                },
                {
                  id: "id2",
                  name: "display2",
                  address: "2 display 2 street"
                },
                {
                  id: "id3",
                  name: "display3",
                  address: "3 display 3 street"
                }
              ]
            }
          };
        }
      },
      presentation: {
        list: function () {
          return {
            result: {
              nextPageToken: 1,
              items: [
                {
                  id: "id1",
                  name: "presentation1",
                  revisionStatusName: "Published"
                },
                {
                  id: "id2",
                  name: "presentation2",
                  revisionStatusName: "Revised"

                },
                {
                  id: "id3",
                  name: "presentation3",
                  revisionStatusName: "Published"

                }
              ]
            }
          };
        }
      }
    },
    setApiKey: function() {
    }
  };

  handleClientJSLoad();

})();
