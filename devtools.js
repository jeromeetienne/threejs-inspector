console.log("hello from devtools");

//////////////////////////////////////////////////////////////////////////////
//              create panel
//////////////////////////////////////////////////////////////////////////////

chrome.devtools.panels.create("Three.js extension2",
      "images/icon_128.png",
      "panel.html",
      function(panel) {
              console.log("hello from callback");
      }
);


//////////////////////////////////////////////////////////////////////////////
//              connect background page
//////////////////////////////////////////////////////////////////////////////


// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

// Relay the tab ID to the background page
chrome.runtime.sendMessage({
        type: 'scriptToInject',
        data: {
                tabId: chrome.devtools.inspectedWindow.tabId,
                scriptToInject: "content_script.js"                
        }
});