console.log('in background.js: start executing')

//////////////////////////////////////////////////////////////////////////////
//              receiving connections from devtools pages
//////////////////////////////////////////////////////////////////////////////

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
        console.log('in background.js: onConnect from devtools page', devToolsConnection.name, devToolsConnection)
        

        // assign the listener function to a variable so we can remove it later
        var onMessage = function(message, sender, sendResponse) {
                // alert('dddd')
                console.log('in background.js: received message from devtools page', arguments)
                if( message.type === 'executeScriptFile' ){
                        console.log('in background.js: trying to inject', message.data.scriptToInject , 'in', message.data.tabId)
                        console.log('in background.js: message.data', message.data)
                        // Inject a content script into the identified tab
                        chrome.tabs.executeScript( message.data.tabId, {
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
        });

        devToolsConnection.postMessage({
                type: 'connected'
        })                

})
// 
// //////////////////////////////////////////////////////////////////////////////////
// //                notify devtools pages
// //////////////////////////////////////////////////////////////////////////////////
//  
// chrome.runtime.onConnect.addListener(function(devToolsConnection) {
//         devToolsConnection.postMessage({
//                 type: 'connected'
//         })
// })
