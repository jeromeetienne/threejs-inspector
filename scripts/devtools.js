console.log('in devtools.js: devtools.js execution started. tabId', chrome.devtools.inspectedWindow.tabId)


//////////////////////////////////////////////////////////////////////////////
//              init IFF there is a inspectedWindow and IIF not a devtools.js
//////////////////////////////////////////////////////////////////////////////

var hasInspectedWindow = chrome.devtools.inspectedWindow.tabId !== undefined ? true : false;
if( hasInspectedWindow === true ){
        // determine if the inspectedWindow is a devtools page
        chrome.devtools.inspectedWindow.eval("window.DevToolsAPI !== undefined ? true : false;", function(result, exceptionInfo){
                var devtoolsInParent = result;
                if( devtoolsInParent === false ){
                        initPanel();
                }else{
                        console.log('in devtools.js: inspected page is a devtools page, so not initializing three.js extension')
                }
        })
}else{
        console.log('in devtools.js: no inspected page, so not initializing three.js extension')
}

//////////////////////////////////////////////////////////////////////////////
//              create panel
//////////////////////////////////////////////////////////////////////////////

function initPanel(){
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

        backgroundPageConnection.postMessage({
                name: 'devtoolPageCreated',
                tabId: chrome.devtools.inspectedWindow.tabId
        });

        backgroundPageConnection.onMessage.addListener(function(msg) {
                // console.log( 'devtools.js', msg );
        });

        // backgroundPageConnection.onMessage.addListener(function (message) {
        //         // Handle responses from the background page, if any
        //         console.log('in devtools.js: received message from background page', message)
        //         if( message.type === 'connected' ){
        //                 console.log('in devtools.js: sending message scriptToInject to background page for tabId', chrome.devtools.inspectedWindow.tabId)
        //                 // Relay the tab ID to the background page
        //                 backgroundPageConnection.postMessage({
        //                         type: 'executeScriptFile',
        //                         data: {
        //                                 tabId: chrome.devtools.inspectedWindow.tabId,
        //                                 file: "content_script.js"                
        //                         }
        //                 }, function(response){
        //                         console.log('in devtools.js: received response', arguments)
        //                 })
        //         }else{
        //                 console.assert('unknown ')
        //         }
        // });


        // chrome.devtools.inspectedWindow.eval("console.log('ddddd', window.THREE);");
        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');

        //////////////////////////////////////////////////////////////////////////////////
        //                Comments
        //////////////////////////////////////////////////////////////////////////////////
        console.log('in devtools.js: devtools.js execution completed')        
}
