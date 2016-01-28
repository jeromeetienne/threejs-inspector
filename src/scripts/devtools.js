console.log('INSPECTING devtool page')

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
window.hasInspectedWindow = hasInspectedWindow

//////////////////////////////////////////////////////////////////////////////
//              create panel
//////////////////////////////////////////////////////////////////////////////

function initPanel(){
        chrome.devtools.panels.create("Three.js Inspector",
                "images/icon_128.png",
                "panel/panel.html",
                function(panel) {
                        console.log("in devtools.js: panel created", panel);
                } 
        );
}

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////
console.log('in devtools.js: devtools.js execution completed')        
