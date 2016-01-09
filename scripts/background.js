console.log('INSPECTING background page')
console.log('THREE.js extension started at', new Date)
console.log('===================================')

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////
console.log('in background.js: start executing')

// background.js
var devtoolsConnections = {};

chrome.runtime.onConnect.addListener(function (devtoolConnection) {
        var onMessage = function (message, sender, sendResponse) {
                console.log('in background.js: received message', message)

                // The original connection event doesn't include the tab ID of the
                // DevTools page, so we need to send it explicitly.
                if (message.name == "devtoolPageCreated") {
                        console.log('in background.js: creating devtools connection for tabId', message.tabId)
                        devtoolsConnections[message.tabId] = devtoolConnection;
                        return;
                }else{
                        console.assert(false, 'unknown message', message.name)
                }
                
                // other message handling
        }
        
        // Listen to messages sent from the DevTools page
        devtoolConnection.onMessage.addListener(onMessage);
        
        devtoolConnection.onDisconnect.addListener(function(devtoolConnection) {
                devtoolConnection.onMessage.removeListener(onMessage);
                
                // remove the connection from the list
                var tabs = Object.keys(devtoolsConnections);
                for (var i=0, len=tabs.length; i < len; i++) {
                        if (devtoolsConnections[tabs[i]] == devtoolConnection) {
                                console.log('in background.js: deleting devtools connection for tabId', tabs[i])
                                delete devtoolsConnections[tabs[i]]
                                break;
                        }
                }
        });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // Messages from content scripts should have sender.tab set
        if (sender.tab) {
                var tabId = sender.tab.id;
                if (tabId in devtoolsConnections) {
                        devtoolsConnections[tabId].postMessage(request);
                } else {
                        console.log("Tab not found in connection list.");
                }
        } else {
                console.log("sender.tab not defined.");
        }
        return true;
});


//////////////////////////////////////////////////////////////////////////////////
//                to detect when a tab content is changed
//////////////////////////////////////////////////////////////////////////////////

/**
 * chrome.webNavigation.onCommitted to send message to 'inject'
 */
chrome.webNavigation.onCommitted.addListener(function(data) {        
        // console.log("onCommitted: " + data.url + ". Frame: " + data.frameId + ". Tab: " + data.tabId);
        // console.log("onCommitted: " + data.url + ". Frame: " + data.frameId + ". Tab: " + data.tabId);
        
        if( devtoolsConnections[ data.tabId ] ) {
                // console.log('has connection', devtoolsConnections[ data.tabId ])
                if( data.frameId === 0 ) {
                        // console.log('frameId', data.frameId)
                        devtoolsConnections[ data.tabId ].postMessage({
                                name: 'inspectedPageReloaded'
                        });
                }
        }
});

console.log('in background.js: stop executing')
