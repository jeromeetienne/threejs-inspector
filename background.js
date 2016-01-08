console.log('hello from background.js')

//////////////////////////////////////////////////////////////////////////////
//              receiving connections from devtools pages
//////////////////////////////////////////////////////////////////////////////

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
        console.log('received connection in background.js from devtools page', devToolsConnection)
        // assign the listener function to a variable so we can remove it later
        var onMessage = function(message, sender, sendResponse) {
                console.log('received message in background.js from devtools page')
                if( message.type === 'scriptToInject' ){
                        // Inject a content script into the identified tab
                        chrome.tabs.executeScript( message.data.tabId, {
                                file: message.data.scriptToInject 
                        });                        
                }else{
                        console.assert(false, 'unknown message type', message.type)
                }
        }
        // add the listener
        devToolsConnection.onMessage.addListener(onMessage);
        
        // remove the listener
        devToolsConnection.onDisconnect.addListener(function() {
                devToolsConnection.onMessage.removeListener(onMessage);
        });
})
