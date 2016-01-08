console.log('in devtools.js: devtools.js execution started. tabId', chrome.devtools.inspectedWindow.tabId)

var hasInspectedWindow = chrome.devtools.inspectedWindow.tabId !== undefined ? true : false;
if( hasInspectedWindow === true ){
        init();
}else{
        console.log('in devtools.js: no inspected page, so not initializing three.js extension')
}

//////////////////////////////////////////////////////////////////////////////
//              create panel
//////////////////////////////////////////////////////////////////////////////

function init(){
        chrome.devtools.panels.create("Three.js extension2",
                "images/icon_128.png",
                "panel.html",
                function(panel) {
                        console.log("in devtools.js: panel created");
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
                console.log('in devtools.js: received message from background page', message)
                if( message.type === 'connected' ){
                        console.log('in devtools.js: sending message scriptToInject to background page for tabId', chrome.devtools.inspectedWindow.tabId)
                        // Relay the tab ID to the background page
                        var message = {
                                type: 'executeScriptFile',
                                data: {
                                        tabId: chrome.devtools.inspectedWindow.tabId,
                                        file: "content_script.js"                
                                }
                        }
                        console.log('in devtools.js:', message, chrome.devtools.inspectedWindow.tabId)
                        backgroundPageConnection.postMessage(message, function(response){
                                console.log('in devtools.js: received response', arguments)
                        })
                } else {
                        console.assert('unknown ')
                }
        });


        //////////////////////////////////////////////////////////////////////////////////
        //                Comments
        //////////////////////////////////////////////////////////////////////////////////
        console.log('in devtools.js: devtools.js execution completed')        
}
