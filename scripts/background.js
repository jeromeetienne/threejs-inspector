console.log('INSPECTING background page')

console.log('in background.js: start executing')

//////////////////////////////////////////////////////////////////////////////
//              receiving devtools from devtools pages
//////////////////////////////////////////////////////////////////////////////

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
        console.log('in background.js: onConnect from devtools page', devToolsConnection.name, devToolsConnection)

        // assign the listener function to a variable so we can remove it later
        var onMessage = function(message, senderPort) {
                // alert('dddd')
                console.log('in background.js: received message from devtools page', arguments)
                if( message.name === 'devtoolPageCreated' ){
                        
                }else if( message.type === 'executeScriptFile' ){
                        console.log('in background.js: trying to inject', message.data.file , 'in', message.data.tabId)
                        console.log('in background.js: message.data', message.data)
                        // Inject a content script into the identified tab
                        chrome.tabs.executeScript(message.data.tabId, {
                                file: message.data.file 
                        });
                }else{
                        console.assert(false, 'in background.js: unknown message type', message.type)
                }
        }
        // add the listener
        devToolsConnection.onMessage.addListener(onMessage);

        // remove the listener
        devToolsConnection.onDisconnect.addListener(function() {
                console.log('in background.js: onDisconnect from devtools page', devToolsConnection)
                devToolsConnection.onMessage.removeListener(onMessage);
                devToolsConnection = null
        });
})


//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

/**
 * chrome.webNavigation.onCommitted to send message to 'inject'
 */
chrome.webNavigation.onCommitted.addListener(function(data) {        
        console.log("onCommitted: " + data.url + ". Frame: " + data.frameId + ". Tab: " + data.tabId);
});

console.log('in background.js: stop executing')
