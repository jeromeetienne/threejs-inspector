console.log("in panel.js: start running");

// declare namespace
window.PanelWin3js = window.PanelWin3js || {}
var PanelWin3js = window.PanelWin3js




//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

document.querySelector('button.inject_script').addEventListener('click', function() {
        console.log('in panel.js: detecting click on a button inject_script')
        
        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');
}, false);

document.querySelector('button.capture_scene').addEventListener('click', function() {
        console.log('in panel.js: detecting click on a button capture_scene')
        
        function jsCode(){
                InspectedWin3js.captureScene(scene)
        }

        chrome.devtools.inspectedWindow.eval('('+injected_script.toString()+')();');
        chrome.devtools.inspectedWindow.eval('('+jsCode.toString()+')();');
}, false);

//////////////////////////////////////////////////////////////////////////////////
//                Comments
//////////////////////////////////////////////////////////////////////////////////

console.log("in panel.js: stop running");
