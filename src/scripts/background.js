console.log('INSPECTING background page')
console.log('THREE.js extension started at', new Date)
console.log('===================================')

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////
console.log('in background.js: start executing')

// background.js
var panelConnections = {};

chrome.runtime.onConnect.addListener(function (panelConnection) {
        var onMessage = function (message, sender, sendResponse) {
                console.log('in background.js: received message', message)

                // The original connection event doesn't include the tab ID of the
                // DevTools page, so we need to send it explicitly.
                if (message.name == "panelPageCreated") {
                        console.log('in background.js: creating panel connection for tabId', message.tabId)
                        panelConnections[message.tabId] = panelConnection;
                        return;
                }else{
                        console.assert(false, 'unknown message', message.name)
                }
                
                // other message handling
        }
        
        // Listen to messages sent from the DevTools page
        panelConnection.onMessage.addListener(onMessage);
        
        panelConnection.onDisconnect.addListener(function(panelConnection) {
                panelConnection.onMessage.removeListener(onMessage);
                
                // remove the connection from the list
                var tabs = Object.keys(panelConnections);
                for (var i=0, len=tabs.length; i < len; i++) {
                        if (panelConnections[tabs[i]] == panelConnection) {
                                console.log('in background.js: deleting panel connection for tabId', tabs[i])
                                delete panelConnections[tabs[i]]
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
                if (tabId in panelConnections) {
                        panelConnections[tabId].postMessage(request);
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
        
        if( panelConnections[ data.tabId ] ) {
                // console.log('has connection', panelConnections[ data.tabId ])
                if( data.frameId === 0 ) {
                        // console.log('frameId', data.frameId)
                        panelConnections[ data.tabId ].postMessage({
                                name: 'inspectedPageReloaded'
                        });
                }
        }
});

console.log('in background.js: stop executing')
